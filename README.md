# Responsive Internship Board

An accessible internship listing page built with plain HTML, CSS and JavaScript (no framework).

**Live preview:** https://amaandayer.github.io/internship-board/

## Features
- Reusable internship card rendered from `internships.json`
- Search by title, company or skill
- Domain filter
- Empty state ("No internships match your search") and error state (data fails to load)
- Keyboard navigation: skip link, visible focus outlines, focusable cards
- Labelled form fields, `aria-live` status messages, semantic HTML
- Responsive layout: 1 column (mobile), 2 columns (tablet, 600px+), 3 columns (desktop, 1000px+)

## Run locally
`fetch` does not work from `file://`, so use a local server:

```
python -m http.server 8000
```
Then open http://localhost:8000

## Screenshots
| Mobile | Tablet | Desktop |
|---|---|---|
| ![Mobile](screenshots/mobile.png) | ![Tablet](screenshots/tablet.png) | ![Desktop](screenshots/desktop.png) |

## Replace the sample data
The included `internships.json` is sample data. If your task gives you a seed file, replace it and adjust field names in `script.js` (`createCard`) if they differ.
