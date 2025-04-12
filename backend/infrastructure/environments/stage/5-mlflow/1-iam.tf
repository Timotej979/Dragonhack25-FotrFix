data "aws_iam_policy" "cloud_watch" {
  name = "AWSOpsWorksCloudWatchLogs"
}

data "aws_iam_policy" "ecs_task_execution" {
  name = "AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_policy" "access_ssm" {
  name        = "ecs_mlflow_access_ssm"
  path        = "/"
  description = "IAM policy for ECS MLflow to access SSM parameters"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath",
          "secretsmanager:GetSecretValue"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:ssm:*:*:*"
      },
      {
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:secretsmanager:*:*:*"
      },
    ]
  })
}

resource "aws_iam_role" "ecs_mlflow" {
  name = "ecs_mlflow_role"

  managed_policy_arns = [
    aws_iam_policy.access_ssm.arn,
    data.aws_iam_policy.cloud_watch.arn,
    data.aws_iam_policy.ecs_task_execution.arn
  ]

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })

  tags = {
    Environment = local.environment
    Project     = local.project
    Name       = "ecs_mlflow_role"
  }
}