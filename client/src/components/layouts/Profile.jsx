import React from "react";
import { FaThreads } from "react-icons/fa6";
import { HiCog6Tooth, HiArrowLeft } from "react-icons/hi2";
import PostDisplayCard from "../cards/PostDisplayCard";

function Profile({user}) {
  const isOwnProfile = true; // Placeholder logic
  

  return (
    <div className="w-full min-h-dvh bg-zinc-950 text-zinc-200">
      
      {/* Fixed Header/Navigation */}
      <div className="heading fixed top-0 z-20 bg-zinc-950 text-white w-full flex justify-between items-center px-4 py-3 border-b-2 border-zinc-800/50 md:max-w-xl md:mx-auto">
        <HiArrowLeft className="w-6 h-6 cursor-pointer" />
        <h1 className="text-lg font-semibold inline">
            username <FaThreads className="inline w-4 h-4 text-zinc-400" />
        </h1>
        {isOwnProfile ? (
          <HiCog6Tooth className="w-6 h-6 cursor-pointer" />
        ) : (
          <div className="w-6 h-6"></div> // Spacer for alignment
        )}
      </div>

      {/* Profile Content - Centered for larger screens */}
      <div className="post-display w-full flex flex-col items-center pt-16 pb-20 overflow-y-scroll scrollbar-hide md:max-w-xl md:mx-auto">
        
        {/* Profile Header Block */}
        <div className="w-full px-5 pt-4">
          <div className="flex justify-between items-start mb-4">
            {/* Left: Info */}
            <div>
              <h2 className="text-3xl font-bold mb-1">Full Name</h2> 
              <p className="text-sm text-zinc-400 mb-2">@username</p>
              <p className="text-sm mb-3 max-w-sm">
                This is a placeholder bio for the user's profile. Decoupled from core authentication.
              </p>
              <p className="text-sm text-zinc-500">
                <span className="font-semibold text-zinc-300">120</span> followers · <span className="font-semibold text-zinc-300">30</span> posts
              </p>
            </div>
            {/* Right: Profile Picture */}
            <div className="profile-pic w-16 h-16 rounded-full bg-zinc-700 shrink-0 border border-zinc-700/50"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button className="flex-1 p-2 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-800/50 transition">
              {isOwnProfile ? 'Edit Profile' : 'Follow'}
            </button>
            <button className="flex-1 p-2 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-800/50 transition">
              Share Profile
            </button>
          </div>
        </div>

        {/* Tabs for Threads/Replies */}
        <div className="w-full flex justify-around mt-8 border-b border-zinc-800/50 sticky top-16 bg-zinc-950 z-10">
            <div className="py-3 px-4 text-white font-semibold border-b-2 border-white cursor-pointer">Threads</div>
            <div className="py-3 px-4 text-zinc-500 font-semibold hover:text-zinc-300 cursor-pointer">Replies</div>
        </div>
        
        {/* Posts/Threads Content */}
        <div className="w-full flex flex-col justify-center items-center">
            <PostDisplayCard />
            <PostDisplayCard />
            <PostDisplayCard />
            <PostDisplayCard />
        </div>

      </div>
    </div>
  );
}

export default Profile;