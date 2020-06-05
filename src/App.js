import React, { useRef, useState, useEffect } from "react";
import { CANVAS_SIZE, SCALE } from "./constants";
import Game from "./components/game-parts";
import User from "./components/user";
import AuthenicatedScreen from "./components/authenticate-screen";

import firebaseConfig from "./config";
import firebase from "firebase";

const App = () => {
  const {
    gameOver,
    startGame,
    moveSnake,
    canvasRef,
    message,
    score,
    snake,
    apple,
    mine,
  } = Game();
  const { signOut, authenticated, setAuthenticated } = User();

  // const [authenticated, setAuthenticated] = useState(false);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // ...
      setAuthenticated(true);
    } else {
      // User is signed out.
      // ...
      setAuthenticated(false);
    }
  });

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
        style={{ border: "1px solid black" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {authenticated ? (
        <>
          {gameOver && <div>{message}... Game Over</div>}
          <div>Arrow keys to move around</div>
          <div>Score: {score}</div>
          <button onClick={startGame}>Start Game</button>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <AuthenicatedScreen />
      )}
    </div>
  );
};

export default App;
