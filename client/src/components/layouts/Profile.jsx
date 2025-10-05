import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaThreads } from "react-icons/fa6";
import { HiCog6Tooth, HiArrowLeft, HiOutlinePhoto } from "react-icons/hi2";
import PostDisplayCard from "../cards/PostDisplayCard";
import api from "../../../api/ServerApi";

// Base URL for the uploaded profile pictures
const SERVER_BASE_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

// --- Utility function to resolve URL ---
const resolveImageUrl = (url) => {
  if (!url) return "https://placehold.co/150x150/0f172a/ffffff?text=PFP";
  return url.startsWith("http") ? url : SERVER_BASE_URL + url;
};

// --- Edit Profile Form Component ---
const EditProfileForm = ({ profile, setIsEditing, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    fullname: profile.fullname,
    bio: profile.bio,
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    resolveImageUrl(profile.profilePictureUrl)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateError(null);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setUpdateError(null);

    // 1. Create FormData object for multipart/form-data
    const data = new FormData();
    data.append("fullname", formData.fullname);
    data.append("bio", formData.bio);
    if (file) {
      // IMPORTANT: 'dp' must match the field name in uploadMiddleware.single("dp")
      data.append("dp", file);
    }

    try {
      // 2. Send PUT request to the secured /me endpoint
      const res = await api.put(`/mthreads/profile/me`, data);

      // 3. Update parent state with the new profile data
      onProfileUpdated(res.data.profile);
      setIsEditing(false); // Close the form
    } catch (err) {
      console.error("Profile update failed:", err);
      setUpdateError(
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full px-5 pt-4 bg-zinc-900 rounded-lg pb-6 md:max-w-xl md:mx-auto">
      <h3 className="text-xl font-bold mb-4 border-b border-zinc-800 pb-2">
        Edit Profile
      </h3>
      <form onSubmit={onSubmit}>
        {/* Profile Picture Upload */}
        <div className="flex items-center justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full bg-zinc-700 shrink-0 border border-zinc-700/50 relative group"
            style={{
              backgroundImage: `url(${previewUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <input
              type="file"
              id="dp-upload" // Changed ID to dp-upload
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label
              htmlFor="dp-upload" // Changed htmlFor to dp-upload
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
              title="Change profile picture"
            >
              <HiOutlinePhoto className="w-6 h-6 text-white" />
            </label>
          </div>
        </div>

        {/* Full Name Input */}
        <div className="mb-4">
          <label className="text-sm text-zinc-400 block mb-1">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={onChange}
            className="w-full p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            maxLength={100}
            required
          />
        </div>

        {/* Bio Input */}
        <div className="mb-6">
          <label className="text-sm text-zinc-400 block mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={onChange}
            rows="3"
            className="w-full p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            maxLength={200}
          ></textarea>
        </div>

        {updateError && (
          <p className="text-red-500 text-sm mb-4">{updateError}</p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              isSaving
                ? "bg-blue-800 text-zinc-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Main Profile Component ---
function Profile({ user }) {
  const { profileId: urlProfileId } = useParams();
  const navigate = useNavigate();

  const [threads, setThreads] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const profileToFetchId = urlProfileId || user?.profileId;
  const isOwnProfile = profileToFetchId === user?.profileId;

  // Handle updates from the Edit form
  const handleProfileUpdated = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  useEffect(() => {
    // Reset editing state whenever the profile changes (e.g., viewing another user)
    setIsEditing(false);
    const fetchThreads = async () => {
      try {
        const res = await api.get("/mthreads/threads/mythreads");
        setThreads(res.data.threads);
        
      } catch (err) {
        console.error("Failed to fetch threads:", err);
      }
    };
    const fetchProfile = async () => {
      if (!profileToFetchId) {
        setLoading(false);
        return;
      }

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
        setError(
          err.response?.data?.msg ||
            "Could not load profile. It may not exist or be private."
        );
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchThreads();
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
        <p className="text-zinc-400 mt-2">
          {error || "Profile data is missing."}
        </p>
      </div>
    );
  }

  // --- Display Data ---
  const {
    fullname,
    bio = "No bio yet.",
    profilePictureUrl,
    followers = [],
    threadCount = 0,
  } = profile;

  const displayUsername = user?.username || "threads_user";
  const fullProfilePictureUrl = resolveImageUrl(profilePictureUrl);

  // Render the Edit Form if in editing mode AND it's the user's own profile
  if (isEditing && isOwnProfile) {
    // Full screen takeover for editing
    return (
      <div className="w-full min-h-dvh bg-zinc-950 pt-20">
        <EditProfileForm
          profile={profile}
          setIsEditing={setIsEditing}
          onProfileUpdated={handleProfileUpdated}
        />
      </div>
    );
  }

  // Render the Profile View
  return (
    <div className="w-full min-h-dvh bg-zinc-950 text-zinc-200">
      {/* Fixed Header/Navigation */}
      <div className="heading fixed top-0 z-20 bg-zinc-950 text-white w-full flex justify-between items-center px-4 py-3 border-b-2 border-zinc-800/50 md:max-w-xl md:mx-auto">
        <HiArrowLeft
          onClick={() => navigate(-1)}
          className="w-6 h-6 cursor-pointer"
        />
        <h1 className="text-lg font-semibold inline">
          {displayUsername}{" "}
          <FaThreads className="inline w-4 h-4 text-zinc-400" />
        </h1>
        {isOwnProfile ? (
          <HiCog6Tooth className="w-6 h-6 cursor-pointer" />
        ) : (
          <div className="w-6 h-6"></div>
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
                <span className="font-semibold text-zinc-300">
                  {followers.length}
                </span>{" "}
                followers ·{" "}
                <span className="font-semibold text-zinc-300">
                  {threadCount}
                </span>{" "}
                posts
              </p>
            </div>
            {/* Right: Profile Picture */}
            <div
              className="profile-pic w-16 h-16 rounded-full bg-zinc-700 shrink-0 border border-zinc-700/50"
              style={{
                backgroundImage: `url(${fullProfilePictureUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>

          {/* Conditional Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              className="flex-1 p-2 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-800/50 transition"
              onClick={() => isOwnProfile && setIsEditing(true)}
            >
              {isOwnProfile ? "Edit Profile" : "Follow"}
            </button>
            <button className="flex-1 p-2 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-800/50 transition">
              Share Profile
            </button>
          </div>
        </div>

        {/* Tabs for Threads/Replies */}
        <div className="w-full flex justify-around mt-8 border-b border-zinc-800/50 sticky top-16 bg-zinc-950 z-10">
          <div className="py-3 px-4 text-white font-semibold border-b-2 border-white cursor-pointer">
            Threads
          </div>
          <div className="py-3 px-4 text-zinc-500 font-semibold hover:text-zinc-300 cursor-pointer">
            Replies
          </div>
        </div>

        {/* Posts/Threads Content (Placeholder) */}
        <div className="w-full flex flex-col justify-center items-center">
          {threads && threads.length > 0 ? (
            threads.map((thread, index) => (
              <PostDisplayCard key={thread._id} thread={thread} />
            ))
          ) : (
            <p className="text-zinc-500 mt-6">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
