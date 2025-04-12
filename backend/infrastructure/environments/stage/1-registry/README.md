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
| <a name="module_ecr_registry"></a> [ecr\_registry](#module\_ecr\_registry) | ../../../modules/ecr | n/a |

## Resources

| Name | Type |
|------|------|
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
| <a name="output_ecr_repository_arns"></a> [ecr\_repository\_arns](#output\_ecr\_repository\_arns) | The ECR repositories |
| <a name="output_ecr_repository_ids"></a> [ecr\_repository\_ids](#output\_ecr\_repository\_ids) | The ECR repositories |
| <a name="output_ecr_repository_names"></a> [ecr\_repository\_names](#output\_ecr\_repository\_names) | The ECR repositories |
| <a name="output_ecr_repository_urls"></a> [ecr\_repository\_urls](#output\_ecr\_repository\_urls) | The ECR repositories |
| <a name="output_mlflow_ecr_repository_arn"></a> [mlflow\_ecr\_repository\_arn](#output\_mlflow\_ecr\_repository\_arn) | The MLflow ECR repository |
| <a name="output_mlflow_ecr_repository_id"></a> [mlflow\_ecr\_repository\_id](#output\_mlflow\_ecr\_repository\_id) | The MLflow ECR repository |
| <a name="output_mlflow_ecr_repository_name"></a> [mlflow\_ecr\_repository\_name](#output\_mlflow\_ecr\_repository\_name) | The MLflow ECR repository |
| <a name="output_mlflow_ecr_repository_url"></a> [mlflow\_ecr\_repository\_url](#output\_mlflow\_ecr\_repository\_url) | The MLflow ECR repository |
<!-- END_TF_DOCS -->