# Base stage - Sets up the base image with Node.js
FROM node:20-alpine AS base
# Set working directory
WORKDIR /app

# Dependencies stage - Install all dependencies
FROM base AS dependencies
# Copy package.json
COPY package.json ./
# Install dependencies with legacy-peer-deps to ignore peer dependency conflicts
RUN npm install --legacy-peer-deps

# Build stage - Build the application
FROM base AS builder
# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
# Copy all files
COPY . .
# Build the app
RUN npm run build --legacy-peer-deps

# Production stage - Create the production image
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
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
