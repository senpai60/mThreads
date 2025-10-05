import React from "react";
import { FaThreads } from "react-icons/fa6";

import PostDisplayCard from "../cards/PostDisplayCard";
import api from "../../../api/ServerApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

function Home() {

  const [threads, setThreads] = useState([]);
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get("/mthreads/threads");
        setThreads(res.data.threads);
        console.log(res.data.threads);
      } catch (err) {
        console.error("Failed to fetch threads:", err);
      }
    };
    fetchThreads();
  }, []);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await api.post("/mthreads/users/logout");
    } catch (err) {
      console.log("Logout API error:", err);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/auth"; // force redirect
  };

  return (
    <div className="w-full h-dvh bg-zinc-950">
      <div className="post-display w-full h-full flex flex-col justify-start items-center pt-3 gap-5 overflow-y-scroll scrollbar-hide">
        <div className="heading fixed top-0 z-20 bg-zinc-950 text-white w-full flex justify-center items-center text-1xl border-b-2 border-zinc-800/50 pb-3 mb-3 ">
          <h1 className="inline">
            Thre
            <FaThreads className="inline" />
            ds
          </h1>
          <button
            className="ml-10"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
        {threads && threads.length > 0 ? (
          threads.map((thread) => (
            <PostDisplayCard key={thread._id} thread={thread} author={thread.author}/>
          ))
        ) : (
          <p className="text-zinc-500 mt-6">No posts yet.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
