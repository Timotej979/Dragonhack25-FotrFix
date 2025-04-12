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
    key            = "registry.tfstate"
    bucket         = "stage-dragonhack25-dadgpt-terraform-state"
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

  # ECR registries
  ecr_repositories = toset(["mlflow"])
}