import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StudentDashSidebar from "../components/studentDashSidebar";
import StudentExam from "../components/studentExam";
import StudentResult from "../components/studentResult";
const Home = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56 bg">
        <StudentDashSidebar />
      </div>
      {tab === "exams" && <StudentExam />}
      {tab === "results" && <StudentResult />}
    </div>
  );
};

export default Home;
