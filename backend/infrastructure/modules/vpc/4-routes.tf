resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = {
    Name        = "${local.environment}-${local.project}-public"
    Environment = local.environment
    Project     = local.project
  }
}

resource "aws_route_table" "private" {
	count = length(var.azs)

	vpc_id = aws_vpc.this.id
	route {
		cidr_block = "0.0.0.0/0"
		nat_gateway_id = aws_nat_gateway.this[count.index].id
	}

	tags = {
		Name        = "${local.environment}-${local.project}-private-${count.index + 1}"
		Environment = local.environment
		Project     = local.project
	}
}

resource "aws_route_table_association" "public_subnet_association" {
	count = length(var.azs)
	route_table_id = aws_route_table.public.id
	subnet_id      = aws_subnet.public[count.index].id
}

resource "aws_route_table_association" "private_subnet_association" {
	count = length(var.azs)
	route_table_id = aws_route_table.private[count.index].id
	subnet_id      = aws_subnet.private[count.index].id
}

resource "aws_route_table_association" "database_subnet_association" {
	count = length(var.azs)
	route_table_id = aws_route_table.public.id
	subnet_id      = aws_subnet.database[count.index].id
}