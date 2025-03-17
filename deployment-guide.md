# Guide de déploiement pour AGIfy.ai

Ce document détaille les étapes pour déployer l'application AGIfy.ai (anciennement AGI Wrapper) sur différentes plateformes.

## Déploiement sur Vercel (Recommandé)

Vercel est une plateforme de déploiement optimisée pour les applications Next.js, offrant un excellent équilibre entre fiabilité, performance et coût.

### Prérequis
- Un compte Vercel (gratuit pour commencer)
- Git installé sur votre machine
- Node.js v16 ou supérieur

### Étapes de déploiement

1. Clonez le dépôt de l'application :
   ```bash
   git clone https://github.com/votre-compte/agify-ai.git
   cd agify-ai
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Connectez-vous à Vercel :
   ```bash
   npx vercel login
   ```

4. Déployez l'application :
   ```bash
   npx vercel --prod
   ```

5. Configurez votre domaine personnalisé :
   - Dans le tableau de bord Vercel, accédez à votre projet
   - Allez dans "Settings" > "Domains"
   - Ajoutez votre domaine personnalisé (ex: agify.ai)
   - Suivez les instructions pour configurer les enregistrements DNS

### Variables d'environnement

Configurez les variables d'environnement suivantes dans le tableau de bord Vercel :

- `OPENAI_API_KEY` : Votre clé API OpenAI
- `ANTHROPIC_API_KEY` : Votre clé API Anthropic
- `ADMIN_EMAIL` : Email de l'administrateur (stephane.gagnant@sncf.fr)
- `ADMIN_PASSWORD_HASH` : Hash du mot de passe temporaire
- `JWT_SECRET` : Clé secrète pour les tokens JWT

## Déploiement sur votre propre infrastructure

### Prérequis
- Node.js v16 ou supérieur
- npm ou yarn
- Un serveur avec au moins 1 Go de RAM

### Étapes de déploiement

1. Extrayez le package complet fourni dans un répertoire de votre serveur

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Construisez l'application :
   ```bash
   npm run build
   ```

4. Démarrez l'application :
   ```bash
   npm start
   ```

5. Pour un déploiement en production, utilisez PM2 :
   ```bash
   npm install -g pm2
   pm2 start npm --name "agify-ai" -- start
   pm2 save
   pm2 startup
   ```

### Configuration Nginx (Recommandé)

```nginx
server {
    listen 80;
    server_name agify.ai www.agify.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Configuration SSL avec Let's Encrypt

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d agify.ai -d www.agify.ai
```

## Accès administrateur

Un compte administrateur a été configuré avec les informations suivantes :

- **Nom d'utilisateur** : Stephane GAGNANT
- **Email** : stephane.gagnant@sncf.fr
- **Mot de passe temporaire** : `Manus2025!SecureTemp`

Lors de la première connexion, vous serez invité à changer ce mot de passe.

## Maintenance et mises à jour

Pour mettre à jour l'application :

1. Récupérez les dernières modifications :
   ```bash
   git pull origin main
   ```

2. Installez les nouvelles dépendances :
   ```bash
   npm install
   ```

3. Reconstruisez l'application :
   ```bash
   npm run build
   ```

4. Redémarrez le serveur :
   ```bash
   pm2 restart agify-ai
   ```

## Support et dépannage

En cas de problème, utilisez le bouton "Signaler un bug" dans l'application pour envoyer automatiquement un rapport détaillé à notre équipe de support.

Pour des questions spécifiques, contactez support@agify.ai
