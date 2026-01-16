# modules/iam/main.tf

# -----------------------------------------------------------
# ECR Repositories (Artifact Storage)
# -----------------------------------------------------------
# NOTE: ECR Repositories are now managed MANUALLY via AWS CLI.
# This prevents them from being deleted during 'terraform destroy'.
#
# The following resources have been removed from Terraform control:
# - aws_ecr_repository.frontend
# - aws_ecr_repository.backend

# -----------------------------------------------------------
# IAM Roles & Policies (Permissions)
# -----------------------------------------------------------

# 1. IAM Role for EC2
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{ 
        Action = "sts:AssumeRole", 
        Effect = "Allow", 
        Principal = { Service = "ec2.amazonaws.com" } 
    }]
  })
}

# 2. Attach Policy (Read-only access to ECR)
resource "aws_iam_role_policy_attachment" "ecr_pull" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# 3. Instance Profile (Passes the role to EC2)
resource "aws_iam_instance_profile" "profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}