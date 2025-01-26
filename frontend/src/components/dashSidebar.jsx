import { Sidebar } from "flowbite-react";
import { HiArrowSmRight } from "react-icons/hi";
import { PiStudent, PiExam } from "react-icons/pi";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const DashSidebar = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className="w-full md:w-56 ">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/admin-dashboard?tab=students">
            <Sidebar.Item active={tab === "students"} icon={PiStudent} as="div">
              Students
            </Sidebar.Item>
          </Link>
          <Link to="/admin-dashboard?tab=exam">
            <Sidebar.Item active={tab === "exam"} icon={PiExam} as="div">
              Exams
            </Sidebar.Item>
          </Link>

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
