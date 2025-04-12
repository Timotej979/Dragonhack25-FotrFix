# Allow inbound traffic from internet
resource "aws_security_group" "allow_ingress_from_internet" {
  name        = "${local.environment}-${local.project}-allow-ingress-from-internet"
  description = "Allow inbound traffic from internet"
  vpc_id      = aws_vpc.this.id

  tags = {
    Name        = "${local.environment}-${local.project}-allow-ingress-from-internet"
    Environment = local.environment
    Project     = local.project
  }
}

resource "aws_security_group_rule" "db_ingress" {
  type              = "ingress"
  description       = "Allow inbound traffic from internet to DB"
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"] # WARNING LIMIT THIS: Allow traffic from anywhere
  security_group_id = aws_security_group.allow_ingress_from_internet.id
}


# ECS security group setup
resource "aws_security_group" "ecs_sg" {
  name        = "${local.environment}-${local.project}-ecs-sg"
  description = "ECS Security Group"
  vpc_id      = aws_vpc.this.id

  tags = {
    Name        = "${local.environment}-${local.project}-ecs-sg"
    Environment = local.environment
    Project     = local.project
  }
}

resource "aws_security_group_rule" "ecs_egress_all" {
  description       = "ECS outbound all"
  type              = "egress"
  from_port         = 0
  to_port           = 65535
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ecs_sg.id
}

resource "aws_security_group_rule" "ecs_ingress" {
  description              = "ECS inbound from LB"
  type                     = "ingress"
  from_port                = 80
  to_port                  = 8080
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ecs_sg.id
  source_security_group_id = aws_security_group.lb_sg.id
}


# RDS security group setup
resource "aws_security_group" "rds_sg" {
  name        = "${local.environment}-${local.project}-rds-sg"
  description = "RDS Security Group"
  vpc_id      = aws_vpc.this.id

  tags = {
    Name        = "${local.environment}-${local.project}-rds-sg"
    Environment = local.environment
    Project     = local.project
  }
}

resource "aws_security_group_rule" "rds_ingress" {
  description              = "RDS inbound from ECS"
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = aws_security_group.ecs_sg.id
}

# ALB security group setup
resource "aws_security_group" "lb_sg" {
  name   = "${local.environment}-${local.project}-lb-sg"
  description = "LB Security Group"
  vpc_id = aws_vpc.this.id
  
  tags = {
    Name        = "${local.environment}-${local.project}-lb-sg"
    Environment = local.environment
    Project     = local.project
  }
}

resource "aws_security_group_rule" "ingress_lb_ports" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "TCP"
  cidr_blocks       = ["0.0.0.0/0"] # WARNING LIMIT THIS: Allow HTTP traffic from anywhere 
  security_group_id = aws_security_group.lb_sg.id
}

resource "aws_security_group_rule" "egress_lb_ecs" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lb_sg.id
}