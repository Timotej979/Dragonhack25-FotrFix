# Creates an S3 bucket to store the Terraform state file
resource "aws_s3_bucket" "terraform_state" {
  bucket = "${local.environment}-${local.project}-terraform-state"
     
  lifecycle {
    prevent_destroy = false
  }

  tags = {
    Environment = local.environment
    Project     = local.project
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  
  versioning_configuration {
    status = "Enabled"
  }
  
  depends_on = [ aws_s3_bucket.terraform_state ]
}