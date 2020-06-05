import React from "react";
import Game from "./components/game-parts";
import User from "./components/user";
import GameScreen from "./components/game-screen";
import AuthenicatedScreen from "./components/authenticate-screen";

import firebaseConfig from "./config";
import firebase from "firebase";

const App = () => {
  const { gameOver, startGame, moveSnake, message, score } = Game();
  const { authenticated, setAuthenticated } = User();

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var uid = user.uid;
      // ...
      setAuthenticated(true);
    } else {
      // User is signed out.
      // ...
      setAuthenticated(false);
    }
  });

  return (
    <div>
      {authenticated && <GameScreen />}
      {authenticated ? (
        <>
          {gameOver && <div>{message}... Game Over</div>}
          <div>Arrow keys to move around</div>
          <div>Score: {score}</div>
        </>
      ) : (
        <AuthenicatedScreen />
      )}
    </div>
  );
};

export default App;
