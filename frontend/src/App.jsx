import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import PrivateRoute from "./components/privateRoute";
import OnlyAdminPrivateRoute from "./components/onlyAdminPrivateRoute";
import AdminDashboard from "./pages/adminDashboard";
import ExamDetails from "./pages/ExamDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
          <Route
            path="/admin-dashboard/exam/:testId"
            element={<ExamDetails />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
