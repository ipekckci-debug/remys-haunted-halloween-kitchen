import { LEVELS, INGREDIENTS, TILE_SIZE, BOARD_COLS, BOARD_ROWS, MAP_TOP } from "./levels.js";
import { findNextStep } from "./pathfinding.js";

const Phaser = window.Phaser;
const WIDTH = 960;
const HEIGHT = 680;
const PLAYER_START = { x: 0, y: 0 };
const GHOST_START = { x: BOARD_COLS - 1, y: BOARD_ROWS - 1 };

class MenuScene extends Phaser.Scene {
  constructor() { super("MenuScene"); }

  create() {
    this.cameras.main.setBackgroundColor("#17131d");
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x211a2b);
    this.add.circle(480, 270, 245, 0x39233e, 0.5);
    this.add.text(480, 95, "HALLOWEEN NIGHT AT THE RESTAURANT", {
      fontFamily: "Arial", fontSize: "18px", color: "#e8c8ff", letterSpacing: 3
    }).setOrigin(0.5);
    this.add.text(480, 175, "REMY'S", {
      fontFamily: "Georgia", fontSize: "62px", color: "#ffb35e", fontStyle: "bold",
      stroke: "#4a2534", strokeThickness: 8
    }).setOrigin(0.5);
    this.add.text(480, 235, "HAUNTED KITCHEN", {
      fontFamily: "Arial", fontSize: "34px", color: "#fff1df", fontStyle: "bold",
      stroke: "#4a2534", strokeThickness: 6
    }).setOrigin(0.5);
    this.add.text(480, 306, "Collect the recipe before midnight. Don't get caught by the Ghost Chef!", {
      fontFamily: "Arial", fontSize: "18px", color: "#d9cbdc", align: "center", wordWrap: { width: 660 }
    }).setOrigin(0.5);
    this.add.text(230, 392, "🎃", { fontSize: "62px" }).setOrigin(0.5);
    this.add.text(730, 392, "👻", { fontSize: "62px" }).setOrigin(0.5);

    const button = this.add.rectangle(480, 465, 245, 62, 0xe58b45, 1).setStrokeStyle(3, 0xffd49c);
    button.setInteractive({ useHandCursor: true });
    const label = this.add.text(480, 465, "ENTER THE KITCHEN", {
      fontFamily: "Arial", fontSize: "19px", color: "#24151f", fontStyle: "bold", letterSpacing: 1
    }).setOrigin(0.5);
    button.on("pointerover", () => button.setFillStyle(0xffa85d));
    button.on("pointerout", () => button.setFillStyle(0xe58b45));
    button.on("pointerdown", () => this.scene.start("KitchenScene", { levelIndex: 0, score: 0, lives: 3, seconds: 150 }));
    label.setInteractive();
    label.on("pointerdown", () => this.scene.start("KitchenScene", { levelIndex: 0, score: 0, lives: 3, seconds: 150 }));

    this.add.text(480, 548, "MOVE: ARROW KEYS OR W A S D     •     CANDY STUNS THE GHOST", {
      fontFamily: "Arial", fontSize: "13px", color: "#bbaec4", letterSpacing: 1
    }).setOrigin(0.5);
    const best = Number(localStorage.getItem("remyHauntedBest") || 0);
    this.add.text(480, 590, "BEST FEAST SCORE: " + best, {
      fontFamily: "Arial", fontSize: "15px", color: "#a8e6a1"
    }).setOrigin(0.5);
    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("KitchenScene", { levelIndex: 0, score: 0, lives: 3, seconds: 150 }));
  }
}

class KitchenScene extends Phaser.Scene {
  constructor() { super("KitchenScene"); }

  init(data) {
    this.levelIndex = data.levelIndex || 0;
    this.score = data.score || 0;
    this.lives = data.lives ?? 3;
    this.seconds = data.seconds ?? 150;
  }

  create() {
    this.level = LEVELS[this.levelIndex];
    this.levelComplete = false;
    this.invulnerableUntil = 0;
    this.ghostPausedUntil = 0;
    this.createTextures();
    this.drawKitchen();
    this.createHUD();
    this.createCounters();
    this.createActors();
    this.createCollectibles();
    this.createControls();
    this.createTimers();
  }

  createTextures() {
    if (this.textures.exists("remy")) return;
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0x755d58, 1); g.fillEllipse(32, 42, 39, 29);
    g.fillCircle(19, 20, 12); g.fillCircle(45, 20, 12);
    g.fillStyle(0xe6a9a3, 1); g.fillCircle(19, 20, 6); g.fillCircle(45, 20, 6);
    g.fillStyle(0x9c8279, 1); g.fillCircle(32, 31, 21);
    g.fillStyle(0x201922, 1); g.fillCircle(26, 30, 2.5); g.fillCircle(38, 30, 2.5);
    g.fillStyle(0xe09588, 1); g.fillCircle(32, 37, 3.5);
    g.lineStyle(3, 0x755d58, 1); g.beginPath(); g.moveTo(49, 48); g.lineTo(59, 53); g.lineTo(55, 61); g.strokePath();
    g.fillStyle(0xf5eee8, 1); g.fillRoundedRect(20, 5, 24, 13, 4);
    g.fillStyle(0xc94e37, 1); g.fillRect(18, 17, 28, 4);
    g.generateTexture("remy", 64, 64); g.clear();

    g.fillStyle(0xc3a0ef, 0.25); g.fillCircle(32, 32, 31);
    g.fillStyle(0xeee8f4, 1); g.fillCircle(32, 28, 20); g.fillRoundedRect(12, 28, 40, 25, 10);
    g.fillStyle(0x392942, 1); g.fillCircle(25, 29, 2.5); g.fillCircle(39, 29, 2.5);
    g.fillStyle(0xc3a0ef, 1); g.fillTriangle(14, 47, 24, 47, 19, 58); g.fillTriangle(27, 48, 37, 48, 32, 59); g.fillTriangle(39, 47, 50, 47, 45, 58);
    g.generateTexture("ghost", 64, 64); g.clear();

    g.fillStyle(0x211923, 1); g.fillRoundedRect(3, 4, 54, 54, 8);
    g.fillStyle(0x81543c, 1); g.fillRoundedRect(5, 3, 50, 50, 7);
    g.fillStyle(0xb68155, 1); g.fillRoundedRect(7, 5, 46, 12, 5);
    g.fillStyle(0x593b36, 1); g.fillRect(12, 23, 36, 23);
    g.fillStyle(0xe9bc75, 1); g.fillCircle(47, 31, 2);
    g.generateTexture("counter", 60, 60); g.clear();

    this.makeFoodTexture(g, "pumpkin", 0xef812e);
    this.makeFoodTexture(g, "cheese", 0xf3c64b);
    this.makeFoodTexture(g, "apple", 0xd84d45);
    this.makeFoodTexture(g, "garlic", 0xe9dcc8);
    this.makeFoodTexture(g, "carrot", 0xee8b38);
    this.makeFoodTexture(g, "chocolate", 0x8a563b);
    this.makeFoodTexture(g, "candy", 0xbb77ed);
    g.destroy();
  }

  makeFoodTexture(g, key, color) {
    g.clear();
    g.fillStyle(0x211923, 0.32); g.fillCircle(32, 35, 25);
    g.fillStyle(color, 1); g.fillCircle(32, 31, 21);
    g.fillStyle(0xffe9b7, 0.8); g.fillCircle(25, 24, 5);
    g.fillStyle(0x4c8c52, 1); g.fillRoundedRect(29, 7, 7, 13, 3);
    g.fillStyle(0x75a95d, 1); g.fillEllipse(41, 12, 14, 7);
    if (key === "cheese") {
      g.clear(); g.fillStyle(0xf3c64b, 1); g.fillTriangle(8, 51, 54, 48, 37, 13);
      g.fillStyle(0xd59535, 1); g.fillCircle(30, 38, 4); g.fillCircle(39, 28, 3); g.fillCircle(22, 45, 2.5);
    } else if (key === "garlic") {
      g.clear(); g.fillStyle(0xe9dcc8, 1); g.fillEllipse(32, 37, 32, 29); g.fillEllipse(22, 35, 15, 24); g.fillEllipse(42, 35, 15, 24);
      g.fillStyle(0x6b8e57, 1); g.fillTriangle(26, 20, 38, 20, 32, 7);
    } else if (key === "carrot") {
      g.clear(); g.fillStyle(0x4e9a50, 1); g.fillTriangle(18, 20, 45, 21, 31, 6);
      g.fillStyle(0xee8b38, 1); g.fillTriangle(13, 20, 51, 20, 32, 59);
      g.lineStyle(2, 0xffc077, 1); g.lineBetween(23, 29, 34, 30); g.lineBetween(27, 39, 37, 40);
    } else if (key === "candy") {
      g.clear(); g.fillStyle(0x75d0db, 1); g.fillTriangle(8, 21, 20, 26, 17, 38); g.fillTriangle(56, 21, 44, 26, 47, 38);
      g.fillStyle(0xbb77ed, 1); g.fillRoundedRect(15, 20, 34, 23, 9); g.fillStyle(0xffffff, 1); g.fillCircle(26, 31, 4); g.fillCircle(38, 31, 4);
    }
    g.generateTexture(key, 64, 64);
  }

  drawKitchen() {
    this.cameras.main.setBackgroundColor("#17131d");
    this.physics.world.setBounds(0, MAP_TOP, WIDTH, BOARD_ROWS * TILE_SIZE);
    this.add.rectangle(WIDTH / 2, MAP_TOP + 240, WIDTH, 480, 0x29222f);
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let column = 0; column < BOARD_COLS; column++) {
        const color = (row + column) % 2 ? 0x38313e : 0x423845;
        const floorTile = this.add.rectangle(column * TILE_SIZE + 30, MAP_TOP + row * TILE_SIZE + 30, 58, 58, color);
        floorTile.setStrokeStyle(1, 0x57475a);
      }
    }
    this.add.text(28, 16, "REMY'S HAUNTED HALLOWEEN KITCHEN", { fontFamily: "Arial", fontSize: "23px", color: "#fff0db", fontStyle: "bold" });
    this.add.text(32, 54, "Collect the recipe before midnight!", { fontFamily: "Arial", fontSize: "14px", color: "#ffb15c" });
    this.add.text(55, 148, "🕸️", { fontSize: "25px" });
    this.add.text(820, 205, "🎃", { fontSize: "28px" });
    this.add.text(470, 505, "🕯️", { fontSize: "24px" });
    this.add.text(700, 570, "🕸️", { fontSize: "26px" });
    this.add.rectangle(480, 620, 960, 2, 0x725c72);
    this.add.text(30, 642, "MOVE: ARROWS / WASD", { fontFamily: "Arial", fontSize: "13px", color: "#c8b9d1" });
    this.add.text(690, 642, "CANDY STUNS THE GHOST", { fontFamily: "Arial", fontSize: "13px", color: "#c8b9d1" });
  }

  createHUD() {
    this.levelText = this.add.text(620, 18, "", { fontFamily: "Arial", fontSize: "14px", color: "#d8c8e3", fontStyle: "bold" });
    this.scoreText = this.add.text(620, 43, "", { fontFamily: "Arial", fontSize: "14px", color: "#a8e6a1" });
    this.timeText = this.add.text(785, 18, "", { fontFamily: "Arial", fontSize: "14px", color: "#ffd174", fontStyle: "bold" });
    this.livesText = this.add.text(785, 43, "", { fontFamily: "Arial", fontSize: "14px", color: "#ff9c9c" });
    this.recipeText = this.add.text(30, 82, "", { fontFamily: "Arial", fontSize: "14px", color: "#b7efae" });
    this.statusText = this.add.text(520, 82, "", { fontFamily: "Arial", fontSize: "13px", color: "#e0cce8" }).setOrigin(0.5, 0);
    this.refreshHUD();
  }

  createCounters() {
    this.counters = this.physics.add.staticGroup();
    this.level.walls.forEach(([column, row]) => {
      const counter = this.counters.create(column * TILE_SIZE + 30, MAP_TOP + row * TILE_SIZE + 30, "counter");
      counter.refreshBody();
    });
  }

  createActors() {
    this.player = this.physics.add.image(this.centerX(PLAYER_START.x), this.centerY(PLAYER_START.y), "remy");
    this.player.setCollideWorldBounds(true).setDepth(5);
    this.player.body.setCircle(20, 12, 12);
    this.physics.add.collider(this.player, this.counters);

    this.ghost = this.physics.add.image(this.centerX(GHOST_START.x), this.centerY(GHOST_START.y), "ghost");
    this.ghost.setDepth(4);
    this.ghost.body.setCircle(20, 12, 12);
    this.tweens.add({ targets: this.ghost, alpha: 0.72, duration: 650, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  createCollectibles() {
    const occupied = new Set(this.level.walls.map(([x, y]) => x + "," + y));
    occupied.add(PLAYER_START.x + "," + PLAYER_START.y);
    occupied.add(GHOST_START.x + "," + GHOST_START.y);
    const free = [];
    for (let y = 0; y < BOARD_ROWS; y++) for (let x = 0; x < BOARD_COLS; x++) {
      if (!occupied.has(x + "," + y)) free.push({ x, y });
    }
    for (let i = free.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [free[i], free[j]] = [free[j], free[i]];
    }

    this.collectedCount = 0;
    this.ingredients = this.physics.add.staticGroup();
    INGREDIENTS.forEach((definition, index) => {
      const cell = free[index];
      const item = this.ingredients.create(this.centerX(cell.x), this.centerY(cell.y), definition.key);
      item.setScale(0.78).setDepth(3);
      item.refreshBody();
      item.setData("name", definition.name);
      item.setData("points", definition.points);
    });
    this.physics.add.overlap(this.player, this.ingredients, this.collectIngredient, null, this);

    const candyCell = free[INGREDIENTS.length];
    this.candyGroup = this.physics.add.staticGroup();
    const candy = this.candyGroup.create(this.centerX(candyCell.x), this.centerY(candyCell.y), "candy");
    candy.setScale(0.78).setDepth(3);
    candy.refreshBody();
    this.physics.add.overlap(this.player, this.candyGroup, this.collectCandy, null, this);
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D");
  }

  createTimers() {
    this.timerEvent = this.time.addEvent({ delay: 1000, loop: true, callback: () => {
      this.seconds = Math.max(0, this.seconds - 1);
      this.refreshHUD();
      if (this.seconds === 0) this.endGame(false);
    }});
    this.ghostEvent = this.time.addEvent({ delay: this.level.ghostDelay, loop: true, callback: this.moveGhost, callbackScope: this });
  }

  collectIngredient(player, item) {
    if (item.getData("collected") || this.levelComplete) return;
    item.setData("collected", true);
    this.score += item.getData("points");
    this.collectedCount++;
    const sparkle = this.add.circle(item.x, item.y, 20, 0xffd46f, 0.75).setDepth(8);
    this.tweens.add({ targets: sparkle, scale: 2, alpha: 0, duration: 300, onComplete: () => sparkle.destroy() });
    item.destroy();
    this.statusText.setText("Collected: " + INGREDIENTS[this.collectedCount - 1].name + "!");
    this.refreshHUD();
    if (this.collectedCount === INGREDIENTS.length) this.completeLevel();
  }

  collectCandy(player, candy) {
    if (!candy.active) return;
    candy.destroy();
    this.ghostPausedUntil = this.time.now + 5000;
    this.ghost.setTint(0xb891ee);
    this.statusText.setText("Candy power-up! Ghost stunned for 5 seconds!");
    this.time.delayedCall(5000, () => { if (this.ghost && this.ghost.active) this.ghost.clearTint(); });
  }

  completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.player.body.setVelocity(0, 0);
    this.statusText.setText("Recipe complete! Preparing the next kitchen…");
    this.ghostEvent.remove(false);
    this.time.delayedCall(1300, () => {
      if (this.levelIndex + 1 < LEVELS.length) {
        this.scene.restart({ levelIndex: this.levelIndex + 1, score: this.score, lives: this.lives, seconds: this.seconds });
      } else {
        this.endGame(true);
      }
    });
  }

  moveGhost() {
    if (this.levelComplete || this.time.now < this.ghostPausedUntil || this.ghostTween) return;
    const start = this.worldToCell(this.ghost.x, this.ghost.y);
    const goal = this.worldToCell(this.player.x, this.player.y);
    const next = findNextStep(this.level.walls, start, goal, BOARD_COLS, BOARD_ROWS);
    if (!next) return;
    this.ghostTween = this.tweens.add({
      targets: this.ghost,
      x: this.centerX(next.x),
      y: this.centerY(next.y),
      duration: Math.max(260, this.level.ghostDelay * 0.72),
      ease: "Linear",
      onComplete: () => { this.ghostTween = null; this.checkGhostCollision(); }
    });
  }

  checkGhostCollision() {
    if (this.levelComplete || this.time.now < this.invulnerableUntil) return;
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.ghost.x, this.ghost.y);
    if (distance < 34) this.loseLife();
  }

  loseLife() {
    if (this.time.now < this.invulnerableUntil || this.levelComplete) return;
    this.lives--;
    this.invulnerableUntil = this.time.now + 1400;
    this.cameras.main.shake(180, 0.006);
    this.player.setPosition(this.centerX(PLAYER_START.x), this.centerY(PLAYER_START.y));
    this.player.body.reset(this.player.x, this.player.y);
    if (this.ghostTween) this.ghostTween.stop();
    this.ghostTween = null;
    this.ghost.setPosition(this.centerX(GHOST_START.x), this.centerY(GHOST_START.y));
    this.ghost.body.reset(this.ghost.x, this.ghost.y);
    this.player.setTint(0xff8585);
    this.time.delayedCall(700, () => { if (this.player && this.player.active) this.player.clearTint(); });
    this.statusText.setText("The Ghost Chef caught you! You lost a heart.");
    this.refreshHUD();
    if (this.lives <= 0) this.endGame(false);
  }

  endGame(won) {
    if (this.scene.isActive("ResultScene")) return;
    this.scene.start("ResultScene", { won, score: this.score, level: this.levelIndex + 1 });
  }

  refreshHUD() {
    if (this.levelText) this.levelText.setText("LEVEL " + (this.levelIndex + 1) + " · " + (this.level ? this.level.name : ""));
    if (this.scoreText) this.scoreText.setText("SCORE " + this.score);
    if (this.timeText) this.timeText.setText("TIME " + Math.floor(this.seconds / 60) + ":" + String(this.seconds % 60).padStart(2, "0"));
    if (this.livesText) this.livesText.setText("LIVES " + "♥ ".repeat(Math.max(0, this.lives)));
    if (this.recipeText) this.recipeText.setText("RECIPE: " + this.collectedCount + " / " + INGREDIENTS.length + " ingredients");
  }

  centerX(column) { return column * TILE_SIZE + TILE_SIZE / 2; }
  centerY(row) { return MAP_TOP + row * TILE_SIZE + TILE_SIZE / 2; }
  worldToCell(x, y) {
    return {
      x: Phaser.Math.Clamp(Math.floor(x / TILE_SIZE), 0, BOARD_COLS - 1),
      y: Phaser.Math.Clamp(Math.floor((y - MAP_TOP) / TILE_SIZE), 0, BOARD_ROWS - 1)
    };
  }

  update() {
    if (!this.player || this.levelComplete) return;
    const velocity = new Phaser.Math.Vector2(0, 0);
    if (this.cursors.left.isDown || this.wasd.A.isDown) velocity.x = -1;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) velocity.x = 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) velocity.y = -1;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) velocity.y = 1;
    velocity.normalize().scale(220);
    this.player.body.setVelocity(velocity.x, velocity.y);
    if (velocity.x !== 0) this.player.setRotation(velocity.x * 0.06);
    this.checkGhostCollision();
    if (this.time.now >= this.ghostPausedUntil && this.ghost.isTinted) this.ghost.clearTint();
  }
}

class ResultScene extends Phaser.Scene {
  constructor() { super("ResultScene"); }
  init(data) { this.result = data; }
  create() {
    this.cameras.main.setBackgroundColor("#17131d");
    this.add.circle(480, 280, 250, this.result.won ? 0x3b4a34 : 0x462b3b, 0.65);
    this.add.text(480, 150, this.result.won ? "THE FEAST IS SAVED!" : "THE GHOST CHEF WON", {
      fontFamily: "Arial", fontSize: "38px", color: this.result.won ? "#b9efa9" : "#ff9c9c", fontStyle: "bold", align: "center", wordWrap: { width: 760 }
    }).setOrigin(0.5);
    this.add.text(480, 240, this.result.won ? "Remy's Halloween recipe is ready before midnight." : "The kitchen grows darker… Try again!", {
      fontFamily: "Arial", fontSize: "20px", color: "#f3e6d7", align: "center", wordWrap: { width: 680 }
    }).setOrigin(0.5);
    this.add.text(480, 315, "FINAL SCORE: " + this.result.score + "     LEVEL REACHED: " + this.result.level, {
      fontFamily: "Arial", fontSize: "19px", color: "#ffd174", fontStyle: "bold"
    }).setOrigin(0.5);
    const oldBest = Number(localStorage.getItem("remyHauntedBest") || 0);
    const newBest = Math.max(oldBest, this.result.score);
    localStorage.setItem("remyHauntedBest", String(newBest));
    this.add.text(480, 360, "PERSONAL BEST: " + newBest, { fontFamily: "Arial", fontSize: "16px", color: "#a8e6a1" }).setOrigin(0.5);
    const button = this.add.rectangle(480, 455, 230, 58, 0xe58b45).setInteractive({ useHandCursor: true });
    this.add.text(480, 455, "PLAY AGAIN", { fontFamily: "Arial", fontSize: "20px", color: "#24151f", fontStyle: "bold" }).setOrigin(0.5);
    button.on("pointerdown", () => this.scene.start("MenuScene"));
  }
}

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: "game",
  backgroundColor: "#17131d",
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: "arcade", arcade: { debug: false } },
  scene: [MenuScene, KitchenScene, ResultScene]
};

new Phaser.Game(config);
