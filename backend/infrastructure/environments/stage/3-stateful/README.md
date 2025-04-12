<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.70.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 5.70.0 |
| <a name="provider_terraform"></a> [terraform](#provider\_terraform) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_mlflow_bucket"></a> [mlflow\_bucket](#module\_mlflow\_bucket) | ../../../modules/s3 | n/a |
| <a name="module_mlflow_db"></a> [mlflow\_db](#module\_mlflow\_db) | ../../../modules/rds | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_iam_access_key.mlflow_s3_user](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_access_key) | resource |
| [aws_iam_user.mlflow_s3_user](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user) | resource |
| [aws_iam_user_policy_attachment.attach_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user_policy_attachment) | resource |
| [aws_ssm_parameter.mlflow_key_id](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter) | resource |
| [aws_ssm_parameter.mlflow_key_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |
| [terraform_remote_state.vpc](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/data-sources/remote_state) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_environment"></a> [environment](#input\_environment) | Environment name | `string` | `"stage"` | no |
| <a name="input_project"></a> [project](#input\_project) | Project name | `string` | `"dragonhack25-fotrfix"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_mlflow_db_instance_address"></a> [mlflow\_db\_instance\_address](#output\_mlflow\_db\_instance\_address) | The address of the RDS instance for MLflow |
| <a name="output_mlflow_db_instance_arn"></a> [mlflow\_db\_instance\_arn](#output\_mlflow\_db\_instance\_arn) | The ARN of the RDS instance for MLflow |
| <a name="output_mlflow_db_instance_endpoint"></a> [mlflow\_db\_instance\_endpoint](#output\_mlflow\_db\_instance\_endpoint) | The endpoint of the RDS instance for MLflow |
| <a name="output_mlflow_db_instance_id"></a> [mlflow\_db\_instance\_id](#output\_mlflow\_db\_instance\_id) | The ID of the RDS instance for MLflow |
| <a name="output_mlflow_db_instance_name"></a> [mlflow\_db\_instance\_name](#output\_mlflow\_db\_instance\_name) | The name of the RDS instance for MLflow |
| <a name="output_mlflow_db_instance_username"></a> [mlflow\_db\_instance\_username](#output\_mlflow\_db\_instance\_username) | The username for the RDS instance for MLflow |
| <a name="output_mlflow_rds_instance_password_ssm_parameter"></a> [mlflow\_rds\_instance\_password\_ssm\_parameter](#output\_mlflow\_rds\_instance\_password\_ssm\_parameter) | The SSM parameter for the RDS instance password |
| <a name="output_mlflow_rds_instance_url_ssm_parameter"></a> [mlflow\_rds\_instance\_url\_ssm\_parameter](#output\_mlflow\_rds\_instance\_url\_ssm\_parameter) | The SSM parameter for the RDS instance URL |
| <a name="output_mlflow_s3_artifact_url_ssm_parameter"></a> [mlflow\_s3\_artifact\_url\_ssm\_parameter](#output\_mlflow\_s3\_artifact\_url\_ssm\_parameter) | The SSM parameter for the S3 artifact URL |
<!-- END_TF_DOCS -->