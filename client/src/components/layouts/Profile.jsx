import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaThreads } from "react-icons/fa6";
import { HiCog6Tooth, HiArrowLeft } from "react-icons/hi2";
import PostDisplayCard from "../cards/PostDisplayCard";
import api from "../../../api/ServerApi";

function Profile({ user }) {
  // Get ID from URL. It will be undefined if navigating to /profile.
  const { profileId: urlProfileId } = useParams(); 
  const navigate = useNavigate();
  
  // State for the profile data being viewed
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine which profile ID to fetch. Defaults to logged-in user's profileId.
  const profileToFetchId = urlProfileId || user?.profileId; 
  
  // Core check: Is the profile currently being viewed the logged-in user's profile?
  const isOwnProfile = profileToFetchId === user?.profileId;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileToFetchId) {
        // Should only happen if user object is null, which is handled by App.jsx
        setLoading(false);
        return;
      }

      // If it's the current user's profile (no URL ID), use the secured /me endpoint.
      // Otherwise, use the public /:id endpoint.
      const endpoint = isOwnProfile 
        ? `/mthreads/profile/me` 
        : `/mthreads/profile/${profileToFetchId}`;

      try {
        setLoading(true);
        const res = await api.get(endpoint);
        setProfile(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Could not load profile. It may not exist or be private.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileToFetchId, isOwnProfile]);

  // --- Conditional Render: Loading/Error ---
  if (loading) {
    return (
      <div className="w-full h-dvh bg-zinc-950 flex justify-center items-center text-zinc-400">
        Loading Profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full h-dvh bg-zinc-950 text-zinc-200 p-5 text-center pt-20">
        <h2 className="text-xl font-bold">Error</h2>
        <p className="text-zinc-400 mt-2">{error || "Profile data is missing."}</p>
      </div>
    );
  }

  // --- Extract data from the fetched profile ---
  const { 
      fullname, 
      bio = 'No bio yet.',
      profilePictureUrl, 
      followers = [], 
      threadCount = 0 
  } = profile;
  
  // Note: The username is on the main 'user' object, not the 'profile' object (see server/models/User.js).
  // We use the logged-in user's username here, which is fine for the owner, but requires another fetch
  // or joining the Profile/User models on the server side to get the correct username for another user's profile.
  const displayUsername = isOwnProfile ? user?.username : 'threads_user'; // Placeholder for other user's username
  

  return (
    <div className="w-full min-h-dvh bg-zinc-950 text-zinc-200">
      
      {/* Fixed Header/Navigation */}
      <div className="heading fixed top-0 z-20 bg-zinc-950 text-white w-full flex justify-between items-center px-4 py-3 border-b-2 border-zinc-800/50 md:max-w-xl md:mx-auto">
        <HiArrowLeft onClick={() => navigate(-1)} className="w-6 h-6 cursor-pointer" /> 
        <h1 className="text-lg font-semibold inline">
            {displayUsername} <FaThreads className="inline w-4 h-4 text-zinc-400" />
        </h1>
        {/* Settings Button (Conditional: Only show if it's the own profile) */}
        {isOwnProfile ? (
          <HiCog6Tooth className="w-6 h-6 cursor-pointer" />
        ) : (
          <div className="w-6 h-6"></div> // Spacer for alignment
        )}
      </div>

      {/* Profile Content */}
      <div className="post-display w-full flex flex-col items-center pt-16 pb-20 overflow-y-scroll scrollbar-hide md:max-w-xl md:mx-auto">
        
        <div className="w-full px-5 pt-4">
          <div className="flex justify-between items-start mb-4">
            {/* Left: Info */}
            <div>
              <h2 className="text-3xl font-bold mb-1">{fullname}</h2> 
              <p className="text-sm text-zinc-400 mb-2">@{displayUsername}</p>
              <p className="text-sm mb-3 max-w-sm">{bio}</p>
              <p className="text-sm text-zinc-500">
                <span className="font-semibold text-zinc-300">{followers.length}</span> followers · <span className="font-semibold text-zinc-300">{threadCount}</span> posts
              </p>
            </div>
            {/* Right: Profile Picture */}
            <div 
              className="profile-pic w-16 h-16 rounded-full bg-zinc-700 shrink-0 border border-zinc-700/50" 
              style={{ backgroundImage: `url(${profilePictureUrl})`, backgroundSize: 'cover' }}
            ></div>
          </div>

          {/* Conditional Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button className="flex-1 p-2 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-800/50 transition">
              {/* Conditional: Edit Profile vs. Follow */}
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
        
        {/* Posts/Threads Content (Placeholder) */}
        <div className="w-full flex flex-col justify-center items-center">
            <PostDisplayCard /> 
            <PostDisplayCard />
        </div>

      </div>
    </div>
  );
}

export default Profile;