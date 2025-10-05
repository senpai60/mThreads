import React from 'react'

function PostDisplayCard() {
  return (
    <div className="post mt-6 w-full md:w-1/3 bg-zinc-950 backdrop-blur-md rounded-2xl p-5 border-t-2 border-zinc-800/50 mb-10">
          <div className="post-header flex g justify-start  gap-5 mb-3">
            <div className="profile-pic w-10 h-10 rounded-full bg-zinc-700"></div>
            <div className="right w-80">
              <div className="right-header">
                <h1 className="font-semibold text-sm">username</h1>
                <p className="text-xs text-zinc-400">2h ago</p>
              </div>
              <div className="caption">
                <p>This is a caption for the post.</p>
              </div>
              <div className="post-media">
                <div className="media w-full h-60 bg-zinc-800 rounded-lg mt-3"></div>
              </div>
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
  )
}

export default PostDisplayCard