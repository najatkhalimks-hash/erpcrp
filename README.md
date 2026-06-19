# EVM+ — CRP Khouribga — Application de Pilotage

Application Next.js interactive basée sur l'Excel V7 du PFE de DADSI Taha.

## Déploiement Vercel

1. `npm install`
2. `npm run build` (vérification locale)
3. Push sur GitHub → connecter à Vercel → déploiement automatique

## Structure

- `lib/data.js` — Toutes les données extraites de l'Excel V7
- `components/UI.jsx` — Composants réutilisables
- `pages/index.js` — Application principale (7 onglets)

## Onglets

| Onglet | Contenu |
|--------|---------|
| 🎯 Diagnostic | Dashboard causal principal |
| 📊 EVM Classique | CPI/SPI/EAC/Courbe en S |
| ⏱ EVM+_CT | Court terme — Instant T |
| 📈 EVM+_LT | Long terme — Trajectoire M36 |
| 📋 Indicateurs | Base de données 27 indicateurs |
| 🔢 Matrices AHP | 13 matrices Saaty interactives |
| 📐 Architecture | Modèle deux temporalités |
