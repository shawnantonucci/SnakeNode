import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "firebase";
import { CANVAS_SIZE } from "../constants";
import Game from "./game-parts";
import { GameCtx } from "../App";

const GameScreen = ({ username, logOut }) => {
  const { scaleSettings } = useContext(GameCtx);
  const [SCALE] = scaleSettings;

  const {
    canvasRef,
    snake,
    apple,
    glMines,
    gameOver,
    moveSnake,
    startGame,
    message,
    score,
    highScore
  } = Game();

  const signOut = () => {
    logOut();
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
    context.setTransform(SCALE, 0, 0, SCALE, 1, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    context.fillStyle = "green";
    context.shadowColor = "black";
    context.shadowBlur = 1;
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));

    context.fillStyle = "red";
    context.fillRect(apple[0], apple[1], 1, 1);

    console.log(glMines)
    glMines.forEach(mine => {
      context.fillStyle = "black";
      context.fillRect(mine[0], mine[1], 1, 1);
    })

  }, [snake, apple, gameOver, glMines]);

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
      {username && (
        <p>
          {username} - Score: {score}
        </p>
      )}
      <p>High Score: {highScore}</p>
    </div>
  );
};

export default GameScreen;
