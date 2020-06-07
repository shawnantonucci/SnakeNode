import React, { useState } from "react";
import firebase from "firebase";
import Axios from "axios";

export default () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChoice, setAuthChoice] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserID] = useState("");
  const [date, setDate] = useState(Date.now());
  const [users, setUsers] = useState();

  const createUser = async () => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        return setGameStart(false);
      });

    const firebaseUser = await firebase.auth().currentUser;

    const user = {
      username: username,
      email: email,
      uid: firebaseUser.uid,
    };

    Axios.post("https://mern-snake.herokuapp.com/users/add", user).then((res) => {});

    setAuthenticated(true);
    return setGameStart(true);
  };

  const writeUserData = (score) => {
    firebase
      .database()
      .ref("users/" + userId)
      .update({
        score: score,
        dateSet: date,
      });
    console.log("DATA SAVED");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser();
  };

  const loginUser = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        return setGameStart(false);
      });
    setAuthenticated(true);
    return setGameStart(true);
  };

  return {
    setUserID,
    setUsers,
    users,
    loginUser,
    handleLogin,
    createUser,
    writeUserData,
    email,
    setEmail,
    username,
    setUserName,
    password,
    setPassword,
    setGameStart,
    authenticated,
    setAuthenticated,
    authChoice,
    setAuthChoice,
  };
};
