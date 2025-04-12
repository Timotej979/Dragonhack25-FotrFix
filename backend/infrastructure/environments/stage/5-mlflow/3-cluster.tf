resource "aws_ecs_cluster" "mlflow_ecs" {
  name = "${local.project}-${local.environment}-mlflow-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "base" {
  cluster_name = aws_ecs_cluster.mlflow_ecs.name

  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    weight            = 10
    base              = 1
    capacity_provider = "FARGATE"
  }
}