import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessageForMe,
    deleteMessageForEveryone,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [hoveredMsgId, setHoveredMsgId] = useState(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    unsubscribeFromMessages();
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`relative group chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
            onMouseEnter={() => setHoveredMsgId(message._id)}
            onMouseLeave={() => setHoveredMsgId(null)}
          >
            {/* Avatar */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar_icon.png"
                      : selectedUser.profilePic || "/avatar_icon.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            {/* Message bubble */}
            <div className="chat-bubble flex flex-col relative">
              {message.isDeletedForEveryone ? (
                <p className="italic text-gray-400">This message was deleted</p>
              ) : (
                <>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </>
              )}

              {/* Time */}
              <time className="text-[10px] opacity-50 mt-1 self-end">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Hover Delete Options (WhatsApp style) */}
            {hoveredMsgId === message._id && (
              <div
                className={`absolute top-0 ${
                  message.senderId === authUser._id ? "-left-20" : "-right-20"
                } bg-gray-800 text-white text-xs rounded-md shadow-md p-1 flex flex-col z-10`}
              >
                <button
                  onClick={() => deleteMessageForMe(message._id)}
                  className="px-2 py-1 hover:bg-red-500 rounded-md"
                >
                  Delete for me
                </button>
                {message.senderId === authUser._id && (
                  <button
                    onClick={() => deleteMessageForEveryone(message._id)}
                    className="px-2 py-1 hover:bg-red-600 rounded-md"
                  >
                    Delete for everyone
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
