const CANVAS_SIZE = [1920, 1080];
const SPEED = 80;
const SNAKE_START = [
  [8, 7],
  [8, 8],
];
const APPLE_START = [8, 3];
const MINE_START = [
  Math.floor(Math.random() * (CANVAS_SIZE / 20)),
  Math.floor(Math.random() * (CANVAS_SIZE / 20)),
];
const DIRECTIONS = {
  38: [0, -1], // up
  87: [0, -1], // up/w
  75: [0, -1], // up/k
  40: [0, 1], // down
  83: [0, 1], // down/s
  74: [0, 1], // down/j
  37: [-1, 0], // left
  65: [-1, 0], // left/a
  72: [-1, 0], // left/h
  39: [1, 0], // right
  68: [1, 0], // right/d
  76: [1, 0], // right/l
};

const REVERSEDIRECTIONS = {
  38: 40,
  40: 38,
  37: 39,
  39: 37,
  87: 83,
  83: 87,
  65: 68,
  68: 65,
  75: 74,
  74: 75,
  72: 76,
  76: 72
};

export {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  MINE_START,
  SPEED,
  DIRECTIONS,
  REVERSEDIRECTIONS
};
