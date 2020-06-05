import React from "react";
import User from "./user";

function signup() {
  const {
    createUser,
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
  } = User();

  const handleSignUp = (e) => {
    e.preventDefault();
    createUser();
  };

  return (
    <>
      <>
        <form
          style={{ width: "500px", height: "500px" }}
          onSubmit={handleSignUp}
        >
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
        </form>
      </>
    </>
  );
}

export default signup;
