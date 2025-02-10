import { Outlet, useLocation } from "react-router-dom";
import Header from "./header";

export default function Layout() {
  const location = useLocation();

  const hideHeaderRoutes = ["/sign-in", "/sign-up"];

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Outlet />
    </>
  );
}
