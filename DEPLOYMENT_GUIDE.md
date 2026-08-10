# Advanced Creation Studio — Deployment & Video Generation Guide

## Part 1: Deploy Expo App to Vercel (No Apple Developer / Expo Cloud)

> Full reference, including every trap we hit and how to verify a build:
> **[EXPO-VERCEL-TEMPLATE.md](./EXPO-VERCEL-TEMPLATE.md)**

### How to deploy

The repo is already connected to the Vercel project **`advanced-creation-studio-app`**.

```bash
git push origin main
```

That is the entire deploy process. Vercel rebuilds and updates the production
URL automatically.

**Live URL:** https://advanced-creation-studio-app.vercel.app

### Do not run `vercel --prod` from this folder

An earlier version of this guide said to. Don't. If a project with the name
already exists the CLI creates a *new* one with a random suffix, and this repo
accumulated **nine** Vercel projects for one app that way — several serving
stale builds, which looked exactly like broken deploys. They have since been
deleted; only `advanced-creation-studio-app` (this app) and
`advanced-creation-studio` (the separate HTML marketing site) remain.

### Never bookmark a URL with a hash in it

```
advanced-creation-studio-app.vercel.app          ✅ production, updates on push
advanced-creation-studio-app-v2-live-p7j6852cb…  ❌ one frozen build, never updates
```

Hash URLs serve one specific build permanently. Checking one after a fix will
always show the old version.

### Vercel does not auto-detect Expo

There is no Expo framework preset. The build is driven entirely by `vercel.json`:

```json
{
  "buildCommand": "npx expo export --platform web",
  "outputDirectory": "dist"
}
```

Framework Preset in the dashboard must stay on **"Other"** — see
`scripts/generate_vercel_config.py`, which enforces this.

### Verify before pushing

```bash
rm -rf dist && npx expo export --platform web
grep -c "reset-project\|Try editing" dist/index.html   # must be 0
npx serve dist -l 4173
```

### Environment Variables
Vercel dashboard → Settings → Environment Variables.

---

## Part 2: Generate 45-60 Second Video (Google Generative AI Pro Tier)

### Setup

**1. Install Google Generative AI SDK**
```bash
cd ~/Desktop/advanced-creation-studio
npm install @google/generative-ai
```

**2. Get Google API Key**
- Go to https://aistudio.google.com/app/apikey
- Create new API key
- Copy it

**3. Set environment variable**
```bash
export GOOGLE_API_KEY="your-api-key-here"
```

Or add to `.env`:
```
GOOGLE_API_KEY=your-api-key-here
```

### Generate Video Scripts

```bash
# Generate professional video script + 3 alternative concepts
node video-generator.js
```

**Output files:**
- `video-script-pro.json` — Main 45-60 second promotional script
- `video-concepts.json` — 3 alternative creative directions

### What You Get

**Main Video Script includes:**
- Scene-by-scene breakdown (10-15 scenes @ 4 sec each)
- Voiceover script (professional tone)
- Music & sound design notes
- Color palette application per scene
- Text overlays with precise timing
- Call-to-action (contact form / website)
- Technical specs (resolution, frame rate, aspect ratio)
- Production tips for creation

**3 Alternative Concepts:**
1. **Impact-Focused** — Real reentry stories, outcome data
2. **Brand Authority** — Clean design, credibility, process
3. **Explainer Style** — Animated walkthrough, how to partner

### Production Next Steps

**Option A: Hire Agency**
- Share `video-script-pro.json` with your video producer
- They follow the scene breakdown, voiceover, and timing
- Turnaround: 2-4 weeks, $3k-10k depending on quality

**Option B: DIY / Stock Footage**
- Use scripts to guide stock footage selection (Pexels, Unsplash, Videvo)
- Record voiceover yourself (GarageBand or Audacity)
- Edit in DaVinci Resolve (free) or Adobe Premiere
- Music: Epidemic Sound, Artlist, or royalty-free sources

**Option C: AI Video Generation**
- Use Runway ML, Synthesia, or D-ID for AI avatar voiceover
- Combine with stock footage following the script
- Edit together in Adobe Premiere or Final Cut Pro

---

## Part 3: Integrate Video into Website

### Option 1: Hero Video (Homepage)
Add to `../advancedcreationstudio/index.html` hero section:

```html
<section class="hero">
  <video autoplay muted loop style="position:absolute;width:100%;height:100%;object-fit:cover;opacity:0.3;z-index:0;">
    <source src="https://advanced-creation-studio.s3.amazonaws.com/promo.mp4" type="video/mp4">
  </video>
  <!-- rest of hero content -->
</section>
```

### Option 2: Embedded on Services Page
```html
<section class="section">
  <div class="container">
    <h2>See Us In Action</h2>
    <iframe 
      width="100%" 
      height="600" 
      src="https://www.youtube.com/embed/VIDEO_ID" 
      frameborder="0" 
      allowfullscreen>
    </iframe>
  </div>
</section>
```

### Option 3: Upload to YouTube
1. Upload final video to YouTube (unlisted or public)
2. Get video ID from URL
3. Embed using iframe code above
4. Add to your website or social media

---

## Deployment Checklist

- [ ] Expo app deployed to Vercel
- [ ] Video script generated (video-script-pro.json)
- [ ] 3 concepts reviewed (video-concepts.json)
- [ ] Video production scheduled (agency, DIY, or AI)
- [ ] Voiceover recorded
- [ ] Video edited and exported (MP4, 1080p)
- [ ] Video uploaded to YouTube or S3
- [ ] Embedded in advancedcreationstudio.com
- [ ] Tested on mobile + desktop
- [ ] Analytics configured (Google Analytics, Heap)

---

## Quick Reference

| Task | Command | Time |
|---|---|---|
| Deploy to Vercel | `git push origin main` | 2 min |
| Audit Vercel projects | `vercel project ls` | 10 sec |
| Generate video scripts | `node video-generator.js` | 1 min |
| Record voiceover | DIY or hire | 15 min - 1 week |
| Edit video | DaVinci, Adobe, or Synthesia | 2-8 hours |
| Upload & embed | YouTube embed or S3 + iframe | 15 min |

---

## Troubleshooting

**Vercel deployment fails?**
- Check Node version: `node --version` (should be 18+)
- Clear cache: `rm -rf node_modules && npm install`
- Check logs: `vercel logs` in dashboard

**Site shows the Expo starter page ("Welcome to Expo")?**
Work through these in order — it is almost never the build:
1. Are you on a **hash URL**? Those never update. Use the no-hash production URL.
2. **Hard reload** / incognito. Static exports cache aggressively.
3. `vercel project ls` — is more than one project serving this app?
4. Only then check the build: `rm -rf dist && npx expo export --platform web`
   and `grep -c "reset-project" dist/index.html` (must be 0). If that is 0
   locally, the repo is fine and the problem is which URL you are looking at.

**Video generation API key error?**
- Confirm key is set: `echo $GOOGLE_API_KEY`
- Check key is active at https://aistudio.google.com/app/apikey
- Regenerate if needed

**Video too large for web?**
- Compress: `ffmpeg -i video.mp4 -vf scale=1920:-1 -b:v 2000k output.mp4`
- Target: 2-5MB for web

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Expo Web:** https://docs.expo.dev/discover/overview/
- **Google Generative AI:** https://ai.google.dev
- **Video Production:** DaVinci Resolve docs, Adobe Premiere tutorials
