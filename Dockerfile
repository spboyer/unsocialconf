# Base stage - Sets up the base image with Node.js
FROM node:20-alpine AS base
# Set working directory
WORKDIR /app

# Dependencies stage - Install all node modules
FROM base AS dependencies
# Copy package.json and lock file
COPY package.json package-lock.json* pnpm-lock.yaml* ./
# Install pnpm
RUN npm install -g pnpm
# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Build stage - Build the Next.js application
FROM base AS builder
# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
# Copy all project files
COPY . .
# Build the app in standalone mode for better container support
RUN npm install -g pnpm && pnpm build

# Production stage - Create the production image
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV AZURE_ENDPOINT=$AZURE_ENDPOINT
ENV API_VERSION=$API_VERSION
ENV DEPLOYMENT_NAME=$DEPLOYMENT_NAME
ENV AZURE_API_KEY=$AZURE_API_KEY

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy required files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the correct user
USER nextjs

# Expose the port
EXPOSE 3000

# Set the environment variable for the app to listen on port 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the app
CMD ["node", "server.js"]
