# Build UI stage
FROM node:22-alpine AS ui-builder
WORKDIR /app/ui

# Install dependencies
COPY ui/package*.json ./
RUN npm install --force

# Copy UI source code
COPY ui/ ./

RUN npm run build

# Build Go stage
FROM golang:1.23-alpine AS go-builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache gcc musl-dev

# Copy Go module files
COPY go.mod go.sum ./
RUN go mod download

# Copy Go source code and built UI
COPY . .
COPY --from=ui-builder /app/ui/build ./ui/build

# Build the Go application
RUN CGO_ENABLED=1 GOOS=linux go build -o main

# Final stage
FROM alpine:3.19
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache ca-certificates

# Copy the built executable and UI files
COPY --from=go-builder /app/main .
COPY --from=ui-builder /app/ui/build ./ui/build

# Copy any additional required files (like migrations)
COPY migrations ./migrations

# Expose the port your application runs on
EXPOSE 8090

# Set environment variables
ENV GO_ENV=production

# Run the application
ENTRYPOINT ["./main", "serve", "--http=0.0.0.0:8090"]
