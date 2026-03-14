# Documentation Technique — FOODIE_APP

## 📖 Présentation du Projet

Foodie_APP est une application mobile de livraison de repas développée dans un environnement **Fullstack JavaScript**.

- Le **Front-end** a été conçu intégralement *(from scratch)* en se basant sur une identité visuelle définie sur Figma.
- Le **Back-end** utilise une architecture Express.js robuste, inspirée de la base de référence du cours, mais étendue pour supporter les besoins spécifiques de l'application (avis, photos, gestion d'adresses).

---

## 🛠️ Architecture & Choix Techniques

### 1. Front-end : React Native & Expo Router

Le choix de React Native avec Expo a été fait pour garantir une rapidité de développement et une fluidité native sur iOS et Android.

- **TypeScript** : Utilisé pour sécuriser le code via un typage strict, évitant ainsi les erreurs de données entre le front et l'API.
- **Expo Router** : Utilisation du routage basé sur les fichiers *(File-based routing)*. Ce choix permet une gestion simplifiée des piles de navigation (`Stack`) et des onglets (`Tabs`).
- **Context API** : Pour la gestion globale de l'état (Panier et Favoris). Cela évite le *"Prop Drilling"* et permet d'accéder aux données de n'importe quel écran.
- **Hooks de Thème Personnalisés** : Implémentation d'un système de gestion de couleurs dynamique (`useThemeColor`) pour supporter facilement le mode Clair/Sombre.

### 2. Back-end : Express.js & JSON DB

Pour le serveur, l'objectif était la légèreté et la simplicité de déploiement.

- **Architecture MVC** *(Modèle-Vue-Contrôleur)* : Séparation claire entre les routes, la logique métier (Controllers) et les données.
- **JSON Database** : Utilisation de fichiers JSON pour le stockage des données. Ce choix facilite la portabilité du projet sans nécessiter une configuration complexe de serveur SQL/NoSQL.
- **Multer** : Intégration pour la gestion du stockage des images téléchargées lors de la publication des avis.

---

## 🏗️ Analyse des Modules Principaux

### 📍 Gestion des Adresses — Le "Default System"

L'un des points clés est la gestion de l'adresse par défaut.

- **Logique Backend** : Lorsqu'une adresse est marquée comme *"par défaut"*, le serveur parcourt toutes les autres adresses de l'utilisateur pour passer leur statut à `false`. Cela garantit l'unicité de l'adresse active.
- **Impact Frontend** : Le design change dynamiquement (bordure primaire, badge `ACTIF`, suppression désactivée). Cela améliore l'UX en guidant l'utilisateur.

### ⭐️ Système d'Avis (Reviews)

Le module de feedback permet d'engager la communauté :

- **Multimodalité** : L'utilisateur peut envoyer du texte, une note (système d'étoiles interactif) et des images simultanément via un objet `FormData`.
- **Calcul de Notation** : La note globale du restaurant est recalculée dynamiquement à chaque nouvel avis pour refléter la satisfaction client réelle.

### 🚚 Calcul de Livraison Dynamique

Contrairement à une valeur statique, le temps et le coût de livraison sont simulés en fonction de l'adresse sélectionnée.

- **Algorithme** : `Coût = Frais Fixes + (Distance × Coefficient)`
- **Réactivité** : L'estimation se met à jour instantanément dès que l'utilisateur change d'adresse dans ses réglages.

---

## ⚙️ Structure des Fichiers
```plaintext
/FOODIE_APP
  ├── /backend
  │    ├── /controllers    # Logique métier (Auth, Adresses, Restos)
  │    ├── /middlewares    # Sécurité (Authentification JWT)
  │    ├── /routes         # Points d'entrée de l'API
  │    └── users.json      # Base de données persistante
  └── /frontend
       ├── /app            # Pages (Expo Router)
       ├── /components     # Composants UI réutilisables (Cards, Modals)
       ├── /context        # Gestion globale (Cart, Favorites)
       ├── /services       # Appels API (Axios)
       └── /hooks          # Logique partagée (Theming)
```

---

## 📝 Conclusion

Ce projet démontre une capacité à transformer une vision créative (Figma) en un produit technique fonctionnel, tout en respectant les standards de développement actuels : **TypeScript**, **Clean Architecture** et **REST API**.