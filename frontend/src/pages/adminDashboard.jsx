import { useState, useEffect, useContext } from "react";
import DashSidebar from "../components/dashSidebar";

const AdminDashboard = () => {
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
    </div>
  );
};

export default AdminDashboard;
