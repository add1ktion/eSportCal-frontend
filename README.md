# 🖥️ eSportCal — Frontend App

[![CI - Frontend Validation](https://github.com/add1ktion/eSportCal-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/add1ktion/eSportCal-frontend/actions/workflows/ci.yml)
[![Vite](https://img.shields.io/badge/vite-5.0-blue.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-18.2-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.0-blue.svg)](https://tailwindcss.com/)

Ce dépôt contient l'application web d'**eSportCal**, le calendrier centralisé des compétitions e-sportives.

---

## 🏛️ Intégration DevOps & Performance

L'application frontend d'eSportCal intègre les meilleures pratiques industrielles en termes de déploiement et de suivi de performance :

### 1. Intégration Continue (GitHub Actions)
Chaque push ou Pull Request déclenche automatiquement :
*   **Audit Sécurité** : Scan `npm audit` pour prévenir l'introduction de packages tiers vulnérables.
*   **Linter** : Vérification stricte du style de code JavaScript et JSX via ESLint.
*   **Build** : Compilation de production Vite pour valider l'absence d'erreurs d'importation et s'assurer que l'application compile sans avertissements bloquants.
*   **Conteneurisation** : Validation de la construction de l'image de conteneur Docker.

### 2. Déploiement GitOps (Vercel)
Déploiement automatisé branché sur l'état de nos branches Git :
*   Les pushs sur `dev` ou `staging` génèrent des environnements de **Preview (Staging)** isolés.
*   Chaque fusion (PR) validée sur la branche `main` déclenche le déploiement immédiat en production sur le domaine final **`esportcal.com`**.

### 3. Monitoring Utilisateur Réel (Grafana Faro)
*   Intégration du SDK **Grafana Faro (Application Observability)**.
*   Remontée en temps réel des exceptions non gérées, des erreurs de console, des Web Vitals de performance (LCP, FID, CLS), et du comportement utilisateur vers Grafana Cloud.

---

## 🛠️ Lancement Local

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Créer un fichier `.env` local :
   ```env
   VITE_API_URL=http://localhost:5001
   ```
3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
