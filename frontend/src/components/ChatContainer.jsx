import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { EllipsisVertical } from "lucide-react"; // 3-dot icon

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
  const [openMenuId, setOpenMenuId] = useState(null);

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
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
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

            <div className="chat-header mb-1 flex items-center justify-between relative">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>

              {/* 3-dot menu */}
              <div className="ml-2 relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === message._id ? null : message._id)
                  }
                  className="p-1 hover:bg-gray-700 rounded-full"
                >
                  <EllipsisVertical size={16} />
                </button>

                {openMenuId === message._id && (
                  <div className="absolute right-0 mt-1 w-40 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        deleteMessageForMe(message._id);
                        setOpenMenuId(null);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      Delete for me
                    </button>
                    {message.senderId === authUser._id && (
                      <button
                        onClick={() => {
                          deleteMessageForEveryone(message._id);
                          setOpenMenuId(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
                      >
                        Delete for everyone
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="chat-bubble flex flex-col">
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
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
