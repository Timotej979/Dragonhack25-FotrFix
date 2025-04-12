resource "aws_ecs_service" "mlflow" {
  health_check_grace_period_seconds = 0
  name                              = "${local.ecs_service_name}-service"
  enable_ecs_managed_tags           = true
  propagate_tags                    = "NONE"
  cluster                           = aws_ecs_cluster.mlflow_ecs.id
  task_definition                   = "${aws_ecs_task_definition.mlflow.family}:${aws_ecs_task_definition.mlflow.revision}"
  desired_count                     = 1

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  deployment_controller {
    type = "ECS"
  }

  capacity_provider_strategy {
    base              = 1
    capacity_provider = "FARGATE"
    weight            = 10
  }

  load_balancer {
    container_name   = "${local.ecs_task_name}-container"
    container_port   = 8080
    target_group_arn = data.terraform_remote_state.load_balancer.outputs.mlflow_lb_target_group_arn
  }

  network_configuration {
    security_groups = [
      data.terraform_remote_state.vpc.outputs.ecs_security_group_id,
      data.terraform_remote_state.vpc.outputs.rds_security_group_id,
    ]

    subnets = data.terraform_remote_state.vpc.outputs.private_subnet_ids
  }

  tags = {
    Environment = local.environment
    Project     = local.project
    Name        = "mlflow-ecs-service"
  }

  depends_on = [aws_ecs_task_definition.mlflow]
}