# modules/security/main.tf

# 1. Bastion SG
resource "aws_security_group" "bastion" {
  name   = "${var.project_name}-bastion-sg"
  vpc_id = var.vpc_id
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow Monitoring (Node Exporter) on Bastion itself
  ingress {
    from_port   = 9100
    to_port     = 9100
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # Allow internal VPC scraping
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. Web/Frontend SG
resource "aws_security_group" "web" {
  name   = "${var.project_name}-web-sg"
  vpc_id = var.vpc_id
  
  # Allow HTTP from the World
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow SSH from Bastion
  ingress {
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    security_groups  = [aws_security_group.bastion.id]
  }

  # Allow Prometheus scraping
  ingress {
    description      = "Allow Prometheus scraping"
    from_port        = 9100
    to_port          = 9100
    protocol         = "tcp"
    cidr_blocks      = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. Backend SG
resource "aws_security_group" "backend" {
  name   = "${var.project_name}-backend-sg"
  vpc_id = var.vpc_id
  
  # Allow API Traffic from Frontend (Port 5000)
  ingress {
    from_port        = 5000
    to_port          = 5000
    protocol         = "tcp"
    security_groups  = [aws_security_group.web.id]
  }

  # --- NEW: Allow Bastion to check API Health (Blackbox Exporter) ---
  ingress {
    description      = "Allow Bastion to check API health"
    from_port        = 5000
    to_port          = 5000
    protocol         = "tcp"
    security_groups  = [aws_security_group.bastion.id]
  }

  # Allow SSH from Bastion
  ingress {
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    security_groups  = [aws_security_group.bastion.id]
  }

  # Allow Prometheus scraping
  ingress {
    description      = "Allow Prometheus scraping"
    from_port        = 9100
    to_port          = 9100
    protocol         = "tcp"
    cidr_blocks      = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Database SG
resource "aws_security_group" "db" {
  name   = "${var.project_name}-db-sg"
  vpc_id = var.vpc_id
  
  # Allow MongoDB Traffic from Backend (Port 27017)
  ingress {
    from_port        = 27017
    to_port          = 27017
    protocol         = "tcp"
    security_groups  = [aws_security_group.backend.id]
  }

  # --- NEW: Allow Bastion to check DB Health (Blackbox Exporter) ---
  ingress {
    description      = "Allow Bastion to check DB health"
    from_port        = 27017
    to_port          = 27017
    protocol         = "tcp"
    security_groups  = [aws_security_group.bastion.id]
  }

  # Allow SSH from Bastion
  ingress {
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    security_groups  = [aws_security_group.bastion.id]
  }

  # Allow Prometheus scraping
  ingress {
    description      = "Allow Prometheus scraping"
    from_port        = 9100
    to_port          = 9100
    protocol         = "tcp"
    cidr_blocks      = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}