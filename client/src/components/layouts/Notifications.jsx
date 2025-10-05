import React from "react";
import { HiHeart, HiUserPlus } from "react-icons/hi2"; 

// Simple dummy notification item component
const NotificationItem = ({ icon, text, time, type }) => {
    const iconColor = type === 'follow' ? 'text-blue-400' : 'text-red-500';

    return (
        <div className="flex items-start gap-4 p-4 border-b border-zinc-800/50 hover:bg-zinc-900 transition-colors duration-150">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor} bg-zinc-800/50 shrink-0 mt-1`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm">
                    <span className="font-semibold text-white">username</span> 
                    {text}
                </p>
                <p className="text-xs text-zinc-500 mt-1">{time}</p>
            </div>
        </div>
    );
};


function Notifications() {
  // Dummy notification data
  const notifications = [
    { id: 1, text: " liked your thread.", time: "1m ago", icon: <HiHeart className="w-5 h-5" />, type: 'like' },
    { id: 2, text: " started following you.", time: "1h ago", icon: <HiUserPlus className="w-5 h-5" />, type: 'follow' },
    { id: 3, text: " replied to your thread: \"Great post!\"", time: "3h ago", icon: <HiHeart className="w-5 h-5" />, type: 'reply' },
    { id: 4, text: " liked your reply.", time: "5h ago", icon: <HiHeart className="w-5 h-5" />, type: 'like' },
    { id: 5, text: " started following you.", time: "1d ago", icon: <HiUserPlus className="w-5 h-5" />, type: 'follow' },
  ];

  return (
    <div className="w-full min-h-dvh bg-zinc-950 text-zinc-200">
      
      {/* Fixed Header */}
      <div className="heading fixed top-0 z-20 bg-zinc-950 text-white w-full flex justify-center items-center text-xl font-bold border-b-2 border-zinc-800/50 py-3 md:max-w-xl md:mx-auto">
        <h2>Activity</h2>
      </div>

      {/* Notifications Content - Centered for larger screens */}
      <div className="w-full pt-14 pb-20 overflow-y-scroll scrollbar-hide md:max-w-xl md:mx-auto">
        <h3 className="text-sm text-zinc-500 font-medium px-4 py-2 mt-2">New</h3>
        
        {notifications.slice(0, 3).map(notif => (
            <NotificationItem key={notif.id} {...notif} />
        ))}

        <h3 className="text-sm text-zinc-500 font-medium px-4 py-2 mt-4">Earlier</h3>
        
        {notifications.slice(3).map(notif => (
            <NotificationItem key={notif.id} {...notif} />
        ))}

        {notifications.length === 0 && (
            <p className="text-center text-zinc-500 mt-10">No activity yet.</p>
        )}
      </div>
    </div>
  );
}

export default Notifications;