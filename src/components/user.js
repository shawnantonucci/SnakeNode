import React, { useState, useEffect, useContext } from "react";
import firebase from "firebase";
import db from "../config";

export default () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChoice, setAuthChoice] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  // const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserID] = useState("");
  const [date, setDate] = useState(Date.now());

  const createUser = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        return setGameStart(false);
      });
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
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        return setGameStart(false);
      });
    setAuthenticated(true);
    return setGameStart(true);
  };

  return {
    setUserID,
    loginUser,
    handleLogin,
    createUser,
    writeUserData,
    email,
    setEmail,
    password,
    setPassword,
    setGameStart,
    authenticated,
    setAuthenticated,
    authChoice,
    setAuthChoice,
  };
};
