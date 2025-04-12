module "mlflow_db" {
  source = "../../../modules/rds"

  # Encironment configuration
  environment = local.environment
  project     = local.project

  # Instance configuration
  instance_name = "mlflow"

  # RDS configuration
  instance_type        = "db.t3.micro"
  allocated_storage    = 10
  security_group_ids   = [
    data.terraform_remote_state.vpc.outputs.rds_security_group_id,
    data.terraform_remote_state.vpc.outputs.allow_ingress_from_internet_security_group_id
  ]
  db_subnet_group_name = data.terraform_remote_state.vpc.outputs.database_subnet_group_name

  # Database configuration
  db_username = "mlflow_db_user"
  db_name     = "mlflowdb"
}