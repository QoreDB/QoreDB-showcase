# QoreDB — Plan d'implémentation : clés par siège (option 2)

**Date** : juin 2026
**But** : passer d'**une clé d'organisation** (`seats:N` informatif) à **N clés nominatives** plafonnées **au point d'émission** → enforcement structurel, sans phone-home, sans télémétrie, offline.
**Repos** : `QoreDB-showcase` (≈ tout le travail) + `QoreDB` (quasi rien).
**Référence** : `B2B_STAGE1_PLAN.md`, `B2B_STAGE0_DECISIONS.md`.

---

## 0. Principe & périmètre réel

- **Enforcement = au point d'émission.** Le site n'émet jamais plus de clés que de sièges payés (`subscription.quantity`). C'est ça la barrière structurelle que le modèle actuel n'a pas.
- **Chaque clé est nominative** (liée à un email de porteur) → traçabilité + révocation **douce** (effective au renouvellement).
- **100 % offline / zéro télémétrie** : l'app vérifie toujours la signature hors-ligne. Aucun ping runtime.
- **Honnêteté sur la limite** : une clé de siège **reste copiable** (offline = pas de kill à distance). L'option 2 **plafonne le nombre de clés** et les rend **nominatives** ; elle n'empêche pas le partage d'une clé donnée. Le hard-kill, c'est l'Enterprise (`qore-server`).

> ### ⚡ Le desktop ne bouge presque pas
> Une clé par siège = une clé Team avec l'email du porteur. L'app l'active déjà (vérif offline), et `/api/license/current` + `refresh_license` fonctionnent **par email**. Le seul ajustement côté site est de résoudre le refresh **par email de siège** (S6). Côté app : ~0 code (un libellé optionnel).

---

## 1. Décisions de design (verrouillées)

| Sujet | Décision | Raison |
| --- | --- | --- |
| Attribution des sièges | **Join-link auto-claim** : l'admin partage un lien d'équipe ; chaque coéquipier ouvre, saisit son email, reçoit **sa** clé. | Le plus léger (pas d'auth complète), UX type « invitation Slack ». |
| Plafond | `assignments.length < subscription.quantity`, sinon refus. Changer la quantité (portail Stripe) change le plafond. | Le plafond Stripe **est** l'enforcement. |
| Gestion / révocation | **Lien admin** (envoyé à l'email de facturation) → voir les sièges, en retirer un (libère un slot), faire tourner le join-link. | Réaffectation quand un dev part, sans comptes. |
| Révocation | **Douce** : retirer un siège stoppe la réémission au renouvellement ; la clé courante reste valide jusqu'à `expires_at` (+14 j). | Cohérent offline. Hard-kill = Enterprise. |
| Stockage des affectations | **Metadata de l'abonnement Stripe** (JSON compact). | Pas de DB, fidèle à « Stripe = source de vérité ». |

> ⚠️ **Limite de la metadata Stripe** (~500 car./clé). Suffisant pour des équipes ≤ ~20-30 sièges en JSON compact (email + statut). Au-delà, prévoir un petit KV (Upstash/Vercel KV). À garder en tête, pas bloquant en v1.

---

## 2. Contrat de la clé par siège (delta vs Stage 1)

Une clé de siège est une `LicensePayload` **déjà supportée** :

```jsonc
{
  "email": "dev2@acme.com",   // l'email DU PORTEUR du siège (≠ email de facturation)
  "tier": "team",
  "issued_at": "2026-06-01T00:00:00.000Z",
  "expires_at": "2027-06-15T00:00:00.000Z",  // période + 14 j
  "payment_id": "sub_...",     // id d'abonnement (commun à tous les sièges)
  "seats": 1                   // 1 par clé nominative (ou champ omis)
}
```

Aucun nouveau champ obligatoire. (Option : un `seat_id` pour la traçabilité — facultatif, `#[serde(default)]` côté app.) **Rétro-compatible** avec les clés Pro et la clé Team d'org actuelle.

---

## 3. Lot SITE — `QoreDB-showcase`

### S1 — Ledger des sièges · `lib/seats/store.ts` (NOUVEAU)

**But** : lire/écrire les affectations dans la metadata de l'abonnement.
**Contenu** :
- Type `SeatAssignment = { email: string; claimedAt: string; status: "active" | "removed" }`.
- `getAssignments(subscription)` / `setAssignments(stripe, subId, list)` (sérialise en JSON compact dans `subscription.metadata[qoredb_seats]`).
- `getCap(subscription)` = `subscription.items.data[0].quantity`.
- `canClaim(sub)` = nb d'`active` < cap.
- `findSubscriptionBySeatEmail(stripe, email)` (parcourt les abonnements actifs, lit leurs assignments) — utilisé par S6.
**Vérif** : tests unitaires : claim sous plafond OK, au plafond refusé, removed libère un slot, round-trip metadata.

### S2 — Tokens join & admin · `lib/seats/token.ts` (NOUVEAU)

**But** : capabilities signées, sans comptes.
**Contenu** :
- `makeJoinToken(subId)` / `makeAdminToken(subId)` : JWT/HMAC signé (réutiliser le secret serveur existant), `kind` + `subId`, expiration (join : longue/rot=invalide ; admin : courte).
- `verifyToken(token, kind)`.
- Rotation du join-token : stocker un `joinNonce` dans la metadata ; un token invalide si le nonce ne matche pas.
**Vérif** : token valide → subId ; token falsifié/expiré → rejet ; rotation invalide l'ancien.

### S3 — Endpoint claim · `app/api/seats/claim/route.ts` (NOUVEAU)

**But** : un coéquipier réclame son siège.
**Flux** : POST `{ joinToken, email }` → vérifie le token (S2) → charge l'abonnement → `canClaim` ? sinon 409 « plafond atteint » → ajoute l'affectation (S1) → **génère la clé du siège** (`generateLicenseKey` avec `email` du porteur, `tier:"team"`, `expiresAt` = période+14j) → **email au porteur** (réutiliser `send-license-email`) → 200.
**Sécurité** : rate-limit (réutiliser `lib/rate-limit.ts`), validation email, idempotence (même email déjà actif → renvoyer/réémettre sa clé, ne pas consommer un nouveau slot).
**Vérif** : 3 emails distincts sur un abo 3 sièges → 3 clés ; le 4ᵉ → 409 ; ré-claim du même email → pas de slot consommé.

### S4 — Endpoints admin · `app/api/seats/admin/route.ts` (NOUVEAU)

**But** : gérer l'équipe.
**Flux** (tous gardés par `adminToken`, S2) :
- `GET` → liste des sièges (email + statut + claimedAt) + cap + join-link courant.
- `POST {action:"remove", email}` → marque `removed` (libère un slot ; révocation douce).
- `POST {action:"rotate"}` → nouveau `joinNonce` → invalide l'ancien join-link.
**Vérif** : remove libère un slot et stoppe la réémission au renouvellement ; rotate casse l'ancien lien.

### S5 — Lien admin (ré)envoyé · `app/api/seats/admin-link/route.ts` (NOUVEAU)

**But** : récupérer l'accès admin sans compte.
**Flux** : POST `{ email }` → si c'est l'email de facturation d'un abonnement Team actif → email un **admin-link** (token S2) à cette adresse. (Anti-énumération : toujours 200.)
**Vérif** : l'email de facturation reçoit le lien ; un autre email ne reçoit rien.

### S6 — Refresh par email de siège · `app/api/license/current/route.ts` (MODIF)

**But** : que chaque porteur rafraîchisse **sa** clé.
**Changement** : avant de chercher par email de **client**, tenter `findSubscriptionBySeatEmail` (S1). Si l'email est un siège actif → régénérer/renvoyer **sa** clé nominative. Sinon, fallback sur le comportement actuel (email de facturation).
**Vérif** : `refresh_license` depuis l'app avec un email de siège → récupère la clé de ce siège à jour.

### S7 — Webhook : émission par siège · `app/api/webhooks/stripe/route.ts` (MODIF de `processTeamSubscription`)

**But** : remplacer « une clé pour l'abo » par « N clés nominatives ».
**Changements** :
- `customer.subscription.created` → initialiser le ledger, **auto-claim du siège admin** (email de facturation = siège 1, clé émise+emailée), puis **emailer à l'admin le join-link + l'admin-link** (instructions pour inviter l'équipe).
- `invoice.paid` (renouvellement) → pour **chaque siège `active`**, réémettre la clé avec `expires_at` repoussé (email ou laisser le refresh faire — au choix ; recommandé : email aux porteurs).
- `customer.subscription.updated` (quantité) → mettre à jour le cap. Si la quantité **baisse** sous le nb de sièges actifs → marquer les sièges excédentaires `removed` (les plus récents) + notifier l'admin.
- `deleted` / `payment_failed` → `qoredb_license_status` = canceled/past_due ; pas de réémission ; expiration naturelle.
- Conserver l'idempotence (clé de période déjà traitée).
**Vérif** (Stripe CLI test) : achat 3 sièges → admin reçoit sa clé + les liens ; 2 coéquipiers claiment → 3 clés ; `invoice.paid` → 3 clés réémises ; quantité 3→2 → 1 siège marqué removed + notif.

### S8 — Parcours post-achat & copy · `purchase/success`, `pricing-page-client.tsx`, `locales/*`

**But** : guider l'admin après l'achat + clarifier l'offre.
**Changements** :
- Page succès Team : afficher la clé du siège admin + un bouton « Gérer mon équipe / inviter » (mène à l'admin-link déjà emailé) + explication des sièges nominatifs.
- Carte Team pricing : préciser « **N sièges nominatifs** (1 licence par personne) ».
- i18n des nouveaux libellés (7 locales du site).
**Vérif** : après achat, l'admin comprend en 1 écran comment inviter son équipe ; i18n complet.

---

## 4. Lot DESKTOP — `QoreDB` (minimal)

### D1 — Validation refresh par email de siège (dépend de S6)

**But** : confirmer que `refresh_license` marche pour un porteur non-facturant.
**Changement** : **aucun code** attendu (l'app envoie déjà l'email stocké). Juste valider end-to-end une fois S6 livré.
**Vérif** : activer une clé de siège, cliquer « Rafraîchir » → clé à jour récupérée.

### D2 — (Optionnel) libellé · `LicenseActivation.tsx` / `LicenseSection.tsx`

**But** : cosmétique.
**Changement** : afficher « Team · siège : `<email>` » (l'email est déjà disponible dans le statut). Aucune logique nouvelle.
**Vérif** : l'UI montre l'email du siège.

> **Total desktop** : 0 changement fonctionnel obligatoire, 1 libellé optionnel.

---

## 5. Séquencement

```
S1 (ledger) ─> S2 (tokens) ─> S3 (claim) ─┐
                              S4 (admin) ──┼─> S7 (webhook émission par siège)
                              S5 (admin-link)┘
S6 (refresh par siège) ── indépendant, après S1
S8 (UX/copy) ── après S3/S5
Desktop : D1 (valider) après S6 ; D2 optionnel
```

**Jalon « clés par siège opérationnelles »** : S1+S2+S3+S7 (émission plafonnée + claim) → tu vends des sièges nominatifs plafonnés. S4/S5 (gestion/réaffectation) et S6 (refresh porteur) complètent l'expérience.

---

## 6. Sécurité (code sensible — à faire relire)

- Tokens **signés + expirables**, join-token **rotables** via nonce.
- **Anti-énumération** sur admin-link et claim (toujours 200/messages neutres) + **rate-limit**.
- Validation stricte des emails ; **idempotence** du claim (pas de double-consommation de slot).
- Ne jamais renvoyer la clé d'un siège à une autre adresse que celle du porteur.
- Vérifs de plafond **côté serveur uniquement** (jamais de confiance au client).

---

## 7. Limites assumées (à assumer dans la com)

- Une clé de siège **reste techniquement copiable** (offline). L'option 2 garantit : **plafond d'émission** + **nominativité** + **révocation au renouvellement**. Pas de coupure instantanée.
- Le **hard-kill / révocation immédiate / contrôle centralisé** = tier **Enterprise** (`qore-server`, identité serveur). → levier d'upsell, pas un manque.

---

## 8. Mise à jour légale (donne des dents au plafond)

À répercuter dans l'EULA / licence (cf. questions légales) :

- « La licence Team donne droit à **N sièges nominatifs** ; **une clé par personne**. »
- « Le partage d'une clé entre plusieurs personnes ou l'usage au-delà des sièges payés sont **interdits**. »
- Sans cette clause, le plafond technique n'a pas d'assise juridique.

---

*Plan d'implémentation. Chaque WP est autonome et vérifiable. Le gros est côté site ; le desktop est quasi inchangé.*
