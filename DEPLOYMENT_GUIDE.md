# Advanced Creation Studio — Deployment & Video Generation Guide

## Part 1: Deploy Expo App to Vercel (No Apple Developer / Expo Cloud)

### Quick Start (2-3 minutes)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login
# (Opens browser, authenticate with GitHub)

# 3. Deploy from project root
cd ~/Desktop/advanced-creation-studio
vercel --prod
```

Your app will be live at `advanced-creation-studio.vercel.app` (or a custom domain if you configure it).

### What Happens
- Vercel detects the Expo app
- Builds web version automatically (`expo export --platform web`)
- Deploys to Vercel's CDN (60+ regions worldwide)
- HTTPS by default
- Free tier includes unlimited deployments

### Custom Domain (optional)
After first deployment:
```bash
vercel alias set <deployment-url> www.advancedcreationstudio-app.com
```

### Environment Variables (if needed)
In Vercel dashboard → Settings → Environment Variables, add any `.env` vars your app needs.

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
| Deploy to Vercel | `vercel --prod` | 2 min |
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
