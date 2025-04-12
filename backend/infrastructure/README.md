# ☁️ MLflow Infrastructure on AWS using IaC (Terraform)

This project provisions a **modular and production-ready MLflow tracking infrastructure** on AWS using Terraform. It's based on the excellent [DLabs.AI tutorial](https://dlabs.ai/blog/how-to-set-up-mlflow-on-aws/) and refactored to support scalable, environment-based deployments.

---

## 🧩 What’s Inside?

This infrastructure includes the essential components needed to deploy MLflow in the cloud:

- 🌐 **VPC** — Private and public subnets across multiple AZs
- 📦 **S3 Bucket** — Stores MLflow artifacts
- 🔐 **SSM Parameter Store** — Securely holds secrets and configuration
- 🌱 **Modular Codebase** — Clean separation of environments and modules

---

## 🗂️ Directory Structure

The project is structured to support multiple environments using reusable modules:

```
terraform/
├── environments/
│   └── stage/                  # Stage-specific deployment
│       ├── 0-tfstate/          # Terraform state management    (DynamoDB, S3)
│       ├── 1-registry/         # MLflow registry               (ECR)
│       ├── 2-vpc/              # VPC configuration             (Subnets, Networking, Security Groups)
│       ├── 3-stateful/         # Stateful resources            (Artifact storage - S3, Database - RDS)
│       ├── 4-load-balancer/    # Load balancer for ECS         (ALB)
│       └── 5-mlflow/           # MLflow configuration          (ECS on Fargate)
│
└── modules/
    ├── ecr/             # ECR configuration
    ├── rds/             # RDS configuration 
    ├── s3/              # Artifact storage
    ├── tfstate/         # Terraform state management
    └── vpc/             # VPC configuration, networking, security groups
```

---

## 🛠️ Prerequisites

Make sure you’ve got the following installed and set up:

- ✅ [Terraform v1.5+](https://www.terraform.io/downloads)
- ✅ [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- ✅ AWS credentials configured via `aws configure` or IAM roles

---

## 🚀 Getting Started

1. **Navigate to the environment:**

   ```bash
   cd terraform/environments/stage
   ```

2. **Apply the Terraform configurations to create the tfstate and registry stages/folders:**

   ```bash
   # Navigate to the tfstate folder
   cd 0-tfstate

   # Init, plan, and apply the tfstate infrtastructure
   terraform init
   terraform plan
   terraform apply

   # Navigate to the registry folder
   cd ../1-registry

   # Init, plan, and apply the registry infrtastructure
   terraform init
   terraform plan
   terraform apply
   ```

3. **Upload your custom MLflow Docker image to ECR:**

   - Build your Docker image and tag it with the ECR repository URI.
   - Push the image to the ECR repository created in the previous step.
   - You can find our pre-built Dockerfile in the `backend/mlflow/dockerfiles` folder.

   ```bash
   # Navigate to the dockerfiles folder
   cd ../mlflow/dockerfiles

   # Build the Docker image
   docker build -t mlflow-ecs .

   # Fetch AWS account ID and region
   AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --profile terraform)

   # Tag the image with the ECR repository URI
   docker tag mlflow-ecs:latest <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/<your-repo-name>:latest

   # Authenticate Docker to the ECR registry
   aws ecr get-login-password --region <AWS_REGION> --profile terraform | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com

   # Push the image to ECR
   docker push <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/<your-repo-name>:latest
   ```

4. **Deploy the remaining infrastructure:**

   ```bash
   # Navigate to the VPC folder
   cd ../2-vpc

   # Init, plan, and apply the VPC infrtastructure
   terraform init
   terraform plan
   terraform apply

   # Navigate to the stateful folder
   cd ../3-stateful
   
   # Init, plan, and apply the stateful infrtastructure
   terraform init
   terraform plan
   terraform apply
   ```

5. **Deploy the load balancer:**

   ```bash
   # Navigate to the load balancer folder
   cd ../4-load-balancer
   
   # Init, plan, and apply the load balancer infrtastructure
   terraform init
   terraform plan
   terraform apply
   ```

6. **Deploy the MLflow infrastructure:**

   ```bash
   # Navigate to the MLflow folder
   cd ../5-mlflow

   # Init, plan, and apply the MLflow infrtastructure
   terraform init
   terraform plan
   terraform apply
   ```

7. **Access MLflow UI:**

   - Open your web browser and navigate to the load balancer URL.
   - You should see the MLflow UI.
   - Use the credentials stored in AWS SSM Parameter Store to log in.
   - The default username is `admin` and the password is stored in the SSM Parameter Store.

---

## ✅ After Deployment

Once the infrastructure is up:

- Use the output values (e.g., S3 bucket name, VPC IDs) for further setup
- MLflow artifacts will be stored in the configured S3 bucket
- Credentials, endpoints, and URIs are securely managed via AWS Parameter Store

---

## 📚 Resources

- 📘 [MLflow Documentation](https://www.mlflow.org/docs/latest/index.html)
- 🧰 [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- 🧪 [DLabs.AI MLflow Tutorial](https://dlabs.ai/blog/how-to-set-up-mlflow-on-aws/)

---

💡 **Tip**: Want to add more environments like `prod` or `dev`? Just duplicate the `stage` folder and customize the variables!

---