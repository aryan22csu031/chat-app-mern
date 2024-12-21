import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../config/axios";
import { authStore } from "./authStore";

export const chatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      
      set({ users: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data.data });
      // console.log(res.data.data);
      
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (msg) => {
    const {selectedUser, messages} = get()
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, msg);
      console.log("res data",res.data.message);
      
      set({ messages: [...messages, res.data.message] });
      
    } catch (err) {
      toast.error(err.message);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = authStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
