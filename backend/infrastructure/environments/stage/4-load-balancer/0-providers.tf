provider "aws" {
  profile = "terraform"
  region  = "eu-central-1"
}

data "terraform_remote_state" "vpc" {
  backend = "s3"
  config = {
    bucket         = "stage-dragonhack25-fotrfix-terraform-state"
    key            = "vpc.tfstate"
    region         = "eu-central-1"
    use_lockfile   = true
  }
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
    key            = "load-balancer.tfstate"
    bucket         = "stage-dragonhack25-fotrfix-terraform-state"
    use_lockfile   = true
    encrypt        = true
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {  
  # Project info
  environment = var.environment
  project     = var.project
}