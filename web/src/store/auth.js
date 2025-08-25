import { defineStore } from "pinia";
import api from "../api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    async register(name, email, password) {
      await api.post("/register", { name, email, password });
    },

    async login(email, password) {
      const res = await api.post("/login", { email, password });
      this.token = res.data.token;
      localStorage.setItem("token", this.token);
    },

    async fetchProfile() {
      const res = await api.get("/profile");
      this.user = res.data;
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
