# Architecture Finale - Projet CI/CD Zero Touch

## Vue d'ensemble

```
Internet
   |
   |-- HTTPS :443 --> [EC2 Registry] 15.224.107.173
   |                    Nginx (reverse proxy SSL)
   |                    Docker Registry v2 (htpasswd auth)
   |                    Docker Registry UI (joxit)
   |
   |-- HTTP  :80  --> [EC2 App] <IP generee par Terraform>
   |-- HTTP  :8000--> [EC2 App] Backend FastAPI
   |-- HTTP  :8080--> [EC2 App] Adminer (admin BDD)
```

---

## EC2 Registre Docker Prive

| Propriete      | Valeur                        |
|----------------|-------------------------------|
| IP publique    | 15.224.107.173                |
| Region AWS     | eu-west-3 (Paris)             |
| Type instance  | t3.micro                      |
| OS             | Ubuntu 24.04 LTS              |
| Ports ouverts  | 22 (SSH), 443 (HTTPS)         |

### Services deployés (Docker Compose)
- **nginx:alpine** — Reverse proxy SSL (port 443)
- **registry:2** — Registre Docker prive (port interne 5000)
- **joxit/docker-registry-ui** — Interface web (port interne 80)

### Securite
- Certificat SSL auto-signe (generé par Ansible avec openssl)
- Authentification htpasswd (bcrypt)
- Credentials : `admin` / `admin123`

### Provisionnement
- **Terraform** : `registry/main.tf` — cree l'EC2 + security group
- **Ansible** : `registry/deploy.yml` — configure nginx, SSL, registry, UI

---

## EC2 Application (ephemere)

| Propriete      | Valeur                              |
|----------------|-------------------------------------|
| IP publique    | Generee dynamiquement par Terraform |
| Region AWS     | eu-west-3 (Paris)                   |
| Type instance  | t3.micro                            |
| OS             | Ubuntu 24.04 LTS (AMI dynamique)    |
| Ports ouverts  | 22 (SSH), 80 (Frontend), 8000 (API), 8080 (Adminer) |

### Services deployés (Docker Compose)
- **frontend** — React (image depuis registre prive, port 80)
- **backend** — FastAPI (image depuis registre prive, port 8000)
- **mysql:8** — Base de donnees (port interne uniquement)
- **adminer** — Interface admin MySQL (port 8080)

### Provisionnement
- **Terraform** : `infra/main.tf` — cree l'EC2, genere la cle SSH a la volee
- **Ansible** : `infra/deploy-app.yml` — installe Docker, authentifie le registre, deploie la stack

---

## Pipeline CI/CD (deploy.yml)

```
workflow_dispatch (declenchement manuel)
         |
         v
[1] Build & Push Docker
    - docker build frontend (avec VITE_API_URL)
    - docker build backend
    - docker push vers 15.224.107.173:443
         |
         v
[2] Terraform (infra/)
    - terraform init
    - terraform apply -auto-approve
    - Cree EC2 app + security group
    - Genere cle SSH volatile
         |
         v
[3] Bridge Terraform -> Ansible
    - terraform output instance_ip -> $SERVER_IP
    - terraform output private_key -> key.pem (chmod 600)
    - Generation inventory.ini dynamique
         |
         v
[4] Ansible
    - ansible-playbook deploy-app.yml
    - Installe Docker sur EC2 vierge
    - docker login au registre prive
    - Deploy docker-compose (images depuis registre)
         |
         v
[5] Validation post-deploiement
    - curl http://<IP>:80   -> Frontend OK
    - curl http://<IP>:8000 -> Backend OK
```

---

## Secrets GitHub Actions requis

| Secret               | Description                            |
|----------------------|----------------------------------------|
| AWS_ACCESS_KEY_ID    | Cle AWS IAM                            |
| AWS_SECRET_ACCESS_KEY| Secret AWS IAM                         |
| REGISTRY_IP          | IP de l'EC2 registre (15.224.107.173)  |
| REGISTRY_USER        | Login registre (admin)                 |
| REGISTRY_PASSWORD    | Mot de passe registre (admin123)       |
| DB_PASSWORD          | Mot de passe MySQL application         |

---

## Structure du depot

```
.
├── .github/workflows/
│   ├── deploy.yml              # Pipeline principal (Zero Touch)
│   ├── terraform.yml           # Provisionnement registre (manuel)
│   ├── build_test_deploy_react.yml  # CI React + GitHub Pages
│   └── production.yml          # Deploiement Vercel (backend)
├── registry/                   # Infrastructure registre Docker
│   ├── main.tf                 # Terraform EC2 registre
│   ├── deploy.yml              # Ansible playbook registre
│   ├── nginx.conf.j2           # Template Nginx SSL
│   └── docker-compose.yml.j2  # Template Docker Compose registre
├── infra/                      # Infrastructure application
│   ├── main.tf                 # Terraform EC2 app (AMI dynamique, SSH volatile)
│   ├── deploy-app.yml          # Ansible playbook application
│   └── app-compose.yml.j2     # Template Docker Compose app
├── src/                        # Code source React
├── server/                     # Code source FastAPI
├── Dockerfile.react            # Build image frontend
├── server/Dockerfile           # Build image backend
└── docker-compose.yml          # Dev local
```
