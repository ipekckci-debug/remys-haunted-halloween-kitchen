export const TILE_SIZE = 60;
export const BOARD_COLS = 16;
export const BOARD_ROWS = 8;
export const MAP_TOP = 120;

// Each pair is a counter tile: [column, row].
export const LEVELS = [
  {
    name: "Moonlit Pantry",
    ghostDelay: 900,
    walls: [[3,1],[4,1],[8,1],[9,1],[3,2],[8,2],[6,3],[7,3],[12,3],[1,4],[6,4],[12,4],[1,5],[9,5],[10,5],[4,6],[5,6],[10,6]]
  },
  {
    name: "Pumpkin Cellar",
    ghostDelay: 720,
    walls: [[2,1],[3,1],[4,1],[11,1],[12,1],[4,2],[8,2],[12,2],[1,3],[2,3],[8,3],[9,3],[14,3],[5,4],[6,4],[7,4],[14,4],[3,5],[11,5],[12,5],[3,6],[7,6],[8,6],[13,6]]
  },
  {
    name: "Ghost Chef's Dining Room",
    ghostDelay: 560,
    walls: [[1,1],[2,1],[7,1],[8,1],[13,1],[4,2],[8,2],[13,2],[4,3],[5,3],[10,3],[11,3],[2,4],[3,4],[10,4],[15,4],[6,5],[7,5],[12,5],[13,5],[1,6],[5,6],[9,6],[14,6]]
  }
];

export const INGREDIENTS = [
  { name: "Pumpkin", key: "pumpkin", points: 100 },
  { name: "Cheese", key: "cheese", points: 100 },
  { name: "Apple", key: "apple", points: 100 },
  { name: "Garlic", key: "garlic", points: 100 },
  { name: "Carrot", key: "carrot", points: 100 },
  { name: "Chocolate", key: "chocolate", points: 150 }
];
