# syntax=docker/dockerfile:1.7
# Pinned to the node:22-slim digest from before 2026-06-18. That day the rolling
# 22-slim tag moved to a Node patch that broke node-fetch v2's gzip handling in
# @libsql/client 0.17 — ERR_STREAM_PREMATURE_CLOSE on every Turso request.
FROM node:22-slim@sha256:e21fc383b50d5347dc7a9f1cae45b8f4e2f0d39f7ade28e4eef7d2934522b752 AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

COPY . .
RUN yarn build

FROM node:22-slim@sha256:e21fc383b50d5347dc7a9f1cae45b8f4e2f0d39f7ade28e4eef7d2934522b752 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV PORT=8080

COPY --from=builder /app/.output ./.output

EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
