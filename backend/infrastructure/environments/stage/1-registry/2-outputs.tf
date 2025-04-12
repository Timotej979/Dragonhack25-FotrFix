output "ecr_repository_arns" {
  description = "The ECR repositories"
  value       = [for repo in module.ecr_registry : repo.ecr_repository_arn]
}

output "ecr_repository_ids" {
  description = "The ECR repositories"
  value       = [for repo in module.ecr_registry : repo.ecr_repository_id]
}

output "ecr_repository_names" {
  description = "The ECR repositories"
  value       = [for repo in module.ecr_registry : repo.ecr_repository_name]
}

output "mlflow_ecr_repository_arn" {
  description = "The MLflow ECR repository"
  value       = module.ecr_registry["mlflow"].ecr_repository_arn
}

output "mlflow_ecr_repository_id" {
  description = "The MLflow ECR repository"
  value       = module.ecr_registry["mlflow"].ecr_repository_id
}

output "mlflow_ecr_repository_name" {
  description = "The MLflow ECR repository"
  value       = module.ecr_registry["mlflow"].ecr_repository_name
}