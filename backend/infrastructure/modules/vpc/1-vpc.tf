resource "aws_vpc" "this" {
  enable_dns_support   = true
  enable_dns_hostnames = true

  cidr_block           = local.vpc_cidr

  tags = {
    Name        = "${local.environment}-${local.project}-vpc"
    Environment = local.environment
    Project     = local.project
  }
}