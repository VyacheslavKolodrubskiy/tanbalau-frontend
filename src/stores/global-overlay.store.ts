import { defineStore } from 'pinia';

export interface GlobalOverlayState {
  visible: boolean
  message: string
}

export const useGlobalOverlayStore = defineStore('global-overlay', {
  state: (): GlobalOverlayState => ({
    visible: false,
    message: '',
  }),
  actions: {
    show(payload) {
      if (payload)
        this.message = payload;

      this.visible = true;
    },
    hide() {
      this.message = '';
      this.visible = false;
    },
  },
});
