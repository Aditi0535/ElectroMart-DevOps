# modules/iam/outputs.tf

output "frontend_repo_url" {
  # Hardcoded URL for the manually created ECR repo
  value = "836397457654.dkr.ecr.ap-south-1.amazonaws.com/home-app-frontend"
}

output "backend_repo_url" {
  # Hardcoded URL for the manually created ECR repo
  value = "836397457654.dkr.ecr.ap-south-1.amazonaws.com/home-app-backend"
}

output "instance_profile" {
  # This resource still exists in Terraform, so we reference it dynamically
  value = aws_iam_instance_profile.profile.name
}