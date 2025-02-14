
# LeeonQuiz – Dokumentation & Projektübersicht
*Stand: Januar 2025*

**URL**: https://lovable.dev/projects/3d4910f1-59fa-43ad-b499-6a55817ff9a7

## Inhaltsverzeichnis
1. [Einleitung und Projektübersicht](#1-einleitung-und-projektübersicht)
2. [Technologische Grundlagen](#2-technologische-grundlagen)
3. [Systemarchitektur und Seitenstruktur](#3-systemarchitektur-und-seitenstruktur)
4. [Funktionen und Features im Detail](#4-funktionen-und-features-im-detail)
5. [Gamification und Belohnungssystem](#5-gamification-und-belohnungssystem)
6. [Prüfungsmodus und Zertifizierungen](#6-prüfungsmodus-und-zertifizierungen)
7. [Entwicklungsumgebung und Tools](#7-entwicklungsumgebung-und-tools)
8. [Offene Fragen und Ausblick](#8-offene-fragen-und-ausblick)
9. [Fazit](#9-fazit)

## 1. Einleitung und Projektübersicht
LeeonQuiz (intern auch „Leeon's Quest" genannt) ist eine Webanwendung zur spielerischen Wissensvermittlung mit einem klaren Fokus auf professionelle Prüfungsfunktionen.

### Zielgruppen
- Teilnehmende von A-Leecon-Schulungen
- Interne Mitarbeitende von A-Leecon
- Externe Unternehmen oder Partner, die ihre Prüfungen und Zertifizierungen über eine flexible und sichere Plattform abwickeln möchten

### Besonderheit
Die Lernphase (KI-gestützte Fragegenerierung, Lernkarten, Gamification) wird nahtlos mit dem Prüfungsmodus (Zeitlimits, Proctoring, Zertifikatsdownload) verknüpft.

### Ziele
1. **Professionelles Prüfungssystem**: Verlässliche, sichere und flexible Prüfungsoptionen, die offizielle Zertifizierungen ermöglichen
2. **Effektives Lerninstrument**: Kombination aus spielerischen Lernquizzes, automatischer Fragegenerierung und motivierendem Belohnungssystem
3. **Zentrale Content-Anbindung**: Integration bereits existierender Kursskripte und Fragensets aus der Leecon ContentDB

### Besondere Merkmale
- KI-gestützte Fragegenerierung (OpenAI) aus PDF-/Textquellen der ContentDB
- Gamification (Coins, Abzeichen, Leaderboards) zur Motivation
- Sicherer Prüfungsmodus (Proctoring, Zeitlimit, Plagiatschutz)
- Mobile-Optimierung (geplant in Phase 2)

## 2. Technologische Grundlagen

### 2.1 Technologien
#### Frontend
- React (entwickelt in Replit): Komponentengerüst, schnelle Iteration, Hot Reload
- Tailwind CSS: Flexibles, einheitliches Styling

#### Backend / Cloud-Services
- Firebase (Auth, Firestore, ggf. Storage, Cloud Functions): Zentrale Datenhaltung (NoSQL), Authentifizierung, serverseitige Funktionen
- Node.js (falls benötigt): Server- oder Cloud Functions (OpenAI-Integration, verifizierte Prüfungslogik)

#### KI-Integration
- OpenAI-APIs: Fragegenerierung, Textanalyse

### 2.2 Nutzung von Firebase
1. Authentifizierung (Email/Passwort, OAuth)
2. Firestore (NoSQL-Datenbank) für Fragen, Prüfungen, Lernkarten, Nutzerfortschritt
3. Storage (optional) für Uploads
4. Cloud Functions für Backend-Logik

### 2.3 Marktanalyse existierender Online-Prüfungstools
1. CertiProf: Bekannte Marke, teils unflexibel, wenig KI-Fokus
2. Pearson VUE: Hohe Sicherheit, starre Vorgaben, teuer
3. ProProfs / exam.net: Einfache Bedienung, jedoch begrenzte Skalierbarkeit

## 3. Systemarchitektur und Seitenstruktur

### 3.1 Rollen und Zugriffsrechte
- **Teilnehmer**: Zugriff auf Startseite, Dashboard, Quiz/Lernkarten, Leaderboards, Zertifizierungsmodus, Avatare, Shop
- **Administrator**: Zugriff auf Admin-Dashboard (Kurs-/Fragenverwaltung, Prüfungsmanagement, Statistiken, Rollenverwaltung)

### 3.2 Hauptseiten und Features
- Öffentliche Bereiche (Startseite, Footer-Links)
- Geschützter Bereich (nach Login)
- Admin-Bereich (separate Navigation)

## 4. Funktionen und Features im Detail

### 4.1 Kernfunktionen
1. **Automatische Fragegenerierung (KI)**
   - Aus PDFs / Text der ContentDB
   - Anpassung nach Schwierigkeitsstufen
2. **Lernkarten**
   - Manuelle oder KI-gestützte Erstellung
   - Personalisierte Wiederholung
3. **Gamification**
   - Coins (Belohnung für richtige Antworten)
   - Abzeichen (Kronen) für Meilensteine
   - Leaderboards (Woche / Gesamt)
4. **Anpassbare Sessions**
   - Themenwahl, Fragenanzahl, Zeitlimit
   - Zwischenspeicherung im Firestore
5. **Quizfragenformate**
   - Multiple-Choice, Richtig/Falsch
   - Optional: Lückentext, Zuordnung, offene Fragen

### 4.2 Erweiterte oder zukünftige Funktionen
1. Live Games (Phase 2)
2. Avatares (Phase 2)
3. Mobile-Optimierung (Phase 2)

## 5. Gamification und Belohnungssystem
[... keep existing code (existing gamification section)]

## 6. Prüfungsmodus und Zertifizierungen

### Professionelle Prüfungen für offizielle Zertifizierungen
- Zeitlimit: je Prüfung konfigurierbar
- Zufällige Fragen: aus großen Pools
- Ergebnismanagement: (Teil-)automatische Auswertung
- Proctoring-Optionen: Lockdown-Browser, Webcam, Logs
- Zertifikatsdownload: nach bestandener Prüfung

### 6.1 Schlüsselanforderungen
1. Hohe Sicherheit
2. Skalierbarkeit
3. Proctoring
4. Flexible Gestaltung
5. Analyse & Reporting
6. Benutzerfreundlichkeit
7. Datenschutz & Compliance

## 7. Entwicklungsumgebung und Tools

### 7.1 Projektkonfiguration
- package.json: Abhängigkeiten und Scripts
- tailwind.config.js: Projektweite Styles
- postcss.config.js: CSS-Optimierung
- .env: API-Keys und Secrets

### 7.2 Einsatz von GitHub & Replit
- GitHub: Privates Repository, Versionierung
- Replit: Online-Dev-Tool, Kollaboration

## 8. Offene Fragen und Ausblick
1. Proctoring: UI/UX für Live-Überwachung
2. Integrationen: SSO, Payment-Lösungen
3. Zertifizierungs-Akkreditierung

## 9. Fazit
LeeonQuiz kombiniert moderne Webentwicklung mit React & Tailwind, effiziente Entwicklung in Replit, zuverlässige Cloud-Infrastruktur und KI-Features zu einer ganzheitlichen Lösung für spielerisches Lernen und professionelle Prüfungen.

## How To Use This Project

[... keep existing code (how to use section)]
