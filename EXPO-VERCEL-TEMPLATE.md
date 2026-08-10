# Expo Router → Vercel: working deploy template

Portable checklist for shipping an Expo app as a static site on Vercel.
Verified end to end on this repo — Expo SDK 57, expo-router 57, React Native
0.86, React 19.2 — in August 2026. Copy this file into the next project.

---

## 1. The two config files

**`vercel.json`** (repo root):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npx expo export --platform web",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false
}
```

**`app.json`** must have static web output:

```json
"web": {
  "output": "static",
  "favicon": "./assets/images/favicon.png"
}
```

That is the whole deploy configuration. No build script in `package.json` is
needed, and no Vercel framework preset.

---

## 2. The traps

These each cost real debugging time. In rough order of how long they hide:

### Your app code may not be in the app at all

The single biggest one. If the project was scaffolded with `create-expo-app`
and the real UI came from somewhere else — an Expo Snack export, a zip, another
repo — then `app/index.tsx` is still the **starter template**, and that is what
deploys. The site renders "Welcome to Expo" and everything looks broken, but the
build is perfectly healthy; it is faithfully serving boilerplate.

Snack exports in particular are structured differently: a single `App.js` with
`registerRootComponent(App)` in `index.js`. An expo-router project uses
`"main": "expo-router/entry"` and file routing, so it will never load that
`App.js`. Drop the file into `src/`, then re-export it:

```tsx
// src/app/index.tsx
export { default } from '@/your-app-module';
```

Delete the starter routes too (`explore.tsx` and friends) — otherwise they stay
publicly reachable at `/explore`.

### `"framework": "expo"` is not a valid Vercel value

Remove the `framework` key entirely. `buildCommand` + `outputDirectory` is
sufficient and unambiguous.

### A build command referencing a script that doesn't exist

`"expo export --platform web && npm run build"` fails when `package.json` has no
`build` script. Check the script exists before chaining it.

### `preventAutoHideAsync()` without a matching `hideAsync()` hangs the splash

The Expo starter calls `SplashScreen.preventAutoHideAsync()` in the root layout
and calls `hideAsync()` from inside its animated splash overlay component. Delete
the overlay while keeping the prevent call and the splash screen never
disappears. Remove both together.

### `Stack.Screen`'s `title` does not set the HTML `<title>`

It only drives the native header. A static export will ship
`<title data-rh="true"></title>` — an empty browser tab. Use `expo-router/head`:

```tsx
import Head from 'expo-router/head';

<Head>
  <title>Your Site</title>
  <meta name="description" content="…" />
</Head>
```

### Importing a plain `.js` module from `.tsx` under `strict`

Set `"allowJs": true` in `tsconfig.json` → `compilerOptions`. This lets TS
resolve the import without type-checking the JS body, so you avoid a flood of
implicit-`any` errors on untyped code.

---

## 3. Verify locally before pushing

Never trust the dev server for this — build exactly what Vercel builds:

```bash
rm -rf dist && npx expo export --platform web
```

Then confirm the output is really your app:

```bash
grep -c "Welcome to Expo" dist/index.html      # must be 0
grep -o "<title[^>]*>[^<]*</title>" dist/index.html
npx serve dist -l 4173                          # open and click through
```

Checking `dist/` rather than the dev server is the point — the boilerplate
failure mode looks identical in both until you read the exported HTML.

---

## 4. Vercel project hygiene — the trap that wastes the most time

Everything above is about making the build correct. This section is about being
able to *tell* that it's correct, which turned out to be the harder problem.

### Deployment URLs with a hash are frozen forever

```
advanced-creation-studio-app.vercel.app                    ← production alias, updates on push
advanced-creation-studio-app-v2-live-p7j6852cb.vercel.app  ← ONE build, never changes
advanced-creation-7olic0jj5-advanced-creation-studio...    ← ONE build, never changes
```

Every Vercel build gets its own permanent URL serving that exact build. A new
push produces a *new* deployment with a *different* hash; it does not update the
old one. Bookmark a hash URL built before a fix and it shows the broken version
forever, which reads exactly like "my deploys aren't working."

**Only ever bookmark the no-hash production alias.**

### Don't run `vercel` from the project folder

If a project with that name already exists, the CLI creates a *new* project with
a random suffix rather than reusing it. Run it a few times and you get:

```
advanced-creation-studio-app
advanced-creation-studio-app-mjpx
advanced-creation-studio-app-s4sp
advanced-creation-studio-app-pk46
advanced-creation--app
...
```

Once the repo is connected, `git push` is the entire deploy process. This repo
reached nine Vercel projects for one app that way.

### Several projects on one repo all rebuild on every push

If more than one project is connected to the same repo, a single push fans out
and redeploys all of them. Harmless, but it makes the dashboard look like
something is thrashing, and it multiplies the URLs you might check.

### Deployment Protection makes previews look broken

A project with Vercel Authentication on will 302 any logged-out visitor to
`vercel.com/sso-api`. The page isn't broken — you just can't see it, and neither
can anyone you send it to.

### Auditing what's actually deployed

```bash
vercel project ls
```

Then probe each production URL for the boilerplate signature. Note that the
starter renders `Welcome to&nbsp;Expo`, so a literal grep for "Welcome to Expo"
misses it — match on the hints instead:

```bash
curl -sL https://<url> | grep -c "reset-project\|Try editing"   # >0 means boilerplate
curl -sL https://<url> | grep -c "_expo/static/js/web/entry"    # >0 means an Expo build
curl -sL https://<url> | grep -o "<title[^>]*>[^<]*</title>"    # empty title = pre-fix build
```

Delete strays with `vercel project remove <name>` — it needs an interactive
confirmation, so pipe it: `printf 'y\n' | vercel project remove <name>`.
`--yes` is not a valid flag, and `--non-interactive` prints the warning and
aborts without deleting.

---

## 5. New project checklist

- [ ] `vercel.json` as above; no `framework` key
- [ ] `app.json` has `web.output: "static"`
- [ ] Real app code re-exported from `app/index.tsx`
- [ ] Starter routes deleted
- [ ] `expo-router/head` supplies `<title>` and description
- [ ] Splash: `preventAutoHideAsync` and `hideAsync` both present, or neither
- [ ] `allowJs` set if any `.js` modules are imported
- [ ] App icon and favicon replaced — the default `ios.icon` points at Expo's
      own stock icon bundle and will ship as your app's identity
- [ ] `expo export` run locally and `dist/` inspected
- [ ] `git pull --rebase` before pushing if anything else writes to the repo
- [ ] Exactly one Vercel project connected to the repo — check `vercel project ls`
- [ ] The no-hash production URL bookmarked, not a deployment URL

---

## 6. Deploying

Connect the repo to a Vercel project **once**, through the dashboard. After
that, `git push` to `main` is the whole deploy process.

Avoid `vercel --prod` from the project folder for routine deploys — that is what
creates duplicate projects. Reach for the CLI only to inspect or clean up:

```bash
vercel project ls                                  # what exists
vercel project inspect <name>                      # build settings, git link
printf 'y\n' | vercel project remove <name>        # delete a stray
```
