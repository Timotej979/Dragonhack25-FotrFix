# Create ECR repositories specified in the environment variables.
resource "aws_ecr_repository" "this" {
  name                 = "${local.environment}-${local.project}-${local.instance_name}"
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  lifecycle {
    prevent_destroy = false
  }

  tags = {
    Environment = local.environment
    Project     = local.project
    Name        = local.instance_name
  }
}