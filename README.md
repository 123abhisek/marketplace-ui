# EasyDeal Marketplace — Frontend UI

Modern React + Vite frontend for EasyDeal Marketplace with Material UI design system.

---

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

---

## 🚀 Production Deployment & Automated Re-Deployment

### Option 1: One-Click Automated Script (`/home/deploy.sh`)

Create `/home/deploy.sh` on your VPS server:

```bash
sudo nano /home/deploy.sh
```

Paste the following script:

```bash
#!/bin/bash
set -e

echo "=========================================="
echo "🚀 Starting Marketplace Re-Deployment"
echo "=========================================="

# ── 1. Backend ──
echo ""
echo "📦 [1/2] Updating Backend..."
cd /home/marketplace_backend
git status
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head || true
sudo systemctl restart fastapi
sudo systemctl is-active --quiet fastapi && echo "✅ FastAPI is running!"

# ── 2. Frontend ──
echo ""
echo "🎨 [2/2] Updating Frontend..."
cd /home/marketplace-ui
git status
git pull origin main
npm install
npm run build
sudo rm -rf /var/www/marketplace/*
sudo cp -r dist/* /var/www/marketplace/
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=========================================="
echo "✅ All Services Deployed & Live!"
echo "=========================================="
```

Make it executable:

```bash
chmod +x /home/deploy.sh
```

Run deployment anytime with a single command:

```bash
/home/deploy.sh
```

---

### Option 2: Automatic Re-Deployment on `git push` (GitHub Actions CI/CD)

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Automated Deployment to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy Backend & Frontend via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: 22
          script: |
            set -e
            echo "🚀 Starting Automated Deployment..."

            # Backend
            cd /home/marketplace_backend
            git pull origin main
            source venv/bin/activate
            pip install -r requirements.txt
            alembic upgrade head || true
            sudo systemctl restart fastapi

            # Frontend
            cd /home/marketplace-ui
            git pull origin main
            npm install
            npm run build
            sudo rm -rf /var/www/marketplace/*
            sudo cp -r dist/* /var/www/marketplace/
            sudo nginx -t && sudo systemctl reload nginx

            echo "🎉 Deployment Completed Successfully!"
```

**Required GitHub Repository Secrets** (`Settings` → `Secrets and variables` → `Actions`):

- `SERVER_HOST`: Your VPS IP address / Domain
- `SERVER_USER`: `root` (or sudo user)
- `SERVER_SSH_KEY`: Server SSH private key

---

### Option 3: Manual Re-Deployment Commands

#### Frontend Re-Deployment:

```bash
cd /home/marketplace-ui
git status
git pull origin main
npm install
npm run build
sudo rm -rf /var/www/marketplace/*
sudo cp -r dist/* /var/www/marketplace/
sudo nginx -t && sudo systemctl reload nginx
```

#### Backend Re-Deployment:

```bash
cd /home/marketplace_backend
git status
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart fastapi
sudo systemctl status fastapi
sudo journalctl -u fastapi -n 100 --no-pager
```

ssh -L 15432:127.0.0.1:5432 root@46.250.239.148
