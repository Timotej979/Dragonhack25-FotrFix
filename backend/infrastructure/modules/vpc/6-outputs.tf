output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.this.id
}

# Public subnets
output "public_subnet_ids" {
  description = "Public Subnet IDs"
  value       = aws_subnet.public.*.id
}

# Private subnets
output "private_subnet_ids" {
  description = "Private Subnet IDs"
  value       = aws_subnet.private.*.id
}

# Database subnets
output "database_subnet_ids" {
  description = "Database Subnet IDs"
  value       = aws_subnet.database.*.id
}

output "database_subnet_group_name" {
  description = "Database Subnet Group Name"
  value       = aws_db_subnet_group.database_group.name
}

# Allow ingress from internet
output "allow_ingress_from_internet_security_group_arn" {
  description = "Allow Ingress from Internet Security Group ARN"
  value       = aws_security_group.allow_ingress_from_internet.arn
}

output "allow_ingress_from_internet_security_group_id" {
  description = "Allow Ingress from Internet Security Group ID"
  value       = aws_security_group.allow_ingress_from_internet.id
}

output "allow_ingress_from_internet_security_group_name" {
  description = "Allow Ingress from Internet Security Group Name"
  value       = aws_security_group.allow_ingress_from_internet.name
}

# ECS Security Group
output "ecs_security_group_arn" {
  description = "ECS Security Group ARN"
  value       = aws_security_group.ecs_sg.arn
}

output "ecs_security_group_id" {
  description = "ECS Security Group ID"
  value       = aws_security_group.ecs_sg.id
}

output "ecs_security_group_name" {
  description = "ECS Security Group Name"
  value       = aws_security_group.ecs_sg.name
}

# RDS Security Group
output "rds_security_group_arn" {
  description = "RDS Security Group ARN"
  value       = aws_security_group.rds_sg.arn
}

output "rds_security_group_id" {
  description = "RDS Security Group ID"
  value       = aws_security_group.rds_sg.id
}

output "rds_security_group_name" {
  description = "RDS Security Group Name"
  value       = aws_security_group.rds_sg.name
}

# Load Balancer Security Group
output "lb_security_group_arn" {
  description = "Load Balancer Security Group ARN"
  value       = aws_security_group.lb_sg.arn
}

output "lb_security_group_id" {
  description = "Load Balancer Security Group ID"
  value       = aws_security_group.lb_sg.id
}

output "lb_security_group_name" {
  description = "Load Balancer Security Group Name"
  value       = aws_security_group.lb_sg.name
}