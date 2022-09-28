import { defineStore } from 'pinia';
import { useUserStore } from '@/stores/user.store';

export interface AuthState {
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
  }),
  getters: {
    isLoggedIn: state => !!state.token,
  },
  actions: {
    login(token: string) {
      this.token = token;
    },
    logout() {
      this.token = null;

      const userStore = useUserStore();
      userStore.setCurrentUser(null);
    },
  },
  persist: true,
});
