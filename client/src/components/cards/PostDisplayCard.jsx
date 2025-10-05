import React, { useRef, useState, useEffect } from "react";

function PostDisplayCard({ thread, author }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  if (!thread) return null;

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mediaCount = thread?.mediaUrls?.length || 0;

  // Track which image is currently in view
  useEffect(() => {
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
  }, []);
  const profilePic = author?.profilePictureUrl
    ? `${serverUrl}${author.profilePictureUrl}`
    : "https://placehold.co/150x150/0f172a/ffffff?text=PFP";

  return (
    <div className="post mt-6 w-full md:w-[30vw] bg-zinc-950 backdrop-blur-md rounded-2xl p-5 border-t-2 border-zinc-800/50 mb-10">
      <div className="w-full post-header flex justify-start gap-5 mb-3">
        {/* Profile Pic */}
        <div
          className="profile-pic w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0"
          style={{
            backgroundImage: `url(${
              author?.profilePictureUrl ||
              "https://placehold.co/150x150/0f172a/ffffff?text=PFP"
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
            <div className="mt-3">
              <div
                ref={carouselRef}
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 scroll-smooth cursor-grab"
              >
                {thread.mediaUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full md:w-80 lg:w-96 snap-start rounded-lg overflow-hidden"
                  >
                    <img
                      src={`${serverUrl}${url}`}
                      alt={`Media ${index + 1}`}
                      className="w-full h-60 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>

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
          <div className="post-footer flex justify-between items-center mt-3">
            <button className="like-button text-zinc-400 hover:text-zinc-200">
              Like
            </button>
            <button className="comment-button text-zinc-400 hover:text-zinc-200">
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDisplayCard;
