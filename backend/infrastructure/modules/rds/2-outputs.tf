output "rds_instance_arn" {
  description = "The ARN of the RDS instance"
  value       = aws_db_instance.this.arn
}

output "rds_instance_id" {
  description = "The ID of the RDS instance"
  value       = aws_db_instance.this.id
}

output "rds_instance_endpoint" {
  description = "The endpoint of the RDS instance"
  value       = aws_db_instance.this.endpoint
}

output "rds_instance_address" {
  description = "The address of the RDS instance"
  value       = aws_db_instance.this.address
}

output "rds_instance_port" {
  description = "The port of the RDS instance"
  value       = aws_db_instance.this.port
}

output "rds_instance_name" {
  description = "The name of the RDS instance"
  value       = aws_db_instance.this.db_name
}

output "rds_instance_username" {
  description = "The username for the RDS instance"
  value       = aws_db_instance.this.username
}

# SSM parameters for RDS instance
output "rds_instance_url_ssm_parameter" {
  description = "The SSM parameter name for the RDS instance URL"
  value       = aws_ssm_parameter.db_url.name
}

output "rds_instance_password_ssm_parameter" {
  description = "The SSM parameter name for the RDS instance password"
  value       = aws_ssm_parameter.db_password.name
}