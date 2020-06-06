import { useState, useEffect, useRef } from "react";
import firebase from "firebase";
import db from "../config";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  MINE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
  REVERSEDIRECTIONS,
} from "../constants";
import { useInterval } from "../useInterval";

export default () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [mine, setMine] = useState(MINE_START);
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
  };

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    updateScore();
    setBoundaryHit(false);
  };

  const updateScore = () => {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("users").doc(user.uid);

    return userRef
      .update({
        score: score,
      })
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const moveSnake = ({ keyCode }) => {
    if (keyCode !== REVERSEDIRECTIONS[prevKeyCode] && canMove) {
      keyCode >= 37 && keyCode <= 40 && setDirection(DIRECTIONS[keyCode]);
      setCanMove(false);
    }
    setPrevKeyCode(keyCode);
  };

  const spawnApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));
  const spawnMine = () =>
    mine.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (head, snk = snake) => {
    if (
      head[0] * SCALE >= CANVAS_SIZE[0] ||
      head[0] < 0 ||
      head[1] * SCALE >= CANVAS_SIZE[1] ||
      head[1] < 0
    ) {
      setBoundaryHit(true);
      return true;
    }
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
      let newApple = spawnApple();
      let newMine = spawnMine();
      while (checkCollision(newApple, newSnake)) {
        newApple = spawnApple();
        newMine = spawnMine();
      }
      setApple(newApple);
      setMine(newMine);
      newScore += 1;
      setScore(newScore);
      console.log(newScore);
      return true;
    }
    return false;
  };

  const checkMineCollision = (newSnake) => {
    if (newSnake[0][0] === mine[0] && newSnake[0][1] === mine[1]) {
      setMineHit(true);
      let newMine = spawnMine();
      while (checkCollision(newMine, newSnake)) {
        newMine = spawnMine();
      }
      setMine(newMine);
      return true;
    }
    setMineHit(false);
    return false;
  };

  // GAME LOOP
  const gameLoop = () => {
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
    if (checkMineCollision(snakeCopy)) {
      setMineHit(true);
    }
    setSnake(snakeCopy);
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
    mine,
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
    gameLoop,
  };
};
