module "mlflow_bucket" {
  source = "../../../modules/s3"

  environment = local.environment
  project     = local.project
  instance_name = "mlflow"
}

resource "aws_iam_user" "mlflow_s3_user" {
  name = "mlflow-s3-user"
  permissions_boundary = "arn:aws:iam::aws:policy/AmazonS3FullAccess"

  tags = {
    Environment = local.environment
    Project     = local.project
    Name       = "mlflow-access-s3"
  }
}
resource "aws_iam_user_policy_attachment" "attach_policy" {
  user       = aws_iam_user.mlflow_s3_user.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_access_key" "mlflow_s3_user" {
  user = aws_iam_user.mlflow_s3_user.name
}

resource "aws_ssm_parameter" "mlflow_key_id" {
  name  = "/${local.environment}/${local.project}/AWS_ACCESS_KEY_ID"
  type  = "SecureString"
  value = aws_iam_access_key.mlflow_s3_user.id

  tags = {
    Environment = local.environment
    Project     = local.project
    Name       = "mlflow-access-s3"
  }
}

resource "aws_ssm_parameter" "mlflow_key_secret" {
  name  = "/${local.environment}/${local.project}/AWS_SECRET_ACCESS_KEY"
  type  = "SecureString"
  value = aws_iam_access_key.mlflow_s3_user.secret

  tags = {
    Environment = local.environment
    Project     = local.project
    Name       = "mlflow-access-s3"
  }
}
