resource "aws_subnet" "private" {
  count             = length(var.private_subnets)

  # Create private subnets
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.azs[count.index]

  tags = {
    Name        = "${var.project}-${var.environment}-private-${count.index + 1}"
    Tier        = "private"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_subnet" "public" {
  count             = length(var.public_subnets)

  # Create public subnets
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.public_subnets[count.index]
  availability_zone = var.azs[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name        = "${var.project}-${var.environment}-public-${count.index + 1}"
    Tier        = "public"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_subnet" "database" {
  count             = length(var.database_subnets)

  # Create database subnets
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.database_subnets[count.index]
  availability_zone = var.azs[count.index]
  
  tags = {
    Name        = "${var.project}-${var.environment}-db-${count.index + 1}"
    Tier        = "database"
    Environment = var.environment
    Project     = var.project
  }
}

# Create a DB subnet group for RDS
resource "aws_db_subnet_group" "database_group" {
  name       = "${var.project}-${var.environment}-db-subnet-group"
  subnet_ids = aws_subnet.database[*].id

  tags = {
    Name        = "${var.project}-${var.environment}-db-subnet-group"
    Environment = var.environment
    Project     = var.project
  }
}
