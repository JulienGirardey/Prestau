# Prestau — Front-end

> **[🇫🇷 Version française ci-dessous](#-prestau--front-end-1)**

---

## Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Available Scripts](#-available-scripts)
- [Project Architecture](#-project-architecture)
- [Navigation Structure](#-navigation-structure)
- [Screens & Features](#-screens--features)
  - [Authentication Screens](#authentication-screens)
  - [Company Screens](#company-screens-tabs-company)
  - [Worker Screens](#worker-screens-tabs-worker)
  - [Shared Screens](#shared-screens)
- [Components](#-components)
- [API Layer](#-api-layer)
- [State Management](#-state-management)
- [Design System](#-design-system)
- [Configuration Files](#-configuration-files)

---

## Overview

Prestau Front-end is a **mobile application** built with **React Native** and **Expo** that provides the user interface for the Prestau platform — a marketplace connecting **companies** (restaurants, bars) with **workers** in the food service sector for short-term missions ("extras").

The application offers two distinct user experiences:
- **Company dashboard**: Post missions, manage applications, track missions, communicate with workers
- **Worker dashboard**: Browse available missions, apply, manage availability calendar, track missions, communicate with companies.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React Native** 0.81 | Cross-platform mobile framework |
| **Expo** v54 | Development platform & toolchain |
| **Expo Router** v6 | File-based routing (typed routes) |
| **TypeScript** v5 | Language |
| **React Query** (@tanstack) v5 | Server state management & caching |
| **Axios** | HTTP client |
| **Expo SecureStore** | Secure token storage |
| **jwt-decode** | JWT token decoding (role detection) |
| **react-native-calendars** | Calendar component for availability |
| **expo-image-picker** | Photo selection from gallery/camera |
| **dayjs** | Date/time formatting |
| **React Navigation** v7 | Navigation framework (via Expo Router) |
| **react-native-reanimated** v4 | Animations |
| **react-native-gesture-handler** | Touch gesture handling |

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Expo CLI** (`npx expo`)
- **Expo Go** app on your mobile device (for development)
- Or an **Android/iOS emulator** configured

---

## Installation

```bash
# Navigate to the front-end directory
cd Prestau/Front-end/Prestau

# Install dependencies
npm install
```

---

## Environment Variables

Create a `.env` file at the root of the `Front-end/Prestau/` folder:

```env
EXPO_PUBLIC_API_URL=http://YOUR_SERVER_IP:3000
```

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | **Yes** | Base URL of the Prestau API server |

**Important:** When testing on a physical device, use your machine's local IP address (not `localhost`). Example: `http://192.168.1.100:3000`

---

## Running the Application

```bash
# Start the Expo development server
npm start

# Start with LAN connection (recommended for physical devices)
npm run start:lan

# Start with tunnel (when LAN doesn't work)
npm run start:tunnel

# Start for specific platform
npm run android
npm run ios
npm run web
```

After starting, scan the QR code with the **Expo Go** app on your mobile device, or press `a` for Android emulator / `i` for iOS simulator.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo development server |
| `npm run start:lan` | Start with LAN network mode |
| `npm run start:tunnel` | Start with tunnel (ngrok) |
| `npm run android` | Start on Android emulator |
| `npm run ios` | Start on iOS simulator |
| `npm run web` | Start web version |
| `npm run lint` | Run ESLint on the project |
| `npm run reset-project` | Reset project to initial state |

---

## Project Architecture

```
Front-end/Prestau/
├── app/                              # Expo Router pages (file-based routing)
│   ├── _layout.tsx                   # Root layout (QueryClientProvider, Stack navigator)
│   ├── index.tsx                     # Landing page (logo + Register/Login links)
│   ├── login.tsx                     # Login screen
│   ├── register.tsx                  # Registration screen (with role selection)
│   ├── companyCreation.tsx           # Company profile creation form
│   ├── workerCreation.tsx            # Worker profile creation form (with photo picker)
│   ├── (tabs-company)/              # Company tab navigation group
│   │   ├── _layout.tsx              # Tab bar configuration (4 tabs)
│   │   ├── dashboard-company.tsx    # Company's posted jobs list
│   │   ├── create-job.tsx           # Job creation form
│   │   ├── ProfileCompany.tsx       # Company profile & stats
│   │   └── Message.tsx              # Messaging interface
│   ├── (tabs-worker)/               # Worker tab navigation group
│   │   ├── _layout.tsx              # Tab bar configuration (3 tabs)
│   │   ├── dashboard-worker.tsx     # Worker dashboard (missions + calendar)
│   │   ├── JobWorker.tsx            # Available jobs listing (search + filters)
│   │   ├── ProfileWorker.tsx        # Worker profile & stats
│   │   └── Message.tsx              # Messaging interface
│   ├── job/
│   │   └── [id].tsx                 # Dynamic job detail page
│   ├── joboffer/
│   │   └── [id].tsx                 # Dynamic job offer detail page
│   └── review/
│       └── [id].tsx                 # Review/rating submission page
├── components/                       # Reusable UI components
│   ├── Button.tsx                   # Custom button component
│   ├── DefaultCard.tsx              # Card wrapper component
│   ├── Header.tsx                   # App header with logo
│   ├── InputBar.tsx                 # Text input wrapper
│   ├── MissionHistory.tsx           # Mission history list component
│   └── ThemedText.tsx               # Typography component with variants
├── constants/
│   └── Colors.ts                    # Color palette (light/dark themes)
├── hooks/
│   └── useThemeColors.ts            # Theme-aware color hook
├── src/
│   └── api/                         # API service layer
│       ├── axios.ts                 # Axios instance with interceptors
│       ├── auth.ts                  # Authentication API calls
│       ├── company.ts               # Company API calls
│       ├── job.ts                   # Job API calls
│       ├── joboffer.ts              # Job offer/application API calls
│       ├── review.ts                # Review API calls
│       └── worker.ts                # Worker API calls
├── assets/
│   └── images/
│       └── logo-prestau.jpg         # App logo
├── app.json                          # Expo configuration
├── package.json
├── tsconfig.json
├── eslint.config.js
└── expo-env.d.ts
```

---

## Navigation Structure

```
Root Stack (app/_layout.tsx)
│
├── index ─────────────── Landing page (logo + links)
├── login ─────────────── Login form
├── register ──────────── Registration form (role selection)
├── companyCreation ───── Company profile form
├── workerCreation ────── Worker profile form
│
├── (tabs-company) ────── Tab Navigator (4 tabs)
│   ├── dashboard-company    Dashboard (posted jobs)
│   ├── create-job           Create Job
│   ├── ProfileCompany       Profile & Settings
│   └── Message              Messages
│
├── (tabs-worker) ─────── Tab Navigator (3 tabs)
│   ├── dashboard-worker     Dashboard (missions + calendar)
│   ├── JobWorker            Browse Jobs
│   ├── ProfileWorker        Profile & Settings
│   └── Message              Messages
│
├── job/[id] ──────────── Job Detail (dynamic route)
├── joboffer/[id] ─────── Job Offer Detail (dynamic route)
└── review/[id] ───────── Review Submission (dynamic route)
```

### Navigation Flow

```
┌──────────┐     ┌──────────┐     ┌──────────────────┐
│  Index   │────▶│ Register │────▶│ Company Creation  │────▶ (tabs-company)
│ (Landing)│     │          │     │   OR               │
│          │     │          │     │ Worker Creation   │────▶ (tabs-worker)
└──────────┘     └──────────┘     └──────────────────┘
      │
      │          ┌──────────┐
      └─────────▶│  Login   │────▶ (tabs-company) or (tabs-worker)
                 │          │     based on JWT decoded role
                 └──────────┘
```

---

## Screens & Features

### Authentication Screens

#### Landing Page (`index.tsx`)
- Prestau logo display
- "Register" button → navigates to registration
- "Login" button → navigates to login
- Responsive layout with cream background

#### Login (`login.tsx`)
- Email input with validation
- Password input (secure text)
- Error message display for invalid credentials
- Loading state during authentication
- On success: JWT token decoded → redirects to company or worker dashboard based on role
- Tokens stored securely via `expo-secure-store`

#### Register (`register.tsx`)
- Email input with validation
- Password input with minimum length check
- Password confirmation field
- **Role selection**: Two buttons — "I'm a Company" / "I'm a Worker"
- On success: redirects to `companyCreation` or `workerCreation` based on selected role

#### Company Creation (`companyCreation.tsx`)
- Full company profile form with fields:
  - Company name, Address, City, Postal code
  - SIRET number, Phone number
  - Establishment type, Description
  - Website URL, Social media URL
- Required field validation
- Responsive scrollable form
- On success: redirects to company dashboard

#### Worker Creation (`workerCreation.tsx`)
- Full worker profile form with fields:
  - First name, Last name, Date of birth
  - City, Postal code, Phone number
  - Profession, Experience (years)
  - Languages, Skills, Qualifications
  - CV URL
- **Photo picker** with ActionSheet (camera or gallery)
- Required field validation
- On success: redirects to worker dashboard

---

### Company Screens (`tabs-company`)

#### Dashboard (`dashboard-company.tsx`)
- **Lists all posted jobs** with:
  - Title, salary badge, dates, times
  - Job status indicator (OPEN / IN_PROGRESS / COMPLETED / CANCELLED)
  - Notification dot for new pending applications
- Pull-to-refresh functionality
- Tap a job → navigates to `job/[id]` for details

#### Create Job (`create-job.tsx`)
- Job posting form with:
  - Title input
  - Description (multi-line)
  - Start date & time pickers
  - End date & time pickers
  - Salary input (€/h)
- Date validation with **dayjs** (end must be after start)
- Success feedback and form reset

#### Company Profile (`ProfileCompany.tsx`)
- Displays company information:
  - Company name, Address, City
  - Establishment type, Phone, SIRET
- **Statistics section**:
  - Total missions count
  - Average rating
  - Time on platform
- **Actions**:
  - View mission history (opens modal with `MissionHistory` component)
  - Settings
  - Logout (clears tokens, redirects to landing)

#### Messages (`Message.tsx`)
- Message thread list
- Unread message indicators (blue dot)
- Timestamps display
- Sender/receiver identification

---

### Worker Screens (`tabs-worker`)

#### Dashboard (`dashboard-worker.tsx`)
- **Active Missions section**:
  - Horizontal scrollable list of current missions
  - Each card shows: title, date, salary, company, status
  - Color-coded borders (yellow = PENDING, green = ACCEPTED)
  - Tap → navigates to `joboffer/[id]`
- **Availability Calendar**:
  - Interactive calendar component (`react-native-calendars`)
  - French localization
  - Color-coded days:
    - 🟢 Green background = Available (free)
    - 🔴 Red background = Busy
    - Default = Neutral
  - Tap a day → cycles through the three states via API mutation
  - Legend displayed below calendar

#### Browse Jobs (`JobWorker.tsx`)
- **Search bar** with debounced input
- **Salary filter chips**:
  - < 10€/h
  - 10–12€/h
  - 12–15€/h
  - 15–20€/h
  - > 20€/h
- **Job cards** displaying:
  - Title, Company name
  - City & address
  - Description (truncated)
  - Date range with times
  - Salary badge
- Pull-to-refresh
- Empty state with icon when no results
- Tap a job → navigates to `job/[id]`

#### Worker Profile (`ProfileWorker.tsx`)
- Displays worker information:
  - Full name, Profession, City
  - Experience, Languages, Skills
- **Statistics section**:
  - Completed missions count
  - Average rating received
  - Time on platform
- **Actions**:
  - View mission history (modal)
  - Settings
  - Logout

---

### Shared Screens

#### Job Detail (`job/[id].tsx`)
- Full job information:
  - Title, Description
  - Company name & city
  - Start/end dates and times
  - Salary
  - Job status badge
- **Worker-specific features**:
  - "Postuler" (Apply) button if eligible
  - "Déjà postulé" (Already Applied) badge if already applied
  - Cancel application option
- **Company-specific features**:
  - "Voir les candidats" (View Applicants) button
  - Modal with candidate list:
    - Worker name, City, Phone, Profession
    - Accept / Reject buttons per candidate

#### Job Offer Detail (`joboffer/[id].tsx`)
- Job offer information from associated job
- Current offer status display
- **For completed offers**: "Leave a review" button
- **For active offers**: Cancel application option
- Formatted dates and times

#### Review Submission (`review/[id].tsx`)
- **5-star rating system** (required)
  - Interactive star selector
  - Scale labels: Very Bad → Bad → Fair → Good → Excellent
- **Comment textarea** (optional, max 500 characters)
  - Character counter
- Automatic reviewer/reviewee determination from JWT role
- Submit → creates review via API → navigates back

---

## 🧩 Components

### `Button.tsx` — Custom Button
```tsx
<NewButton title="Submit" onPress={handleSubmit} disabled={isLoading} />
```
- Customizable title and press handler
- Disabled state support
- Orange background with white text

### `DefaultCard.tsx` — Card Wrapper
```tsx
<DefaultCard>
  <Text>Content inside a card</Text>
</DefaultCard>
```
- Bordered container with rounded corners
- Responsive padding
- Theme-aware background colors

### `Header.tsx` — App Header
```tsx
<Header />
```
- Displays the Prestau logo centered
- Responsive sizing

### `InputBar.tsx` — Text Input
```tsx
<InputBar placeholder="Email" value={email} onChangeText={setEmail} secureTextEntry={false} />
```
- Styled text input with placeholder
- Secure text option for passwords
- Custom styling support

### `MissionHistory.tsx` — Mission History List
```tsx
<MissionHistory missions={history} role="COMPANY" />
```
- Displays completed/past missions:
  - Mission title and salary badge
  - Company or Worker name
  - Address and date range
  - Received review (rating + comment)
  - Sent review (rating + comment)
  - "Pending review" prompt if no review submitted
- Pressable cards → navigate to offer detail

### `ThemedText.tsx` — Typography
```tsx
<ThemedText variant="headline">Title</ThemedText>
<ThemedText variant="subtitle1">Subtitle</ThemedText>
<ThemedText variant="body3">Body text</ThemedText>
<ThemedText variant="caption">Small text</ThemedText>
```
- Variants: `headline`, `subtitle1`, `subtitle2`, `subtitle3`, `body3`, `caption`
- Theme-aware text colors

---

## 🔌 API Layer

The API layer is located in `src/api/` and uses **Axios** with interceptors.

### Axios Configuration (`axios.ts`)
- Base URL from `EXPO_PUBLIC_API_URL` environment variable
- **Request interceptor**: Automatically injects JWT access token from SecureStore into `Authorization: Bearer` header
- **Response interceptor**: Handles `401` responses by clearing stored tokens; logs `400` errors for debugging

### API Modules

#### `auth.ts` — Authentication
| Function | Method | Endpoint | Description |
|---|---|---|---|
| `register(email, password, role)` | POST | `/auth/register` | Creates account, stores tokens in SecureStore |
| `login(email, password)` | POST | `/auth/login` | Authenticates, stores tokens in SecureStore |
| `logout()` | POST | `/auth/logout` | Invalidates refresh token, clears local storage |
| `refreshToken()` | POST | `/auth/refresh-token` | Refreshes access token from stored refresh token |

#### `company.ts` — Company
| Function | Method | Endpoint | Description |
|---|---|---|---|
| `createCompanyProfile(data)` | POST | `/company` | Creates company profile |
| `getCompanyProfile()` | GET | `/company/MyCompany` | Fetches current company profile |

#### `worker.ts` — Worker
| Function | Method | Endpoint | Description |
|---|---|---|---|
| `createWorkerProfile(data)` | POST | `/worker` | Creates worker profile |
| `getWorkerProfile()` | GET | `/worker/MyProfile` | Fetches current worker profile |
| `getWorkerAvailability()` | GET | `/worker/availability` | Gets availability calendar data |
| `updateWorkerAvailability(date, status)` | PATCH | `/worker/availability` | Updates a day's status |

#### `job.ts` — Jobs
| Function | Method | Endpoint | Description |
|---|---|---|---|
| `createJob(jobData)` | POST | `/job` | Creates a new job posting |
| `getJobs(search?)` | GET | `/job` | Fetches available jobs (with optional search) |
| `getMyJobs()` | GET | `/job/my-jobs` | Fetches company's posted jobs |
| `getJobById(id)` | GET | `/job/:id` | Fetches job details with applicants |

#### `joboffer.ts` — Job Offers
| Function | Method | Endpoint | Description |
|---|---|---|---|
| `createJobOffer(jobId)` | POST | `/joboffer/:jobId` | Applies for a job |
| `deleteJobOffer(jobId)` | DELETE | `/joboffer/cancel/:jobId` | Cancels application |
| `acceptJobOffer(offerId)` | POST | `/joboffer/:id/accept` | Accepts an applicant |
| `rejectJobOffer(offerId)` | POST | `/joboffer/:id/reject` | Rejects an applicant |
| `completeJobOffer(offerId)` | POST | `/joboffer/:id/complete` | Marks mission as completed |
| `cancelJobOffer(offerId)` | POST | `/joboffer/:id/cancel` | Cancels an accepted offer |
| `getJobOfferById(id)` | GET | `/joboffer/:id` | Gets offer details |
| `getJobOffersByCompany()` | GET | `/joboffer/my-offers` | Gets received applications |
| `getJobOffersByWorker()` | GET | `/joboffer/my-applications` | Gets submitted applications |
| `getMissionHistory()` | GET | `/joboffer/history` | Gets completed missions history |

#### `review.ts` — Reviews
| Function | Method | Endpoint | Description |
|---|---|---|---|
| `createReview(payload)` | POST | `/review` | Submits a rating and comment |

---

## State Management

The application uses **React Query** (`@tanstack/react-query` v5) for server state management:

- **QueryClientProvider** wraps the entire app in `_layout.tsx`
- **Queries** (`useQuery`): Used for fetching data (jobs, profiles, offers, availability)
- **Mutations** (`useMutation`): Used for creating/updating data (login, register, create job, apply, etc.)
- **Automatic refetching**: `refetchOnMount`, `refetchOnWindowFocus` for fresh data
- **Cache invalidation**: `queryClient.invalidateQueries()` after mutations

### Authentication State
- JWT tokens stored in **Expo SecureStore** (encrypted device storage)
- Access token: `accessToken` key
- Refresh token: `refreshToken` key
- User role decoded from JWT payload using `jwt-decode`

---

## Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `background` | `#F5F2D9` | Cream — page backgrounds |
| `primary` | `#264D84` | Blue — headers, buttons, text |
| `secondary` | `#EE4832` | Orange-red — accents, active tabs, CTAs |
| `inactive` | `#555` | Gray — inactive tab icons |

### Theme Support
- Light and dark themes defined in `constants/Colors.ts`
- Theme automatically detected via `useColorScheme()`
- Accessed via `useThemeColors()` hook
- Currently both themes use identical values (future dark mode ready)

### Responsive Design
- Custom `useResponsive()` utility in multiple screens
- `scale(size)`: Scales dimensions based on screen width (base: 390px)
- `scaleFont(size)`: Scales fonts with a max cap of 1.4x
- Adapts to different device sizes (phones, tablets)

### Typography Variants (ThemedText)
| Variant | Size | Weight | Usage |
|---|---|---|---|
| `headline` | 24px | Bold | Page titles |
| `subtitle1` | 20px | Semi-bold | Section headers |
| `subtitle2` | 18px | Semi-bold | Sub-sections |
| `subtitle3` | 16px | Semi-bold | Card titles |
| `body3` | 14px | Normal | Body text |
| `caption` | 12px | Normal | Small text, labels |

### Status Colors
| Status | Color | Context |
|---|---|---|
| `OPEN` | Green | Job available |
| `PENDING` | Orange/Yellow | Application pending |
| `ACCEPTED` | Blue | Application accepted |
| `IN_PROGRESS` | Blue | Mission in progress |
| `COMPLETED` | Green | Mission completed |
| `REJECTED` | Red | Application rejected |
| `CANCELLED` | Gray | Offer/job cancelled |

---

## Configuration Files

### `app.json` — Expo Configuration
- **App name**: Prestau
- **Scheme**: `prestau` (deep linking)
- **Orientation**: Portrait only
- **Icon**: `./assets/images/logo-prestau.jpg`
- **Splash screen**: Logo on white background (dark mode: black background)
- **Android**: Adaptive icon with `#E6F4FE` background, edge-to-edge enabled
- **iOS**: Tablet support enabled
- **Plugins**: `expo-router`, `expo-splash-screen`, `expo-secure-store`
- **Experimental**: Typed routes enabled, React Compiler enabled

### `tsconfig.json`
- Extends `expo/tsconfig.base`
- Strict mode enabled

### `eslint.config.js`
- Uses `eslint-config-expo/flat`
- Ignores `dist/` directory

---
---

# Prestau — Front-end

> **[🇫🇷 Version française ci-dessous](#-prestau--front-end-1)**

---

## Table des matières

- [Présentation](#-présentation)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation-1)
- [Variables d'environnement](#-variables-denvironnement-1)
- [Lancement de l'application](#-lancement-de-lapplication)
- [Scripts disponibles](#-scripts-disponibles)
- [Architecture du projet](#-architecture-du-projet)
- [Structure de navigation](#-structure-de-navigation)
- [Écrans & Fonctionnalités](#-écrans--fonctionnalités)
  - [Écrans d'authentification](#écrans-dauthentification)
  - [Écrans Entreprise](#écrans-entreprise-tabs-company)
  - [Écrans Travailleur](#écrans-travailleur-tabs-worker)
  - [Écrans partagés](#écrans-partagés)
- [Composants](#-composants)
- [Couche API](#-couche-api)
- [Gestion d'état](#-gestion-détat)
- [Système de design](#-système-de-design)
- [Fichiers de configuration](#-fichiers-de-configuration)

---

## Présentation

Le Front-end Prestau est une **application mobile** construite avec **React Native** et **Expo** qui fournit l'interface utilisateur de la plateforme Prestau — une marketplace mettant en relation des **entreprises** (restaurants, bars) avec des **travailleurs** du secteur de la restauration, pour des missions de courtes durée de type extras.

L'application propose deux expériences utilisateur distinctes :
- **Tableau de bord Entreprise** : Publier des missions, gérer les candidatures, suivre les missions, communiquer avec les travailleurs
- **Tableau de bord Travailleur** : Parcourir les missions disponibles, postuler, gérer le calendrier de disponibilité, suivre les missions, communiquer avec les entreprises.

---

## Stack technique

| Technologie | Utilisation |
|---|---|
| **React Native** 0.81 | Framework mobile multiplateforme |
| **Expo** v54 | Plateforme de développement & outillage |
| **Expo Router** v6 | Routage basé sur les fichiers (routes typées) |
| **TypeScript** v5 | Langage |
| **React Query** (@tanstack) v5 | Gestion d'état serveur & cache |
| **Axios** | Client HTTP |
| **Expo SecureStore** | Stockage sécurisé des jetons |
| **jwt-decode** | Décodage des jetons JWT (détection du rôle) |
| **react-native-calendars** | Composant calendrier pour la disponibilité |
| **expo-image-picker** | Sélection de photos (galerie/caméra) |
| **dayjs** | Formatage des dates/heures |
| **React Navigation** v7 | Framework de navigation (via Expo Router) |
| **react-native-reanimated** v4 | Animations |
| **react-native-gesture-handler** | Gestion des gestes tactiles |

---

## Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Expo CLI** (`npx expo`)
- Application **Expo Go** sur votre appareil mobile (pour le développement)
- Ou un **émulateur Android/iOS** configuré

---

## Installation

```bash
# Naviguer vers le dossier front-end
cd Prestau/Front-end/Prestau

# Installer les dépendances
npm install
```

---

## Variables d'environnement

Créez un fichier `.env` à la racine du dossier `Front-end/Prestau/` :

```env
EXPO_PUBLIC_API_URL=http://VOTRE_IP_SERVEUR:3000
```

| Variable | Requis | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | **Oui** | URL de base du serveur API Prestau |

**Important :** Lors des tests sur un appareil physique, utilisez l'adresse IP locale de votre machine (pas `localhost`). Exemple : `http://192.168.1.100:3000`

---

## Lancement de l'application

```bash
# Démarrer le serveur de développement Expo
npm start

# Démarrer avec connexion LAN (recommandé pour appareils physiques)
npm run start:lan

# Démarrer avec tunnel (quand le LAN ne fonctionne pas)
npm run start:tunnel

# Démarrer pour une plateforme spécifique
npm run android
npm run ios
npm run web
```

Après le démarrage, scannez le QR code avec l'application **Expo Go** sur votre téléphone, ou appuyez sur `a` pour l'émulateur Android / `i` pour le simulateur iOS.

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm start` | Démarrer le serveur de développement Expo |
| `npm run start:lan` | Démarrer en mode réseau LAN |
| `npm run start:tunnel` | Démarrer avec tunnel (ngrok) |
| `npm run android` | Démarrer sur émulateur Android |
| `npm run ios` | Démarrer sur simulateur iOS |
| `npm run web` | Démarrer la version web |
| `npm run lint` | Lancer ESLint sur le projet |
| `npm run reset-project` | Réinitialiser le projet |

---

## Architecture du projet

```
Front-end/Prestau/
├── app/                              # Pages Expo Router (routage basé sur les fichiers)
│   ├── _layout.tsx                   # Layout racine (QueryClientProvider, Stack)
│   ├── index.tsx                     # Page d'accueil (logo + liens Inscription/Connexion)
│   ├── login.tsx                     # Écran de connexion
│   ├── register.tsx                  # Écran d'inscription (sélection de rôle)
│   ├── companyCreation.tsx           # Formulaire de création de profil entreprise
│   ├── workerCreation.tsx            # Formulaire de création de profil travailleur
│   ├── (tabs-company)/              # Groupe d'onglets Entreprise
│   │   ├── _layout.tsx              # Configuration de la barre d'onglets (4 onglets)
│   │   ├── dashboard-company.tsx    # Liste des missions publiées
│   │   ├── create-job.tsx           # Formulaire de création de mission
│   │   ├── ProfileCompany.tsx       # Profil et statistiques entreprise
│   │   └── Message.tsx              # Interface de messagerie
│   ├── (tabs-worker)/               # Groupe d'onglets Travailleur
│   │   ├── _layout.tsx              # Configuration de la barre d'onglets (3 onglets)
│   │   ├── dashboard-worker.tsx     # Tableau de bord (missions + calendrier)
│   │   ├── JobWorker.tsx            # Liste des missions disponibles (recherche + filtres)
│   │   ├── ProfileWorker.tsx        # Profil et statistiques travailleur
│   │   └── Message.tsx              # Interface de messagerie
│   ├── job/
│   │   └── [id].tsx                 # Page de détail d'une mission (route dynamique)
│   ├── joboffer/
│   │   └── [id].tsx                 # Page de détail d'une candidature (route dynamique)
│   └── review/
│       └── [id].tsx                 # Page de soumission d'avis (route dynamique)
├── components/                       # Composants UI réutilisables
│   ├── Button.tsx                   # Composant bouton personnalisé
│   ├── DefaultCard.tsx              # Composant carte conteneur
│   ├── Header.tsx                   # En-tête avec logo
│   ├── InputBar.tsx                 # Champ de saisie texte
│   ├── MissionHistory.tsx           # Liste historique des missions
│   └── ThemedText.tsx               # Composant typographique avec variantes
├── constants/
│   └── Colors.ts                    # Palette de couleurs (thèmes clair/sombre)
├── hooks/
│   └── useThemeColors.ts            # Hook de couleurs selon le thème
├── src/
│   └── api/                         # Couche de services API
│       ├── axios.ts                 # Instance Axios avec intercepteurs
│       ├── auth.ts                  # Appels API authentification
│       ├── company.ts               # Appels API entreprise
│       ├── job.ts                   # Appels API missions
│       ├── joboffer.ts              # Appels API candidatures
│       ├── review.ts                # Appels API avis
│       └── worker.ts                # Appels API travailleur
├── assets/
│   └── images/
│       └── logo-prestau.jpg         # Logo de l'application
├── app.json                          # Configuration Expo
├── package.json
├── tsconfig.json
├── eslint.config.js
└── expo-env.d.ts
```

---

## Structure de navigation

```
Stack Racine (app/_layout.tsx)
│
├── index ─────────────── Page d'accueil (logo + liens)
├── login ─────────────── Formulaire de connexion
├── register ──────────── Formulaire d'inscription (sélection de rôle)
├── companyCreation ───── Formulaire profil entreprise
├── workerCreation ────── Formulaire profil travailleur
│
├── (tabs-company) ────── Navigateur à onglets (4 onglets)
│   ├── dashboard-company    Tableau de bord (missions publiées)
│   ├── create-job           Créer une mission
│   ├── ProfileCompany       Profil & Paramètres
│   └── Message              Messages
│
├── (tabs-worker) ─────── Navigateur à onglets (3 onglets)
│   ├── dashboard-worker     Tableau de bord (missions + calendrier)
│   ├── JobWorker            Parcourir les missions
│   ├── ProfileWorker        Profil & Paramètres
│   └── Message              Messages
│
├── job/[id] ──────────── Détail d'une mission (route dynamique)
├── joboffer/[id] ─────── Détail d'une candidature (route dynamique)
└── review/[id] ───────── Soumission d'un avis (route dynamique)
```

### Flux de navigation

```
┌──────────┐     ┌──────────┐     ┌───────────────────┐
│ Accueil  │────▶│Inscription│────▶│ Création profil   │────▶ (tabs-company)
│          │     │          │     │ Entreprise OU      │
│          │     │          │     │ Travailleur        │────▶ (tabs-worker)
└──────────┘     └──────────┘     └───────────────────┘
      │
      │          ┌──────────┐
      └─────────▶│ Connexion│────▶ (tabs-company) ou (tabs-worker)
                 │          │     selon le rôle décodé du JWT
                 └──────────┘
```

---

## Écrans & Fonctionnalités

### Écrans d'authentification

#### Page d'accueil (`index.tsx`)
- Affichage du logo Prestau
- Bouton "S'inscrire" → navigation vers l'inscription
- Bouton "Se connecter" → navigation vers la connexion
- Mise en page responsive

#### Connexion (`login.tsx`)
- Saisie de l'email avec validation
- Saisie du mot de passe (texte sécurisé)
- Affichage des messages d'erreur pour identifiants invalides
- État de chargement pendant l'authentification
- En cas de succès : décodage du JWT → redirection vers le tableau de bord entreprise ou travailleur selon le rôle
- Jetons stockés de manière sécurisée via `expo-secure-store`

#### Inscription (`register.tsx`)
- Saisie de l'email avec validation
- Saisie du mot de passe avec vérification de longueur minimale
- Champ de confirmation du mot de passe
- **Sélection du rôle** : Deux boutons — "Je suis une Entreprise" / "Je suis un Travailleur"
- En cas de succès : redirection vers `companyCreation` ou `workerCreation` selon le rôle choisi

#### Création profil Entreprise (`companyCreation.tsx`)
- Formulaire complet avec les champs :
  - Nom de l'entreprise, Adresse, Ville, Code postal
  - Numéro SIRET, Numéro de téléphone
  - Type d'établissement, Description
  - Site web, Réseaux sociaux
- Validation des champs requis
- Formulaire défilable responsive
- En cas de succès : redirection vers le tableau de bord entreprise

#### Création profil Travailleur (`workerCreation.tsx`)
- Formulaire complet avec les champs :
  - Prénom, Nom, Date de naissance
  - Ville, Code postal, Numéro de téléphone
  - Profession, Expérience (années)
  - Langues, Compétences, Qualifications
  - URL du CV
- **Sélecteur de photo** avec ActionSheet (caméra ou galerie)
- Validation des champs requis
- En cas de succès : redirection vers le tableau de bord travailleur

---

### Écrans Entreprise (`tabs-company`)

#### Tableau de bord (`dashboard-company.tsx`)
- **Liste de toutes les missions publiées** avec :
  - Titre, badge salaire, dates, horaires
  - Indicateur de statut (OPEN / IN_PROGRESS / COMPLETED / CANCELLED)
  - Point de notification pour les nouvelles candidatures en attente
- Fonctionnalité de rafraîchissement par glissement
- Toucher une mission → navigation vers `job/[id]` pour les détails

#### Créer une mission (`create-job.tsx`)
- Formulaire de publication de mission avec :
  - Saisie du titre
  - Description (multi-lignes)
  - Sélecteurs de date et heure de début
  - Sélecteurs de date et heure de fin
  - Saisie du salaire (€/h)
- Validation des dates avec **dayjs** (la fin doit être après le début)
- Retour de succès et réinitialisation du formulaire

#### Profil Entreprise (`ProfileCompany.tsx`)
- Affichage des informations de l'entreprise :
  - Nom, Adresse, Ville
  - Type d'établissement, Téléphone, SIRET
- **Section statistiques** :
  - Nombre total de missions
  - Note moyenne
  - Ancienneté sur la plateforme
- **Actions** :
  - Voir l'historique des missions (ouvre un modal avec le composant `MissionHistory`)
  - Paramètres
  - Déconnexion (efface les jetons, redirige vers l'accueil)

#### Messages (`Message.tsx`)
- Liste des fils de discussion
- Indicateurs de messages non lus (point bleu)
- Affichage des horodatages
- Identification expéditeur/destinataire

---

### Écrans Travailleur (`tabs-worker`)

#### Tableau de bord (`dashboard-worker.tsx`)
- **Section Missions actives** :
  - Liste défilable horizontalement des missions en cours
  - Chaque carte affiche : titre, date, salaire, entreprise, statut
  - Bordures colorées (jaune = EN ATTENTE, vert = ACCEPTÉE)
  - Toucher → navigation vers `joboffer/[id]`
- **Calendrier de disponibilité** :
  - Composant calendrier interactif (`react-native-calendars`)
  - Localisation française
  - Jours colorés :
    - 🟢 Fond vert = Disponible (libre)
    - 🔴 Fond rouge = Occupé
    - Défaut = Neutre
  - Toucher un jour → cycle entre les trois états via mutation API
  - Légende affichée sous le calendrier

#### Parcourir les missions (`JobWorker.tsx`)
- **Barre de recherche** avec délai de saisie
- **Filtres salaire** (chips) :
  - < 10€/h
  - 10–12€/h
  - 12–15€/h
  - 15–20€/h
  - 20€/h
- **Cartes de missions** affichant :
  - Titre, Nom de l'entreprise
  - Ville & adresse
  - Description (tronquée)
  - Période avec horaires
  - Badge salaire
- Rafraîchissement par glissement
- État vide avec icône quand aucun résultat
- Toucher une mission → navigation vers `job/[id]`

#### Profil Travailleur (`ProfileWorker.tsx`)
- Affichage des informations du travailleur :
  - Nom complet, Profession, Ville
  - Expérience, Langues, Compétences
- **Section statistiques** :
  - Nombre de missions terminées
  - Note moyenne reçue
  - Ancienneté sur la plateforme
- **Actions** :
  - Voir l'historique des missions (modal)
  - Paramètres
  - Déconnexion

---

### Écrans partagés

#### Détail d'une mission (`job/[id].tsx`)
- Informations complètes de la mission :
  - Titre, Description
  - Nom et ville de l'entreprise
  - Dates et horaires de début/fin
  - Salaire
  - Badge de statut
- **Fonctionnalités spécifiques au travailleur** :
  - Bouton "Postuler" si éligible
  - Badge "Déjà postulé" si déjà candidat
  - Option d'annulation de candidature
- **Fonctionnalités spécifiques à l'entreprise** :
  - Bouton "Voir les candidats"
  - Modal avec liste des candidats :
    - Nom, Ville, Téléphone, Profession du travailleur
    - Boutons Accepter / Refuser par candidat

#### Détail d'une candidature (`joboffer/[id].tsx`)
- Informations de la candidature liée à la mission
- Affichage du statut actuel
- **Pour les missions terminées** : Bouton "Laisser un avis"
- **Pour les candidatures actives** : Option d'annulation
- Dates et heures formatées

#### Soumission d'avis (`review/[id].tsx`)
- **Système de notation 5 étoiles** (requis)
  - Sélecteur d'étoiles interactif
  - Libellés d'échelle : Très Mauvais → Mauvais → Moyen → Bien → Excellent
- **Zone de commentaire** (optionnel, max 500 caractères)
  - Compteur de caractères
- Détermination automatique de l'évaluateur/évalué depuis le rôle JWT
- Soumission → crée l'avis via API → retour en arrière

---

## Composants

### `Button.tsx` — Bouton personnalisé
```tsx
<NewButton title="Valider" onPress={handleSubmit} disabled={isLoading} />
```
- Titre et gestionnaire de pression personnalisables
- Support de l'état désactivé
- Fond orange avec texte blanc

### `DefaultCard.tsx` — Carte conteneur
```tsx
<DefaultCard>
  <Text>Contenu dans une carte</Text>
</DefaultCard>
```
- Conteneur bordé avec coins arrondis
- Padding responsive
- Couleurs de fond adaptées au thème

### `Header.tsx` — En-tête
```tsx
<Header />
```
- Affiche le logo Prestau centré
- Dimensionnement responsive

### `InputBar.tsx` — Champ de saisie
```tsx
<InputBar placeholder="Email" value={email} onChangeText={setEmail} secureTextEntry={false} />
```
- Champ de saisie stylisé avec placeholder
- Option texte sécurisé pour les mots de passe
- Support de styles personnalisés

### `MissionHistory.tsx` — Historique des missions
```tsx
<MissionHistory missions={history} />
```
- Affiche les missions terminées/passées :
  - Titre de la mission et badge salaire
  - Nom de l'entreprise ou du travailleur
  - Adresse et période
  - Avis reçu (note + commentaire)
  - Avis envoyé (note + commentaire)
  - Message "Avis en attente" si pas encore soumis
- Cartes pressables → navigation vers le détail de l'offre

### `ThemedText.tsx` — Typographie
```tsx
<ThemedText variant="headline">Titre</ThemedText>
<ThemedText variant="subtitle1">Sous-titre</ThemedText>
<ThemedText variant="body3">Texte corps</ThemedText>
<ThemedText variant="caption">Petit texte</ThemedText>
```
- Variantes : `headline`, `subtitle1`, `subtitle2`, `subtitle3`, `body3`, `caption`
- Couleurs de texte adaptées au thème

---

## Couche API

La couche API se trouve dans `src/api/` et utilise **Axios** avec des intercepteurs.

### Configuration Axios (`axios.ts`)
- URL de base depuis la variable d'environnement `EXPO_PUBLIC_API_URL`
- **Intercepteur de requête** : Injecte automatiquement le jeton JWT depuis SecureStore dans l'en-tête `Authorization: Bearer`
- **Intercepteur de réponse** : Gère les réponses `401` en effaçant les jetons stockés ; journalise les erreurs `400` pour le débogage

### Modules API

#### `auth.ts` — Authentification
| Fonction | Méthode | Endpoint | Description |
|---|---|---|---|
| `register(email, password, role)` | POST | `/auth/register` | Crée le compte, stocke les jetons |
| `login(email, password)` | POST | `/auth/login` | Authentifie, stocke les jetons |
| `logout()` | POST | `/auth/logout` | Invalide le jeton, efface le stockage local |
| `refreshToken()` | POST | `/auth/refresh-token` | Rafraîchit le jeton d'accès |

#### `company.ts` — Entreprise
| Fonction | Méthode | Endpoint | Description |
|---|---|---|---|
| `createCompanyProfile(data)` | POST | `/company` | Crée le profil entreprise |
| `getCompanyProfile()` | GET | `/company/MyCompany` | Récupère le profil entreprise |

#### `worker.ts` — Travailleur
| Fonction | Méthode | Endpoint | Description |
|---|---|---|---|
| `createWorkerProfile(data)` | POST | `/worker` | Crée le profil travailleur |
| `getWorkerProfile()` | GET | `/worker/MyProfile` | Récupère le profil travailleur |
| `getWorkerAvailability()` | GET | `/worker/availability` | Récupère le calendrier |
| `updateWorkerAvailability(date, status)` | PATCH | `/worker/availability` | Met à jour la disponibilité |

#### `job.ts` — Missions
| Fonction | Méthode | Endpoint | Description |
|---|---|---|---|
| `createJob(jobData)` | POST | `/job` | Crée une nouvelle mission |
| `getJobs(search?)` | GET | `/job` | Récupère les missions (recherche optionnelle) |
| `getMyJobs()` | GET | `/job/my-jobs` | Récupère les missions de l'entreprise |
| `getJobById(id)` | GET | `/job/:id` | Récupère les détails d'une mission |

#### `joboffer.ts` — Candidatures
| Fonction | Méthode | Endpoint | Description |
|---|---|---|---|
| `createJobOffer(jobId)` | POST | `/joboffer/:jobId` | Postule à une mission |
| `deleteJobOffer(jobId)` | DELETE | `/joboffer/cancel/:jobId` | Annule une candidature |
| `acceptJobOffer(offerId)` | POST | `/joboffer/:id/accept` | Accepte un candidat |
| `rejectJobOffer(offerId)` | POST | `/joboffer/:id/reject` | Refuse un candidat |
| `completeJobOffer(offerId)` | POST | `/joboffer/:id/complete` | Marque comme terminée |
| `cancelJobOffer(offerId)` | POST | `/joboffer/:id/cancel` | Annule une offre acceptée |
| `getJobOfferById(id)` | GET | `/joboffer/:id` | Récupère les détails d'une offre |
| `getJobOffersByCompany()` | GET | `/joboffer/my-offers` | Récupère les candidatures reçues |
| `getJobOffersByWorker()` | GET | `/joboffer/my-applications` | Récupère les candidatures envoyées |
| `getMissionHistory()` | GET | `/joboffer/history` | Récupère l'historique des missions |

#### `review.ts` — Avis
| Fonction | Méthode | Endpoint | Description |
|---|---|---|---|
| `createReview(payload)` | POST | `/review` | Soumet une note et un commentaire |

---

## Gestion d'état

L'application utilise **React Query** (`@tanstack/react-query` v5) pour la gestion de l'état serveur :

- **QueryClientProvider** enveloppe toute l'application dans `_layout.tsx`
- **Queries** (`useQuery`) : Pour récupérer les données (missions, profils, offres, disponibilité)
- **Mutations** (`useMutation`) : Pour créer/modifier les données (connexion, inscription, création de mission, candidature, etc.)
- **Invalidation du cache** : `queryClient.invalidateQueries()` après les mutations

### État d'authentification
- Jetons JWT stockés dans **Expo SecureStore** (stockage chiffré sur l'appareil)
- Jeton d'accès : clé `accessToken`
- Jeton de rafraîchissement : clé `refreshToken`
- Rôle de l'utilisateur décodé depuis le payload JWT via `jwt-decode`

---

## Système de design

### Palette de couleurs

| Jeton | Valeur | Utilisation |
|---|---|---|
| `background` | `#F5F2D9` | Crème — fonds de page |
| `primary` | `#264D84` | Bleu — en-têtes, boutons, texte |
| `secondary` | `#EE4832` | Orange-rouge — accents, onglets actifs, CTAs |
| `inactive` | `#555` | Gris — icônes d'onglets inactifs |

### Support des thèmes
- Thèmes clair et sombre définis dans `constants/Colors.ts`
- Thème détecté automatiquement via `useColorScheme()`
- Accessible via le hook `useThemeColors()`
- Actuellement les deux thèmes utilisent des valeurs identiques (prêt pour un futur mode sombre)

### Design responsive
- Utilitaire `useResponsive()` personnalisé dans plusieurs écrans
- `scale(size)` : Redimensionne selon la largeur de l'écran (base : 390px)
- `scaleFont(size)` : Redimensionne les polices avec un maximum de 1.4x
- S'adapte aux différentes tailles d'appareils (téléphones, tablettes)

### Variantes typographiques (ThemedText)
| Variante | Taille | Poids | Utilisation |
|---|---|---|---|
| `headline` | 24px | Gras | Titres de page |
| `subtitle1` | 20px | Semi-gras | En-têtes de section |
| `subtitle2` | 18px | Semi-gras | Sous-sections |
| `subtitle3` | 16px | Semi-gras | Titres de carte |
| `body3` | 14px | Normal | Texte courant |
| `caption` | 12px | Normal | Petits textes, libellés |

### Couleurs de statut
| Statut | Couleur | Contexte |
|---|---|---|
| `OPEN` | Vert | Mission disponible |
| `PENDING` | Orange/Jaune | Candidature en attente de réponse |
| `ACCEPTED` | Vert | Candidature acceptée |
| `IN_PROGRESS` | Orange/Jaune | Mission en cours |
| `COMPLETED` | Vert | Mission terminée |
| `REJECTED` | Rouge | Candidature refusée |
| `CANCELLED` | Rouge | Offre/mission annulée |

---

## Fichiers de configuration

### `app.json` — Configuration Expo
- **Nom de l'app** : Prestau
- **Schéma** : `prestau` (deep linking)
- **Orientation** : Portrait uniquement
- **Icône** : `./assets/images/logo-prestau.jpg`
- **Écran de démarrage** : Logo sur fond blanc (mode sombre : fond noir)
- **Android** : Icône adaptative avec fond `#E6F4FE`, edge-to-edge activé
- **iOS** : Support tablette activé
- **Plugins** : `expo-router`, `expo-splash-screen`, `expo-secure-store`
- **Expérimental** : Routes typées activées, React Compiler activé

### `tsconfig.json`
- Étend `expo/tsconfig.base`
- Mode strict activé

### `eslint.config.js`
- Utilise `eslint-config-expo/flat`
- Ignore le dossier `dist/`
