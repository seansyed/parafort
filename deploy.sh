#!/bin/bash

# ParaFort AWS Lightsail Deployment Script
# This script automates the deployment process to AWS Lightsail

set -e  # Exit on any error

echo "🚀 Starting ParaFort deployment to AWS Lightsail..."

# Configuration
APP_NAME="parafort"
CONTAINER_NAME="parafort-app"
IMAGE_NAME="parafort:latest"
PORT=5000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_requirements() {
    print_status "Checking deployment requirements..."
    
    if [ ! -f ".env.production" ]; then
        print_error ".env.production file not found!"
        print_warning "Please copy .env.production.template to .env.production and configure it."
        exit 1
    fi
    
    if [ ! -f "Dockerfile" ]; then
        print_error "Dockerfile not found!"
        exit 1
    fi
    
    print_status "Requirements check passed ✅"
}

# Build the application
build_app() {
    print_status "Building the application..."
    
    # Install dependencies
    npm ci
    
    # Build the frontend and backend
    npm run build
    
    print_status "Application build completed ✅"
}

# Build Docker image
build_docker() {
    print_status "Building Docker image..."
    
    docker build -t $IMAGE_NAME .
    
    print_status "Docker image built successfully ✅"
}

# Deploy to Lightsail
deploy_to_lightsail() {
    print_status "Deploying to AWS Lightsail..."
    
    # Stop existing container if running
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        print_status "Stopping existing container..."
        docker stop $CONTAINER_NAME
        docker rm $CONTAINER_NAME
    fi
    
    # Run new container
    print_status "Starting new container..."
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p $PORT:$PORT \
        --env-file .env.production \
        $IMAGE_NAME
    
    print_status "Container started successfully ✅"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    sleep 10  # Wait for container to start
    
    if curl -f http://localhost:$PORT/api/health > /dev/null 2>&1; then
        print_status "Health check passed ✅"
        print_status "🎉 Deployment completed successfully!"
        print_status "Your application is running at: http://your-lightsail-ip:$PORT"
    else
        print_error "Health check failed ❌"
        print_warning "Check container logs: docker logs $CONTAINER_NAME"
        exit 1
    fi
}

# Cleanup old images
cleanup() {
    print_status "Cleaning up old Docker images..."
    docker image prune -f
    print_status "Cleanup completed ✅"
}

# Main deployment flow
main() {
    check_requirements
    build_app
    build_docker
    deploy_to_lightsail
    health_check
    cleanup
    
    echo ""
    print_status "🚀 Deployment Summary:"
    print_status "   • Application: $APP_NAME"
    print_status "   • Container: $CONTAINER_NAME"
    print_status "   • Port: $PORT"
    print_status "   • Status: Running"
    echo ""
    print_status "📋 Useful Commands:"
    print_status "   • View logs: docker logs -f $CONTAINER_NAME"
    print_status "   • Stop app: docker stop $CONTAINER_NAME"
    print_status "   • Restart app: docker restart $CONTAINER_NAME"
    print_status "   • Remove app: docker rm -f $CONTAINER_NAME"
}

# Run main function
main "$@"