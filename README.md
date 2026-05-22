<p align="center">
  <img width="200" height="200" alt="ChatGPT Image May 21, 2026, 02_39_16 PM" src="https://github.com/user-attachments/assets/4be36d3d-4a5f-4917-91bf-750bf3f40b81" />
</p>

# Move Mania

A motion-based party game built with Expo and React Native. Players use their body movements to compete across a collection of mini-games.

## Mini-Games

| Game | Description | Status |
|------|-------------|--------|
| 🏃 Dodge Rush | Dodge flying obstacles with your body | Available |
| 👋 Smack Attack | Slap the creatures before they escape | Available |
| 🧍 Pose Panic | Strike the pose before time runs out | Coming soon |
| 💃 Dance Madness | Match the moves to the beat | Coming soon |
| ⚖️ Balance Chaos | Stay inside the moving zones | Coming soon |

## Getting Started

```bash
npm install
npm start
```

Then open on:
- **iOS** — press `i` for the simulator
- **Android** — press `a` for the emulator
- **Expo Go** — scan the QR code

## Tech Stack

- [Expo](https://expo.dev) v55 with file-based routing via `expo-router`
- [React Native Skia](https://shopify.github.io/react-native-skia/) for 2D graphics
- TypeScript

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run ios` | Open on iOS simulator |
| `npm run android` | Open on Android emulator |
| `npm run lint` | Run ESLint |

## Node 24 Compatibility Patches

This project runs on Node 24 which requires a few manual patches to `node_modules`. These patches are applied automatically on each clean install via `patch-package` — **if** you have it set up. Otherwise, apply them manually after running `npm install`.

### 1. `babel.config.js` — NativeWind preset placement

`nativewind/babel` must be listed under `presets`, not `plugins`.

```js
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
```

### 2. `src/app/_layout.tsx` — global.css import path

The stylesheet must be imported with `../` because `_layout.tsx` lives inside `src/app/`, one level below `src/global.css`.

```ts
import "../global.css"; // not "./global.css"
```

### 3. `node_modules/expo/node_modules/@expo/cli/build/src/run/ios/appleDevice/client/LockdowndClient.js`

**Error:** `TypeError: Cannot convert object to primitive value`

The `startSession` debug log coerces the `pairRecord` object to a string, which throws under Node 24.

```diff
- debug(`startSession: ${pairRecord}`);
+ debug('startSession');
```

### 4. `node_modules/react-native-css-interop/dist/metro/index.js`

**Error:** `TypeError: Cannot read properties of undefined (reading 'addedFiles')`

NativeWind emits a Metro `change` event without the `changes`/`rootDir` shape that Metro now requires. Also, the `modifiedFiles` map entry must include a metadata object, not `null`.

```diff
  haste.emit("change", {
+   rootDir: process.cwd(),
+   changes: {
+     addedFiles: new Map(),
+     modifiedFiles: new Map([[canonicalPath, { isSymlink: false }]]),
+     removedFiles: new Map(),
+   },
    eventsQueue: [
      {
        filePath,
        metadata: { modifiedTime: Date.now(), size: 1, type: "virtual" },
        type: "change",
      },
    ],
  });
```

This same fix is mirrored in `node_modules/react-native-css-interop/src/metro/index.ts`.

### Missing peer dependencies (resolved via `npx expo install`)

```bash
npx expo install expo-asset react-native-worklets
```

These were flagged as missing by `expo-doctor` and are required at runtime by `expo-audio` and `react-native-reanimated` respectively.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
