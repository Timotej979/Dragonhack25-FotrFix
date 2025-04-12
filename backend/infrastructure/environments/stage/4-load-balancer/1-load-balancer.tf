resource "aws_lb" "mlflow" {
  name               = "${var.environment}-${var.project}-lb"
  
  # Configuration
  load_balancer_type = "application"
  ip_address_type    = "ipv4"
  internal           = false
  idle_timeout       = 60
  
  # Security Groups
  security_groups = [
    data.terraform_remote_state.vpc.outputs.lb_security_group_id
  ]
  
  # Subnets
  subnets = data.terraform_remote_state.vpc.outputs.public_subnet_ids

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_lb_target_group" "mlflow" {
  name            = "${var.environment}-${var.project}-tg"

  # Configuration
  target_type     = "ip"
  protocol        = "HTTP"
  ip_address_type = "ipv4"
  port            = 80

  # VPC Configuration
  vpc_id          = data.terraform_remote_state.vpc.outputs.vpc_id

  # Health Check Configuration
  health_check {
    enabled             = true
    healthy_threshold   = 5
    interval            = 30
    matcher             = "401"
    path                = "/ping"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

resource "aws_alb_listener" "mlflow" {
  # Load Balancer Configuration
  load_balancer_arn = aws_lb.mlflow.id
  protocol          = "HTTP"
  port              = 80
  
  # Default Action Configuration
  default_action {
    order            = 1
    type             = "forward"
    target_group_arn = aws_lb_target_group.mlflow.id
  }

  depends_on = [aws_lb.mlflow, aws_lb_target_group.mlflow]
}

resource "aws_lb_listener_rule" "mlflow" {
  # Listener Configuration
  priority     = 1
  listener_arn = aws_alb_listener.mlflow.id
  
  # Action Configuration
  action {
    target_group_arn = aws_lb_target_group.mlflow.id
    type             = "forward"
  }

  # Condition Configuration
  condition {
    source_ip {
      values = ["0.0.0.0/0"]
    }
  }

  depends_on = [aws_lb.mlflow, aws_lb_target_group.mlflow]
}