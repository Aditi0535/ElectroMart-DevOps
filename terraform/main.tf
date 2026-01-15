provider "aws" { region = var.region }

module "networking" {
  source       = "./modules/networking"
  project_name = var.project_name
  region       = var.region
}

module "security" {
  source       = "./modules/security"
  project_name = var.project_name
  vpc_id       = module.networking.vpc_id
}

module "iam" {
  source       = "./modules/iam"
  project_name = var.project_name
}

module "compute" {
  source               = "./modules/compute"
  project_name         = var.project_name
  key_name             = var.key_name
  public_subnet_id     = module.networking.public_subnet_id
  private_subnet_id    = module.networking.private_subnet_id
  bastion_sg_id        = module.security.bastion_sg_id
  web_sg_id            = module.security.web_sg_id
  backend_sg_id        = module.security.backend_sg_id
  db_sg_id             = module.security.db_sg_id
  iam_instance_profile = module.iam.instance_profile
}