class KitchenScene extends Phaser.Scene {
  constructor() {
    super("KitchenScene");
  }

  create() {
    this.createTextures();
    this.drawKitchen();

    // Remy starts near the upper-left corner of the kitchen.
    this.player = this.physics.add.image(90, 190, "remy");
    this.player.setCollideWorldBounds(true);
    this.player.body.setCircle(20, 12, 12);
    this.player.setDepth(5);

    // Create the kitchen counters and make them solid.
    this.counters = this.physics.add.staticGroup();

    const counterTiles = [
      [3, 1], [4, 1], [8, 1], [9, 1],
      [3, 2], [8, 2],
      [6, 3], [7, 3], [12, 3],
      [1, 4], [6, 4], [12, 4],
      [1, 5], [9, 5], [10, 5],
      [4, 6], [5, 6], [10, 6]
    ];

    for (const [column, row] of counterTiles) {
      const x = column * 60 + 30;
      const y = 100 + row * 60 + 30;
      const counter = this.counters.create(x, y, "counter");
      counter.refreshBody();
    }

    this.physics.add.collider(this.player, this.counters);

    // Keyboard controls: arrow keys or WASD.
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D");

    // The Ghost Chef is decorative for this first milestone.
    this.ghost = this.add.image(870, 520, "ghost").setDepth(4);
    this.tweens.add({
      targets: this.ghost,
      y: this.ghost.y - 10,
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    this.add.text(30, 20, "REMY'S HAUNTED HALLOWEEN KITCHEN", {
      fontFamily: "Arial",
      fontSize: "25px",
      color: "#fff0db",
      fontStyle: "bold"
    });

    this.add.text(32, 57, "Prototype 1: explore the haunted kitchen", {
      fontFamily: "Arial",
      fontSize: "15px",
      color: "#ffb15c"
    });

    this.add.text(30, 603, "MOVE: ARROW KEYS / WASD", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e1d4e8"
    });

    this.add.text(665, 603, "NEXT: INGREDIENTS + GHOST AI", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e1d4e8"
    });
  }

  createTextures() {
    // Draw a simple original mouse character with Phaser's Graphics API.
    const mouse = this.make.graphics({ x: 0, y: 0, add: false });

    mouse.fillStyle(0x89766e, 1);
    mouse.fillEllipse(32, 39, 38, 30);
    mouse.fillCircle(19, 20, 12);
    mouse.fillCircle(45, 20, 12);

    mouse.fillStyle(0xe9b4a8, 1);
    mouse.fillCircle(19, 20, 6);
    mouse.fillCircle(45, 20, 6);

    mouse.fillStyle(0x9c8980, 1);
    mouse.fillCircle(32, 30, 21);

    mouse.fillStyle(0x241c24, 1);
    mouse.fillCircle(26, 29, 2.5);
    mouse.fillCircle(38, 29, 2.5);

    mouse.fillStyle(0xd88982, 1);
    mouse.fillCircle(32, 36, 3);

    mouse.lineStyle(2, 0xead7c7, 1);
    mouse.beginPath();
    mouse.moveTo(32, 42);
    mouse.lineTo(20, 45);
    mouse.moveTo(32, 42);
    mouse.lineTo(44, 45);
    mouse.strokePath();

    mouse.lineStyle(3, 0x89766e, 1);
    mouse.beginPath();
    mouse.moveTo(48, 49);
    mouse.lineTo(58, 54);
    mouse.lineTo(56, 60);
    mouse.strokePath();

    mouse.generateTexture("remy", 64, 64);
    mouse.destroy();

    // Draw a floating ghost for the haunted-kitchen atmosphere.
    const ghost = this.make.graphics({ x: 0, y: 0, add: false });

    ghost.fillStyle(0xb8a2df, 0.28);
    ghost.fillCircle(32, 32, 29);

    ghost.fillStyle(0xe9e4f4, 1);
    ghost.fillCircle(32, 29, 20);
    ghost.fillRoundedRect(12, 28, 40, 24, 10);

    ghost.fillStyle(0x332744, 1);
    ghost.fillCircle(25, 29, 2.5);
    ghost.fillCircle(39, 29, 2.5);

    ghost.fillStyle(0xb8a2df, 1);
    ghost.fillTriangle(14, 47, 24, 47, 18, 57);
    ghost.fillTriangle(27, 48, 37, 48, 32, 58);
    ghost.fillTriangle(39, 47, 50, 47, 46, 57);

    ghost.generateTexture("ghost", 64, 64);
    ghost.destroy();

    // Draw a wooden counter tile.
    const counter = this.make.graphics({ x: 0, y: 0, add: false });

    counter.fillStyle(0x211923, 1);
    counter.fillRoundedRect(3, 4, 54, 54, 8);
    counter.fillStyle(0x81543c, 1);
    counter.fillRoundedRect(5, 3, 50, 50, 7);
    counter.fillStyle(0xb68155, 1);
    counter.fillRoundedRect(7, 5, 46, 12, 5);
    counter.fillStyle(0x593b36, 1);
    counter.fillRect(12, 23, 36, 23);
    counter.fillStyle(0xe9bc75, 1);
    counter.fillCircle(47, 31, 2);

    counter.generateTexture("counter", 60, 60);
    counter.destroy();
  }

  drawKitchen() {
    this.physics.world.setBounds(0, 100, 960, 480);

    this.add.rectangle(480, 340, 960, 480, 0x28212e);

    // Draw a tiled floor.
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 16; column++) {
        const color = (row + column) % 2 === 0 ? 0x3c3343 : 0x352d3b;
        const tile = this.add.rectangle(
          column * 60 + 30,
          100 + row * 60 + 30,
          58,
          58,
          color
        );
        tile.setStrokeStyle(1, 0x514454);
      }
    }

    // Halloween decorations.
    this.add.text(710, 120, "🎃", { fontSize: "34px" });
    this.add.text(530, 300, "🕸️", { fontSize: "30px" });
    this.add.text(790, 480, "🕯️", { fontSize: "30px" });
    this.add.text(140, 420, "🕸️", { fontSize: "28px" });
  }

  update() {
    const speed = 220;
    const velocity = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      velocity.x = -1;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      velocity.x = 1;
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      velocity.y = -1;
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      velocity.y = 1;
    }

    velocity.normalize().scale(speed);
    this.player.body.setVelocity(velocity.x, velocity.y);
  }
}

const gameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  parent: "game",
  backgroundColor: "#17131d",
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  scene: [KitchenScene]
};

new Phaser.Game(gameConfig);
