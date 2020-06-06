import React from "react";
import Login from "./login";
import Register from "./signup";
import User from "./user";

const AuthenticateScreen = () => {
  const { authChoice, setAuthChoice } = User();

  return (
    <>
      <button onClick={() => setAuthChoice(!authChoice)}>
        {authChoice ? "Switch to Login" : "Switch to Register"}
      </button>
      {authChoice ? <Register /> : <Login />}
    </>
  );
};

export default AuthenticateScreen;
