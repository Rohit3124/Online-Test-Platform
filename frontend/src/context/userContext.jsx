import { useState, useContext, createContext } from "react";
export const currentUserContext = createContext();

const UserContext = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("");
  return (
    <currentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </currentUserContext.Provider>
  );
};

export default UserContext;
