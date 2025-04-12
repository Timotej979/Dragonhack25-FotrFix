terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.70.0"
    }
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  # Project info
  environment   = var.environment
  project       = var.project

  # RDS info
  instance_name        = var.instance_name
  instance_type        = var.instance_type
  allocated_storage    = var.allocated_storage
  db_subnet_group_name = var.db_subnet_group_name
  security_group_ids   = var.security_group_ids

  # DB info
  db_name           = var.db_name
  username       = var.db_username
}