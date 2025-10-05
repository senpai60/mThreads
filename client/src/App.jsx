import React, { useEffect, useState } from "react";
import Navbar from "./components/layouts/Navbar";
import Home from "./components/layouts/Home";
import LoginSignup from "./components/auth/LoginSignup";
import Explore from "./components/layouts/Explore";
import AddPost from "./components/layouts/AddPost";
import Notifications from "./components/layouts/Notifications";
import Profile from "./components/layouts/Profile";
import { Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <div className="text-zinc-200 overflow-x-hidden">
      {user && <Navbar />}
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/addpost" element={<AddPost />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile user={user}/>} />
          </>
        ) : (
          <Route path="*" element={<LoginSignup setUser={setUser} />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
