resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = {
    Name        = "${local.environment}-${local.project}-igw"
    Environment = local.environment
    Project     = local.project
  }
}

resource "aws_eip" "this" {
  count    = length(var.azs)

  # Create EIPs for NAT Gateways
  domain   = "vpc"

  tags = {
    Name        = "${local.environment}-${local.project}-nat-ip-${count.index + 1}"
    Environment = local.environment
    Project     = local.project
  }
}

resource "aws_nat_gateway" "this" {
  count    = length(var.azs)

  # Create NAT Gateways
  allocation_id = aws_eip.this[count.index].id
  subnet_id    = aws_subnet.public[count.index].id

  tags = {
    Name        = "${local.environment}-${local.project}-nat-${count.index + 1}"
    Environment = local.environment
    Project     = local.project
  }

  depends_on = [aws_internet_gateway.this]
}