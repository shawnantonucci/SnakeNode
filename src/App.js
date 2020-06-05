import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  MINE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants";
import firebase from "firebase";
import firebaseConfig from "./config";

const App = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [mine, setMine] = useState(MINE_START);
  const [direction, setDirection] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [boundaryHit, setBoundaryHit] = useState(false);
  const [mineHit, setMineHit] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [dataRec, setDataRec] = useState(false);
  const [signup, setSignup] = useState(false);
  const [login, setLogin] = useState(false);
  const [message, setMessage] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserID] = useState("");
  const [score, setScore] = useState(0);
  const [date, setDate] = useState(Date.now());
  const [auth, setAuth] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var email = user.email;
      var uid = user.uid;
      setAuth(true);
      console.log("Online");
      writeDisplayName();
    } else {
      // User is signed out.
      console.log("Offline");
      return setAuth(false);
    }
  });

  const createUser = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // ...
        return setGameStart(false);
      });
    return setGameStart(true);
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
        // ...
        return setGameStart(false);
      });
    return setGameStart(true);
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
      setLoggedIn(true);
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

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("signed");
    createUser();
    setSignup(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("login");
    loginUser();
    setLogin(false);
  };

  const signUp = () => {
    return (
      <form style={{ width: "500px", height: "500px" }} onSubmit={handleSignUp}>
        <h3>Register</h3>
        <label>
          DisplayName
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          password
          <input
            type="passwword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
        <button onClick={() => setSignup(false)}>Back</button>
      </form>
    );
  };
  const _login = () => {
    return (
      <form style={{ width: "500px", height: "500px" }} onSubmit={handleLogin}>
        <h3>Login</h3>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          password
          <input
            type="passwword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
        <button onClick={() => setLogin(false)}>Back</button>
      </form>
    );
  };

  const authenticate = () => {
    return (
      <div>
        <button onClick={() => setSignup(true)}>Signup</button>
        <button onClick={() => setLogin(true)}>Login</button>
      </div>
    );
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDirection([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
    setMineHit(false);
    setGameStart(true);
  };

  const endGame = () => {
    writeUserData(score);
    setSpeed(null);
    setGameOver(true);
    setGameStart(false);
  };

  const moveSnake = ({ keyCode }) => {
    keyCode >= 37 && keyCode <= 40 && setDirection(DIRECTIONS[keyCode]);
  };

  const spawnApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));
  const spawnMine = () =>
    mine.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (head, snk = snake) => {
    if (
      head[0] * SCALE >= CANVAS_SIZE[0] ||
      head[0] < 0 ||
      head[1] * SCALE >= CANVAS_SIZE[1] ||
      head[1] < 0
    ) {
      setBoundaryHit(true);
      return true;
    }
    for (const segment of snk) {
      if (head[0] === segment[0] && head[1] === segment[1]) {
        setBoundaryHit(false);
        return true;
      }
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    let newScore = score;
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = spawnApple();
      let newMine = spawnMine();
      while (checkCollision(newApple, newSnake)) {
        newApple = spawnApple();
        newMine = spawnMine();
      }
      setApple(newApple);
      setMine(newMine);
      newScore += 1;
      setScore(newScore);
      console.log(newScore);
      return true;
    }
    return false;
  };

  const checkMineCollision = (newSnake) => {
    if (newSnake[0][0] === mine[0] && newSnake[0][1] === mine[1]) {
      setMineHit(true);
      let newMine = spawnMine();
      while (checkCollision(newMine, newSnake)) {
        newMine = spawnMine();
      }
      setMine(newMine);
      return true;
    }
    setMineHit(false);
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [
      snakeCopy[0][0] + direction[0],
      snakeCopy[0][1] + direction[1],
    ];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) {
      endGame();
    }
    if (!checkAppleCollision(snakeCopy)) {
      snakeCopy.pop();
    }
    if (checkMineCollision(snakeCopy)) {
      setMineHit(true);
    }
    setSnake(snakeCopy);
  };

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

  useEffect(() => {
    if (boundaryHit) {
      setMessage("Hit the end of the world");
    } else {
      setMessage("You ate yourself");
    }
  }, [boundaryHit]);

  useEffect(() => {
    if (mineHit) {
      setMessage("Boom!!!");
      endGame();
    }
  }, [mineHit]);

  useEffect(() => {
    getUserData();
  }, [dataRec]);

  useInterval(() => gameLoop(), speed);

  return (
    <div role="button" tabIndex="0" onKeyDown={(e) => moveSnake(e)}>
      <canvas
        style={{ border: "1px solid black" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div>{message}... Game Over</div>}
      {gameStart && <div>Arrow keys to move around</div>}
      {signup && signUp()}
      {login && _login()}
      {auth && <div>Score: {score}</div>}
      {auth && <button onClick={startGame}>Start Game</button>}
      {auth && <button onClick={signOut}>Sign Out</button>}
      {!auth && authenticate()}
    </div>
  );
};

export default App;
