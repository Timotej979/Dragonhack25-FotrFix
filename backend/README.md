# ⚙️ Backend Setup

Welcome to the backend setup for deploying and managing MLFlow on AWS! This repository is divided into two main parts:

1. **MLFlow Setup**: Everything related to configuring and running MLFlow for tracking experiments.
2. **Terraform Setup**: Infrastructure as Code (IaC) for setting up the AWS environment to host MLFlow on ECS Fargate.



## 📂 Folder Structure

```
backend/
│
├── mlflow/                  # MLFlow setup and configuration
│   ├── models/              # Pre-trained models for MLFlow
│   ├── Dockerfile           # Dockerfile for MLFlow server
│   ├── entry-point.sh       # Entry point script for the Docker container
│   ├── mlflow_auth.py       # Authentication script for MLFlow
│   └── requirements.txt     # Python dependencies for MLFlow
│
└── infrastructure/          # Infrastructure setup using Terraform for ECS Fargate
    ├── environments/        # Environment-specific configurations  
    └── modules/             # Reusable Terraform modules
```

---



### 🔧 `mlflow/` - MLFlow Setup

The `mlflow/` directory contains everything needed to configure and run **MLFlow** for tracking and managing machine learning experiments.

- **dockerfiles/**: Contains the **Dockerfile** to build the image for deploying the MLFlow server to **Amazon ECS Fargate**.
- **notebooks/**: Contains Python scripts that are run through the **MLFlow UI**, allowing you to log, track, and visualize your machine learning experiments.

You can check out the `mlflow/README.md` inside the `mlflow` directory for detailed information on building and using the Docker image, as well as running Python scripts via the MLFlow UI.

---



### 🏗️ `infrastructure/` - Infrastructure Setup

The `terraform/` directory contains the **Terraform scripts** for setting up the infrastructure required to run **MLFlow on AWS ECS Fargate**.

#### Key Components:
- **ECS Fargate Setup**: Deploys MLFlow server on Amazon ECS Fargate with an auto-scaling policy.
- **VPC and Networking**: Configures the necessary VPC, subnets, security groups, and IAM roles for the ECS service.
- **ECR (Elastic Container Registry)**: Pushes the MLFlow Docker image to AWS ECR for ECS to pull and deploy the container.
- **CloudWatch**: Sets up CloudWatch for logging and monitoring the ECS tasks running the MLFlow server.

---



### 🛠️ Getting Started


#### 1. Prerequisites

Before starting, make sure you have the following:

- **Docker** 🐳: Installed and running for building the MLFlow Docker image.
- **Terraform** 🏗️: Installed to provision the infrastructure on AWS.
- **AWS Account** 🌐: Configured with proper IAM credentials for deploying ECS, ECR, and other AWS services.


#### 2. Bulding the Backend

Check the `mlflow/README.md` for detailed instructions on building and running the MLFlow Docker image.

Check the `backend/terraform/README.md` for detailed instructions on setting up the infrastructure.


### 🤝 Contributing

We welcome contributions to this project! Here’s how you can help:

- **MLFlow Setup**: Improve Dockerfiles, add new notebooks, or enhance the MLFlow experiment tracking system.
- **Terraform Infrastructure**: Improve the infrastructure setup, add new resources, or optimize the Terraform configuration.

If you have changes or features to add, feel free to submit a pull request! When contributing, please ensure that:

- Code is well-documented 📚.
- Infrastructure changes are properly tested 🔧.

---

### 💡 Let's scale machine learning workflows efficiently on AWS with MLFlow and ECS Fargate! 🚀