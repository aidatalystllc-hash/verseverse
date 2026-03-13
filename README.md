# VerseVerse ✨

> Your magical, rainbow-themed AI poem generator — powered by Claude.

VerseVerse lets you fill in creative prompts (theme, tone, length, rhythm style, rhyme scheme) and Claude AI writes a beautiful, personalized poem. Iterate on it, then download a gorgeous keepsake-quality PDF.

---

## Features

- 🌈 **Rainbow pastel UI** with floating animals and sparkle animations
- 🤖 **Claude AI** (claude-sonnet-4-20250514) generates emotionally resonant, structured poems
- ✏️ **Iterative refinement** — tweak up to 5 times with feedback
- 📜 **Version history** — switch between previous drafts
- 📄 **Beautiful PDF export** — keepsake-quality with ornamental borders and flourishes
- 🎲 **Surprise Me!** — auto-fills all form fields with fun random combos
- 📋 **Copy to clipboard** — one-click copy with confirmation
- 🌙 **Dark/light theme toggle** — soft dark mode with glowing pastels

---

## Local Setup

### 1. Clone & install

```bash
git clone <your-repo-url>
cd verseverse
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at: https://console.anthropic.com

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the VerseVerse welcome screen.

---

## Project Structure

```
verseverse/
├── app/
│   ├── layout.tsx              # Global fonts, metadata
│   ├── page.tsx                # Welcome screen (/)
│   ├── create/page.tsx         # Poem input form (/create)
│   ├── poem/page.tsx           # Poem display + iteration (/poem)
│   └── api/
│       ├── generate-poem/route.ts    # POST /api/generate-poem
│       └── regenerate-poem/route.ts  # POST /api/regenerate-poem
├── components/
│   ├── AnimalFloat.tsx         # Floating animal decorations
│   ├── SparkleButton.tsx       # Animated CTA button
│   ├── PoemCard.tsx            # Styled poem display card
│   ├── TweakPanel.tsx          # Refinement UI with suggestions
│   ├── VersionHistory.tsx      # Previous poem versions list
│   ├── ThemeToggle.tsx         # Dark/light mode toggle
│   └── LoadingMuse.tsx         # Loading animation
├── lib/
│   └── generatePDF.ts          # All PDF generation logic (jsPDF)
├── .env.local                  # API key (gitignored)
├── .env.example                # Template for env vars
└── README.md
```

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial VerseVerse project"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**
2. Import your GitHub repository
3. Vercel will auto-detect Next.js — no build config changes needed

### 3. Add environment variable

In your Vercel project dashboard:
1. Go to **Settings → Environment Variables**
2. Add: `ANTHROPIC_API_KEY` = `sk-ant-your-key-here`
3. Select all environments (Production, Preview, Development)

### 4. Deploy

Click **Deploy**. Your app will be live in ~60 seconds.

---

## Screenshots

_Add screenshots here after deploying_

| Welcome Screen | Create Form | Poem Display | PDF Export |
|---|---|---|---|
| `<screenshot>` | `<screenshot>` | `<screenshot>` | `<screenshot>` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API |
| PDF | jsPDF |
| Fonts | Google Fonts (Pacifico, Nunito, Lora) |
| Deploy | Vercel |

---

## License

MIT — use it, remix it, share it. Made with 🌸 and Claude AI.
