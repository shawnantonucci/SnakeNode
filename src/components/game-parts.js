import { useState, useEffect, useRef, useContext } from "react";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  MINE_START,
  SPEED,
  DIRECTIONS,
  REVERSEDIRECTIONS,
} from "../constants";
import { url } from '../config'
import { useInterval } from "../useInterval";
import { GameCtx } from "../App";
import User from "./user";
import Axios from "axios";

export default () => {
  const { scaleSettings, _id, username } = useContext(GameCtx);

  const [SCALE, setScale] = scaleSettings;

  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [glMines, setMines] = useState([]);
  const [direction, setDirection] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [boundaryHit, setBoundaryHit] = useState(false);
  const [self, setSelf] = useState(false);
  const [canMove, setCanMove] = useState(true);
  const [mineHit, setMineHit] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [prevKeyCode, setPrevKeyCode] = useState(38);
  const [highScore, setHighScore] = useState(0);

  const { users, setUsers } = User();

  const startGame = () => {
    setScore(0);
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDirection([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
    setMineHit(false);
    setBoundaryHit(false);
    setMessage("");
    setSelf(false);

    setMines(spawnMines(0))
  };

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    updateScore();
    setBoundaryHit(false);
    setPrevKeyCode(38);
    // setScale(10)
  };

  const checkScore = async () => {
    const { data } = await Axios.get(
      `${url}/users/${_id}`
      // `http://localhost:5000/users/${_id}`
    );
    setHighScore(data.score);
  };

  const updateScore = async () => {
    const { data } = await Axios.get(
      `${url}/users/${_id}`
      // `http://localhost:5000/users/${_id}`
    );

    if (data.score < score || data.score === undefined) {
      const user = {
        username,
        score,
      };
      Axios.post(
        `${url}/users/update/${_id}`,
        // `http://localhost:5000/users/update/${_id}`,
        user
      ).then((res) => { });
    }
  };

  const moveSnake = ({ keyCode }) => {
    if (keyCode >= 37 && keyCode <= 40) {
      if (keyCode !== REVERSEDIRECTIONS[prevKeyCode] && canMove) {
        setCanMove(false);
        setDirection(DIRECTIONS[keyCode]);

        setPrevKeyCode(keyCode);
      }
    }
  };

  const spawnApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const spawnMines = (level) => {
    const mines = [];
    const f = [0, 1]
    const cnt = (level > 10) ? ~~(level / 10) + 1 : 1;
    for (let i = 0; i < cnt; i++) {
      const rndCords = f.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)))
      mines.push(rndCords)
    }

    return mines
  }


  const checkCollision = (head, snk = snake) => {
    for (const segment of snk) {
      if (head[0] === segment[0] && head[1] === segment[1]) {
        setBoundaryHit(false);
        setSelf(true);
        return true;
      }
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    let newScore = score;
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      // this is where we are setting the scaling option! decrease to zoom out.
      // setScale(SCALE - 5)
      const mines = spawnMines(score)
      setMines(mines)

      let newApple = spawnApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = spawnApple();
      }
      setApple(newApple);
      newScore += 1;
      setScore(newScore);
      return true;
    }
    return false;
  };

  const checkMineCollision = (mines, snake) => {
    if (mines.length < 0) {
      return false;
    }

    const isCollision = mines.some(mine => snake[0][0] === mine[0] && snake[0][1] === mine[1])

    return isCollision
  };

  const translateSegments = (sn) => {
    const [caX, caY] = CANVAS_SIZE;

    for (let i = 0; i < sn.length; i++) {
      const [snX, snY] = sn[i];

      if (snX * SCALE >= caX || snX < 0) {
        const trans = snX <= 0 ? Math.abs(caX / SCALE) : 0;
        sn[i] = [trans, snY];
      } else if (snY * SCALE >= caY || snY < 0) {
        const trans = snY <= 0 ? Math.abs(caY / SCALE) : 0;

        sn[i] = [snX, trans];
      }
    }

    return sn;
  };

  // GAME LOOP
  const gameLoop = () => {
    console.log('game loop started!!!')
    setCanMove(true);

    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [
      snakeCopy[0][0] + direction[0],
      snakeCopy[0][1] + direction[1],
    ];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) {
      endGame();
    }
    if (!checkAppleCollision(snakeCopy)) {
      snakeCopy.pop();
    }
    if (checkMineCollision(glMines, snakeCopy)) {
      setMineHit(true);
    }
    setSnake(translateSegments(snakeCopy));
  };

  useEffect(() => {
    if (boundaryHit) {
      setMessage("Hit the end of the world gameover");
    }
  }, [boundaryHit]);

  useEffect(() => {
    if (self) {
      setMessage("You ate yourself gameover");
    }
  }, [self]);

  useEffect(() => {
    if (mineHit) {
      setMessage("Boom!!! gameover");
      endGame();
    }
  }, [mineHit]);

  useEffect(() => {
    checkScore();
  }, [gameOver]);

  useInterval(() => gameLoop(), speed);

  return {
    startGame,
    gameOver,
    moveSnake,
    score,
    message,
    canvasRef,
    snake,
    apple,
    glMines,
    direction,
    checkCollision,
    checkAppleCollision,
    checkMineCollision,
    setMineHit,
    mineHit,
    boundaryHit,
    setSnake,
    setMessage,
    endGame,
    speed,
    checkScore,
    gameLoop,
    highScore,
  };
};
