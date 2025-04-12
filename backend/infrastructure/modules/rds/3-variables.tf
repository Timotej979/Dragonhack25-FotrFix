variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "instance_name" {
  description = "Instance name of the S3 bucket"
  type        = string
}

variable "instance_type" {
  description = "Instance type of the RDS instance"
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "Allocated storage for the RDS instance in GB"
  type        = number
  default     = 10
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_subnet_group_name" {
  description = "Database subnet group name"
  type        = string
} 

variable "security_group_ids" {
  description = "Security groups for the RDS instance"
  type        = list(string)
}
