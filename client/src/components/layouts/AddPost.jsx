import React, { useState } from "react";
import { HiOutlinePhoto, HiXMark } from "react-icons/hi2";

function AddPost() {
  const [content, setContent] = useState('');
  const MAX_LENGTH = 500; // Based on ThreadSchema content maxLength

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() && content.length <= MAX_LENGTH) {
      console.log('Posting thread:', content);
      // TODO: Implement API call to post new thread
      setContent('');
    }
  };

  return (
    <div className="w-full min-h-dvh bg-zinc-950 text-zinc-200">
      
      {/* Fixed Header */}
      <div className="fixed top-0 z-20 bg-zinc-950 text-white w-full flex justify-between items-center px-4 py-3 border-b-2 border-zinc-800/50 md:max-w-xl md:mx-auto">
        <button className="flex items-center text-zinc-400 hover:text-white transition">
            <HiXMark className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold">New Thread</h2>
        <button 
            onClick={handleSubmit}
            className={`px-4 py-1 rounded-full text-sm font-bold transition ${
                content.length > 0 && content.length <= MAX_LENGTH 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
            disabled={content.length === 0 || content.length > MAX_LENGTH}
        >
            Post
        </button>
      </div>

      {/* Post Creation Form - Centered for larger screens */}
      <div className="w-full pt-16 pb-20 px-5 md:max-w-xl md:mx-auto">
        
        <div className="flex gap-4 pt-4">
            {/* Profile Pic Placeholder */}
            <div className="w-10 h-10 rounded-full bg-zinc-700 shrink-0"></div>
            
            <div className="flex-1">
                <p className="text-sm font-semibold mb-2">@current_user</p>
                
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start a thread..."
                    rows="6"
                    maxLength={MAX_LENGTH}
                    className="w-full bg-transparent resize-none text-lg text-white placeholder-zinc-500 focus:outline-none scrollbar-hide"
                ></textarea>

                {/* Media/Action Buttons */}
                <div className="flex justify-between items-center mt-4 border-t border-zinc-800/50 pt-3">
                    <button className="text-zinc-400 hover:text-white transition">
                        <HiOutlinePhoto className="w-6 h-6" />
                    </button>
                    
                    {/* Character Count */}
                    <span className={`text-xs ${content.length > MAX_LENGTH ? 'text-red-500' : 'text-zinc-500'}`}>
                        {content.length} / {MAX_LENGTH}
                    </span>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}

export default AddPost;