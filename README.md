# Remy's Haunted Halloween Kitchen

A Halloween maze game inspired by *Ratatouille*. Collect the recipe ingredients before midnight, avoid the Ghost Chef, and use a candy power-up to stun it.

## Play in a browser

- Open the GitHub Pages site for this repository.
- Choose **Enter the Kitchen**.
- Move with the arrow keys or **W A S D**.
- Collect all six ingredients in each of three kitchens.
- Avoid the Ghost Chef. It uses A* pathfinding to choose a route around counters.
- The candy power-up briefly stuns the ghost.

## Run as a desktop app

Download the installer for your operating system from the repository's **Actions** tab, under the latest successful **Build desktop app** workflow run. Each run provides a Windows installer, macOS disk image, and Linux AppImage.

To run or package it yourself, install Node.js 22 or newer and run:

```sh
npm install
npm start
```

To create a local installer, run `npm run dist`. The game loads Phaser 3.90.0 from jsDelivr, so internet access is required when playing.

## Built with

- JavaScript ES modules
- Phaser 3.90.0
- Electron

The character and item graphics are drawn in code with Phaser Graphics; the game does not load external image assets. Best score is saved in the browser with `localStorage`.

## Project structure

- `index.html` loads Phaser and the game entry point.
- `style.css` styles the responsive game page.
- `src/main.js` contains the menu, game, and results scenes.
- `src/levels.js` stores the level layouts and recipe data.
- `src/pathfinding.js` contains the A* route-finding algorithm.
- `electron-main.cjs` opens the game in a desktop window.

## How the ghost finds Remy

The game represents the kitchen as a grid. A* search explores open neighboring tiles and estimates the remaining distance with Manhattan distance. The ghost moves one tile along the shortest route, then recalculates as Remy moves.

This is simple rule-based game AI, not machine learning.
