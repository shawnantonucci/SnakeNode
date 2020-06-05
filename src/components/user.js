import React, { useState, useEffect } from "react";
import firebase from "firebase";
import Game from "./game-parts";
import Login from "./login";
import Register from "./signup";

export default () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChoice, setAuthChoice] = useState(false);
  const [dataRec, setDataRec] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserID] = useState("");
  const [date, setDate] = useState(Date.now());
  const [users, setUsers] = useState([]);

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

  const writeDisplayName = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase
        .database()
        .ref("users/" + user.uid)
        .set({
          uid: user.uid,
          displayName: displayName,
        });
    }
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

  const getUserData = () => {
    let ref = firebase.database().ref("/");
    ref.on("value", (snapshot) => {
      const state = snapshot.val();
      setUsers(state);
      setDataRec(true);
    });
    console.log("DATA RETRIEVED", users);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser();
    // setLogin(false);
  };

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

  //   useEffect(() => {
  //     getUserData();
  //   }, [dataRec]);

  return {
    setUserID,
    loginUser,
    signOut,
    handleLogin,
    getUserData,
    writeDisplayName,
    createUser,
    writeUserData,
    displayName,
    setDisplayName,
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
