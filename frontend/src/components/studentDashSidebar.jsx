import { Sidebar } from "flowbite-react";
import { HiArrowSmRight } from "react-icons/hi";
import { PiStudent, PiExam } from "react-icons/pi";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { currentUserContext } from "../context/userContext";
const StudentDashSidebar = () => {
  const { setCurrentUser } = useContext(currentUserContext);
  const location = useLocation();
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
      await res.json();
      if (res.ok) {
        navigate("/sign-in");
        setCurrentUser(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className="w-full md:w-56 ">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/student?tab=exams">
            <Sidebar.Item active={tab === "exams"} icon={PiExam} as="div">
              Exams
            </Sidebar.Item>
          </Link>
          <Link to="/student?tab=results">
            <Sidebar.Item active={tab === "results"} icon={PiStudent} as="div">
              Results
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

export default StudentDashSidebar;
