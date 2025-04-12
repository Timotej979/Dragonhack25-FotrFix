<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.70.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 5.70.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_vpc"></a> [vpc](#module\_vpc) | ../../../modules/vpc | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_availability_zones.available](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/availability_zones) | data source |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_environment"></a> [environment](#input\_environment) | Environment name | `string` | `"stage"` | no |
| <a name="input_project"></a> [project](#input\_project) | Project name | `string` | `"dragonhack25-fotrfix"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_allow_ingress_from_internet_security_group_arn"></a> [allow\_ingress\_from\_internet\_security\_group\_arn](#output\_allow\_ingress\_from\_internet\_security\_group\_arn) | Allow Ingress from Internet Security Group ARN |
| <a name="output_allow_ingress_from_internet_security_group_id"></a> [allow\_ingress\_from\_internet\_security\_group\_id](#output\_allow\_ingress\_from\_internet\_security\_group\_id) | Allow Ingress from Internet Security Group ID |
| <a name="output_allow_ingress_from_internet_security_group_name"></a> [allow\_ingress\_from\_internet\_security\_group\_name](#output\_allow\_ingress\_from\_internet\_security\_group\_name) | Allow Ingress from Internet Security Group Name |
| <a name="output_database_subnet_group_name"></a> [database\_subnet\_group\_name](#output\_database\_subnet\_group\_name) | Database Subnet Group Name |
| <a name="output_ecs_security_group_arn"></a> [ecs\_security\_group\_arn](#output\_ecs\_security\_group\_arn) | ECS Security Group ARN |
| <a name="output_ecs_security_group_id"></a> [ecs\_security\_group\_id](#output\_ecs\_security\_group\_id) | ECS Security Group ID |
| <a name="output_ecs_security_group_name"></a> [ecs\_security\_group\_name](#output\_ecs\_security\_group\_name) | ECS Security Group Name |
| <a name="output_lb_security_group_arn"></a> [lb\_security\_group\_arn](#output\_lb\_security\_group\_arn) | Load Balancer Security Group ARN |
| <a name="output_lb_security_group_id"></a> [lb\_security\_group\_id](#output\_lb\_security\_group\_id) | Load Balancer Security Group ID |
| <a name="output_lb_security_group_name"></a> [lb\_security\_group\_name](#output\_lb\_security\_group\_name) | Load Balancer Security Group Name |
| <a name="output_private_subnet_ids"></a> [private\_subnet\_ids](#output\_private\_subnet\_ids) | Private Subnet IDs |
| <a name="output_public_subnet_ids"></a> [public\_subnet\_ids](#output\_public\_subnet\_ids) | Public Subnet IDs |
| <a name="output_rds_security_group_arn"></a> [rds\_security\_group\_arn](#output\_rds\_security\_group\_arn) | RDS Security Group ARN |
| <a name="output_rds_security_group_id"></a> [rds\_security\_group\_id](#output\_rds\_security\_group\_id) | RDS Security Group ID |
| <a name="output_rds_security_group_name"></a> [rds\_security\_group\_name](#output\_rds\_security\_group\_name) | RDS Security Group Name |
| <a name="output_vpc_id"></a> [vpc\_id](#output\_vpc\_id) | VPC ID |
<!-- END_TF_DOCS -->