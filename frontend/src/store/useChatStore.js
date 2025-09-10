import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] }); // ✅ apne local state me add kar diya
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
  const { selectedUser } = get();
  if (!selectedUser) return;

  const socket = useAuthStore.getState().socket;
  socket.off("newMessage");
  socket.off("messageDeleted");

  socket.on("newMessage", (newMessage) => {
    if (
      newMessage.senderId === selectedUser._id ||
      newMessage.receiverId === selectedUser._id
    ) {
      set({ messages: [...get().messages, newMessage] });
    }
  });

  socket.on("messageDeleted", ({ messageId, type }) => {
    set({
      messages: get().messages.map((msg) =>
        msg._id === messageId
          ? type === "everyone"
            ? { ...msg, isDeletedForEveryone: true }
            : msg
          : msg
      ),
    });
  });
},

deleteMessageForMe: async (messageId) => {
  try {
    await axiosInstance.delete(`/messages/${messageId}/deleteForMe`);
    set({
      messages: get().messages.filter((msg) => msg._id !== messageId),
    });
  } catch (err) {
    toast.error("Failed to delete message for me");
  }
},

deleteMessageForEveryone: async (messageId) => {
  try {
    await axiosInstance.delete(`/messages/${messageId}/deleteForEveryone`);
    set({
      messages: get().messages.map((msg) =>
        msg._id === messageId ? { ...msg, isDeletedForEveryone: true } : msg
      ),
    });
  } catch (err) {
    toast.error("Failed to delete message for everyone");
  }
},


  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    console.log("🛑 Removing all newMessage listeners...");
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
