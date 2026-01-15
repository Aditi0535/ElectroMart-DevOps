# modules/iam/main.tf

# 1. Frontend Repository (Hardened)
resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}-frontend"
  force_delete         = true
  image_tag_mutability = "IMMUTABLE" # Security: Prevent overwriting tags

  # Security: Enable auto-scanning for vulnerabilities
  image_scanning_configuration {
    scan_on_push = true
  }
}

# 2. Backend Repository (Hardened)
resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  force_delete         = true
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# 3. IAM Role for EC2
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{ Action = "sts:AssumeRole", Effect = "Allow", Principal = { Service = "ec2.amazonaws.com" } }]
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