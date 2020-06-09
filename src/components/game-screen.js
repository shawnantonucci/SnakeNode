import React, { useState, useEffect, useContext, useRef } from "react";
import firebase from "firebase";
import { CANVAS_SIZE } from "../constants";
import Game from "./game-parts";
import { GameCtx } from "../App";
import styles from "./game-screen.module.css";

const GameScreen = ({ username, logOut }) => {
  const { scaleSettings } = useContext(GameCtx);
  const [SCALE] = scaleSettings;
  const divRef = useRef(null);

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
    highScore,
    endGame,
    setPaused,
    paused,
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

  const pausePanel = () => {
    if (paused) {
      return (
        <div style={{ zIndex: 1 }}>
          <p>Game Paused</p>
          <button
            className={styles.stopButton}
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Resume Game" : "Pause Game"}
          </button>
        </div>
      );
    }
  };

  const leaderBoard = () => {
    return (
      <div className={styles.leaderboardContainer}>
        <h3>Leaderboards</h3>
        <p>Shawn Antonucci - 1337</p>
      </div>
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

    glMines.forEach((mine) => {
      context.fillStyle = "black";
      context.fillRect(mine[0], mine[1], 1, 1);
    });
  }, [snake, apple, gameOver, glMines]);

  useEffect(() => {
    divRef.current.focus();
  }, [paused]);

  return (
    <div
      className={styles.container}
      role="button"
      tabIndex="0"
      ref={divRef}
      onKeyDown={(e) => moveSnake(e)}
    >
      <canvas
        id={"canvas"}
        className={styles.canvasContainer}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {paused ? (
        pausePanel()
      ) : (
        <>
          <div className={styles.keyContainer}>
            <span className={styles.keysText}>[W,A,S,D]</span> or{" "}
            <span className={styles.keysText}>[Arrow keys]</span> to move snake
          </div>
          <div className={styles.keyContainer}>
            For Vim users <span className={styles.keysText}>[H,J,K,L]</span> to
            move snake
          </div>
          <p>{message}</p>
          <div className={styles.buttonContainer}>
            <button className={styles.startButton} onClick={startGame}>
              Start Game
            </button>
            <button
              className={styles.stopButton}
              onClick={() => setPaused(!paused)}
            >
              {paused ? "Resume Game" : "Pause Game"}
            </button>
            <button className={styles.logoutButton} onClick={signOut}>
              Logout
            </button>
          </div>
          {username && (
            <div>
              <p className={styles.scoreText}>
                {username} - Current Score:{" "}
                <span className={styles.score}>{score}</span>
              </p>
              <p className={styles.scoreText}>
                Your High Score:{" "}
                <span className={styles.highScore}>{highScore}</span>
              </p>
            </div>
          )}
        </>
      )}
      {leaderBoard()}
    </div>
  );
};

export default GameScreen;
