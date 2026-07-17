# GameHub

A hall of games — the source for [xinfernohdx.github.io/Gamehub](https://xinfernohdx.github.io/Gamehub/), a static game library where visitors can play games in the browser or download them.

## How it works

- **The site** is dependency-free static HTML/CSS/JS on GitHub Pages. `games.json` is the single source of truth: every game card, screenshot gallery, and button is rendered from it.
- **Game builds** are stored as GitHub Release assets (not in the repo), so the repo stays small and downloads get GitHub's CDN.
- **Web builds** (games playable in the browser) live under `play/<game-id>/` and are linked via the `web` field in `games.json`.

## Publishing a game

One command, from this repo:

```
py tools/publish.py --id my-game --title "My Game" --tag mygame-v1.0 --zip path/to/MyGame-win64.zip
```

The script creates/updates the GitHub Release, uploads the zip, and prints the `games.json` entry skeleton to fill in (tagline, screenshots, description). Commit + push and the site updates.

Requires: [GitHub CLI](https://cli.github.com/) (`gh auth login`) and Python 3.

## Adding screenshots

Drop 1600px-wide JPEGs in `assets/shots/` and reference them from the game's `screenshots` array. First entry doubles as the card cover via `cover`.

## Disclosure

Games here are built with AI assistance (Claude). Art uses CC0 assets (Poly Haven and similar); audio is procedurally generated. Per-game details are on each game's page.
