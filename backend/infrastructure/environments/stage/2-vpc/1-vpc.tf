module "vpc" {
  source = "../../../modules/vpc"

  environment = local.environment
  project     = local.project

  # VPC configuration
  vpc_cidr = local.vpc_cidr
  azs      = local.azs

  # Subnet configuration
  private_subnets  = local.private_subnets
  public_subnets   = local.public_subnets
  database_subnets = local.database_subnets
}