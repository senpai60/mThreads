import React, { useState, useEffect } from "react";
import { HiOutlinePhoto, HiXMark, HiTrash } from "react-icons/hi2";
import api from "../../../api/ServerApi";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [profile, setProfile] = useState(null);
  const MAX_LENGTH = 500;

  const navigate = useNavigate()

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await api.get("mthreads/profile/me");
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    getProfile();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...files].slice(0, 4)); // Limit max 4 images
  };

  // Remove selected file
  const removeFile = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && mediaFiles.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("content", content);
      mediaFiles.forEach((file) => formData.append("media", file));

      const res = await api.post("/mthreads/threads/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Posted thread:", res.data);
      setContent("");
      setMediaFiles([]);
      navigate("/")
    } catch (err) {
      console.error("Error posting thread:", err);
    }
  };

  return (
    <div className="w-full min-h-dvh bg-zinc-950 text-zinc-200">
      {/* Header */}
      <div className="fixed top-0 z-20 bg-zinc-950 text-white w-full flex justify-between items-center px-4 py-3 border-b-2 border-zinc-800/50 md:max-w-xl md:mx-auto">
        <button className="flex items-center text-zinc-400 hover:text-white transition">
          <HiXMark className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold">New Thread</h2>
        <button
          onClick={handleSubmit}
          className={`px-4 py-1 rounded-full text-sm font-bold transition ${
            (content.trim() || mediaFiles.length > 0) && content.length <= MAX_LENGTH
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
          disabled={!(content.trim() || mediaFiles.length > 0) || content.length > MAX_LENGTH}
        >
          Post
        </button>
      </div>

      {/* Form */}
      <form
        className="w-full pt-16 pb-20 px-5 md:max-w-xl md:mx-auto flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-4">
          {/* Profile Picture */}
          <div className="w-10 h-10 shrink-0">
            <img
              src={
                profile?.profilePictureUrl
                  ? `http://localhost:5000${profile.profilePictureUrl}`
                  : "https://placehold.co/150x150/0f172a/ffffff?text=PFP"
              }
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <p className="text-sm font-semibold">@{profile?.username}</p>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start a thread..."
              rows="4"
              maxLength={MAX_LENGTH}
              className="w-full bg-transparent resize-none text-lg text-white placeholder-zinc-500 focus:outline-none scrollbar-hide rounded-md p-2 border border-zinc-800"
            />

            {/* Image Upload */}
            <div className="flex items-center gap-2 mt-2">
              <label className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer">
                <HiOutlinePhoto className="w-6 h-6" />
                <span className="text-sm">Add Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <span className={`text-xs ml-auto ${content.length > MAX_LENGTH ? "text-red-500" : "text-zinc-500"}`}>
                {content.length} / {MAX_LENGTH}
              </span>
            </div>

            {/* Preview Selected Images */}
            {mediaFiles.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {mediaFiles.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddPost;
