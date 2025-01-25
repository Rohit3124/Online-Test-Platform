import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiOutlineUserGroup } from "react-icons/hi";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const DashSidebar = () => {
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <Sidebar className="w-full md:w-56 ">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab === "students"}
              icon={HiOutlineUserGroup}
              as="div"
            >
              Students
            </Sidebar.Item>
          </Link>

          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
