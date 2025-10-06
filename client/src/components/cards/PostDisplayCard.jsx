// File: senpai60/mthreads/.../client/src/components/cards/PostDisplayCard.jsx

import React, { useRef, useState, useEffect } from "react";
import { ImHeart } from "react-icons/im";

import api from "../../../api/ServerApi";

// FIX APPLIED: 'author' prop removed from signature
function PostDisplayCard({ thread }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  if (!thread) return null;

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(thread.likes?.length || 0);

  const mediaCount = thread?.mediaUrls?.length || 0;

  // Track which image is currently in view
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && thread.likes.includes(user.id)) {
      setLiked(true);
    }

    const el = carouselRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const width = el.clientWidth;
      const index = Math.round(scrollLeft / width);
      setCurrentIndex(index);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [thread]);

  // LikeFunction
  const likeThread = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    // instant visual feedback before waiting for backend
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    try {
      const res = await api.post("/mthreads/threads/like", {
        threadId: thread._id,
      });
      if (res.data.succes) {
        setLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      }
    } catch (err) {
      console.error("Error liking thread:", err);
    }
  };
  const commentThread = () => {};
  const shareThread = () => {};

  // FIX: New variable for DP URL using the nested path
  const fullProfilePictureUrl = thread?.author?.profile?.profilePictureUrl
    ? `${serverUrl}${thread.author.profile.profilePictureUrl}`
    : "https://placehold.co/150x150/0f172a/ffffff?text=PFP";

  return (
    <div className="post mt-6 w-full md:w-[30vw] bg-zinc-950 backdrop-blur-md rounded-2xl p-5 border-t-2 border-zinc-800/50 ">
      <div className="w-full post-header flex justify-start gap-5 mb-3">
        {/* Profile Pic */}
        <div
          className="profile-pic w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0"
          style={{
            backgroundImage: `url(${
              // FIX APPLIED: Directly use the calculated URL
              fullProfilePictureUrl
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="right w-full">
          {/* Post Header */}
          <div className="right-header flex justify-between items-center">
            <h1 className="font-semibold text-sm">
              {thread?.author?.username || "Unknown User"}
            </h1>
            <p className="text-xs text-zinc-400">
              {thread?.createdAt
                ? new Date(thread.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Unknown time"}
            </p>
          </div>

          {/* Post Caption */}
          <div className="caption mt-2">
            <p>{thread?.content || ""}</p>
          </div>

          {/* Post Media Carousel */}
          {mediaCount > 0 && (
            <div className="mt-3 relative group">
              {/* Carousel */}
              <div
                ref={carouselRef}
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 scroll-smooth cursor-grab active:cursor-grabbing select-none"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                }}
                onMouseDown={(e) => {
                  const el = carouselRef.current;
                  if (!el) return;
                  e.preventDefault();

                  let startX = e.pageX - el.offsetLeft;
                  let scrollLeft = el.scrollLeft;
                  let isDragging = true;

                  const onMouseMove = (moveEvent) => {
                    if (!isDragging) return;
                    const x = moveEvent.pageX - el.offsetLeft;
                    const walk = (x - startX) * 1.3;
                    el.scrollLeft = scrollLeft - walk;
                  };

                  const onMouseUp = () => {
                    isDragging = false;
                    const width = el.clientWidth;
                    const newIndex = Math.round(el.scrollLeft / width);
                    el.scrollTo({
                      left: newIndex * width,
                      behavior: "smooth",
                    });
                    window.removeEventListener("mousemove", onMouseMove);
                    window.removeEventListener("mouseup", onMouseUp);
                  };

                  window.addEventListener("mousemove", onMouseMove);
                  window.addEventListener("mouseup", onMouseUp);
                }}
              >
                {thread.mediaUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full md:w-80 lg:w-96 snap-center rounded-lg overflow-hidden aspect-[4/5]"
                  >
                    <img
                      src={`${serverUrl}${url}`}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                ))}
              </div>

              {/* ⬅️ Left Button (visible on md+ only) */}
              {mediaCount > 1 && (
                <button
                  onClick={() => {
                    const el = carouselRef.current;
                    if (!el) return;
                    const width = el.clientWidth;
                    const newIndex = Math.max(0, currentIndex - 1);
                    el.scrollTo({
                      left: newIndex * width,
                      behavior: "smooth",
                    });
                    setCurrentIndex(newIndex);
                  }}
                  className="hidden md:flex absolute top-1/2 left-2 -translate-y-1/2 bg-zinc-900/70 hover:bg-zinc-800/90 text-white p-2 rounded-full backdrop-blur-md transition opacity-0 group-hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
              )}

              {/* ➡️ Right Button (visible on md+ only) */}
              {mediaCount > 1 && (
                <button
                  onClick={() => {
                    const el = carouselRef.current;
                    if (!el) return;
                    const width = el.clientWidth;
                    const newIndex = Math.min(mediaCount - 1, currentIndex + 1);
                    el.scrollTo({
                      left: newIndex * width,
                      behavior: "smooth",
                    });
                    setCurrentIndex(newIndex);
                  }}
                  className="hidden md:flex absolute top-1/2 right-2 -translate-y-1/2 bg-zinc-900/70 hover:bg-zinc-800/90 text-white p-2 rounded-full backdrop-blur-md transition opacity-0 group-hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              )}

              {/* Dots Indicator */}
              <div className="flex justify-center mt-2 gap-2">
                {thread.mediaUrls.map((_, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-200 rounded-full ${
                      index === currentIndex
                        ? "w-3 h-3 bg-white"
                        : "w-2 h-2 bg-zinc-600"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Post Footer */}
          <div className="post-footer flex justify-between items-center mt-10">
            <button
              onClick={likeThread}
              className={`like-button transition text-zinc-400 hover:text-zinc-200 ${
                liked ? "text-red-500" : ""
              }`}
            >
              <ImHeart />
              <span className="ml-1 text-sm">{likeCount}</span>
            </button>

            <button className="comment-button text-zinc-400 hover:text-zinc-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-message-square-icon lucide-message-square"
              >
                <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button className="comment-button text-zinc-400 hover:text-zinc-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-share-icon lucide-share"
              >
                <path d="M12 2v13" />
                <path d="m16 6-4-4-4 4" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDisplayCard;
