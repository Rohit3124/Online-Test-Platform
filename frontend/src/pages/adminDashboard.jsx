import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/dashSidebar";
import Exam from "../components/exam";
import Students from "../components/students";

const AdminDashboard = () => {
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
        <DashSidebar />
      </div>
      {tab === "students" && <Students />}
      {tab === "exam" && <Exam />}
    </div>
  );
};

export default AdminDashboard;
