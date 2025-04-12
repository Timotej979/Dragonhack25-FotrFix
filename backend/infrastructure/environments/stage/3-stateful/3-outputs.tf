output "mlflow_db_instance_id" {
  description = "The ID of the RDS instance for MLflow"
  value       = module.mlflow_db.rds_instance_id
}

output "mlflow_db_instance_arn" {
  description = "The ARN of the RDS instance for MLflow"
  value       = module.mlflow_db.rds_instance_arn
}

output "mlflow_db_instance_endpoint" {
  description = "The endpoint of the RDS instance for MLflow"
  value       = module.mlflow_db.rds_instance_endpoint
}

output "mlflow_db_instance_address" {
  description = "The address of the RDS instance for MLflow"
  value       = module.mlflow_db.rds_instance_address
}

output "mlflow_db_instance_name" {
  description = "The name of the RDS instance for MLflow"
  value       = module.mlflow_db.rds_instance_name
}

output "mlflow_db_instance_username" {
  description = "The username for the RDS instance for MLflow"
  value       = module.mlflow_db.rds_instance_username
}

output "mlflow_rds_instance_url_ssm_parameter" {
  description = "The SSM parameter for the RDS instance URL"
  value       = module.mlflow_db.rds_instance_url_ssm_parameter
}

output "mlflow_rds_instance_password_ssm_parameter" {
  description = "The SSM parameter for the RDS instance password"
  value       = module.mlflow_db.rds_instance_password_ssm_parameter
}

output "mlflow_s3_artifact_url_ssm_parameter" {
  description = "The SSM parameter for the S3 artifact URL"
  value       = module.mlflow_bucket.s3_artifact_url_ssm_parameter
}