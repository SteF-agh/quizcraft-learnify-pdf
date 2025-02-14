
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3d4910f1-59fa-43ad-b499-6a55817ff9a7

## Belohnungssystem und Fortschrittsanzeige für LeeonQuiz
*Status: Januar 2025*

### Systematische Aufteilung

#### Punkte
- **Zweck**: Bewertung der Fragegewichtung und Darstellung der Leistung.
- **Vergabe**: 
  - Leichte Fragen: 1 Punkt
  - Mittlere Fragen: 2 Punkte
  - Schwere Fragen: 3 Punkte
- **Verwendung**: 
  - Punkte fließen in die persönliche Statistik und das Leaderboard ein
  - Keine direkte Verbindung zu Coins oder Abzeichen

#### Coins
- **Zweck**: Virtuelle Währung zur Freischaltung von Anpassungen
- **Vergabe**: 
  - Leichte Fragen: 1 Coin
  - Mittlere Fragen: 2 Coins
  - Schwere Fragen: 3 Coins
  - Kapitel abgeschlossen: 10 Coins
  - Kurs abgeschlossen: 50 Coins
- **Verwendung**: 
  - Freischaltung von Avataren und deren Anpassungen
  - Personalisierung des Spielerprofils
- **Visualisierung**: 
  - Coins werden im Dashboard und Leaderboard prominent angezeigt

#### Fortschrittsbalken
- **Zweck**: Darstellung des prozentualen Fortschritts
- **Anzeigen**: 
  - Zentraler Fortschrittsbalken für den gesamten Kurs: Zeigt den Prozentsatz aller beantworteten Fragen
  - Kapitel-Fortschrittsanzeigen: Zeigen den Fortschritt pro Kapitel
- **Berechnung**: 
  - Fortschritt = (Beantwortete Fragen / Gesamte Fragen) × 100%
- **Unabhängigkeit**: 
  - Der Fortschrittsbalken ist nicht an Punkte oder Coins gekoppelt

#### Abzeichen (Kronen)
- **Zweck**: Anerkennung von Meilensteinen
- **Vergabe**: 
  - Bronze-Krone: 50 richtig beantwortete Fragen
  - Silber-Krone: 100 richtig beantwortete Fragen
  - Gold-Krone: 200 richtig beantwortete Fragen
  - Königskrone: 1000 Punkte erreicht
- **Visualisierung**: 
  - Abzeichen werden prominent im Dashboard und Leaderboard dargestellt

### Zusammenfassung der Funktionen
1. Unabhängige Belohnungssysteme: Punkte, Coins und Fortschrittsbalken sind klar voneinander getrennt
2. Flexibilität: Coins können individuell eingesetzt werden, während Punkte und Fortschrittsbalken die Leistung widerspiegeln
3. Motivation: Abzeichen und Coins schaffen langfristige Anreize, Kurse abzuschließen und sich zu verbessern
4. Einfache Visualisierung: Fortschrittsbalken, Abzeichen und Coins sind leicht nachvollziehbar

### Navigation und Darstellung
- **Dashboard**: 
  - Fortschrittsbalken für aktuelle Kurse und Kapitel
  - Anzeige der gesammelten Coins und Abzeichen
  - Punkteübersicht pro Kurs und insgesamt
- **Leaderboards**: 
  - Vergleich der Coins mit anderen Teilnehmern
  - Darstellung der freigeschalteten Abzeichen
- **Startseite**: 
  - Kurzübersicht der Coins und Abzeichen zur Motivation

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3d4910f1-59fa-43ad-b499-6a55817ff9a7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3d4910f1-59fa-43ad-b499-6a55817ff9a7) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
