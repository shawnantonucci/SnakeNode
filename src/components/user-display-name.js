import React, { useContext } from "react";
import { UserContext } from "../context/user-context";

export default function UserNameDisplay() {
  const [count] = useContext(UserContext);

  return (
    <UserNameDisplay.Provider value={[displayName, setDisplayName]}>
      {props.children}
    </UserNameDisplay.Provider>
  );
}
