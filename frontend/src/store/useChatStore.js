import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  chatUsers: [],
  selectedUser: null,
  userSelected: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages");

      set({ users: data.users });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, userSelected, messages } = get();
  
    const userId = userSelected ? userSelected._id : selectedUser?._id;
  
    if (!userId) {
      toast.error("Please select a user to send a message.");
      return; 
    }
  
    try {
      const res = await axiosInstance.post(
        `/messages/send/${userId}`,
        messageData
      );
  
      if (res.data && res.data.newMessage) {
        set({ messages: [...messages, res.data.newMessage] });
        console.log("Message sent successfully:", res.data.newMessage);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || " An error occurred while sending the message.");
    }
  },
  

  getChatUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chat-users");
      set({ chatUsers: res.data.users });
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error fetching chat users:", error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, userSelected } = get();
    if (!selectedUser && !userSelected) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id || newMessage.senderId === userSelected._id;
      if (!isMessageSentFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  setUserSelected: (user) => {
    set({ userSelected: user });
  },
}));
