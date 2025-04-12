# Create a Terraform state module for the production environment
module "tfstate" {
  source = "../../../modules/tfstate"

  environment = var.environment
  project     = var.project
}