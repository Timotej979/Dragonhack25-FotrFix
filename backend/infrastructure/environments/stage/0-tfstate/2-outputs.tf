output "terraform_state_bucket_arn" {
  description = "The ARN of the S3 bucket for saving Terraform state"
  value       = module.tfstate.terraform_state_bucket_arn
}

output "terraform_state_bucket_id" {
  description = "The ID of the S3 bucket for saving Terraform state"
  value       = module.tfstate.terraform_state_bucket_id
}

output "terraform_state_bucket_name" {
  description = "The name of the S3 bucket for saving Terraform state"
  value       = module.tfstate.terraform_state_bucket_name
}