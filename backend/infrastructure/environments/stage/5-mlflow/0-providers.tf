provider "aws" {
  profile = "terraform"
  region  = "eu-central-1"
}

data "terraform_remote_state" "registry" {
  backend = "s3"
  config = {
    bucket         = "stage-dragonhack25-fotrfix-terraform-state"
    key            = "registry.tfstate"
    region         = "eu-central-1"
    use_lockfile   = true
  }
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

data "terraform_remote_state" "stateful" {
  backend = "s3"
  config = {
    bucket         = "stage-dragonhack25-fotrfix-terraform-state"
    key            = "stateful.tfstate"
    region         = "eu-central-1"
    use_lockfile   = true
  }
}

data "terraform_remote_state" "load_balancer" {
  backend = "s3"
  config = {
    bucket         = "stage-dragonhack25-fotrfix-terraform-state"
    key            = "load-balancer.tfstate"
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
    key            = "mlflow.tfstate"
    bucket         = "stage-dragonhack25-fotrfix-terraform-state"
    use_lockfile   = true
    encrypt        = true
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  # AWS info
  region      = data.aws_region.current.name

  # Project info
  environment = var.environment
  project     = var.project

  # RDS info
  db_username = data.terraform_remote_state.stateful.outputs.mlflow_db_instance_username


  # ECS info
  ecs_task_name    = "${local.project}-${local.environment}-mlflow"
  ecs_service_name = "${local.project}-${local.environment}-mlflow"
}