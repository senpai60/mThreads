import React from "react";
import { FaThreads } from "react-icons/fa6";

import PostDisplayCard from "../cards/PostDisplayCard";

function Home() {
  return (
    <div className="w-full h-dvh bg-zinc-950">
      <div className="post-display w-full h-full flex flex-col justify-start items-center pt-3 gap-5 overflow-y-scroll scrollbar-hide">
        <div className="heading fixed top-0 z-20 bg-zinc-950 text-white w-full flex justify-center items-center text-1xl border-b-2 border-zinc-800/50 pb-3 mb-3 ">
            <h1 className="inline">Thre<FaThreads className="inline" />ds</h1>
        </div>
        
        <PostDisplayCard />
        <PostDisplayCard />
      </div>
    </div>
  );
}

export default Home;
