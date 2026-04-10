test_front_page
===============

NY Tech + AI Jobs Matcher (static web app)

## What it does
- Matches candidates to NY tech/AI companies.
- Scores fit using:
  - living preference
  - budget/salary preference
  - in-office preference
  - years of experience
- Includes a public job board section with:
  - seeded Brooklyn startup jobs from specific public job postings (not generic careers pages)
  - a submission form so users can add jobs publicly (stored in browser localStorage)
- Includes simple email login capture for Career Insights / Reach-out Insights access (stored in browser localStorage).

## Run locally
Open `johnnywu_frontpage.html` in your browser.

## Weekly job check script
- Seed file: `data/brooklyn_startup_jobs_seed.json`
- Script: `scripts/weekly_job_check.mjs`
- Run manually:
  - `node scripts/weekly_job_check.mjs`
- Validation expectation:
  - URLs should point to specific job listings (e.g. `/jobs/<id>`, not `/careers`)
- Output report:
  - `data/weekly_job_report.json`

### Example weekly cron (every Monday at 9:00 AM)
```bash
0 9 * * 1 cd /workspace/Homepage && /usr/bin/node scripts/weekly_job_check.mjs
```
