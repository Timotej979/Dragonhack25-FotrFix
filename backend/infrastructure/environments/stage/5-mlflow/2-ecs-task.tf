resource "random_password" "mlflow_password" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_ssm_parameter" "mlflow_password" {
  name  = "/${local.environment}/${local.project}/MLFLOW_TRACKING_PASSWORD"
  type  = "SecureString"
  value = random_password.mlflow_password.result

  tags = {
    Environment = local.environment
    Project     = local.project
    Name        = "mlflow-tracking-password"
  }
}

resource "aws_ecs_task_definition" "mlflow" {
  execution_role_arn = aws_iam_role.ecs_mlflow.arn
  family       = local.ecs_task_name
  memory       = "3072"
  cpu          = "1024"
  network_mode = "awsvpc"
  requires_compatibilities = [
    "FARGATE",
  ]

  container_definitions = jsonencode(
    [
      {
        environment = [
          {
            name  = "DB_PORT"
            value = "5432"
          },
          {
            name  = "MLFLOW_TRACKING_USERNAME"
            value = "mlflow-user"
          },
        ]
        essential = true
        image     = "${data.terraform_remote_state.registry.outputs.mlflow_ecr_repository_url}:latest"
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-create-group  = "true"
            awslogs-group         = "/ecs/${local.ecs_service_name}/${local.ecs_task_name}"
            awslogs-region        = "${local.region}"
            awslogs-stream-prefix = "ecs"
          }
        }
        name = "${local.ecs_task_name}-container"
        portMappings = [
          {
            appProtocol   = "http"
            containerPort = 8080
            hostPort      = 8080
            name          = "${local.ecs_task_name}-8080-tcp"
            protocol      = "tcp"
          },
        ]
        secrets = [
          {
            name      = "AWS_ACCESS_KEY_ID"
            valueFrom = "/${local.environment}/${local.project}/AWS_ACCESS_KEY_ID"
          },
          {
            name      = "AWS_SECRET_ACCESS_KEY"
            valueFrom = "/${local.environment}/${local.project}/AWS_SECRET_ACCESS_KEY"
          },
          {
            name      = "MLFLOW_TRACKING_PASSWORD"
            valueFrom = "/${local.environment}/${local.project}/MLFLOW_TRACKING_PASSWORD"
          },
          {
            name      = "ARTIFACT_URL"
            valueFrom = data.terraform_remote_state.stateful.outputs.mlflow_s3_artifact_url_ssm_parameter
          },
          {
            name      = "DATABASE_URL"
            valueFrom = data.terraform_remote_state.stateful.outputs.mlflow_rds_instance_url_ssm_parameter
          },
        ]
      },
    ]
  )

  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }
  
  tags = {
    Environment = local.environment
    Project     = local.project
    Name        = local.ecs_task_name
  }
}