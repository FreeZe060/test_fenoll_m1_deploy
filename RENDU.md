# Rendu - Projet Final CI/CD Zero Touch

**Groupe :** Tim / Alexandre

---

## Répartition du travail

Une grande partie du projet a été réalisée en collaboration active via **VS Code Live Share**, ce qui nous a permis de travailler simultanément sur les mêmes fichiers en temps réel.

### Tim — Membre A : Infrastructure as Code & Pipeline CI/CD

- Provisionnement Terraform : EC2 registre + EC2 applicative
- Configuration sécurité AWS : security groups, clés SSH volatiles générées à la volée
- AMI dynamique (data source Ubuntu 24.04 LTS)
- Outputs Terraform (IP publique, clé privée)
- Workflow GitHub Actions `deploy.yml` (orchestration complète)
- Bridge Terraform → Ansible (génération `inventory.ini` dynamique)
- Étapes de validation post-déploiement (`curl` frontend + backend)

### Alexandre — Membre B : Configuration Management & Docker

- Playbooks Ansible : déploiement registre Docker privé
- Configuration Nginx reverse proxy SSL + certificats auto-signés
- Authentification htpasswd sur le registre
- Playbook applicatif : Docker, docker login, stack compose
- Build et push des images Docker vers le registre privé

---

## Repository GitHub

[https://github.com/FreeZe060/test_fenoll_m1_deploy](https://github.com/FreeZe060/test_fenoll_m1_deploy)

---

## Infrastructure déployée

### EC2 Registre Docker Privé

| Propriété | Valeur |
|-----------|--------|
| IP publique | `15.224.107.173` |
| URL registre | `https://15.224.107.173:443` |
| Login | `admin` |
| Mot de passe | `admin123` |

### EC2 Application (éphémère — générée par le pipeline)

| Service | URL |
|---------|-----|
| IP publique | `51.44.20.221` |
| Frontend | [http://51.44.20.221:80](http://51.44.20.221:80) |
| Backend API | [http://51.44.20.221:8000](http://51.44.20.221:8000) |
| Adminer | [http://51.44.20.221:8080](http://51.44.20.221:8080) |

> **Note :** L'EC2 applicative est éphémère. Chaque exécution du workflow crée une nouvelle infrastructure avec une nouvelle IP.

---

## Workflow CI/CD

| Propriété | Valeur |
|-----------|--------|
| Déclenchement | Manuel (`workflow_dispatch`) |
| Fichier | `.github/workflows/deploy.yml` |
| Branche | `master` |

### Étapes du pipeline

```
1. Nettoyage infrastructure précédente (terminate EC2, delete key pair & SG)
2. Terraform Apply → nouvelle EC2 + clé SSH volatile
3. Build & Push images Docker (frontend + backend) vers registre privé
4. Ansible → configuration EC2 vierge + déploiement stack
5. SSH retry → docker compose up -d
6. Validation curl (frontend :80 + backend :8000)
```
