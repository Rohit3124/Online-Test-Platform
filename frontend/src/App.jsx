import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import PrivateRoute from "./components/privateRoute";
import OnlyAdminPrivateRoute from "./components/onlyAdminPrivateRoute";
import AdminDashboard from "./pages/adminDashboard";
import ExamDetails from "./pages/ExamDetails";
import QuestionPaper from "./pages/questionPaper";
import Start from "./pages/start";
import ResultPage from "./pages/resultPage";
import Layout from "./components/layout";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  return (
    <GoogleOAuthProvider clientId="682354252232-sajs087p1582s2ep33g9rmimj9g04ktu.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route element={<Layout />}>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Start />} />
              <Route path="/student" element={<Home />} />
              <Route
                path="/student/question-paper/:testId"
                element={<QuestionPaper />}
              />
              <Route
                path="/student/exam-result/:resultId"
                element={<ResultPage />}
              />
            </Route>

            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route
                path="/admin-dashboard/exam/:testId"
                element={<ExamDetails />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
