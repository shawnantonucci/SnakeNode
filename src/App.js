import React, { createContext, useEffect, useState } from "react";
import Game from "./components/game-parts";
import User from "./components/user";
import GameScreen from "./components/game-screen";
import AuthenicatedScreen from "./components/authenticate-screen";
// import firebaseConfig from "./config";
import firebase from "firebase";
import Axios from "axios";

export const GameCtx = createContext({
  scaleSettings: [40, () => {}],
  _id: "",
  username: "",
});

const App = () => {
  const { gameOver, startGame, moveSnake, message } = Game();
  const { authenticated, setAuthenticated } = User();
  const [user, setUser] = useState();
  const [_id, set_ID] = useState("");
  const [username, setUserName] = useState("");
  const { users, setUsers } = User();

  const logOut = () => {
    set_ID("");
    setUserName("");
    setUser("");
  };

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      setUser(user.email);
      const { data } = await Axios.get("http://localhost:5000/users");
      const currentUser = data.find(
        (dataUser) => dataUser.email === user.email
      );
      set_ID(currentUser._id);
      setUserName(currentUser.username);

      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  });

  // useEffect(() => {
  //   Axios.get("http://localhost:5000/users").then((response) => {
  //     if (response.data.email === user) {
  //       set_ID(response.data[0]._id);
  //       setUserName(response.data[0].username);
  //     }
  //   });
  // }, [authenticated]);

  // useEffect(() => {
  //   if (users) {
  //     console.log("trying to get user");
  //     Axios.get(`http://localhost:5000/users/${_id}`).then((response) => {
  //       if (response.data.length > 0) {
  //         setUserName(response.data.username);
  //         set_ID(response.data._id);
  //       }
  //     });
  //   }
  // }, [authenticated]);

  const scaleSettings = useState(20);

  return (
    <GameCtx.Provider value={{ scaleSettings, _id, username }}>
      {authenticated && (
        <GameScreen logOut={logOut} username={username} message={message} />
      )}
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
