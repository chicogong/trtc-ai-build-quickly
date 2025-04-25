# Use official Node.js image as the base image
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Use lightweight image for runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy build results and dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./
COPY --from=builder /app/dialogue.html ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "server.js"] 