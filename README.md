# den-of-thieves-trackers

Trackers for the Den of Thieves Clash of Clans clan.

Live site: https://kingtrentz.github.io/den-of-thieves-trackers/

This README is the knowledge doc for the repo: what the site does, how the data updates, how it deploys, and known issues. It describes the repo as of Nov 25, 2026. This repo holds only the published pages; the scripts that build them run on the host PC and are not in here. Anything about those scripts comes from the owner's AI Brain notes, not from code in this repo, and is marked *(from notes)*. Anything else not read directly from the files is marked *(inferred)*.

## What the site does
| Page | Tab | What's on it |
|---|---|---|
| `index.html` | Current War | Current war, path to victory, scouting report, suggested lineup, who's in and on the bubble, MVP leaderboard, war log |
| `cwl.html` | CWL Tracker | Clan War League: battle day, rounds, standings, path to promotion, still to attack, clan leaderboard |
| `history.html` | The Den | Clan-wide stats: MVP leaderboard, 3★ streaks, recent form, who's in and on the bubble, clan capital raid totals, donations (top givers and moochers) |
| `leader.html` | 🔒 | Leaders only: promote, demote, watch and kick suggestions, with "how it decides". The page's data is encrypted in the file and only opens with the leaders' passphrase (browser crypto: PBKDF2 key, then decrypt) |
| `current.html` | none | Redirects to `index.html` (old link) |

Details worth knowing:
- Each page carries its data inline as `const SNAPSHOT = {...}`, with `updated` (CT text) and `updatedISO` stamps.
- **Open pages refresh themselves:** every 2 minutes (and when the tab comes back into view) the page re-downloads itself and re-renders if `updatedISO` changed.
- **Status banner:** each page reads a `status` block in the snapshot and explains problems in plain words:
  - Clash API down for maintenance, API key rejected because the host's internet IP changed, or access refused (check the key and clan tag).
  - Clash API too slow or unreachable on the last update, with which pull failed (CWL or War stats). Says it retries every 10 minutes.
  - Data older than 25 minutes: checks GitHub for a newer copy and githubstatus.com for Pages or Actions problems, to tell a GitHub problem from the host PC having stopped.

## App features (installable web app)
- `manifest.webmanifest` and `sw.js` make the site installable to the Home Screen.
- **Service worker (`sw.js`, cache `dot-shell-v1`):** network first, so pages are always fresh when online, with the last copy as an offline fallback.

## How the data updates
- **Data source:** the official Clash of Clans API for clan #2RCY90GY0 *(from notes; the status banner in the pages confirms the Clash API and an IP-locked key)*.
- **Host:** Python scripts on the owner's always-on Windows PC, run by Windows Task Scheduler every 10 minutes *(from notes; matches the commit history: an "Update <date> <time>" commit every 10 minutes)*.
- **Each run** pulls the API, builds the five pages with the data embedded, and uploads the changed files to this repo through the GitHub API with the owner's token *(from notes)*. Commits show as "Update Nov 24 18:45" style messages.
- **Discord:** a webhook bot named Ops Bot posts to the clan's Discord channel (reminders, recaps, CWL standings) *(from notes)*.
- **Monitoring:** healthchecks.io emails the owner if runs stop *(from notes)*.
- `raw-archive/` is listed in `.gitignore`: raw data kept locally on the host and never published.
- Secrets (Clash API key, GitHub token, webhook URL) live in local files on the host PC, never in this repo *(from notes)*.

## Deploying
- GitHub Pages deploys straight from the `main` branch (GitHub's own "pages build and deployment" run after each commit). `.nojekyll` turns off Jekyll.
- **Do not hand-edit the HTML pages in this repo.** The host overwrites them every 10 minutes. Page changes go into the templates and scripts on the host PC *(inferred from how the pages are generated)*.
- Docs like this README are not generated, so they can be edited here *(inferred: the uploader only sends the files it builds)*.

## Known issues
- The build scripts and templates aren't in this repo, so they can't be reviewed or recovered from GitHub. If the host PC's folder is lost, the generator goes with it *(inferred)*.
- If the home internet IP changes, the Clash API key stops working and a new key has to be made; the site shows a banner until then.
- If the host PC is off or asleep, updates stop; the pages say so after 25 minutes and healthchecks.io emails the owner.
- Any private clan analysis stays off this public site.
