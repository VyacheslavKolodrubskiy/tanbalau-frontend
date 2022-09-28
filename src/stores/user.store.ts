import { defineStore } from 'pinia';
import type { User } from '@/models/user.model';
import type { Removable } from '@/types';
import type { Role } from '@/models/role.model';
import { PAYMENT_STATUSES, ROLES } from '@/config/types';

export interface UserState {
  current: Removable<User>
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    current: null,
  }),

  getters: {
    currentRole(): Removable<Role> {
      return this.current?.role;
    },
    hasDemoAccess(): boolean {
      return (
        this.currentRole?.id === ROLES.client.id // Демо доступ может быть только у юзера "Клиент"
        && this.current?.subscription?.id === PAYMENT_STATUSES.created.id // Статус у юзера должен быть "Создан/Демо-доступ"
      );
    },
  },
  actions: {
    setCurrentUser(user: User | null) {
      this.current = user;
    },
  },
});
