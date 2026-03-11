# Prestau

> **[🇫🇷 Version française ci-dessous](#-prestau-1)**

---

<p align="center">
  <strong>A marketplace connecting restaurants and food service businesses with temporary workers</strong>
</p>

<p align="center">
  <em>NestJS · React Native · Expo · PostgreSQL · Prisma · JWT</em>
</p>

---

## Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Back-end Setup](#back-end-setup)
  - [Front-end Setup](#front-end-setup)
- [Architecture Overview](#-architecture-overview)
- [User Flows](#-user-flows)
- [API Overview](#-api-overview)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Testing](#-testing)
- [Documentation](#-documentation)

---

## About the Project

**Prestau** is a full-stack mobile platform designed to bridge the gap between **food service businesses** (restaurants, hotels, caterers, event venues) and **temporary workers** (servers, cooks, bartenders, kitchen staff) looking for missions.

The platform allows companies to quickly post temporary job offers and find qualified staff, while workers can browse available missions, manage their availability, and build their professional reputation through a rating system.

### The Problem
The food service industry frequently needs temporary staff for events, peak seasons, or to cover absences. Finding available, qualified workers quickly is a challenge, and workers often struggle to find consistent temporary work.

### The Solution
Prestau provides a streamlined, mobile-first experience where:
- **Companies** can post missions, browse worker profiles, and manage the entire hiring cycle from application to completion
- **Workers** can discover opportunities, manage their calendar, apply with one tap, and build a verified track record

---

## Key Features

### For Companies
- **Job Posting**: Create detailed mission offers with dates, times, salary, and description
- **Applicant Management**: Review, accept, or reject worker applications
- **Mission Lifecycle**: Track missions from open → in progress → completed
- **Worker Discovery**: View worker profiles, skills, experience, and ratings
- **Messaging**: Direct communication with applicants and hired workers
- **Mission History**: View completed missions with mutual reviews
- **Company Profile**: Showcase establishment type, location, and description

### For Workers
- **Job Discovery**: Browse and search available missions with salary filters
- **One-Tap Apply**: Quick application process for available jobs
- **Availability Calendar**: Interactive calendar to mark free/busy days
- **Active Missions**: Track current mission status and details
- **Mission History**: View completed missions and received reviews
- **Profile & CV**: Showcase skills, experience, languages, and qualifications
- **Rating System**: Build a professional reputation through completed missions

### Platform Features
- **JWT Authentication**: Secure access with token rotation and refresh
- **Role-Based Access**: Separate experiences for companies and workers
- **Real-Time Status Updates**: Live mission and application status tracking
- **Mutual Review System**: Both parties rate each other after mission completion
- **Search & Filters**: Find jobs by title, location, and salary range
- **Responsive Design**: Adapts to any mobile device size
- **Cross-Platform**: Runs on iOS, Android, and Web

---

## Tech Stack

### Back-end
| Technology | Version | Purpose |
|---|---|---|
| NestJS | v11 | TypeScript API framework |
| Prisma | v7 | ORM & database migrations |
| PostgreSQL | 14+ | Relational database |
| Passport.js | v0.7 | Authentication middleware |
| JWT | — | Token-based authentication |
| bcrypt | v6 | Password hashing |
| class-validator | v0.14 | Request validation |
| Jest | v30 | Unit testing |

### Front-end
| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.81 | Mobile UI framework |
| Expo | v54 | Development platform |
| Expo Router | v6 | File-based navigation |
| TypeScript | v5 | Language |
| React Query | v5 | Server state management |
| Axios | v1.13 | HTTP client |
| Expo SecureStore | v15 | Encrypted token storage |
| react-native-calendars | — | Availability calendar |
| dayjs | v1.11 | Date formatting |

---

## Project Structure

```
Prestau/
├── README.md                    # ← You are here (general documentation)
├── Back-end/                    # NestJS REST API
│   ├── README.md                # Detailed back-end documentation
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema (7 models, 4 enums)
│   │   └── migrations/          # 9 migration files
│   └── src/
│       ├── main.ts              # Entry point (port 3000)
│       ├── app.module.ts        # Root module
│       ├── prisma.service.ts    # Database service
│       └── Modules/
│           ├── auth/            # Authentication (4 endpoints)
│           ├── user/            # User accounts (4 endpoints)
│           ├── company/         # Company profiles (5 endpoints)
│           ├── worker/          # Worker profiles (7 endpoints)
│           ├── job/             # Job postings (6 endpoints)
│           ├── joboffer/        # Applications (10 endpoints)
│           ├── message/         # Messaging (3 endpoints)
│           └── review/          # Ratings & reviews (2 endpoints)
└── Front-end/
    └── Prestau/                 # Expo React Native app
        ├── README.md            # Detailed front-end documentation
        ├── package.json
        ├── app/                 # Screens (file-based routing)
        │   ├── index.tsx        # Landing page
        │   ├── login.tsx        # Login
        │   ├── register.tsx     # Registration
        │   ├── (tabs-company)/  # Company dashboard (4 tabs)
        │   ├── (tabs-worker)/   # Worker dashboard (3 tabs)
        │   ├── job/[id].tsx     # Job details
        │   ├── joboffer/[id].tsx # Application details
        │   └── review/[id].tsx  # Review submission
        ├── components/          # 6 reusable UI components
        ├── src/api/             # 7 API service modules
        └── constants/           # Theme & colors
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x (running instance)
- **Expo Go** app on your mobile device (or Android/iOS emulator)

### Back-end Setup

```bash
# 1. Navigate to back-end
cd Prestau/Back-end

# 2. Install dependencies
npm install

# 3. Create environment file
cat > .env << EOF
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/prestau
JWT_SECRET=your-secure-secret-key-here
EOF

# 4. Generate Prisma client & run migrations
npm run prisma:generate
npm run prisma:migrate

# 5. Start the API server (development mode)
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### Front-end Setup

```bash
# 1. Navigate to front-end
cd Prestau/Front-end/Prestau

# 2. Install dependencies
npm install

# 3. Create environment file (use your machine's IP, not localhost)
echo "EXPO_PUBLIC_API_URL=http://YOUR_IP:3000" > .env

# 4. Start the Expo development server
npm start
```

Scan the QR code with **Expo Go** on your phone, or press `a`/`i` for emulators.

> **Tip:** Find your local IP with `ifconfig` (macOS/Linux) or `ipconfig` (Windows). On a physical device, both the phone and the server must be on the same network.

---

## Architecture Overview

```
┌─────────────────────────────┐
│      Mobile App (Expo)      │
│  React Native + TypeScript  │
│  Expo Router (navigation)   │
│  React Query (state)        │
│  SecureStore (tokens)       │
└──────────────┬──────────────┘
               │
          HTTP/REST
          (Axios)
               │
               ▼
┌─────────────────────────────┐
│      API Server (NestJS)    │
│  Controllers → Services     │
│  JWT Authentication         │
│  Role-Based Guards          │
│  DTO Validation             │
└──────────────┬──────────────┘
               │
          Prisma ORM
               │
               ▼
┌─────────────────────────────┐
│     PostgreSQL Database     │
│  7 tables, 4 enums          │
│  Cascade delete relations   │
│  Indexed foreign keys       │
└─────────────────────────────┘
```

### Request Lifecycle

```
Mobile App → Axios Interceptor (inject JWT) → NestJS Controller
  → JwtAuthGuard (verify token) → RolesGuard (check role)
  → Service (business logic) → Prisma (database query)
  → Response → Axios Interceptor (handle 401) → React Query Cache → UI
```

---

## User Flows

### Registration & Onboarding

```
1. User opens app → Landing page
2. Taps "Register"
3. Enters email, password, confirms password
4. Selects role: "Company" or "Worker"
5. POST /auth/register → JWT tokens returned & stored
6. Redirected to profile creation form:
   - Company: name, address, SIRET, phone, type...
   - Worker: name, profession, skills, photo, phone...
7. POST /company or POST /worker
8. Redirected to role-specific dashboard
```

### Company: Posting a Job

```
1. Company opens "Create Job" tab
2. Fills in: title, description, dates, times, salary
3. POST /job → Job created with status OPEN
4. Job appears on company dashboard
5. Workers can now see and apply to the job
```

### Worker: Applying to a Job

```
1. Worker opens "Browse Jobs" tab
2. Searches/filters available jobs
3. Taps a job → views full details
4. Taps "Postuler" (Apply)
5. POST /joboffer/:jobId → Application created with status PENDING
6. Application appears in worker's "My Applications"
7. Company sees notification dot on their dashboard
```

### Company: Managing Applications

```
1. Company taps a job on their dashboard
2. Opens "View Applicants" modal
3. Sees list of workers with name, city, phone, profession
4. Taps "Accept" → POST /joboffer/:id/accept
   - Application status → ACCEPTED
   - Job status → IN_PROGRESS
5. Or taps "Reject" → POST /joboffer/:id/reject
   - Application status → REJECTED
```

### Mission Completion & Reviews

```
1. Company marks mission as done → POST /joboffer/:id/complete
   - Application status → COMPLETED
   - Job status → COMPLETED
2. Both parties can now leave reviews
3. Tap "Leave Review" → 5-star rating + optional comment
4. POST /review → Review stored
5. Reviews visible in mission history for both parties
```

---

## API Overview

The REST API exposes **41 endpoints** across 8 modules:

| Module | Endpoints | Key Operations |
|---|---|---|
| **Auth** | 4 | Register, Login, Logout, Refresh Token |
| **User** | 4 | Get/Update/Delete profile |
| **Company** | 5 | CRUD company + view by worker |
| **Worker** | 7 | CRUD worker + availability calendar |
| **Job** | 6 | CRUD jobs + search/filter |
| **JobOffer** | 10 | Apply, Accept, Reject, Complete, Cancel, History |
| **Message** | 3 | Send/Read messages within job offers |
| **Review** | 2 | Submit and view reviews |

### Authentication
All protected endpoints require: `Authorization: Bearer <access_token>`

- **Access tokens** expire after 15 minutes
- **Refresh tokens** expire after 7 days with automatic rotation
- Two roles: `COMPANY` and `WORKER` with distinct permissions

> See the [Back-end README](Back-end/README.md) for complete API reference with request/response examples.

---

## Database Schema

7 tables with full cascade delete relationships:

| Table | Description | Key Relations |
|---|---|---|
| **Users** | Authentication accounts (email, password, role) | → Company (1:1), → Worker (1:1) |
| **Company** | Business profiles (name, SIRET, address, type) | → Users, → Job (1:N) |
| **Worker** | Worker profiles (skills, availability, CV) | → Users, → JobOffer (1:N) |
| **Job** | Mission postings (title, salary, dates, status) | → Company, → JobOffer (1:N), → Review (1:N) |
| **JobOffer** | Applications (status, contract info) | → Job, → Worker, → Message (1:N) |
| **Review** | Ratings and comments (1-5 stars) | → Job |
| **Message** | Conversation messages (content, read status) | → JobOffer |

### Enums
- **Role**: `COMPANY` | `WORKER`
- **JobStatus**: `OPEN` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED`
- **JobOfferStatus**: `PENDING` | `ACCEPTED` | `REJECTED` | `CANCELLED` | `COMPLETED`

---

## Security

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt with 10 salt rounds |
| Token authentication | JWT (access: 15min, refresh: 7d) |
| Token rotation | Refresh tokens invalidated after each use |
| Token storage (server) | Refresh tokens hashed before DB storage |
| Token storage (client) | Expo SecureStore (encrypted device storage) |
| Input validation | class-validator DTOs on all endpoints |
| Role authorization | Guard-based RBAC (JwtAuthGuard + RolesGuard) |
| CORS | Enabled (configurable origins) |
| Environment validation | Joi schema for env vars at startup |
| Cascade deletion | All foreign keys with CASCADE delete |
| 401 handling | Auto token cleanup + redirect on invalid/expired tokens |

---

## Testing

### Back-end

```bash
cd Back-end

# Run all unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

Test files (`.spec.ts`) exist for all service layers:
- Auth, Company, Job, Worker, Message, Review, User

### Front-end

```bash
cd Front-end/Prestau

# Lint check
npm run lint
```

---

## Documentation

| Document | Location | Content |
|---|---|---|
| **General README** | [README.md](README.md) | Project overview, setup, architecture |
| **Back-end README** | [Back-end/README.md](Back-end/README.md) | Full API reference, database schema, auth flow |
| **Front-end README** | [Front-end/Prestau/README.md](Front-end/Prestau/README.md) | Screens, components, navigation, design system |

---
---

# Prestau

> **🇫🇷 Version française**

---

<p align="center">
  <strong>Une marketplace connectant les restaurants et entreprises de restauration avec des travailleurs intérimaires</strong>
</p>

<p align="center">
  <em>NestJS · React Native · Expo · PostgreSQL · Prisma · JWT</em>
</p>

---

## Table des matières

- [À propos du projet](#-à-propos-du-projet)
- [Fonctionnalités clés](#-fonctionnalités-clés)
- [Stack technique](#-stack-technique-1)
- [Structure du projet](#-structure-du-projet)
- [Démarrage rapide](#-démarrage-rapide)
  - [Prérequis](#prérequis)
  - [Configuration du Back-end](#configuration-du-back-end)
  - [Configuration du Front-end](#configuration-du-front-end)
- [Vue d'ensemble de l'architecture](#-vue-densemble-de-larchitecture)
- [Parcours utilisateur](#-parcours-utilisateur)
- [Aperçu de l'API](#-aperçu-de-lapi)
- [Schéma de la base de données](#-schéma-de-la-base-de-données)
- [Sécurité](#-sécurité)
- [Tests](#-tests)
- [Documentation](#-documentation-1)

---

## À propos du projet

**Prestau** est une plateforme mobile full-stack conçue pour connecter les **entreprises de restauration** (restaurants, hôtels, traiteurs, salles événementielles) avec les **travailleurs intérimaires** (serveurs, cuisiniers, barmen, personnel de cuisine) à la recherche de missions.

La plateforme permet aux entreprises de publier rapidement des offres de mission temporaire et de trouver du personnel, tandis que les travailleurs peuvent parcourir les missions disponibles, gérer leur disponibilité et construire leur réputation professionnelle grâce à un système de notation.

### Le problème
Le secteur de la restauration a fréquemment besoin de personnel temporaire pour des événements, les périodes de forte affluence ou pour remplacer des absences. Trouver rapidement des travailleurs qualifiés et disponibles est un défi, et les travailleurs peinent souvent à trouver du travail intérimaire régulier.

### La solution
Prestau offre une expérience simplifiée, pensée pour le mobile, où :
- **Les entreprises** peuvent publier des missions, parcourir les profils des travailleurs et gérer le cycle complet d'embauche, de la candidature à la finalisation
- **Les travailleurs** peuvent découvrir des opportunités, gérer leur calendrier, postuler en un clic et construire un historique vérifié

---

## Fonctionnalités clés

### Pour les Entreprises
- **Publication de missions** : Créer des offres détaillées avec dates, horaires, salaire et description
- **Gestion des candidatures** : Examiner, accepter ou refuser les candidatures des travailleurs
- **Cycle de vie des missions** : Suivi des missions de ouverte → en cours → terminée
- **Découverte de travailleurs** : Voir les profils, compétences, expériences et notations des travailleurs
- **Messagerie** : Communication directe avec les candidats et travailleurs embauchés
- **Historique des missions** : Consulter les missions terminées avec avis mutuels
- **Profil entreprise** : Mettre en valeur le type d'établissement, l'emplacement et la description

### Pour les Travailleurs
- **Découverte de missions** : Parcourir et rechercher les missions disponibles avec filtres de salaire
- **Candidature en un clic** : Processus de candidature rapide pour les missions disponibles
- **Calendrier de disponibilité** : Calendrier interactif pour marquer les jours libres/occupés
- **Missions actives** : Suivi du statut et des détails des missions en cours
- **Historique des missions** : Voir les missions terminées et les avis reçus
- **Profil & CV** : Mettre en avant compétences, expérience, langues et qualifications
- **Système de notation** : Construire une réputation professionnelle via les missions terminées

### Fonctionnalités de la plateforme
- **Authentification JWT** : Accès sécurisé avec rotation et rafraîchissement des jetons
- **Accès basé sur les rôles** : Expériences séparées pour entreprises et travailleurs
- **Mises à jour en temps réel** : Suivi en direct du statut des missions et candidatures
- **Système d'avis mutuels** : Les deux parties se notent après chaque mission
- **Recherche & Filtres** : Trouver des missions par titre, localisation et tranche de salaire
- **Design responsive** : S'adapte à toute taille d'appareil mobile
- **Multiplateforme** : Fonctionne sur iOS, Android et Web

---

## Stack technique

### Back-end
| Technologie | Version | Utilisation |
|---|---|---|
| NestJS | v11 | Framework API TypeScript |
| Prisma | v7 | ORM & migrations de BDD |
| PostgreSQL | 14+ | Base de données relationnelle |
| Passport.js | v0.7 | Middleware d'authentification |
| JWT | — | Authentification par jetons |
| bcrypt | v6 | Hachage des mots de passe |
| class-validator | v0.14 | Validation des requêtes |
| Jest | v30 | Tests unitaires |

### Front-end
| Technologie | Version | Utilisation |
|---|---|---|
| React Native | 0.81 | Framework UI mobile |
| Expo | v54 | Plateforme de développement |
| Expo Router | v6 | Navigation basée sur les fichiers |
| TypeScript | v5 | Langage |
| React Query | v5 | Gestion de l'état serveur |
| Axios | v1.13 | Client HTTP |
| Expo SecureStore | v15 | Stockage chiffré des jetons |
| react-native-calendars | — | Calendrier de disponibilité |
| dayjs | v1.11 | Formatage des dates |

---

## Structure du projet

```
Prestau/
├── README.md                    # ← Vous êtes ici (documentation générale)
├── Back-end/                    # API REST NestJS
│   ├── README.md                # Documentation détaillée du back-end
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma        # Schéma BDD (7 modèles, 4 enums)
│   │   └── migrations/          # 9 fichiers de migration
│   └── src/
│       ├── main.ts              # Point d'entrée (port 3000)
│       ├── app.module.ts        # Module racine
│       ├── prisma.service.ts    # Service base de données
│       └── Modules/
│           ├── auth/            # Authentification (4 endpoints)
│           ├── user/            # Comptes utilisateurs (4 endpoints)
│           ├── company/         # Profils entreprise (5 endpoints)
│           ├── worker/          # Profils travailleur (7 endpoints)
│           ├── job/             # Offres de mission (6 endpoints)
│           ├── joboffer/        # Candidatures (10 endpoints)
│           ├── message/         # Messagerie (3 endpoints)
│           └── review/          # Avis & notations (2 endpoints)
└── Front-end/
    └── Prestau/                 # Application Expo React Native
        ├── README.md            # Documentation détaillée du front-end
        ├── package.json
        ├── app/                 # Écrans (routage basé sur les fichiers)
        │   ├── index.tsx        # Page d'accueil
        │   ├── login.tsx        # Connexion
        │   ├── register.tsx     # Inscription
        │   ├── (tabs-company)/  # Tableau de bord entreprise (4 onglets)
        │   ├── (tabs-worker)/   # Tableau de bord travailleur (3 onglets)
        │   ├── job/[id].tsx     # Détail d'une mission
        │   ├── joboffer/[id].tsx # Détail d'une candidature
        │   └── review/[id].tsx  # Soumission d'avis
        ├── components/          # 6 composants UI réutilisables
        ├── src/api/             # 7 modules de services API
        └── constants/           # Thème & couleurs
```

---

## Démarrage rapide

### Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x (instance en cours d'exécution)
- Application **Expo Go** sur votre appareil mobile (ou émulateur Android/iOS)

### Configuration du Back-end

```bash
# 1. Naviguer vers le back-end
cd Prestau/Back-end

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement
cat > .env << EOF
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://UTILISATEUR:MOT_DE_PASSE@localhost:5432/prestau
JWT_SECRET=votre-clé-secrète-sécurisée
EOF

# 4. Générer le client Prisma & exécuter les migrations
npm run prisma:generate
npm run prisma:migrate

# 5. Démarrer le serveur API (mode développement)
npm run start:dev
```

L'API sera disponible sur `http://localhost:3000`.

### Configuration du Front-end

```bash
# 1. Naviguer vers le front-end
cd Prestau/Front-end/Prestau

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement (utilisez l'IP de votre machine, pas localhost)
echo "EXPO_PUBLIC_API_URL=http://VOTRE_IP:3000" > .env

# 4. Démarrer le serveur de développement Expo
npm start
```

Scannez le QR code avec **Expo Go** sur votre téléphone, ou appuyez sur `a`/`i` pour les émulateurs.

> **Astuce :** Trouvez votre IP locale avec `ifconfig` (macOS/Linux) ou `ipconfig` (Windows). Sur un appareil physique, le téléphone et le serveur doivent être sur le même réseau.

---

## Vue d'ensemble de l'architecture

```
┌─────────────────────────────┐
│    Application Mobile (Expo)│
│  React Native + TypeScript  │
│  Expo Router (navigation)   │
│  React Query (état)         │
│  SecureStore (jetons)       │
└──────────────┬──────────────┘
               │
          HTTP/REST
          (Axios)
               │
               ▼
┌─────────────────────────────┐
│    Serveur API (NestJS)     │
│  Contrôleurs → Services     │
│  Authentification JWT       │
│  Gardes basés sur les rôles │
│  Validation DTO             │
└──────────────┬──────────────┘
               │
          Prisma ORM
               │
               ▼
┌─────────────────────────────┐
│   Base de données PostgreSQL│
│  7 tables, 4 enums          │
│  Relations suppression      │
│  en cascade                 │
│  Clés étrangères indexées   │
└─────────────────────────────┘
```

### Cycle de vie d'une requête

```
App Mobile → Intercepteur Axios (injection JWT) → Contrôleur NestJS
  → JwtAuthGuard (vérification jeton) → RolesGuard (vérification rôle)
  → Service (logique métier) → Prisma (requête BDD)
  → Réponse → Intercepteur Axios (gestion 401) → Cache React Query → Interface
```

---

## Parcours utilisateur

### Inscription & Onboarding

```
1. L'utilisateur ouvre l'app → Page d'accueil
2. Appuie sur "S'inscrire"
3. Saisit email, mot de passe, confirmation
4. Sélectionne le rôle : "Entreprise" ou "Travailleur"
5. POST /auth/register → Jetons JWT retournés & stockés
6. Redirigé vers le formulaire de création de profil :
   - Entreprise : nom, adresse, SIRET, téléphone, type...
   - Travailleur : nom, profession, compétences, photo, téléphone...
7. POST /company ou POST /worker
8. Redirigé vers le tableau de bord correspondant au rôle
```

### Entreprise : Publier une mission

```
1. L'entreprise ouvre l'onglet "Créer une mission"
2. Remplit : titre, description, dates, horaires, salaire
3. POST /job → Mission créée avec le statut OPEN
4. La mission apparaît sur le tableau de bord de l'entreprise
5. Les travailleurs peuvent maintenant la voir et postuler
```

### Travailleur : Postuler à une mission

```
1. Le travailleur ouvre l'onglet "Parcourir les missions"
2. Recherche/filtre les missions disponibles
3. Touche une mission → voit les détails complets
4. Touche "Postuler"
5. POST /joboffer/:jobId → Candidature créée avec le statut PENDING
6. La candidature apparaît dans "Mes candidatures" du travailleur
7. L'entreprise voit un point de notification sur son tableau de bord
```

### Entreprise : Gérer les candidatures

```
1. L'entreprise touche une mission sur son tableau de bord
2. Ouvre le modal "Voir les candidats"
3. Voit la liste des travailleurs avec nom, ville, téléphone, profession
4. Touche "Accepter" → POST /joboffer/:id/accept
   - Statut candidature → ACCEPTED
   - Statut mission → IN_PROGRESS
5. Ou touche "Refuser" → POST /joboffer/:id/reject
   - Statut candidature → REJECTED
```

### Fin de mission & Avis

```
1. L'entreprise marque la mission comme terminée → POST /joboffer/:id/complete
   - Statut candidature → COMPLETED
   - Statut mission → COMPLETED
2. Les deux parties peuvent maintenant laisser un avis
3. Touche "Laisser un avis" → Notation 5 étoiles + commentaire optionnel
4. POST /review → Avis enregistré
5. Les avis sont visibles dans l'historique des missions des deux parties
```

---

## Aperçu de l'API

L'API REST expose **41 endpoints** répartis en 8 modules :

| Module | Endpoints | Opérations clés |
|---|---|---|
| **Auth** | 4 | Inscription, Connexion, Déconnexion, Rafraîchissement |
| **User** | 4 | Obtenir/Modifier/Supprimer un profil |
| **Company** | 5 | CRUD entreprise + consultation par travailleur |
| **Worker** | 7 | CRUD travailleur + calendrier de disponibilité |
| **Job** | 6 | CRUD missions + recherche/filtre |
| **JobOffer** | 10 | Postuler, Accepter, Refuser, Terminer, Annuler, Historique |
| **Message** | 3 | Envoyer/Lire des messages dans les candidatures |
| **Review** | 2 | Soumettre et consulter les avis |

### Authentification
Tous les endpoints protégés nécessitent : `Authorization: Bearer <access_token>`

- Les **jetons d'accès** expirent après 15 minutes
- Les **jetons de rafraîchissement** expirent après 7 jours avec rotation automatique
- Deux rôles : `COMPANY` et `WORKER` avec des permissions distinctes

> Voir le [README du Back-end](Back-end/README.md) pour la référence API complète avec exemples de requêtes/réponses.

---

## Schéma de la base de données

7 tables avec des relations de suppression en cascade complètes :

| Table | Description | Relations clés |
|---|---|---|
| **Users** | Comptes d'authentification (email, mot de passe, rôle) | → Company (1:1), → Worker (1:1) |
| **Company** | Profils entreprise (nom, SIRET, adresse, type) | → Users, → Job (1:N) |
| **Worker** | Profils travailleur (compétences, disponibilité, CV) | → Users, → JobOffer (1:N) |
| **Job** | Publications de missions (titre, salaire, dates, statut) | → Company, → JobOffer (1:N), → Review (1:N) |
| **JobOffer** | Candidatures (statut, infos contrat) | → Job, → Worker, → Message (1:N) |
| **Review** | Notes et commentaires (1-5 étoiles) | → Job |
| **Message** | Messages de conversation (contenu, statut de lecture) | → JobOffer |

### Enums
- **Role** : `COMPANY` | `WORKER`
- **JobStatus** : `OPEN` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED`
- **JobOfferStatus** : `PENDING` | `ACCEPTED` | `REJECTED` | `CANCELLED` | `COMPLETED`

---

## Sécurité

| Fonctionnalité | Implémentation |
|---|---|
| Hachage des mots de passe | bcrypt avec 10 tours de salage |
| Authentification par jetons | JWT (accès : 15min, rafraîchissement : 7j) |
| Rotation des jetons | Jetons de rafraîchissement invalidés après chaque utilisation |
| Stockage des jetons (serveur) | Jetons de rafraîchissement hachés avant stockage en BDD |
| Stockage des jetons (client) | Expo SecureStore (stockage chiffré sur l'appareil) |
| Validation des entrées | DTOs class-validator sur tous les endpoints |
| Autorisation par rôle | RBAC par gardes (JwtAuthGuard + RolesGuard) |
| CORS | Activé (origines configurables) |
| Validation environnement | Schéma Joi pour les variables d'env au démarrage |
| Suppression en cascade | Toutes les clés étrangères avec CASCADE delete |
| Gestion des 401 | Nettoyage automatique des jetons + redirection en cas de jeton invalide/expiré |

---

## Tests

### Back-end

```bash
cd Back-end

# Lancer tous les tests unitaires
npm test

# Mode surveillance
npm run test:watch

# Rapport de couverture
npm run test:cov
```

Des fichiers de tests (`.spec.ts`) existent pour toutes les couches de services :
- Auth, Company, Job, Worker, Message, Review, User

### Front-end

```bash
cd Front-end/Prestau

# Vérification du lint
npm run lint
```

---

## Documentation

| Document | Emplacement | Contenu |
|---|---|---|
| **README Général** | [README.md](README.md) | Vue d'ensemble, installation, architecture |
| **README Back-end** | [Back-end/README.md](Back-end/README.md) | Référence API complète, schéma BDD, flux d'auth |
| **README Front-end** | [Front-end/Prestau/README.md](Front-end/Prestau/README.md) | Écrans, composants, navigation, système de design |
