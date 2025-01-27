import { createContext, useState, useEffect } from "react";

export const currentUserContext = createContext();

export const UserContext = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  return (
    <currentUserContext.Provider
      value={{ currentUser, setCurrentUser, isLoading, setIsLoading }}
    >
      {children}
    </currentUserContext.Provider>
  );
};

export default UserContext;
