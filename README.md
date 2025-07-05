

---

# 🚀 Code Delivery and CI/CD Workflows

This repository documents our end-to-end code delivery and deployment workflows, combining **GitOps with ArgoCD**, **GitHub Actions**, and a **Jenkins dev-prod pipeline**.

## 📌 Overview

Our goal is to ensure reliable, automated, and consistent delivery of microservices to production and development environments. This includes:

* Automated build and test pipelines.
* Continuous deployment using GitOps practices.
* Separate workflows for development, staging, and production environments.

---

## ✅ Code Delivery Workflow (GitOps)

![Code Delivery Workflow](./image.png)

**Description:**
The main branch acts as the single source of truth. When changes are committed:

1. **Main Branch** — Code changes are pushed here.
2. **ArgoCD** — Watches the repository for changes.
3. **Check Microservice to Change** — Determines which microservice needs to be updated.
4. **Deploy to EKS** — Deploys the updated microservice to the Kubernetes cluster (EKS).

---

## 🔄 GitHub Actions Workflow

![GitHub Actions Workflow](./image2.png)

**Description:**
This workflow runs on every pull request to the service branch:

1. **Pull Request** — A PR is created on the service branch.
2. **Checkout Code** — The pipeline checks out the code.
3. **Build Test** — Runs unit and integration tests.
4. **Image Build Test** — Builds and tests the Docker image.
5. **Code Quality Check** — Runs static analysis and linting.
6. **Merge Request** — Merges the changes if all checks pass.

---

## 🟢 Jenkins Dev-Prod Workflow

![Jenkins Dev-Prod Workflow](./image3.png)

**Description:**
This pipeline automates the promotion of code from development to production:

1. **GitHub Dev-Prod Branch** — Push triggers a webhook.
2. **Jenkins** — Receives the webhook and pulls the code.
3. **Code Pull** — Retrieves the latest changes.
4. **Remove Old Containers & Images** — Cleans up outdated containers/images.
5. **Run New Images with Docker Compose** — Deploys the new containers.

---

## ⚙️ Tech Stack

* **CI/CD:** GitHub Actions, Jenkins
* **GitOps:** ArgoCD
* **Containerization:** Docker
* **Container Orchestration:** Kubernetes (EKS)
* **Source Control:** GitHub
* 
---
