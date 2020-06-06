import React, { createContext, useEffect, useState } from "react";
import Game from "./components/game-parts";
import User from "./components/user";
import GameScreen from "./components/game-screen";
import AuthenicatedScreen from "./components/authenticate-screen";
import firebaseConfig from "./config";
import firebase from "firebase";
import db from "./config";

export const GameCtx = createContext({
  scaleSettings: [40, () => {}],
});

const App = () => {
  const { gameOver, startGame, moveSnake, message } = Game();
  const { authenticated, setAuthenticated } = User();
  const [user, setUser] = useState();

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const userName = localStorage.getItem("username");
      db.collection("users")
        .doc(user.uid)
        .set(
          {
            displayName: userName,
            email: user.email,
            uid: user.uid,
          },
          { merge: true }
        )

        .then(function () {})
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });

      setAuthenticated(true);
    } else {
      // User is signed out.
      setAuthenticated(false);
    }
  });

  const getUserData = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const usersRef = db.collection("users").doc(user.uid);

      usersRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            // console.log("Document data:", doc.data());
            const userData = doc.data();
            console.log(userData);
            setUser(userData);
            return userData;
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    }
  };

  useEffect(() => {
    getUserData();
  }, [authenticated]);

  const scaleSettings = useState(20);

  return (
    <GameCtx.Provider value={{ scaleSettings }}>
      {authenticated && <GameScreen user={user} message={message} />}
      {authenticated ? (
        <>
          {gameOver && <div>{message}... Game Over</div>}
          <div>Arrow keys to move around</div>
        </>
      ) : (
        <AuthenicatedScreen />
      )}
    </GameCtx.Provider>
  );
};

export default App;
