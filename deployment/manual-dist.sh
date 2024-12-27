#!/bin/bash

source .env

# Functions for better output
function echo_info() {
    echo -e "\033[1;32m[INFO]\033[0m $1"
}

function echo_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
    exit 1
}

# Ensure build exists locally
if [ ! -f "$APP_NAME" ]; then
    echo_error "Binary file '$APP_NAME' not found! Did you build your Go app?"
fi

# Upload files to the temporary directory
echo_info "Uploading files to remote server..."
rsync -avz migrations/ $SERVER_USER@$SERVER_IP:$REMOTE_APP_DIR/migrations || echo_error "Failed to upload migration folder."
rsync -avz $APP_NAME $SERVER_USER@$SERVER_IP:$REMOTE_APP_DIR || echo_error "Failed to upload Go binary."


# Perform a zero-downtime deployment
echo_info "Performing zero-downtime deployment..."

ssh $SERVER_USER@$SERVER_IP "systemctl is-active --quiet arvix && sudo -S systemctl restart arvix || sudo -S systemctl start arvix"

echo_info "Deployment completed successfully!"
