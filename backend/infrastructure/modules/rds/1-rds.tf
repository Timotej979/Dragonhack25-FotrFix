resource "random_password" "db_password" {
  length           = 32
  special          = false
}

resource "aws_db_instance" "this" {
  # Instance naming
  identifier             = "${local.environment}-${local.project}-${local.instance_name}"
  db_name                = local.db_name

  # Engine, Instance Class, Storage
  engine                 = "postgres"
  engine_version         = "15.12"
  instance_class         = local.instance_type
  allocated_storage      = local.allocated_storage
  
  # Credentials
  username               = local.username
  password               = random_password.db_password.result
  
  # Networking
  vpc_security_group_ids = local.security_group_ids
  publicly_accessible    = "true"
  db_subnet_group_name   = local.db_subnet_group_name
  
  # Encryption & Backup
  storage_encrypted      = true
  skip_final_snapshot    = true

  tags = {
    Name        = "${local.environment}-${local.project}-${local.instance_name}"
    Environment = local.environment
    Project     = local.project
  }
}

resource "aws_ssm_parameter" "db_password" {
  name  = "/${local.environment}/${local.project}/${local.instance_name}/DB_PASSWORD"
  type  = "SecureString"
  value = random_password.db_password.result

  tags = {
    Environment = local.environment
    Project     = local.project
    Name        = local.instance_name
  }
}

resource "aws_ssm_parameter" "db_url" {
  name  = "/${local.environment}/${local.project}/${local.instance_name}/DB_URL"
  type  = "SecureString"
  value = "postgresql://${aws_db_instance.this.username}:${random_password.db_password.result}@${aws_db_instance.this.address}:5432/${aws_db_instance.this.db_name}"

  tags = {
    Environment = local.environment
    Project     = local.project
    Name        = local.instance_name
  }
}