output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

# Database Subnet Group
output "database_subnet_group_name" {
  description = "Database Subnet Group Name"
  value       = module.vpc.database_subnet_group_name
}

# Allow Ingress from Internet Security Group
output "allow_ingress_from_internet_security_group_arn" {
  description = "Allow Ingress from Internet Security Group ARN"
  value       = module.vpc.allow_ingress_from_internet_security_group_arn
}

output "allow_ingress_from_internet_security_group_id" {
  description = "Allow Ingress from Internet Security Group ID"
  value       = module.vpc.allow_ingress_from_internet_security_group_id
}

output "allow_ingress_from_internet_security_group_name" {
  description = "Allow Ingress from Internet Security Group Name"
  value       = module.vpc.allow_ingress_from_internet_security_group_name
}

# ECS Security Group
output "ecs_security_group_arn" {
  description = "ECS Security Group ARN"
  value       = module.vpc.ecs_security_group_arn
}

output "ecs_security_group_id" {
  description = "ECS Security Group ID"
  value       = module.vpc.ecs_security_group_id
}

output "ecs_security_group_name" {
  description = "ECS Security Group Name"
  value       = module.vpc.ecs_security_group_name
}

# RDS Security Group
output "rds_security_group_arn" {
  description = "RDS Security Group ARN"
  value       = module.vpc.rds_security_group_arn
}

output "rds_security_group_id" {
  description = "RDS Security Group ID"
  value       = module.vpc.rds_security_group_id
}

output "rds_security_group_name" {
  description = "RDS Security Group Name"
  value       = module.vpc.rds_security_group_name
}

# Load Balancer Security Group
output "lb_security_group_arn" {
  description = "Load Balancer Security Group ARN"
  value       = module.vpc.lb_security_group_arn
}

output "lb_security_group_id" {
  description = "Load Balancer Security Group ID"
  value       = module.vpc.lb_security_group_id
}

output "lb_security_group_name" {
  description = "Load Balancer Security Group Name"
  value       = module.vpc.lb_security_group_name
}