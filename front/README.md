# Concert Finder

Aplikacja internetowa, która umożliwia użytkownikom wyszukiwanie koncertów, przeglądanie szczegółów wydarzeń oraz dodawanie ich do swojego Kalendarza Google. Aplikacja integruje się z Spotify API w celu pobierania zdjęć artystów oraz Ticketmaster API w celu uzyskania informacji o koncertach. Używa również Supabase do autoryzacji użytkowników za pomocą konta Google.

## Funkcje

- **Wyszukiwanie koncertów po artyście**: Użytkownicy mogą wyszukiwać koncerty po nazwie artysty.
- **Podgląd szczegółów koncertu**: Wyświetla nazwę koncertu, datę, godzinę, miejsce i informacje o cenach.
- **Zdjęcia artystów**: Wyświetla zdjęcia artystów pobrane z API Spotify.
- **Dodaj do Kalendarza Google**: Użytkownicy, którzy są zalogowani, mogą dodać koncerty do swojego Kalendarza Google.
- **Logowanie przez Google**: Użytkownicy mogą zalogować się za pomocą konta Google, aby uzyskać dodatkowe funkcje.

## Stos technologiczny

- **Frontend**: React, Tailwind CSS
- **Autoryzacja**: Supabase (Google OAuth)

### API:
- **Ticketmaster API** (informacje o koncertach)
- **Spotify API** (zdjęcia artystów)
- **Google Calendar API** (dodawanie wydarzeń do kalendarza)

- **Zarządzanie stanem**: React Hooks (`useState`, `useEffect`)

## Wymagania

- **Node.js** (wersja 16 lub wyższa)

## Instalacja

npm install

npm run dev

## Użycie
Zaloguj się za pomocą Google, klikając przycisk "Zaloguj się przez Google".
Użyj paska wyszukiwania, aby znaleźć koncerty po nazwie artysty.
Przeglądaj szczegóły koncertów, w tym zdjęcia artystów i informacje o miejscach.
Dodaj koncerty do swojego Kalendarza Google, klikając "Add to calendar" (dostępne tylko dla zalogowanych użytkowników).


## Klucze API
Aby używać aplikacji musisz uzyskać klucze API do Ticketmaster, Spotify oraz Supabase

- https://developer.ticketmaster.com/products-and-docs/apis/getting-started/
- https://developer.spotify.com/
- https://supabase.com/docs/guides/getting-started
