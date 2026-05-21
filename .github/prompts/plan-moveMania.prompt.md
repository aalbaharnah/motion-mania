# Plan: Move Mania — Mobile Party Game MVP

**What**: Rebuild the existing Expo starter into a React Native party game with 5 motion-controlled mini-games using front camera + MoveNet pose detection. Dodge Rush will be the fully working implementation; the others will be structured scaffolds.

**How**: Stay on Expo managed workflow with EAS Dev Builds. Use VisionCamera v4 (Nitro) + react-native-fast-tflite v3 (Nitro) + SkiaCamera for the pose pipeline. Drop Firebase and web support for MVP.

---

## Phase 1 — Foundation *(prerequisite for everything)*

**1. Update `package.json`**
Add: `react-native-vision-camera`, `react-native-nitro-modules`, `react-native-nitro-image`, `vision-camera-resize-plugin`, `react-native-vision-camera-skia`, `@shopify/react-native-skia`, `react-native-fast-tflite`, `zustand`, `expo-screen-orientation`, `expo-haptics`, `expo-audio`
Remove: `react-native-worklets` (VisionCamera v3 legacy), `react-native-web`, `expo-web-browser`

**2. Update `app.json`**
- Add iOS `NSCameraUsageDescription`, Android `CAMERA` permission
- Add expo plugins: `react-native-vision-camera`, `react-native-fast-tflite` (with `enableCoreMLDelegate: true`, `enableAndroidGpuLibraries: true`)
- Change `orientation` from `"portrait"` to `"default"` (games lock landscape via `expo-screen-orientation` at runtime)

**3. Create `metro.config.js`**
Add `tflite` to `resolver.assetExts` so Metro can bundle the MoveNet model file

**4. Drop web, restructure app routing**
- Remove `src/components/app-tabs.web.tsx`, `animated-icon.web.tsx`, `src/hooks/use-color-scheme.web.ts`
- Rewrite `src/app/_layout.tsx`: remove `ThemeProvider`/tab navigation, replace with `Stack` navigator from expo-router
- Rewrite `src/app/index.tsx`: game lobby/home screen
- Add `src/app/game/_layout.tsx` and `src/app/game/[mini-game-id].tsx`

---

## Phase 2 — Engine Layer *(parallel-friendly after Phase 1)*

**5. `src/engine/pose/pose.type.ts`**
Define `PoseLandmark { x, y, confidence }`, `PoseFrame { landmarks: PoseLandmark[17], timestamp }`, `BodyBounds { center_x, center_y, width, height }`

**6. `src/engine/pose/pose-landmark-indices.constant.ts`**
Named constants for all 17 MoveNet keypoints: `NOSE=0`, `LEFT_EYE=1`…`RIGHT_ANKLE=16`, plus helper groups `TORSO_LANDMARKS`, `UPPER_BODY_LANDMARKS`

**7. `src/engine/pose/pose.util.ts`**
Utility functions: `getBodyBounds(frame, screen_w, screen_h)`, `getLandmarkDistance(a, b)`, `normalizeLandmark(landmark, screen_w, screen_h)`, `computePoseSimilarity(target, detected)` (cosine similarity on joint angles, used by Pose Panic)

**8. `src/engine/pose/pose-detector.service.ts`**
Loads MoveNet Lightning TFLite model via `useTensorflowModel`. Exports `runPoseInference(resized_buffer): PoseFrame` — called from within the SkiaCamera worklet. Parses the `[1,1,17,3]` float32 output into `PoseFrame` (note MoveNet outputs `[y, x, confidence]` — swap to `[x, y, confidence]`)

**9. `src/engine/camera/use-pose-tracker.hook.ts`**
Hook that owns `pose_shared_value = useSharedValue<PoseFrame | null>(null)`. Returns it + a ref to `boxed_model` (Nitro-boxed for worklet access). Consumer components read `pose_shared_value` via `useAnimatedReaction` or directly in game loop

**10. `src/engine/camera/camera-engine.component.tsx`**
Wraps `<SkiaCamera>` from `react-native-vision-camera-skia`. In `onFrame` worklet:
1. `resize(frame, {width:192, height:192, pixelFormat:'rgb', dataType:'uint8'})` via vision-camera-resize-plugin
2. `tflite.runSync([input_buffer])` → raw output
3. Parse → write to `pose_shared_value`
4. Call `render({frameTexture, canvas}) => canvas.drawImage(frameTexture, 0, 0)` to show camera feed
Accepts `children` overlay slot rendered on top of Skia canvas

**11. `src/engine/collision/collision-detector.util.ts`**
Pure functions: `pointInRect(px, py, rect)`, `rectsOverlap(a, b)`, `circleInRect(cx, cy, r, rect)`, `distanceBetween(a, b)`. All operate on screen-space coordinates

**12. `src/engine/game-loop/use-game-loop.hook.ts`**
Custom hook using `requestAnimationFrame` with delta-time capping at 100ms. Returns `{ start, stop, isPaused }`. Accepts a `tick(delta: number, elapsedMs: number)` callback. Cleans up on unmount

---

## Phase 3 — Store + Shared Systems *(parallel with Phase 2)*

**13. `src/store/score.store.ts`** + **`score.type.ts`**
Zustand store: `{ score, combo, combo_multiplier, lives, high_score }` + actions `addScore(base)`, `incrementCombo()`, `resetCombo()`, `decrementLife()`, `resetScore()`. Combo multiplier: 1×/2×/3×/5× at thresholds 5/10/20

**14. `src/store/game.store.ts`**
Zustand store: `{ active_game, game_phase: 'idle'|'countdown'|'playing'|'paused'|'gameover', elapsed_ms, difficulty }` + actions. `difficulty` (0–1 float) increases every 10s during play

**15. `src/engine/audio/audio-manager.service.ts`** + **`src/engine/haptics/haptics-manager.service.ts`**
`AudioManager`: loads `expo-audio` sounds (hit, miss, combo, countdown) once, exposes `play(sound_key)`.
`HapticsManager`: wraps `expo-haptics` — `impact()`, `notification(type)`, `selection()`

---

## Phase 4 — UI Components *(depends on Phase 3)*

**16. `src/components/game/game-overlay.component.tsx`**
Skia `<Canvas>` that renders pose skeleton (dots + lines connecting landmarks) from `pose_shared_value`. Uses Reanimated's `useDerivedValue` to read shared value. Drawn with low-opacity so it doesn't distract from gameplay. Accepts a `renderGameElements` paint callback for game-specific Skia drawings

**17. `src/components/game/score-hud.component.tsx`**
Reads from `useScoreStore`. Displays score top-left, combo multiplier top-center, lives (heart icons) top-right, timer bottom. Uses `ThemedText` with large arcade-style font size (48pt)

**18. `src/components/game/countdown.component.tsx`**
Animated 3-2-1-GO component using Reanimated `withSequence` + `withSpring`. Triggers a callback when complete

**19. `src/components/game/game-over.component.tsx`**
Full-screen overlay: final score, high score, "Play Again" and "Lobby" buttons

**20. `src/components/ui/mini-game-card.component.tsx`**
Lobby card: game name, emoji icon, high score. Pressable with scale animation on press

---

## Phase 5 — Navigation Screens *(depends on Phase 4)*

**21. `src/app/index.tsx`** — Lobby
Grid of 5 `<MiniGameCard>` components. Tapping navigates to `/game/[mini-game-id]`. Shows app title, no nav bar. Full-screen portrait or landscape (player chooses game then game locks landscape)

**22. `src/app/game/_layout.tsx`**
Locks screen to landscape using `expo-screen-orientation` on mount, restores on unmount. Hides status bar. Stack layout with no header

**23. `src/app/game/[mini-game-id].tsx`**
Reads `params.mini-game-id`, renders the matching mini-game screen component

---

## Phase 6 — Dodge Rush: Full Implementation *(depends on Phases 2–5)*

**24. `src/mini-games/dodge-rush/dodge-rush.type.ts`**
`Obstacle { id, x, y, width, height, speed, lane }`, `DodgeRushState { obstacles, lives, near_miss_count, last_spawn_ms, spawn_interval_ms }`

**25. `src/mini-games/dodge-rush/dodge-rush.system.ts`**
Pure functions: `spawnObstacle(screen_w, screen_h, difficulty)` — random Y lane, speed based on difficulty. `updateObstacles(obstacles, delta, screen_w)` — move left, filter off-screen. `checkNearMiss(obstacle, body_bounds)` — bonus when obstacle passes within 40px of body edge

**26. `src/mini-games/dodge-rush/dodge-rush.store.ts`**
Zustand store extending game state with dodge-rush-specific fields. Actions: `spawnObstacle`, `removeObstacle`, `applyNearMiss`, `resetDodgeRush`

**27. `src/mini-games/dodge-rush/dodge-rush.screen.tsx`** — the *fully working* mini-game
- Full-screen `<CameraEngine>` (landscape, front camera)
- `useGameLoop` tick: read pose → `getBodyBounds()` → `updateObstacles()` → collision check → update store
- `<GameOverlay>` Skia canvas renders: obstacles as colored rectangles with emoji icons (🪨/🎳/💣), body bounding box outline, near-miss flash effect, screen shake via Reanimated `useSharedValue`
- `<ScoreHud>` + `<Countdown>` + `<GameOver>` overlaid via `<View style={StyleSheet.absoluteFill}>`
- Difficulty: spawn interval starts at 2000ms, decreases by 200ms every 10s (floor 400ms); obstacle speed 0.3–0.8 of screenWidth per second

---

## Phase 7 — Remaining 4 Mini-Games: Structured Scaffolds *(parallel)*

Each has the same file set as Dodge Rush (types, logic, store, screen) but screen shows "Coming Soon" with the game description. All types and logic stubs are defined with TODO comments, giving a clear implementation contract.

**28.** `src/mini-games/smack-attack/` — 4 files (`smack-attack.type.ts`, spawn logic `smack-attack.system.ts`, `smack-attack.store.ts`, `smack-attack.screen.tsx`)
**29.** `src/mini-games/pose-panic/` — 4 files (`pose-panic.type.ts`, similarity scoring `pose-panic.system.ts`, `pose-panic.store.ts`, `pose-panic.screen.tsx`)
**30.** `src/mini-games/dance-madness/` — 4 files (`dance-madness.type.ts`, rhythm logic `dance-madness.system.ts`, `dance-madness.store.ts`, `dance-madness.screen.tsx`)
**31.** `src/mini-games/balance-chaos/` — 4 files (`balance-chaos.type.ts`, zone movement `balance-chaos.system.ts`, `balance-chaos.store.ts`, `balance-chaos.screen.tsx`)

---

## Phase 8 — Assets + Config *(parallel with Phase 7)*

**32. `assets/models/movenet-lightning.tflite`** — placeholder note: download from TF Hub (`lite-model_movenet_singlepose_lightning_tflite_int8_4.tflite`)
**33. `eas.json`** — EAS build profiles: `development`, `preview`, `production`
**34. `src/constants/game.constant.ts`** — all magic numbers in one place: `TARGET_FPS=60`, `POSE_CONFIDENCE_THRESHOLD=0.3`, `MOVENET_INPUT_SIZE=192`, `BODY_BOUNDS_PADDING=1.5`, etc.

---

## Relevant Files

| File | Action |
|------|--------|
| `package.json` | Add ~10 deps, remove 3 |
| `app.json` | Permissions, plugins, orientation |
| `metro.config.js` | New — add tflite asset extension |
| `src/app/_layout.tsx` | Replace tabs with Stack navigator |
| `src/app/index.tsx` | Replace with lobby screen |
| `src/app/game/_layout.tsx` | New — orientation lock |
| `src/app/game/[mini-game-id].tsx` | New — dynamic game router |
| `src/engine/` | New directory — all engine modules |
| `src/mini-games/` | New directory — all 5 mini-games |
| `src/store/` | New directory — Zustand stores |
| `src/components/game/` | New — shared game UI components |

---

## Verification

1. **EAS build**: `eas build --profile development --platform ios` completes without native errors
2. **Camera permission**: Camera preview visible on device; front camera activates on game start
3. **Pose detection**: Skeleton overlay (dots/lines) tracks body movements in real time at ≥30 FPS on a mid-range device
4. **Dodge Rush gameplay**: Obstacles fly across screen; body correctly dodges (no false positives); score increments; lives decrement on hit; game over triggers; restart works
5. **Difficulty ramp**: Spawn rate visibly increases after 10s, 20s, 30s intervals
6. **Near-miss**: +50 bonus points appear when obstacle narrowly misses body
7. **4 stub games**: Lobby shows all 5 cards; tapping each non-Dodge game shows "Coming Soon" — no crash
8. **Orientation**: Landscape locked during gameplay; portrait restores on lobby return
9. **No TypeScript errors**: `npx tsc --noEmit` passes

---

## Decisions

- **Firebase**: Excluded from MVP. Scoped to a future phase (leaderboards, session replay)
- **Web**: Dropped — VisionCamera and TFLite have no web support
- **Pose model**: MoveNet Lightning (int8) over MoveNet Thunder (more accurate but ~2× slower) for 60 FPS target
- **react-native-worklets 0.7.4**: Remove — it was required for VisionCamera v3's worklet-based frame processors. VisionCamera v4 handles worklets internally via Nitro
- **Skia Frame Processor vs overlay**: Using `<SkiaCamera>` (renders camera into Skia canvas) + `react-native-vision-camera-skia` — this is the officially supported v4 integration
- **File naming**: kebab-case base name + `.suffix.ext` separator (e.g., `.screen.tsx`, `.store.ts`, `.system.ts`, `.type.ts`, `.util.ts`, `.service.ts`, `.hook.ts`, `.constant.ts`, `.component.tsx`)

---

## Further Considerations

1. **TFLite model download**: The MoveNet `.tflite` file (~3MB) cannot be committed to the repo without LFS or a download script. Plan should include an `npm postinstall` or EAS `prebuildCommand` to download it from TF Hub. Alternatively, bundle it via a CDN URL with `loadTensorflowModel({ url: '...' })` on first launch and cache locally.

2. **Frame processor worklet compatibility**: Vision Camera v4's `onFrame` in `<SkiaCamera>` runs on a Nitro worklet — `NitroModules.box(model)` is required to pass the TFLite `HybridObject` into the worklet. This is non-obvious and must be carefully implemented in `camera-engine.tsx`.

3. **Multiplayer / online leaderboards (future)**: Firebase Firestore + anonymous auth is the natural next step. The score store can be extended with a `submitScore(gameId, score)` action that writes to Firestore without changing any game logic.
