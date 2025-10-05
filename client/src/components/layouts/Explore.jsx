import React from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import PostDisplayCard from "../cards/PostDisplayCard";

function Explore() {
  return (
    <div className="w-full min-h-dvh bg-zinc-950 text-zinc-200">
      
      {/* Fixed Header/Search Bar */}
      <div className="fixed top-0 z-20 bg-zinc-950 w-full px-4 py-3 border-b-2 border-zinc-800/50 md:max-w-xl md:mx-auto">
        <div className="flex items-center bg-zinc-800/50 rounded-lg px-3 py-2">
            <HiMagnifyingGlass className="w-5 h-5 text-zinc-400 mr-2" />
            <input 
                type="text" 
                placeholder="Search" 
                className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none"
            />
        </div>
      </div>

      {/* Explore Content - Scrollable feed (list of posts for simplicity) */}
      <div className="post-display w-full h-full flex flex-col justify-start items-center pt-16 pb-20 gap-5 overflow-y-scroll scrollbar-hide md:max-w-xl md:mx-auto">
        
        <h3 className="w-full px-4 pt-2 text-lg font-semibold">Suggested Threads</h3>
        
        {/* Repeating posts to simulate an explore feed */}
        <PostDisplayCard />
        <PostDisplayCard />
        <PostDisplayCard />
        <PostDisplayCard />
        <PostDisplayCard />
      </div>
    </div>
  );
}

export default Explore;