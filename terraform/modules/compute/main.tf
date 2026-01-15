data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# 1. Bastion Host (Public)
resource "aws_instance" "bastion" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [var.bastion_sg_id]
  key_name               = var.key_name
  tags                   = { Name = "${var.project_name}-bastion" }

  # Fix: Encrypt the Hard Drive
  root_block_device {
    encrypted = true
  }

  # Fix: Enforce IMDSv2 (Metadata Protection)
  metadata_options {
    http_tokens = "required"
  }
}

# 2. Web Server (Public)
resource "aws_instance" "web" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [var.web_sg_id]
  key_name               = var.key_name
  iam_instance_profile   = var.iam_instance_profile
  tags                   = { Name = "${var.project_name}-web" }

  # Fix: Encrypt the Hard Drive
  root_block_device {
    encrypted = true
  }

  # Fix: Enforce IMDSv2 (Metadata Protection)
  metadata_options {
    http_tokens = "required"
  }
}

# 3. Backend App (Private)
resource "aws_instance" "backend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  subnet_id              = var.private_subnet_id
  vpc_security_group_ids = [var.backend_sg_id]
  key_name               = var.key_name
  iam_instance_profile   = var.iam_instance_profile
  tags                   = { Name = "${var.project_name}-backend" }

  # Fix: Encrypt the Hard Drive
  root_block_device {
    encrypted = true
  }

  # Fix: Enforce IMDSv2 (Metadata Protection)
  metadata_options {
    http_tokens = "required"
  }
}

# 4. Database (Private)
resource "aws_instance" "db" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  subnet_id              = var.private_subnet_id
  vpc_security_group_ids = [var.db_sg_id]
  key_name               = var.key_name
  tags                   = { Name = "${var.project_name}-db" }

  # Fix: Encrypt the Hard Drive
  root_block_device {
    encrypted = true
  }

  # Fix: Enforce IMDSv2 (Metadata Protection)
  metadata_options {
    http_tokens = "required"
  }
}