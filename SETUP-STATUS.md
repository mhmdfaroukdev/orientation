# Orientation setup status

## Completed

- Frontend registration website copied to this public repository.
- Google Apps Script backend copied and configured.
- Deployed Apps Script Web App URL is configured in `app.js`.
- Google Sheet ID is configured in `apps-script/Code.gs`.
- `SITE_URL` is set to `https://mhmdwaelanwr.github.io/orientation/`.
- Duplicate-email prevention is enabled.
- Unique registration IDs are enabled.
- Confirmation emails, bulk invites and reminders are implemented.
- GitHub Pages workflow is included.

## Google Sheet

https://docs.google.com/spreadsheets/d/1IHgJEORmoeclWXh0Dz077PNbunAJqihbXMpv3fZ-ssM/edit

## Apps Script Web App

https://script.google.com/macros/s/AKfycbyGoQdR5xgepqns7HpyWoHjfJr4cDEMWaBFHoSzUo3uAFgjrrGZvWUKW2TvPLjIWCdy/exec

## Pending event information

- date
- time
- exact location

Update those values in both `app.js` and `apps-script/Code.gs` when confirmed.

## Deployment checklist

- [ ] Apps Script Web App deployed with **Who has access: Anyone**.
      With any restricted access setting the `/exec` endpoint answers with
      `302 -> accounts.google.com/ServiceLogin` (GET) and `401 Unauthorized` (POST),
      so every site registration fails before reaching the sheet.
- [ ] New Apps Script deployment copied into `CONFIG.appsScriptUrl` in `app.js`
      and the form `action` in `index.html` (they must match).
- [ ] GitHub Pages enabled for this repository
      (`https://mhmdfaroukdev.github.io/orientation/` currently returns 404).
