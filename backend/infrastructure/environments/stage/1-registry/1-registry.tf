module "ecr_registry" {
	for_each = local.ecr_repositories
	source	 = "../../../modules/ecr"

	environment 	= local.environment
	project     	= local.project
	instance_name   = each.value
}