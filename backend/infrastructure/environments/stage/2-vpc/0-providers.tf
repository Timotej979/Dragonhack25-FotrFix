provider "aws" {
  profile = "terraform"
  region  = "eu-central-1"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.70.0"
    }
  }

  backend "s3" {
    profile        = "terraform"
    region         = "eu-central-1"
    key            = "vpc.tfstate"
    bucket         = "stage-dragonhack25-fotrfix-terraform-state"
    use_lockfile   = true
    encrypt        = true
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

locals {  
  # Project info
  environment = var.environment
  project     = var.project

  # VPC config
  vpc_cidr = "10.1.0.0/16"

  # Subnet config
  azs = slice(data.aws_availability_zones.available.names, 0, 3)

  # Subnet config (1 AZ = 1 set of private/public/database subnets)
  private_subnets  = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
  public_subnets   = ["10.1.11.0/24", "10.1.12.0/24", "10.1.13.0/24"]
  database_subnets = ["10.1.21.0/24", "10.1.22.0/24", "10.1.23.0/24"]
}