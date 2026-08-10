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

## 4. New project checklist

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

---

## 5. Deploying

Vercel redeploys automatically on push to `main` once the repo is connected.
For a manual deploy:

```bash
npx vercel --prod
```
