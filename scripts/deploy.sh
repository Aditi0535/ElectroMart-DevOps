#!/bin/bash

# Exit immediately if any command fails
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_ROOT=$(pwd)/..
TF_DIR="${PROJECT_ROOT}/terraform"
ANSIBLE_DIR="${PROJECT_ROOT}/ansible"
APP_DIR="${PROJECT_ROOT}/app"

echo -e "${GREEN}🚀 STARTING ONE-CLICK DEPLOYMENT...${NC}"

# ====================================================
# PHASE 1: PROVISION INFRASTRUCTURE (Terraform)
# ====================================================
echo -e "\n${BLUE}🏗️  [1/4] Provisioning AWS Infrastructure...${NC}"
cd $TF_DIR
terraform init
terraform apply -auto-approve

# Extract Outputs for later use
echo -e "${YELLOW}📝 Capturing Infrastructure Details...${NC}"
BASTION_IP=$(terraform output -raw BASTION_IP)
FRONTEND_IP=$(terraform output -raw WEB_PRIVATE_IP)
BACKEND_IP=$(terraform output -raw BACKEND_IP)
DB_IP=$(terraform output -raw DB_IP)
WEB_PUBLIC_IP=$(terraform output -raw WEB_IP)
ECR_BACKEND=$(terraform output -raw ECR_BACKEND_URL)
ECR_FRONTEND=$(terraform output -raw ECR_FRONTEND_URL)
REGION="ap-south-1" 

echo "   - Bastion: $BASTION_IP"
echo "   - Web App: $WEB_PUBLIC_IP"

# ====================================================
# PHASE 2: GENERATE ANSIBLE INVENTORY
# ====================================================
echo -e "\n${BLUE}Gx  [2/4] Generating Dynamic Inventory...${NC}"
# We automatically write the IPs to inventory.ini
cat > ${ANSIBLE_DIR}/inventory.ini <<EOF
[bastion]
${BASTION_IP}

[frontend]
${FRONTEND_IP}

[backend]
${BACKEND_IP}

[db]
${DB_IP}

[private:children]
frontend
backend
db

[all:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=./home-app.pem
ansible_ssh_common_args='-o StrictHostKeyChecking=no'

[private:vars]
ansible_ssh_common_args='-o StrictHostKeyChecking=no -o ProxyCommand="ssh -W %h:%p -q ubuntu@${BASTION_IP} -i ./home-app.pem"'
EOF

echo -e "${GREEN}✅ Inventory updated successfully!${NC}"

# ====================================================
# PHASE 3: BUILD & PUSH ARTIFACTS (Docker)
# ====================================================
echo -e "\n${BLUE}🐳 [3/4] Building & Pushing Docker Images...${NC}"

# Login to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_BACKEND

# Build & Push Backend
echo "   -> Processing Backend..."
cd $PROJECT_ROOT
docker build -t home-app-backend -f docker/backend.Dockerfile app/electromart-backend > /dev/null 2>&1
docker tag home-app-backend:latest $ECR_BACKEND:latest
docker push $ECR_BACKEND:latest

# Build & Push Frontend
echo "   -> Processing Frontend..."
docker build -t home-app-frontend -f docker/frontend.Dockerfile app/electromart-frontend > /dev/null 2>&1
docker tag home-app-frontend:latest $ECR_FRONTEND:latest
docker push $ECR_FRONTEND:latest

echo -e "${GREEN}✅ Images pushed to ECR!${NC}"

# ====================================================
# PHASE 4: CONFIGURE SERVERS (Ansible)
# ====================================================
echo -e "\n${BLUE}⚙️  [4/4] Configuring Servers & Deploying App...${NC}"

cd $ANSIBLE_DIR

# ------------------------------------------------------------------
# SMART WAIT: Check for SSH connectivity before running playbooks
# ------------------------------------------------------------------
echo -e "${YELLOW}⏳ Waiting for all servers to become reachable via SSH...${NC}"
echo "   (This may take 1-2 minutes while servers initialize)"

RETRIES=30
DELAY=10
SUCCESS=false

for ((i=1; i<=RETRIES; i++)); do
    # Try to ping all hosts defined in inventory
    if ansible -i inventory.ini all -m ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ All servers are online and reachable!${NC}"
        SUCCESS=true
        break
    else
        echo "   ... Waiting for SSH connection (Attempt $i/$RETRIES)"
        sleep $DELAY
    fi
done

if [ "$SUCCESS" = false ]; then
    echo -e "${RED}❌ Timeout: Servers did not become reachable in time.${NC}"
    echo "   Please check your Security Groups or SSH Key configuration."
    exit 1
fi

# ------------------------------------------------------------------
# Run Playbooks (Now guaranteed to connect)
# ------------------------------------------------------------------
echo "   -> Installing Docker..."
ansible-playbook -i inventory.ini install_docker.yaml

echo "   -> Deploying Application Stack..."
ansible-playbook -i inventory.ini deploy_app.yaml

echo "   -> Deploying Monitoring Stack..."
ansible-playbook -i inventory.ini deploy_monitoring.yaml

# ====================================================
# SUMMARY
# ====================================================
echo -e "\n${GREEN}🎉 DEPLOYMENT COMPLETE! 🎉${NC}"
echo "------------------------------------------------"
echo -e "🌍 Web App URL:    http://${WEB_PUBLIC_IP}"
echo -e "📊 Grafana URL:    http://localhost:3000 (Requires SSH Tunnel)"
echo "------------------------------------------------"
echo -e "${YELLOW}👉 Run this command to open the monitoring tunnel:${NC}"
echo "ssh -i home-app.pem -L 3000:localhost:3000 -L 9090:localhost:9090 ubuntu@${BASTION_IP}"