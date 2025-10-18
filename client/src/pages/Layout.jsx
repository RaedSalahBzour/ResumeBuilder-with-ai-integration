import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Layout;
