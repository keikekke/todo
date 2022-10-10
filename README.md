# Dockerized Todo App with CI/CD
A simple Todo app with React + Node.js + MongoDB written in TypeScript.  
The frontend, the api server, and the database are all dockerized, and they are combined using Docker-Compose or Kubernetes.  
This repository also hosts configuration files for GitHub Actions such as
- run `npm test` for pull-requests
- create a preview page in Okteto Cloud
- deploy the stable code in `main` branch on merging pull-requests

Demo is available at [https://todo.keikr.com](https://todo.keikr.com)  

## How to Run (using Makefile)
Makefile provides shortcuts for development commands.
- `make` or `make up_build` to start a dev environment after building images.
- `make up` to start a dev environment *without* building images.
- `make down` to stop the dev environment.

After the dev environment starts up, the frontend client listens requests at `http://localhost:8080` and the API server accepts requests at `http://localhost:5001`.

## Deployment
### Using Docker-Compose
Once you have prepared environment variables used in `docker-compose-prod.yml` (through target service's VAR option or `.env` file), you are ready to start the production-ready server with `docker-compose -f docker-compose-prod.yml up --build`.  
Major differences from the dev version are:
- No bind mounts (because hot-reload is unnecessary in production).
- No test containers.

### Using Kubernetes
0. Build Docker images and push them to the Docker Hub (`make build` would do this).
1. Create MongoDB-related secret with: `kubectl create secret generic mongoinfo --from-env-file {env_file_name}`
    - For an example env file, see `.env.dev` file.
2. Install NGINX Ingress Controller with `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.1/deploy/static/provider/cloud/deploy.yaml`
    - Installation instruction is available [here](https://kubernetes.github.io/ingress-nginx/deploy/).
    - Some cloud platforms (such as [Okteto Cloud](https://www.okteto.com/)) have their own Ingress controller, so installation on such platforms is not required.
3. Apply Kubernetes configuration files with: `kubectl apply -f k8s/`.

#### Deployment onto [Okteto Cloud](https://www.okteto.com/)
Step-by-step instructions are as follows.
- Install Okteto CLI (see [here](https://www.okteto.com/docs/getting-started/)).
- Select the proper okteto context: `okteto context use https://cloud.okteto.com --namespace {{namespace_name}}`.
- Download Kubernetes credentials (see [here](https://www.okteto.com/docs/cloud/credentials/)) and store it to `~/.kube/config`.
- Export `KUBECONFIG` variable: `export KUBECONFIG=$HOME/okteto-kube.config:${KUBECONFIG:-$HOME/.kube/config}`.
- Run `okteto kubeconfig`.
    - This allows you to use your `kubectl` command in your terminal to manipulate k8s on Okteto.
- Create MongoDB-related secret with: `kubectl create secret generic mongoinfo --from-env-file {env_file_name}`.
    - For an example env file, see `.env.dev` file.
- Run `okteto deploy`.
