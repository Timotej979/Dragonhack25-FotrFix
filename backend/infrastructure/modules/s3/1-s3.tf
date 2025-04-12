resource "aws_s3_bucket" "this" {
  bucket = "${local.environment}-${local.project}-${var.instance_name}"

  tags = {
    Environment = var.environment
    Project     = var.project
    Name        = var.instance_name
  }
}

resource "aws_ssm_parameter" "this" {
  name  = "/${local.environment}/${local.project}/ARTIFACT_URL"
  type  = "SecureString"
  value = "s3://${aws_s3_bucket.this.bucket}"

  tags = {
    Environment = var.environment
    Project     = var.project
    Name        = var.instance_name
  }
}