"use client";

import type React from "react";
import { Outlet } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useApp } from "@/contexts/AppContext";
// import Nav from "./Nav";

import Nav from "./Nav";
// import { signOut } from "@/lib/supabase"

const Layout: React.FC = () => {
  // const { user, theme, toggleTheme } = useApp();
  // const location = useLocation();

  // const handleSignOut = async () => {
  //   await signOut()
  // }

  // const navItems = [
  //   { path: "/", label: "Home" },
  //   { path: "/dashboard", label: "Dashboard" },
  //   { path: "/charts", label: "Charts" },
  //   { path: "/flow", label: "Flow" },
  //   { path: "/voice", label: "Voice AI" },
  // ];

  return (
    <div className="flex flex-col w-full h-full">
      <Nav withLogin={true}></Nav>
      <div className="flex w-full h-full justify-center">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Layout;
