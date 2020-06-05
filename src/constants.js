const CANVAS_SIZE = [800, 800];
const SCALE = 40;
const SPEED = 100;
const SNAKE_START = [
  [8, 7],
  [8, 8],
];
const APPLE_START = [8, 3];
const MINE_START = [
  Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
  Math.floor(Math.random() * (CANVAS_SIZE / SCALE))
];
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0], // right
};

export {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  MINE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
};
