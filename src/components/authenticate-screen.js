import React, { useState } from "react";
import Login from "./login";
import Register from "./signup";
import User from "./user";

const AuthenticateScreen = () => {
  const { authChoice, setAuthChoice } = User();

  return (
    <>
      {authChoice ? <Login /> : <Register />}
      <button onClick={() => setAuthChoice(!authChoice)}>
        {authChoice ? "Register Account" : "Login to the game"}
      </button>
    </>
  );
};

export default AuthenticateScreen;
