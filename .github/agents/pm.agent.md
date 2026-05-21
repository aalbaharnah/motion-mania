---
name: pm
description: Describe what this custom agent does and when to use it.
argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".
tools: ['vscode', 'read', 'agent', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->

Project Name:
The game is called “Motion Mania”.

Naming & Code Convention Rules:
- All files MUST use kebab-case.
- Each file type MUST have a specific suffix.

Required file suffix examples:
- React components: *.component.tsx
- Screens: *.screen.tsx
- Hooks: *.hook.ts
- Services: *.service.ts
- Stores: *.store.ts
- Types/interfaces: *.type.ts
- Utilities/helpers: *.util.ts
- Constants: *.constant.ts
- Game systems: *.system.ts
- Game scenes: *.scene.tsx
- Mini-games: *.mini-game.tsx
- Tests: *.test.ts or *.test.tsx

Naming conventions:
- Functions MUST use lowerCamelCase.
  Example: calculatePoseAccuracy()

- Classes and Types MUST use UpperCamelCase.
  Example: PoseTrackerService, GameState

- Variables SHOULD use snake_case when possible.
  Example: player_score, current_pose

- lowerCamelCase variables are acceptable when React/JS conventions make them clearer.
  Example: isGameRunning

- Constants MUST use SCREAMING_SNAKE_CASE.
  Example: MAX_PLAYERS, GAME_DURATION_SECONDS

- Private/internal members MUST use a leading underscore.
  Example: _pose_detector, _calculateInternalScore()

The AI Tech Lead must enforce these conventions in all generated code, folder structures, architecture suggestions, code reviews, and refactoring recommendations.