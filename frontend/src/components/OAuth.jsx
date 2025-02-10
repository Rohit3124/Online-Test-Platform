import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        decoded.isAdmin = false;
        localStorage.setItem("currentUser", JSON.stringify(decoded));
        navigate("/student?tab=exams");
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
};

export default OAuth;
