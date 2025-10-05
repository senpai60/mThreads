import React, { useEffect, useState } from "react";
import Navbar from "./components/layouts/Navbar";
import Home from "./components/layouts/Home";
import LoginSignup from "./components/auth/LoginSignup";
import Explore from "./components/layouts/Explore";
import AddPost from "./components/layouts/AddPost";
import Notifications from "./components/layouts/Notifications";
import Profile from "./components/layouts/Profile";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ to wait for localStorage check

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    setLoading(false); // ✅ done checking
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        Loading...
      </div>
    );
  }

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
            <Route path="/profile/:profileId?" element={<Profile user={user} />} />
            {/* Redirect all other routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/auth" element={<LoginSignup setUser={setUser} />} />
            {/* Redirect everything else to auth page */}
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
