output "bucket_arn" {
  description = "The ARN of the S3 bucket for saving MLflow artifacts"
  value       = aws_s3_bucket.this.arn
}

output "bucket_id" {
  description = "The ID of the S3 bucket for saving MLflow artifacts"
  value       = aws_s3_bucket.this.id
}

output "bucket_name" {
  description = "The name of the S3 bucket for saving MLflow artifacts"
  value       = aws_s3_bucket.this.bucket
}

# SSM parameters for MLflow S3 access
output "s3_artifact_url_ssm_parameter" {
  description = "The SSM parameter for the S3 artifact URL"
  value       = aws_ssm_parameter.this.name
}