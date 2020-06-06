import React, { useState } from "react";
import firebase from "firebase";

const DisplayNameModel = () => {
  const [displayName, setDisplayName] = useState("");

  const writeDisplayName = () => {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true,
    });
    const userRef = db.collection("users").add({
      displayName: displayName,
      email: user.email,
      uid: user.uid,
    });
    setDisplayName("");
  };

//   const handleDisplayModel = () => {
//     writeDisplayName();
//   };

  return (
    <form
      style={{ width: "500px", height: "500px" }}
      onSubmit={writeDisplayName}
    >
      <h3>Enter a display name</h3>
      <label>
        Display Name
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </label>

      <input type="submit" value="Submit" />
    </form>
  );
};

export default DisplayNameModel;
