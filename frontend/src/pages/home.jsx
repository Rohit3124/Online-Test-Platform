import { useContext, useEffect } from "react";
import { currentUserContext } from "../context/userContext";

const Home = () => {
  const { currentUser, setCurrentUser } = useContext(currentUserContext);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, [setCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);
  console.log(currentUser);
  return <div>Home</div>;
};

export default Home;
