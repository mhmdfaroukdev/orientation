# Claude Builder Club – AOU Egypt Orientation

Orientation registration website for Claude Builder Club – AOU Egypt.

## Live site

https://mhmdwaelanwr.github.io/orientation/

## Included

- Responsive orientation landing page
- Registration form
- Google Apps Script backend
- Google Sheets storage
- Duplicate email prevention
- Unique registration IDs
- Automatic confirmation emails
- Bulk invitation and reminder functions
- GitHub Pages deployment workflow

## Backend

The frontend is connected to the deployed Google Apps Script Web App in `app.js`.

Registration data is written to the configured `Registrations` Google Sheet by `apps-script/Code.gs`.

## Event details

Date, time, and exact venue are currently marked as `To be announced`. Update both `app.js` and `apps-script/Code.gs` when the schedule is confirmed.

## Files

- `index.html` — site structure
- `styles.css` — responsive styling
- `app.js` — form validation and submission
- `apps-script/Code.gs` — registration, Sheets and email backend
- `apps-script/Tools.gs` — backend test helpers
- `apps-script/appsscript.json` — Apps Script manifest
- `.github/workflows/pages.yml` — GitHub Pages deployment

## Privacy

Do not commit passwords, Google credentials, private tokens, or other secrets. The public website only contains the deployed Apps Script endpoint required for form submission.
