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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
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
