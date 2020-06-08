import React, { createContext, useEffect, useState, useMemo } from "react";
import Game from "./components/game-parts";
import User from "./components/user";
import GameScreen from "./components/game-screen";
import AuthenicatedScreen from "./components/authenticate-screen";
import firebaseConfig from "./config";
import { url } from "./config";
import firebase from "firebase";
import Axios from "axios";
import socketIOClient from "socket.io-client";

export const GameCtx = createContext({
  scaleSettings: [40, () => {}],
  _id: "",
  username: "",
  socket: null,
});

const App = () => {
  const { gameOver, startGame, moveSnake, message } = Game();
  const { authenticated, setAuthenticated } = User();
  const [user, setUser] = useState();
  const [_id, set_ID] = useState("");
  const [username, setUserName] = useState("");

  // const socket = useMemo(() => socketIOClient("localhost:5000/tick"));
  const socket = useMemo(() => socketIOClient("mern-snake.herokuapp.com/tick"));

  useEffect(() => {
    socket.on("connect", () => {});
    // console.log("App -> socket", socket);
  }, [socket]);

  const logOut = () => {
    set_ID("");
    setUserName("");
    setUser("");
  };

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      setUser(user.email);
      const { data } = await Axios.get(`${url}/users`);
      // const { data } = await Axios.get("http://localhost:5000/users");
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

  const scaleSettings = useState(30);

  return (
    <GameCtx.Provider value={{ scaleSettings, _id, username, socket }}>
      {authenticated && (
        <GameScreen logOut={logOut} username={username} message={message} />
      )}
      {authenticated ? (
        <>{gameOver && <div>{message}... Game Over</div>}</>
      ) : (
        <AuthenicatedScreen />
      )}
    </GameCtx.Provider>
  );
};

export default App;
