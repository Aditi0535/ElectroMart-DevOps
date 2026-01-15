output "ECR_FRONTEND_URL" {
  value = module.iam.frontend_repo_url
}

output "ECR_BACKEND_URL" {
  value = module.iam.backend_repo_url
}

output "BASTION_IP" {
  value = module.compute.bastion_public_ip
}

output "WEB_IP" {
  value = module.compute.web_public_ip
}

output "BACKEND_IP" {
  value = module.compute.backend_private_ip
}

output "DB_IP" {
  value = module.compute.db_private_ip
}

output "WEB_PRIVATE_IP" {
  value = module.compute.web_private_ip
}

output "BASTION_PRIVATE_IP" {
  value = module.compute.bastion_private_ip
}