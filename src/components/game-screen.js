import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { CANVAS_SIZE, SCALE } from "../constants";
// import { useInterval } from "../useInterval";
import Game from "./game-parts";

const GameScreen = ({ user }) => {
  const {
    canvasRef,
    snake,
    apple,
    mine,
    gameOver,
    checkCollision,
    checkAppleCollision,
    checkMineCollision,
    endGame,
    setMineHit,
    setSnake,
    direction,
    boundaryHit,
    setMessage,
    mineHit,
    speed,
    moveSnake,
    startGame,
    message,
    score,
    gameLoop,
  } = Game();

  // const [messageText, setMessageText] = useState("");

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(
        function () {
          // Sign-out successful.
        },
        function (error) {
          // An error happened.
        }
      );
  };


  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    context.fillStyle = "green";
    context.shadowColor = "black";
    context.shadowBlur = 1;
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "red";
    context.fillRect(apple[0], apple[1], 1, 1);
    context.fillStyle = "black";
    context.fillRect(mine[0], mine[1], 1, 1);
  }, [snake, apple, gameOver, mine]);

  return (
    <div role="button" tabIndex="0" onKeyDown={(e) => moveSnake(e)}>
      <canvas
        id={"canvas"}
        style={{ border: "1px solid black" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />

      <p>{message}</p>
      <button onClick={startGame}>Start Game</button>
      <button onClick={signOut}>Logout</button>
      <div>
        {user && user.displayName} Score: {score}
      </div>
    </div>
  );
};

export default GameScreen;
