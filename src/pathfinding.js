// A* search on a four-direction grid. Returns the next tile after start.
export function findNextStep(walls, start, goal, columns, rows) {
  if (start.x === goal.x && start.y === goal.y) return null;

  const wallSet = new Set(walls.map(([x, y]) => x + "," + y));
  const key = (point) => point.x + "," + point.y;
  const heuristic = (point) => Math.abs(point.x - goal.x) + Math.abs(point.y - goal.y);
  const startKey = key(start);
  const goalKey = key(goal);
  const open = [startKey];
  const points = new Map([[startKey, start]]);
  const cameFrom = new Map();
  const cost = new Map([[startKey, 0]]);
  const estimate = new Map([[startKey, heuristic(start)]]);
  const closed = new Set();
  const directions = [[1,0],[-1,0],[0,1],[0,-1]];

  while (open.length) {
    open.sort((a, b) => estimate.get(a) - estimate.get(b));
    const currentKey = open.shift();
    const current = points.get(currentKey);

    if (currentKey === goalKey) {
      let stepKey = goalKey;
      while (cameFrom.get(stepKey) && cameFrom.get(stepKey) !== startKey) {
        stepKey = cameFrom.get(stepKey);
      }
      return points.get(stepKey) || null;
    }
    closed.add(currentKey);

    for (const [dx, dy] of directions) {
      const next = { x: current.x + dx, y: current.y + dy };
      const nextKey = key(next);
      if (next.x < 0 || next.y < 0 || next.x >= columns || next.y >= rows) continue;
      if (wallSet.has(nextKey) || closed.has(nextKey)) continue;

      const newCost = cost.get(currentKey) + 1;
      if (newCost < (cost.get(nextKey) ?? Infinity)) {
        cameFrom.set(nextKey, currentKey);
        points.set(nextKey, next);
        cost.set(nextKey, newCost);
        estimate.set(nextKey, newCost + heuristic(next));
        if (!open.includes(nextKey)) open.push(nextKey);
      }
    }
  }
  return null;
}
