# The Scorecard

A pocket cricket scoring app. Built with React Native + Expo.

**Aesthetic:** Wisden Pocket — cream paper, vibrant crimson accent, modern serif (Fraunces) + mono (IBM Plex Mono). Oversized bold score as the hero.

---

## Quick start

### 1. Prerequisites
- **Node.js** 18 or newer: https://nodejs.org
- **Expo Go** app on your phone:
  - iOS: https://apps.apple.com/app/expo-go/id982107779
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

### 2. Install

```bash
cd scorecard-app
npm install
```

### 3. Run

```bash
npx expo start
```

A QR code will appear in your terminal.

- **iOS:** open the Camera app, point it at the QR, tap the Expo banner
- **Android:** open Expo Go, tap "Scan QR code"

Your phone will load the app over your local Wi-Fi. Hot reload works out of the box — save a file, the app updates.

### 4. Build for the stores (when you're ready)

```bash
# Install EAS CLI once
npm install -g eas-cli
eas login

# Configure (first time only)
eas build:configure

# Build for Android (APK for testing)
eas build --platform android --profile preview

# Build for iOS (requires Apple Developer account)
eas build --platform ios
```

---

## Project structure

```
scorecard-app/
├── App.js                          ← entry, loads fonts + state
├── app.json                        ← Expo config (name, icons, colors)
├── package.json
├── babel.config.js
├── assets/                         ← icon.png, splash.png (you provide these)
└── src/
    ├── theme/
    │   └── index.js                ← colors, fonts, sizes — single source of truth
    ├── hooks/
    │   └── useMatch.js             ← all cricket scoring logic + AsyncStorage
    ├── components/
    │   ├── PaperBackground.js      ← the cream paper with subtle tint layers
    │   ├── BottomSheet.js          ← native modal w/ spring animation
    │   ├── FolioField.js           ← text input with serif styling
    │   └── FolioButton.js          ← primary action button
    ├── modals/
    │   ├── MatchSetupModal.js      ← set teams & max overs
    │   ├── TargetModal.js          ← target mode / start 2nd innings
    │   ├── AdjustScoreModal.js     ← manually adjust score
    │   ├── BreakdownModal.js       ← over-by-over ledger + extras
    │   └── ArchiveModal.js         ← past scorecards list
    └── screens/
        └── MatchScreen.js          ← the main scoring screen
```

---

## Features

All features from the prototype are ported:

- **Scoring:** dot, 1, 2, 3, 4, 6, wide, no-ball, out
- **Undo** — up to 40 steps of history
- **Max overs** with team names
- **Target mode** — set target directly OR start 2nd innings
- **Change score** — manual adjustment
- **Over breakdown** — wides/no-balls stats + ball-by-ball ledger of every completed over
- **Match history (Archive)** — past matches persisted with date/time
- **Haptic feedback** on every scoring action (light/medium/heavy)
- **Flash animations** on runs, boundaries, wickets, extras
- **Automatic state persistence** — match survives app kill/restart via AsyncStorage

---

## Design tokens

All design constants are in `src/theme/index.js`. To tweak the look:

- **Change accent color:** `colors.accent` (currently `#E63946` vibrant crimson)
- **Change background:** `colors.cream` (currently `#F4EDE0`)
- **Change score size:** `sizes.scoreMain` (currently `120`)
- **Swap the display font:** edit the `fonts` object (requires matching `@expo-google-fonts/...` package)

---

## Notes

- **Keyboard handling:** `BottomSheet` uses `KeyboardAvoidingView` so inputs aren't covered by the keyboard on iOS
- **SafeAreaView:** handles iPhone notch/dynamic island and Android status bar automatically
- **Fonts:** loaded from Google Fonts via `@expo-google-fonts/*` — no manual font files required
- **State:** the `useMatch` hook is fully isolated. You can drop it into any other screen (e.g. a dedicated "Start new match" landing page later) and it'll still work.

---

## Troubleshooting

**"Unable to resolve module @expo-google-fonts/fraunces"**
Run `npm install` again. If still failing, `rm -rf node_modules && npm install`.

**Fonts appear as system default**
The `ready` check in `App.js` gates rendering. If fonts fail to load silently, check your Wi-Fi — Expo fetches Google Fonts on first run.

**State not persisting**
AsyncStorage is debounced by 300ms. If you force-quit the app within 300ms of a score change, that change may not be saved. Ordinary backgrounding is safe.

**Red is too bright / too dark**
Edit `colors.accent` in `src/theme/index.js`. Try `#D62828` for slightly softer, `#FF3B3F` for more neon.
