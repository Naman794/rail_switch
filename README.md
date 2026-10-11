# Train Yard Jam 🚂

**Milestone 2: playable visual redesign for Telegram Mini Apps.**

This PR replaces the original dark Rail Switch prototype with a colorful miniature railway theme, level goals, tappable junctions, automatic train routing, lives, level selection and a victory screen.

## Run in GitHub Codespaces

```bash
npm install
npm run build
npm run dev -- --host 0.0.0.0
```

Open port **5173** from the Codespaces Ports tab.

## Gameplay

- Press **Play** to begin.
- Incoming trains appear at the bottom and move toward the railway switch.
- Tap the yellow switch lever or the circular arrow button to cycle the active track among red, green, and blue.
- The selected route is locked when the train reaches the junction. Match it to the depot of the same color.
- Deliver the required number of trains to complete a level. Three wrong deliveries result in failure.
- Progression is currently stored in the browser's localStorage; Telegram Serverless persistence comes in a later PR.

## Art direction and current limitations

The approved Train Yard Jam screenshots are **art-direction references**: colorful 3D miniature scenery, toy locomotives, polished depots, rounded game UI, wood trim and bright colors. The new frontend approximates this with responsive CSS and SVG so routing is functional.

**It is not a pixel-identical 3D rendering of those images.** Exact asset fidelity requires production-ready, separated train/depot/track/background assets, consistent render angles and animation atlases. We should not bake a single static illustration into the playable board, since trains and switches must move independently.

Current gameplay has one switch and three branches. Additional crossovers, obstacles, multi-switch puzzle layouts and a polished 3D asset pass are not yet included. Generated gameplay preview images remain visual references rather than exported sprite sheets.

## Deployment

The project retains Telegram Serverless scaffolding. Configure the bot through BotFather and authenticate:

```bash
npx tgcloud login
npm run build
npx tgcloud push
```

No live deployment, automated tests or device testing have been performed in this PR. No database persistence is included. Never commit BotFather or Serverless CLI secrets.
