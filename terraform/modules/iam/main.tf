# modules/iam/main.tf

# -----------------------------------------------------------
# ECR Repositories (Artifact Storage)
# -----------------------------------------------------------

# 1. Frontend Repository
resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}-frontend"
  force_delete         = true
  
  # CRITICAL: Changed to MUTABLE to allow CI/CD to overwrite 'latest' tag
  image_tag_mutability = "MUTABLE" 

  # Security: Still keeps auto-scanning enabled
  image_scanning_configuration {
    scan_on_push = true
  }
}

# 2. Backend Repository
resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  force_delete         = true
  
  # CRITICAL: Changed to MUTABLE to allow CI/CD to overwrite 'latest' tag
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# -----------------------------------------------------------
# IAM Roles & Policies (Permissions)
# -----------------------------------------------------------

# 3. IAM Role for EC2
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

# 4. Attach Policy (Read-only access to ECR)
resource "aws_iam_role_policy_attachment" "ecr_pull" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# 5. Instance Profile (Passes the role to EC2)
resource "aws_iam_instance_profile" "profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}