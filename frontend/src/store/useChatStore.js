import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  chatUsers: [],
  selectedUser: null,

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
    const { selectedUser, userSelected, messages, chatUsers } = get();

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

        const updatedChatUsers = chatUsers.map((user) => {
          if (
            user._id === res.data.newMessage.senderId ||
            user._id === res.data.newMessage.receiverId
          ) {
            return { ...user, lastMessage: res.data.newMessage };
          }
          return user;
        });

        const userExists = updatedChatUsers.some(
          (user) =>
            user._id === res.data.newMessage.senderId ||
            user._id === res.data.newMessage.receiverId
        );
        if (!userExists) {
          updatedChatUsers.push({
            _id: res.data.newMessage.senderId,
            fullName: res.data.newMessage.fullName,
            lastMessage: res.data.newMessage,
          });
        }

        // Chat kullanıcıları sıralanır
        updatedChatUsers.sort((a, b) => {
          const lastMessageA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
          const lastMessageB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
          return lastMessageB - lastMessageA;
        });

        set({ chatUsers: updatedChatUsers });

        console.log("Message sent successfully:", res.data.newMessage);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while sending the message."
      );
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
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { messages, chatUsers, selectedUser, userSelected } = get();

      const isMessageRelevant =
        (selectedUser &&
          (newMessage.senderId === selectedUser._id ||
            newMessage.receiverId === selectedUser._id)) ||
        (userSelected &&
          (newMessage.senderId === userSelected._id ||
            newMessage.receiverId === userSelected._id));

      if (isMessageRelevant) {
        set({ messages: [...messages, newMessage] });
      }

      const updatedChatUsers = chatUsers.map((user) => {
        if (
          user._id === newMessage.senderId ||
          user._id === newMessage.receiverId
        ) {
          return { ...user, lastMessage: newMessage };
        }
        return user;
      });

      set({ chatUsers: updatedChatUsers });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
}));
