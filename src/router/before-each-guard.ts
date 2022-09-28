import { checkPermission } from '@/utils/permissions';
import router from '@/router';
import { DEFAULT_LOGGED_IN_ROUTE_NAME, DEFAULT_LOGGED_OUT_ROUTE_NAME } from '@/config/constants';
import { Executor } from '@/network/executor';
import { UserService } from '@/services/user.service';
import { useUserStore } from '@/stores/user.store';
import { useAuthStore } from '@/stores/auth.store';

function getCurrentUser() {
  const userStore = useUserStore();
  if (userStore.current)
    return Promise.resolve();

  return Executor.run({
    request: UserService.readUser(),
    onResult(data) {
      userStore.setCurrentUser(data);
    },
  });
}

// Не удаляйте логи, они нужны для дебага роутинга!
router.beforeEach((to) => {
  console.log(`%cGoing to %c${to.name as string}`, 'font-weight: bold', 'font-weight: bold; color: blue', to);

  if (['Error500', 'logout'].includes(to.name as string))
    return;

  const authStore = useAuthStore();
  if (authStore.isLoggedIn) {
    // console.log('user logged in');

    if (to.meta.onlyLoggedOut) {
      // console.log('this page only for logged out');
      return { name: DEFAULT_LOGGED_IN_ROUTE_NAME };
    }

    return getCurrentUser()
      .then(() => {
        if (!checkPermission(to.meta.permissions) && !to.meta.public) {
          // console.log('access denied');
          return { name: 'Error403' };
        }

        // console.log('access granted');
      });
  }

  // console.log('user is logged out');
  if (!to.meta.public && !to.meta.onlyLoggedOut) {
    // console.log('access denied');
    return { name: DEFAULT_LOGGED_OUT_ROUTE_NAME };
  }
  // console.log('access granted');
});
