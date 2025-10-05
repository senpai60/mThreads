import React from "react";
import { useNavigate } from "react-router-dom";
import { HiHome, HiSearch, HiPlusCircle, HiHeart, HiUser } from "react-icons/hi";

function Navbar() {
  const navigate = useNavigate();

  const iconClass = "w-7 h-7 cursor-pointer hover:scale-110 transition-all duration-200 ease-in-out";

  // Map icons to routes
  const navItems = [
    { icon: <HiHome className={iconClass} />, path: "/" },
    { icon: <HiSearch className={iconClass} />, path: "/explore" },
    { icon: <HiPlusCircle className={iconClass} />, path: "/addpost" },
    { icon: <HiHeart className={iconClass} />, path: "/notifications" },
    { icon: <HiUser className={iconClass} />, path: "/profile" },
  ];

  return (
    <div className="w-full fixed z-10 bottom-5 px-10 flex justify-center items-center">
      <div className="w-full md:w-1/3 rounded-[32px] flex justify-center items-center bg-zinc-900/80 backdrop-blur-md py-3 px-5">
        <div className="link-icons flex justify-between items-center w-full max-w-lg">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="link-icon"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
