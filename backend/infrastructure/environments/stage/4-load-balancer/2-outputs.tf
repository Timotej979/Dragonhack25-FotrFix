output "mlflow_lb_target_group_arn" {
  description = "The ARN of the MLflow AWS Load Balancer Target Group"
  value       = aws_lb_target_group.mlflow.arn
}