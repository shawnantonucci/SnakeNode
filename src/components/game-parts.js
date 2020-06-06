import { useState, useEffect, useRef, useContext } from "react";
import firebase from "firebase";
import db from "../config";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  MINE_START,
  SPEED,
  DIRECTIONS,
  REVERSEDIRECTIONS,
} from "../constants";
import { useInterval } from "../useInterval";
import { GameCtx } from '../App';


export default () => {
  const { scaleSettings } = useContext(GameCtx);

  const [SCALE, setScale] = scaleSettings;

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
    setPrevKeyCode(38);
    // setScale(10)
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
    if (keyCode >= 37 && keyCode <= 40) {
      console.log(prevKeyCode, keyCode)
      if (keyCode !== REVERSEDIRECTIONS[prevKeyCode] && canMove) {
        setCanMove(false);
        setDirection(DIRECTIONS[keyCode])


        setPrevKeyCode(keyCode);
      }
    }
  };

  const spawnApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));
  const spawnMine = () =>
    mine.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

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


  const translateSegments = (sn) => {
    const [caX, caY] = CANVAS_SIZE

    for (let i = 0; i < sn.length; i++) {
      const [snX, snY] = sn[i];

      if (snX * SCALE >= caX || snX < 0) {
        const trans = (snX <= 0) ? Math.abs(caX / SCALE) : 0;
        console.log('hmmm')
        sn[i] = [trans, snY]
      } else if (snY * SCALE >= caY || snY < 0) {
        const trans = (snY <= 0) ? Math.abs(caY / SCALE) : 0;
        console.log('hmmm2', snY * SCALE >= caY, snY <= 0)

        sn[i] = [snX, trans];
      }
    }

    console.log(sn)

    // MIC DIED!

    return sn;
  }

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
