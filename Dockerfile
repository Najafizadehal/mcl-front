# ====== Build stage ======
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY . .
# Build with API base URL provided at build time
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# ====== Runtime stage ======
FROM node:20-alpine
WORKDIR /app

# Copy production build
COPY --from=build /app/build /app/build

# Install a tiny static server
RUN npm i -g serve@14

EXPOSE 3000
ENV PORT=3000

CMD ["serve","-s","build","-l","3000"]


