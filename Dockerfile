FROM oven/bun:1.4.0

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV TRANSFORMERS_CACHE=/app/models
ENV PORT=3000

RUN bun run build

EXPOSE 3000
CMD ["bun", "src/index.ts"]
