import assert from "node:assert/strict";
import test from "node:test";
import type Stripe from "stripe";

// Clé de signature Ed25519 fixe (32 octets) pour generateLicenseKey, lue
// paresseusement à l'appel via LICENSE_PRIVATE_KEY.
process.env.LICENSE_PRIVATE_KEY = Buffer.from(
  new Uint8Array(32).fill(7),
).toString("base64");

import { claimSeat } from "./issue";
import { countActive, getAssignments } from "./store";

function makeSub(quantity: number): Stripe.Subscription {
  return {
    id: "sub_1",
    status: "active",
    metadata: {},
    items: { data: [{ quantity }] },
  } as unknown as Stripe.Subscription;
}

// Faux Stripe : `update` merge la metadata DANS l'objet (simule la relecture
// de l'état le plus récent à chaque requête séquentielle).
function makeFakeStripe(sub: Stripe.Subscription) {
  return {
    subscriptions: {
      update: async (
        _id: string,
        params: { metadata: Record<string, string> },
      ) => {
        sub.metadata = { ...sub.metadata, ...params.metadata };
        return sub;
      },
    },
  } as unknown as Stripe;
}

test("3 distinct emails claim 3 seats; 4th is capped; re-claim consumes no slot", async () => {
  const sub = makeSub(3);
  const stripe = makeFakeStripe(sub);

  const a = await claimSeat(stripe, sub, "a@acme.com");
  const b = await claimSeat(stripe, sub, "b@acme.com");
  const c = await claimSeat(stripe, sub, "c@acme.com");
  assert.equal(a.status, "claimed");
  assert.equal(b.status, "claimed");
  assert.equal(c.status, "claimed");
  assert.equal(countActive(getAssignments(sub)), 3);

  // 4ᵉ email distinct -> plafond atteint, aucune mutation.
  const d = await claimSeat(stripe, sub, "d@acme.com");
  assert.equal(d.status, "cap_reached");
  assert.equal(countActive(getAssignments(sub)), 3);

  // Ré-claim d'un email déjà actif -> existing, slot non re-consommé.
  const reA = await claimSeat(stripe, sub, "A@ACME.com");
  assert.equal(reA.status, "existing");
  assert.equal(countActive(getAssignments(sub)), 3);

  // Chaque claim a produit une clé de licence non vide.
  if (a.status === "claimed") {
    assert.ok(a.licenseKey.length > 0);
  }
});

test("removing then re-claiming frees and refills a slot", async () => {
  const sub = makeSub(2);
  const stripe = makeFakeStripe(sub);

  await claimSeat(stripe, sub, "a@acme.com");
  await claimSeat(stripe, sub, "b@acme.com");
  assert.equal(countActive(getAssignments(sub)), 2);

  // Simule une révocation : on marque b removed dans la metadata.
  const list = getAssignments(sub).map((seat) =>
    seat.email === "b@acme.com"
      ? { ...seat, status: "removed" as const }
      : seat,
  );
  sub.metadata = {
    ...sub.metadata,
    qoredb_seat_assignments: JSON.stringify(
      list.map((s) => ({
        e: s.email,
        s: s.status === "active" ? "a" : "r",
        c: 0,
      })),
    ),
  };
  assert.equal(countActive(getAssignments(sub)), 1);

  const c = await claimSeat(stripe, sub, "c@acme.com");
  assert.equal(c.status, "claimed");
  assert.equal(countActive(getAssignments(sub)), 2);
});
