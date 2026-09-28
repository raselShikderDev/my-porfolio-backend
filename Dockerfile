# syntax=docker/dockerfile:1

# Builder stage
FROM oven/bun:1.2.15 AS builder

WORKDIR /app

# Copy dependency files first for better caching
COPY package.json bun.lock* ./
COPY prisma ./prisma

# Install dependencies and run postinstall (Prisma Client generation)
RUN bun install
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN bun run build

# Production stage
FROM oven/bun:1.2.15 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy production artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock* ./

# Set ownership for non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

EXPOSE 5000

# Health check using existing /health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["bun", "run", "dist/server.js"]