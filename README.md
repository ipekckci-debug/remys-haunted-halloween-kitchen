# Remy's Haunted Halloween Kitchen

A browser-based Halloween maze game inspired by *Ratatouille*. Collect the recipe ingredients before midnight, avoid the Ghost Chef, and use a candy power-up to stun it.

## Play

- Open the GitHub Pages site for this repository.
- Choose **Enter the Kitchen**.
- Move with the arrow keys or **W A S D**.
- Collect all six ingredients in each of three kitchens.
- Avoid the Ghost Chef. It uses A* pathfinding to choose a route around counters.
- The candy power-up briefly stuns the ghost.

## Built with

- JavaScript ES modules
- Phaser 3.90.0
- GitHub Pages

The character and item graphics are drawn in code with Phaser Graphics; the game does not load external image assets. Best score is saved in the browser with `localStorage`.

## Project structure

- `index.html` loads Phaser and the game entry point.
- `style.css` styles the responsive game page.
- `src/main.js` contains the menu, game, and results scenes.
- `src/levels.js` stores the level layouts and recipe data.
- `src/pathfinding.js` contains the A* route-finding algorithm.

## How the ghost finds Remy

The game represents the kitchen as a grid. A* search explores open neighboring tiles and estimates the remaining distance with Manhattan distance. The ghost moves one tile along the shortest route, then recalculates as Remy moves.

This is simple rule-based game AI, not machine learning.
