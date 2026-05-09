# CompIntel — Compensation Intelligence System

Level-standardized salary data for India → Global tech. Built for Track C.

---

## Running Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API key
Edit `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...your key here...
```
Get one free at https://console.anthropic.com

### 3. Start the dev server
```bash
npm run dev
```
Open http://localhost:3000

---

## Deploying to Vercel (free, 2 minutes)

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
# Follow prompts, then:
vercel env add ANTHROPIC_API_KEY
# paste your key when asked
vercel --prod
```

### Option B — Vercel Dashboard (easiest)
1. Push this folder to GitHub:
   ```bash
   git init
   git add .
   git commit -m "init"
   # create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/compintel.git
   git push -u origin main
   ```
2. Go to https://vercel.com → "Add New Project" → import your repo
3. In Environment Variables add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from console.anthropic.com
4. Click Deploy → get your live URL

---

## Project Structure
```
compintel/
├── app/
│   ├── globals.css       # All styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main app (all 5 pages)
│   └── api/
│       └── insight/
│           └── route.ts  # AI comparison endpoint
├── lib/
│   └── data.ts           # Seed data, types, utilities
├── .env.local            # Your API key (never commit this)
└── package.json
```

---

## What's Built
- **Home** — positioning, stats, quick nav
- **Salary Table** — filter/sort by company, role, level, location; select 2 to compare
- **Companies** — median TC, avg, max, level distribution, role breakdown
- **Compare** — side-by-side base/bonus/stock/TC with AI insight via Claude API
- **Submit** — validated form, company normalization, duplicate detection, TC preview

## Edge Cases Handled
- Company normalization: "Google", " google ", "GOOGLE" → "google"
- Missing bonus/stock → 0 (never null)
- Duplicate entry detection
- Invalid/missing required fields → clear error messages
- Empty filter results → empty state
- Sort by any column, asc/desc
