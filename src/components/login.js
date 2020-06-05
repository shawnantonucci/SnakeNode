import React from "react";
import User from "./user";

function login() {
  const { setEmail, setPassword, handleLogin, email, password } = User();

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
      <input type="submit" value="Login" />
    </form>
  );
}

export default login;
