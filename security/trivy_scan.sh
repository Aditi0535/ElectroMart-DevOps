#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 STARTING SIMPLIFIED SECURITY SCAN...${NC}"

# --- SETUP ---
IMAGE_BACKEND="home-app-backend:latest"
IMAGE_FRONTEND="home-app-frontend:latest"
PROJECT_ROOT=$(pwd)/..

# --- STEP 1: DOCKERFILE LINTING (Hadolint) ---
# Checks for bad practices in your Dockerfile writing
echo -e "\n${BLUE}🔍 [1/3] Checking Dockerfiles (Best Practices)...${NC}"

docker run --rm -i -v "${PROJECT_ROOT}/security/hadolint.yaml":/root/.config/hadolint.yaml hadolint/hadolint < "${PROJECT_ROOT}/docker/backend.Dockerfile"
if [ $? -eq 0 ]; then echo -e "${GREEN}✅ Backend Dockerfile is clean.${NC}"; fi

docker run --rm -i -v "${PROJECT_ROOT}/security/hadolint.yaml":/root/.config/hadolint.yaml hadolint/hadolint < "${PROJECT_ROOT}/docker/frontend.Dockerfile"
if [ $? -eq 0 ]; then echo -e "${GREEN}✅ Frontend Dockerfile is clean.${NC}"; fi


# --- STEP 2: IaC SCANNING (Trivy Config) ---
# Checks Terraform for security holes (Open ports, unencrypted drives)
echo -e "\n${BLUE}🏗️  [2/3] Scanning Infrastructure (Terraform)...${NC}"

docker run --rm -v "${PROJECT_ROOT}/terraform":/root/terraform aquasec/trivy config /root/terraform \
  --severity HIGH,CRITICAL \
  --exit-code 0 \
  --format table


# --- STEP 3: IMAGE VULNERABILITY SCANNING (Trivy Image) ---
# Checks your actual container images for known vulnerabilities (CVEs)
echo -e "\n${BLUE}🐳 [3/3] Scanning Docker Images (Fixable Issues Only)...${NC}"

echo "Scanning Backend..."
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image ${IMAGE_BACKEND} \
  --severity HIGH,CRITICAL \
  --ignore-unfixed \
  --scanners vuln \
  --format table \
  --exit-code 0

echo "Scanning Frontend..."
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image ${IMAGE_FRONTEND} \
  --severity HIGH,CRITICAL \
  --ignore-unfixed \
  --scanners vuln \
  --format table \
  --exit-code 0

echo -e "\n${GREEN}🛡️ SCAN COMPLETE!${NC}"