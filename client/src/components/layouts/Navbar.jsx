import React from "react";
import { HiHome } from "react-icons/hi";
import { HiSearch } from "react-icons/hi";
import { HiPlusCircle } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";
import { HiUser } from "react-icons/hi";

function Navbar() {
    const iconClass = "w-7 h-7 cursor-pointer hover:scale-110 transition-all duration-200 ease-in-out";
    const icons = {
      home: <HiHome className={iconClass} />,
      search: <HiSearch className={iconClass} />,
      post: <HiPlusCircle className={iconClass} />,
      notification: <HiHeart className={iconClass} />,
      profile: <HiUser className={iconClass} />,
    };
  return (
    <div className="w-full fixed z-10 bottom-5 px-10 flex justify-center items-center">
      <div className="w-full md:w-1/3 rounded-[32px] flex justify-center items-center bg-zinc-900/80 backdrop-blur-md py-3 px-5">
        <div className="link-icons flex justify-between items-center w-full max-w-lg">
          {["home", "search", "post", "notification", "profile"].map((icon,index) => (
            <div key={icon} className="link-icon">
              {icons[icon]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
