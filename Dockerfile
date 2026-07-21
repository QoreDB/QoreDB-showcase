# syntax=docker/dockerfile:1
###############################################################################
# QoreDB Showcase — image de production (Next.js 16 / React 19)
#
# Choix : on lance `next start` (pas le mode "standalone") pour reproduire
# exactement le comportement local (`npm start`). C'est un poil plus gros en
# disque, mais increvable : locales/, content/, doc/ et public/pagefind sont
# tous présents, aucune surprise de "file tracing".
#
# Build pack Coolify à sélectionner : "Dockerfile".
###############################################################################

FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# --- Build --------------------------------------------------------------------
FROM base AS build

# Évite de télécharger Chromium (puppeteer est en devDep, inutile pour le build)
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NEXT_TELEMETRY_DISABLED=1
# Marge mémoire pour le build sur un petit VPS (voir swap dans le runbook §2)
ENV NODE_OPTIONS=--max-old-space-size=3072

# Variables PUBLIQUES : inlinées dans le bundle → doivent exister AU BUILD.
# Coolify passe ces valeurs en --build-arg pour les vars cochées "Build Variable".
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_API_VERSION
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_UMAMI_SRC
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
# Le build interroge Sanity/GitHub (generateStaticParams, fetch-stats)
ARG SANITY_TOKEN
ARG SANITY_PROJECT_ID
ARG SANITY_DATASET
ARG GITHUB_TOKEN
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID \
    NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET \
    NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_UMAMI_SRC=$NEXT_PUBLIC_UMAMI_SRC \
    NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID \
    SANITY_TOKEN=$SANITY_TOKEN \
    SANITY_PROJECT_ID=$SANITY_PROJECT_ID \
    SANITY_DATASET=$SANITY_DATASET \
    GITHUB_TOKEN=$GITHUB_TOKEN

# Cache des deps : on copie d'abord les manifestes (respecte .npmrc/legacy-peer-deps)
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Puis le reste du code, et build complet
# (tsc --noEmit && fetch-stats && next build && pagefind → public/pagefind)
COPY . .
RUN npm run build

# On retire les devDeps pour alléger l'image finale (next start n'a besoin
# que des dependencies de prod : next, sharp, sanity client, stripe, ...)
RUN npm prune --omit=dev

# --- Runner -------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Utilisateur non-root
RUN groupadd --gid 1001 nodejs && useradd --uid 1001 --gid nodejs --shell /bin/bash nextjs

# On récupère l'app buildée + node_modules prod
COPY --from=build --chown=nextjs:nodejs /app ./

USER nextjs
EXPOSE 3000

# next start (respecte next.config.ts, i18n, ISR, redirects, /studio, /pagefind)
CMD ["npm", "run", "start"]
