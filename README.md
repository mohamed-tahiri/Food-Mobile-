# 🍔 FoodieSpot — README Technique
 
> Application mobile de livraison de repas — React Native / Expo / Express.js  
> Rendu individuel — ESTIAM E4
 
---
 
## 🚀 Lancer le projet
 
### Prérequis
 
- Node.js `>= 18`
- Expo CLI : `npm install -g expo-cli`
- Un simulateur iOS/Android **ou** l'application Expo Go sur un appareil physique
 
### Installation
 
```bash
# Cloner le dépôt
git clone https://github.com/mohamed-tahiri/Food-Mobile-.git
cd Food-Mobile-
 
# Backend
cd backend
npm install
npm start
 
# Frontend 
cd mobile
npx expo install
npx expo start
```
 
> ⚠️ Penser à mettre à jour l'URL de l'API dans `services/api.ts` avec l'IP locale de votre machine si vous testez sur appareil physique.
 
---
 
## ✅ Améliorations réalisées
 
### 1. Architecture & Structure
 
| Fichier / Zone | Problème initial | Correction apportée |
|---|---|---|
| `profile.tsx` | Imports relatifs `../../services/api` | Remplacé par alias `@/services/api` sur tous les fichiers concernés |
| `types/index.ts` | Typo `resurantId` | Corrigé en `restaurantId` |
| `types/index.ts` | `deliveryTime` mal typé (`string`) | Typé en `{ min: number; max: number }` |
| Global | Logique métier dans les composants UI | Extraite dans des hooks personnalisés dédiés |
| Global | Appels API dispersés | Centralisés dans `services/api.ts` avec gestion des headers et erreurs |
 
### 2. Écrans existants corrigés
 
#### 🏠 Home (`app/(tabs)/index.tsx`)
- Ajout d'un spinner de chargement (le loader était commenté)
- Bannière promo `-30%` rendue dynamique via un endpoint dédié (plus de valeur hardcodée)
- Intégration de la géolocalisation pour le tri des restaurants "À proximité" (`lat`, `lng`, `radius`)
 
#### 🔍 Search (`app/(tabs)/recherche.tsx`)
- Ajout d'un **debounce** (300 ms) sur la barre de recherche pour éviter un appel API à chaque frappe
- Filtres cuisine chargés dynamiquement depuis `GET /categories` (plus de tableau hardcodé)
- État visuel actif sur les filtres sélectionnés (fond coloré sur le chip)
- Remplacement de `ScrollView + .map()` par une `FlatList` pour les performances
- Ajout d'un état vide et d'un état de chargement
 
#### 📦 Orders (`app/(tabs)/commandes.tsx`)
- Spinner visible pendant le chargement des commandes
- Remplacement du texte brut `"ICON"` par une vraie icône/illustration
- Ajout d'onglets de filtres par statut : **En cours / Livrées / Annulées**
- Navigation vers `/tracking/:orderId` au clic sur une commande
 
#### 👤 Profile (`app/(tabs)/profile.tsx`)
- Statistiques (commandes, note) chargées dynamiquement depuis l'API
- Skeleton loader affiché pendant le chargement (remplace le rendu conditionnel fragile `user?.`)
- Déconnexion complète : clear des tokens + redirection vers login sans state stale
- Correction de la navigation vers les favoris (écran créé)
- Alias `@/` appliqués sur tous les imports
 
#### 🔔 Notifications (`app/(tabs)/notifications.tsx`)
- Correction du `useEffect` sans tableau de dépendances (boucle infinie résolue)
- Correction du bug `Promise.all` : destructuration alignée sur le nombre réel d'appels
- Réduction des `console.log` de debug
- Ajout de loaders et gestion d'erreur
 
#### 🍽️ Restaurant Detail (`app/restaurant/[id].tsx`)
- Skeleton loader à la place du simple `"Loading..."`
- Bouton **Itinéraire** : ouvre l'application Maps native (`Linking.openURL`)
- Bouton **Appeler** : compose le numéro (`Linking.openURL tel:`)
- Bouton **Share** : corrigé (appelait `handleToggleFavorite` au lieu de partager)
- `deliveryTime` correctement typé et affiché (`min` – `max` min)
 
#### 🥘 Dish Detail (`app/restaurant/dish/[id].tsx`)
- Suppression des IDs de restaurants hardcodés (`'r1'`, `'r2'`) ; le `restaurantId` est passé en paramètre de route
- Bouton **Ajouter au panier** branché sur le `CartContext`
- Ajout des états loading/erreur
- Correction du `marginTop: -100` fragile par une solution responsive (`position: absolute` + `SafeAreaView`)
 
#### 🗺️ Order Tracking (`app/order/[id].tsx`)
- Affichage de la **timeline** de commande (champ renvoyé par le backend)
- Ajout d'un **pull-to-refresh** et d'un polling toutes les 30 secondes
- Affichage des infos du livreur
- États loading/erreur
 
#### 🔐 Login & Register
- Validation renforcée : regex email, longueur minimale mot de passe (8 caractères)
- Messages d'erreur par champ (plus de message global unique)
- Suppression du `setTimeout(resolve, 100)` arbitraire → navigation basée sur l'état auth réel
 
#### 🧭 Layout / Auth Guard (`app/_layout.tsx`)
- Guard reécrit sans dépendance fragile à `segments[0]`
- Protection contre les boucles de redirection si `refreshAuth` échoue
- Écrans absents (`cart`, `checkout`, `review/[orderId]`) créés
 
---
 
## ✨ Fonctionnalités innovantes implémentées
 
### 1. 🌙 Mode Sombre (Dark Mode)
 
**Pourquoi ?** L'application ciblant une utilisation fréquente le soir (livraison de repas), un mode sombre réduit la fatigue visuelle et améliore l'expérience utilisateur.  
**Valeur utilisateur** : Confort de lecture, personnalisation, cohérence avec les préférences système.  
**Implémentation** : Exploitation du `useColorScheme` existant + toggle manuel dans le profil stocké via `AsyncStorage`. Toutes les couleurs passent par des variables CSS/tokens (fonds, textes, cartes, headers).  
**Difficulté** : Harmoniser la palette existante incohérente (`#FF6B35`, `#8B5CF6`, `#a855f7`) en un système de tokens unifié pour les deux thèmes.
 
---
 
### 2. 🛒 Panier Complet avec Animations
 
**Pourquoi ?** Le panier était déclaré dans le layout mais non fonctionnel, rendant l'application inutilisable de bout en bout.  
**Valeur utilisateur** : Flux d'achat complet (ajouter, modifier les quantités, supprimer, passer commande).  
**Implémentation** :
- `CartContext` global avec `useReducer` (ajout, suppression, modification quantité, vidage)
- Animation d'ajout au panier (badge animé sur l'icône de l'onglet)
- Barre flottante affichant le total et le nombre d'articles quand le panier est non vide
**Difficulté** : Synchronisation du badge animé avec le contexte global sans re-renders inutiles.
 
---
 
### 3. 📍 Recherche Vocale
 
**Pourquoi ?** Différenciation forte par rapport aux apps concurrentes ; utile quand les mains sont occupées.  
**Valeur utilisateur** : Rapidité de recherche, accessibilité accrue.  
**Implémentation** : Bouton micro sur l'écran Search utilisant `expo-speech` / `@react-native-voice/voice` pour convertir la voix en texte, puis déclenchement automatique de la recherche.  
**Difficulté** : Gestion des permissions microphone sur iOS et Android, et comportement dégradé sur simulateur (affichage d'un message explicatif).
 
---
 
### 4. 🕘 Historique de Recherches & Suggestions
 
**Pourquoi ?** La clé `STORAGE_KEYS.RECENT_SEARCHES` était déclarée mais jamais utilisée — fonctionnalité à fort impact UX.  
**Valeur utilisateur** : Gain de temps, redécouverte de commandes passées, suggestions contextuelles.  
**Implémentation** :
- Persistance des 5 dernières recherches dans `AsyncStorage`
- Affichage sous la barre de recherche quand le champ est vide
- Suggestions auto-complétées depuis les noms de restaurants/cuisines connus
**Difficulté** : Dédupliquer les entrées et limiter la taille de l'historique sans impacter les performances.
 
---
 
### 5. 🎬 Onboarding au Premier Lancement
 
**Pourquoi ?** Première impression essentielle pour l'adoption ; réduit le taux d'abandon.  
**Valeur utilisateur** : Découverte guidée des fonctionnalités clés (recherche, panier, suivi).  
**Implémentation** :
- 3 slides avec illustrations/animations (`Animated` API)
- Flag `onboarding_seen` persisté dans `AsyncStorage`
- Affiché **une seule fois** au premier lancement, jamais après
**Difficulté** : Intégration dans le flux de navigation (`_layout.tsx`) sans créer de conflit avec l'auth guard.
 
---
 
## 🏗️ Architecture du projet
 
```
/FOODIE_APP
  ├── /backend
  │    ├── /controllers        # Logique métier (Auth, Adresses, Restaurants, Reviews)
  │    ├── /middlewares         # JWT Authentication
  │    ├── /routes              # Endpoints API REST
  │    └── users.json           # Base de données JSON persistante
  └── /frontend
       ├── /app
       │    ├── /(auth)         # Login, Register
       │    ├── /(tabs)         # Home, Search, Orders, Profile, Favorites, Notifications
       │    ├── /restaurant     # [id].tsx — Détail restaurant
       │    ├── /review         # [orderId].tsx — Laisser un avis
       │    ├── cart.tsx         # Panier
       │    ├── checkout.tsx     # Validation commande
       │    └── _layout.tsx      # Auth guard + navigation racine
       ├── /components          # Composants UI réutilisables (Cards, Modals, Skeletons)
       ├── /context             # CartContext, FavoritesContext, AuthContext
       ├── /services            # api.ts centralisé (Axios + headers + erreurs)
       ├── /hooks               # useThemeColor, useNotifications, useCart, useAuth
       └── /types               # index.ts — Modèles TypeScript
```
 
---
 
## 🔧 Décisions techniques
 
| Décision | Justification |
|---|---|
| **Expo Router** (file-based routing) | Navigation simplifiée, deep links natifs, cohérence avec les standards Expo récents |
| **Context API** (pas Redux) | Complexité de l'état ne justifie pas Redux ; Context + `useReducer` suffit et reste lisible |
| **JSON Database** côté backend | Portabilité maximale, zéro configuration SQL/NoSQL pour un projet académique |
| **Debounce sur la recherche** | Évite des centaines d'appels API inutiles, améliore les performances perçues |
| **TypeScript strict** | Prévient les erreurs de données entre front et API, facilite la maintenance |
| **Alias `@/`** | Élimine les imports relatifs profonds `../../..`, améliore la lisibilité |
| **FlatList** (remplace ScrollView+map) | Performance native sur les longues listes (virtualisation, recyclage des vues) |
 
---
 
## ⚠️ Limites connues
 
- Le backend utilise des fichiers JSON : pas adapté à de la concurrence ou à un volume élevé de données.
- La géolocalisation "À proximité" est simulée sur simulateur iOS/Android (pas de vraie position GPS).
- La recherche vocale n'est pas disponible sur simulateur (microphone non accessible) ; un message explicatif est affiché.
- Le suivi en temps réel repose sur du polling (toutes les 30s) et non sur des WebSockets : latence acceptable pour un prototype.
- Les tokens JWT ne sont pas rafraîchis automatiquement (pas de refresh token) — déconnexion après expiration.
 
---
 
## 👤 Auteur

Développeur Fullstack : Mohamed TAHIRI 
Projet réalisé individuellement dans le cadre du cours **ESTIAM E4 — React Native**.  

 