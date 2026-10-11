# Rail Switch 🚂

A one-tap railway routing arcade game built as a Telegram Mini App.

## Run in GitHub Codespaces

1. After this PR is merged, open **Code → Codespaces → Create codespace on main**.
2. Run:

```bash
npm install
npm run dev -- --host 0.0.0.0
```

3. Open forwarded port **5173** in your browser.

## Controls

Tap the game board or press **SWITCH TRACK** to cycle red, green and blue routes. Trains lock onto the selected track at the junction. Matching deliveries earn points; three misses ends the round. Scores are local to the browser for this milestone.

## Telegram Serverless

After enabling Serverless in BotFather and configuring CLI access, use:

```bash
npx tgcloud login
npm run build
npx tgcloud push
```

Do not commit bot tokens or local .tgcloud credentials. Persistent leaderboard and server-side score validation are not yet implemented.
