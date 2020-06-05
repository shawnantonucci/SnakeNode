import React, { useState } from "react";
import Login from "./login";
import Register from "./signup";
import User from "./user";

const AuthenticateScreen = () => {
  const { authChoice, setAuthChoice } = User();

  return (
    <>
      <button onClick={() => setAuthChoice(!authChoice)}>
        {authChoice ? "Switch to Register" : "Switch to Login"}
      </button>
      {authChoice ? <Login /> : <Register />}
    </>
  );
};

export default AuthenticateScreen;
