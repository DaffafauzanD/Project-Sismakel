import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export interface User {
 id: string;
 username: string;
 role: string;
 permission?: string[];
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(false);

  function setAuth(authUser: User) {
    console.log("setAuth user:", authUser); // 👈 log dulu
    if (!authUser) {
      console.warn("User data is undefined!");
      return;
    }

    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
  }

  async function login(credentials: { username: string; password: string}) {
    try {
      const { data } = await ApiService.post("auth/login", credentials);
      console.log("Login response:", data);
      const user = data.data.user;
      setAuth(user);
    } catch (error: any) {
      setError(error.response?.data?.errors || { message: "Login failed" });
    }
  }

  async function logout() {
    try {
      await ApiService.post("auth/logout", {});
    } finally {
      purgeAuth();
    }
  }

  async function verifyAuth(){
    try {
      const { data } = await ApiService.get("auth/verify");
      console.log("verify response:", data);
      const user = data.data.user;
      setAuth(user);
      return true;
    } catch (error: any) {
      setError(error.response?.data?.errors || { message: "Not authenticated"});
      purgeAuth();
      return false;
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    verifyAuth,
  };
});
