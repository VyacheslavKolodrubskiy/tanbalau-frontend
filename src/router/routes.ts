import type { RouteRecordRaw } from 'vue-router';
import TheEmptyRouterView from '@/components/TheEmptyRouterView.vue';
import Error500 from '@/pages/errors/Error500.vue';
import { setFromRedirect } from '@/router/guards';
import { DEFAULT_LOGGED_IN_ROUTE_NAME } from '@/config/constants';
import { useUserStore } from '@/stores/user.store';

export const routes: RouteRecordRaw[] = [
  {
    path: '/logout',
    name: 'logout',
    component: () => import('@/pages/auth/Logout.vue'),
  },

  {
    path: '/login',
    meta: {
      onlyLoggedOut: true,
    },
    component: () => import('@/layouts/TheLayoutAuth.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        meta: {
          title: 'Авторизация',
        },
        component: () => import('@/pages/auth/Login.vue'),
      },
      {
        path: '/register',
        name: 'Register',
        meta: {
          title: 'Регистрация',
          permissions: ['client'],
        },
        component: () => import('@/pages/auth/Register.vue'),
      },
      {
        path: '/recover-access',
        name: 'RecoverAccess',
        meta: {
          title: 'Восстановление доступа Организации',
          onlyLoggedOut: false,
        },
        beforeEnter: (to) => {
          const userStore = useUserStore();
          if (!userStore.current?.counterparty?.id && to.params.bin)
            return;

          return { name: DEFAULT_LOGGED_IN_ROUTE_NAME };
        },
        component: () => import('@/pages/auth/RecoverOrgAccess.vue'),
      },
      {
        path: '/recover-password',
        name: 'Recover',
        meta: {
          title: 'Восстановление пароля',
          permissions: ['client'],
        },
        component: () => import('@/pages/auth/RecoverUserPassword.vue'),
      },
      {
        path: '/new-password',
        name: 'NewPassword',
        meta: {
          title: 'Новый пароль',
        },
        beforeEnter(to) {
          if (to.query.email && to.query.token) {
            // todo
          } else {
            return { name: 'ErrorMalformedLink' };
          }
        },
        component: () => import('@/pages/auth/NewPassword.vue'),
      },
    ],
  },

  {
    path: '/',
    name: 'default',
    redirect: { name: DEFAULT_LOGGED_IN_ROUTE_NAME },
    component: () => import('@/layouts/TheLayoutDefault.vue'),
    children: [
      {
        path: '/pricing-table',
        name: 'PricingTable',
        component: () => import('@/pages/PricingTable.vue'),
      },
      {
        path: '/statistics',
        component: TheEmptyRouterView,
        meta: {
          breadcrumbName: 'Статистика',
          title: 'Главная',
          demoAccess: { videoId: 'LXaTkh7Iu8k' },
        },
        children: [
          {
            path: '',
            name: 'Statistics',
            component: () => import('@/pages/statistics/StatisticsMain.vue'),
          },
          {
            path: 'suz',
            name: 'StatisticsSuz',
            meta: {
              breadcrumbName: 'Статистика по СУЗ / Печать',
            },
            component: () => import('@/pages/statistics/StatisticsSuz.vue'),
          },
          {
            path: 'npc',
            name: 'StatisticsNpc',
            meta: {
              breadcrumbName: 'Статистика по НКТ',
            },
            component: () => import('@/pages/statistics/StatisticsNpc.vue'),
          },
          {
            path: 'application',
            name: 'StatisticsApplication',
            meta: {
              breadcrumbName: 'Статистика по Заявкам',
            },
            component: () => import('@/pages/statistics/StatisticsApplication.vue'),
          },
        ],
      },
      {
        path: '/npc',
        component: TheEmptyRouterView,
        redirect: { name: 'Groups' },
        meta: {
          breadcrumbName: 'НКТ',
          demoAccess: { videoId: '92gLw3qw9ZM' },
        },
        children: [
          {
            path: 'groups',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Группы товаров',
              title: 'Группы товаров',
            },
            children: [
              {
                path: '',
                name: 'Groups',
                component: () => import('@/pages/npc/groups/GroupsMain.vue'),
              },
              {
                path: 'add',
                name: 'GroupsAdd',
                meta: {
                  permissions: ['client'],
                  breadcrumbName: 'Добавить “Группу товаров”',
                  title: 'Добавить группу товаров',
                },
                component: () => import('@/pages/npc/groups/GroupsAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'ProductGroupEdit',
                meta: {
                  permissions: ['client', 'admin', 'manager'],
                  title: 'Просмотр группы товаров',
                },
                component: () => import('@/pages/npc/groups/GroupsEdit.vue'),
              },
            ],
          },
          {
            path: 'list',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Список товаров',
              title: 'Список товаров',
              demoAccess: { videoId: 'OSbJJh1ZZrE' },
            },
            children: [
              {
                path: '',
                name: 'ProductList',
                component: () => import('@/pages/npc/list/NpcListMain.vue'),
              },
              {
                path: ':id',
                name: 'ProductListView',
                meta: {
                  title: 'Просмотр товара',
                },
                component: () => import('@/pages/npc/list/NpcListView.vue'),
              },
            ],
          },
        ],
      },

      {
        path: '/application',
        component: TheEmptyRouterView,
        meta: {
          breadcrumbName: 'Заявки',
          title: 'Заявки',
        },
        children: [
          {
            path: '',
            name: 'Application',
            component: () => import('@/pages/application/ApplicationMain.vue'),
          },
          {
            path: 'add',
            name: 'ApplicationAdd',
            meta: {
              permissions: ['client'],
              breadcrumbName: 'Добавить “Заявку”',
              title: 'Добавить заявку',
            },
            component: () => import('@/pages/application/ApplicationAdd.vue'),
          },
          {
            path: ':id',
            name: 'ApplicationView',
            meta: {
              breadcrumbName: 'Просмотр “Заявки”',
              title: 'Просмотр заявки',
            },
            component: () => import('@/pages/application/ApplicationView.vue'),
          },
        ],
      },

      {
        path: '/suz',
        component: TheEmptyRouterView,
        redirect: { name: 'Order' },
        meta: {
          breadcrumbName: 'Система управления заказами (СУЗ)',
        },
        children: [
          {
            path: 'order',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Заказы на формирование КМ',
              title: 'Заказы на формирование КМ',
              demoAccess: { videoId: 'OvQr4FnPpHk' },
            },
            children: [
              {
                path: '',
                name: 'Order',
                component: () => import('@/pages/suz/orders/OrdersMain.vue'),
              },
              {
                path: 'add',
                name: 'OrderAdd',
                meta: {
                  permissions: ['client'],
                  breadcrumbName: 'Добавить “Заказ на формирование КМ”',
                  title: 'Добавить Заказ на формирование КМ',
                },
                component: () => import('@/pages/suz/orders/OrdersAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'OrderEdit',
                meta: {
                  permissions: ['client'],
                  breadcrumbName: 'Редактировать  “Заказ на формирование КМ”',
                  title: 'Редактировать Заказ на формирование КМ',
                },
                component: () => import('@/pages/suz/orders/OrdersEdit.vue'),
              },
              {
                path: ':id',
                name: 'OrderView',
                meta: {
                  permissions: ['admin', 'manager', 'client'],
                  breadcrumbName: 'Просмотр  “Заказ на формирование КМ”',
                  title: 'Просмотр Заказа на формирование КМ',
                },
                component: () => import('@/pages/suz/orders/OrdersView.vue'),
              },
            ],
          },

          {
            path: 'print',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Печать КМ',
              title: 'Печать КМ',
              demoAccess: { videoId: 'SZYvi5TbDT4' },
            },
            children: [
              {
                path: '',
                name: 'Print',
                meta: {
                  permissions: ['admin', 'manager', 'client'],
                },
                component: () => import('@/pages/suz/print/PrintMain.vue'),
              },
              {
                path: 'add',
                name: 'PrintAdd',
                meta: {
                  permissions: ['client'],
                  breadcrumbName: 'Добавить ”Форма печати”',
                  title: 'Добавить Печать КМ',
                },
                component: () => import('@/pages/suz/print/PrintAdd.vue'),
              },
              {
                path: 'reprint-add',
                name: 'RePrintAdd',
                meta: {
                  permissions: ['client'],
                  breadcrumbName: 'Добавить ”Повторная форма печати”',
                  title: 'Добавить Повторную Печать КМ',
                },
                component: () => import('@/pages/suz/print/RePrintAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'PrintEdit',
                meta: {
                  permissions: ['client'],
                  breadcrumbName: 'Редактировать ”Форма печати”',
                  title: 'Редактировать Печать КМ',
                },
                component: () => import('@/pages/suz/print/PrintEdit.vue'),
              },
              {
                path: ':id/reprint-edit',
                name: 'RePrintEdit',
                meta: {
                  permissions: ['client'],
                  breadcrumbName: 'Редактировать ”Повторная форма печати”',
                  title: 'Редактировать Повторную Печать КМ',
                },
                component: () => import('@/pages/suz/print/RePrintEdit.vue'),
              },
              {
                path: ':id',
                name: 'PrintView',
                meta: {
                  permissions: ['admin', 'manager', 'client'],
                  breadcrumbName: 'Просмотр “Форма печати”',
                  title: 'Просмотр Печати КМ',
                },
                component: () => import('@/pages/suz/print/PrintView.vue'),
              },
            ],
          },

          {
            path: 'reprint',
            component: TheEmptyRouterView,
            redirect: { name: 'Print' },
            meta: {
              breadcrumbName: 'Печать КМ',
              title: 'Печать КМ',
              demoAccess: { videoId: 'fIu2dQPBcBc' },
            },
            children: [
              {
                path: ':id/add',
                name: 'RePrintAdd',
                meta: {
                  permissions: ['client'],
                  breadcrumbName: 'Добавить ”Повторная форма печати”',
                  title: 'Добавить Повторную Печать КМ',
                },
                component: () => import('@/pages/suz/print/RePrintAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'RePrintEdit',
                meta: {
                  permissions: ['client'],
                  breadcrumbName: 'Редактировать ”Повторная форма печати”',
                  title: 'Редактировать Повторную Печать КМ',
                },
                component: () => import('@/pages/suz/print/RePrintEdit.vue'),
              },
            ],
          },
        ],
      },

      {
        path: 'organization',
        component: TheEmptyRouterView,
        meta: {
          permissions: ['client'],
        },
        children: [
          {
            path: 'add',
            name: 'OrganizationsAdd',
            beforeEnter: () => {
              const userStore = useUserStore();
              const counterparty_id = userStore.current?.counterparty?.id;
              if (!counterparty_id)
                return;

              return { name: 'OrganizationsView', params: { id: counterparty_id } };
            },
            meta: {
              permissions: ['client'],
              breadcrumbName: 'Добавить “Организацию клиента”',
              title: 'Добавить Организацию клиента',
            },
            component: () => import('@/pages/catalog/organizations/OrganizationsAdd.vue'),
          },
          {
            path: ':id',
            name: 'OrganizationsView',
            meta: {
              breadcrumbName: 'Просмотр “Организации клиента”',
              title: 'Просмотр Организации клиента',
            },
            component: () => import('@/pages/catalog/organizations/OrganizationsView.vue'),
          },
          {
            path: ':id/edit',
            name: 'OrganizationsEdit',
            meta: {
              permissions: ['client'],
              breadcrumbName: 'Редактировать “Организацию клиента”',
              title: 'Редактировать Организацию клиента',
            },
            component: () => import('@/pages/catalog/organizations/OrganizationsEdit.vue'),
          },

        ],
      },

      {
        path: '/catalog',
        component: TheEmptyRouterView,
        redirect: { name: 'CatalogBranches' },
        meta: {
          breadcrumbName: 'Справочники',
        },
        children: [
          {
            path: 'branches',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Филиалы',
              title: 'Филиалы',
              permissions: ['admin', 'manager'],
            },
            children: [
              {
                path: '',
                name: 'CatalogBranches',
                component: () => import('@/pages/catalog/branches/BranchesMain.vue'),
              },
              {
                path: 'add',
                name: 'CatalogBranchesAdd',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Добавить “Филиал”',
                  title: 'Добавить филиал',
                },
                component: () => import('@/pages/catalog/branches/BranchesAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'CatalogBranchesEdit',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Редактировать “Филиал”',
                  title: 'Редактировать филиал',
                },
                component: () => import('@/pages/catalog/branches/BranchesEdit.vue'),
              },
              {
                path: ':id',
                name: 'CatalogBranchesView',
                meta: {
                  breadcrumbName: 'Просмотр “Филиала”',
                  title: 'Просмотр филиала',
                },
                component: () => import('@/pages/catalog/branches/BranchesView.vue'),
              },
            ],
          },
          {
            path: 'organizations',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Организации клиентов',
              title: 'Организации клиентов',
              permissions: ['admin', 'manager'],
            },
            children: [
              {
                path: '',
                name: 'CatalogOrganizations',
                component: () => import('@/pages/catalog/organizations/OrganizationsMain.vue'),
              },
              {
                path: ':id',
                name: 'CatalogOrganizationsView',
                meta: {
                  breadcrumbName: 'Просмотр “Организации клиента”',
                  title: 'Просмотр Организации клиента',
                },
                component: () => import('@/pages/catalog/organizations/OrganizationsView.vue'),
              },
            ],
          },

          {
            path: 'region',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'ГРЗ/Области',
              title: 'ГРЗ/Область',
            },
            children: [
              {
                path: '',
                name: 'CatalogRegion',
                meta: {
                  permissions: ['admin'],
                },
                component: () => import('@/pages/catalog/regions/RegionsMain.vue'),
              },
              {
                path: ':id/edit',
                name: 'CatalogRegionEdit',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Редактировать “ГРЗ/Область”',
                  title: 'Редактировать ГРЗ/Область',
                },
                component: () => import('@/pages/catalog/regions/RegionsEdit.vue'),
              },
              {
                path: 'add',
                name: 'CatalogRegionAdd',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Добавить “ГРЗ/Область”',
                  title: 'Добавить ГРЗ/Область',
                },
                component: () => import('@/pages/catalog/regions/RegionsAdd.vue'),
              },
            ],
          },

          {
            path: 'city',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Города',
              title: 'Город',
            },
            children: [
              {
                path: '',
                name: 'CatalogCity',
                meta: {
                  permissions: ['admin'],
                },
                component: () => import('@/pages/catalog/city/CityMain.vue'),
              },
              {
                path: ':id/edit',
                name: 'CatalogCityEdit',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Редактировать “Город”',
                  title: 'Редактировать город',
                },
                component: () => import('@/pages/catalog/city/CityEdit.vue'),
              },
              {
                path: 'add',
                name: 'CatalogCityAdd',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Добавить “Город”',
                  title: 'Добавить город',
                },
                component: () => import('@/pages/catalog/city/CityAdd.vue'),
              },
            ],
          },
        ],
      },

      {
        path: '/profile',
        name: 'Profile',
        meta: {
          title: 'Мой профиль',
        },
        component: () => import('@/pages/profile/ProfileMain.vue'),
      },

      {
        path: '/users',
        component: TheEmptyRouterView,
        redirect: { name: 'UsersAdmin' },
        meta: {
          breadcrumbName: 'Пользователи',
        },
        children: [
          {
            path: 'admin',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Администраторы',
              title: 'Пользователи Администратор',
            },
            children: [
              {
                path: '',
                name: 'UsersAdmin',
                meta: {
                  permissions: ['admin'],
                },
                component: () => import('@/pages/users/admin/AdminMain.vue'),
              },
              {
                path: 'add',
                name: 'UsersAdminAdd',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Добавить “Администратора”',
                  title: 'Добавить пользователя Администратор',
                },
                component: () => import('@/pages/users/admin/AdminAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'UsersAdminEdit',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Редактировать “Администратора”',
                  title: 'Редактировать пользователя Администратор',
                },
                component: () => import('@/pages/users/admin/AdminEdit.vue'),
              },
              {
                path: ':id',
                name: 'UsersAdminView',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Просмотр “Администратора”',
                  title: 'Просмотр пользователя Администратор',
                },
                component: () => import('@/pages/users/admin/AdminView.vue'),
              },
            ],
          },

          {
            path: 'manager',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Менеджеры',
              title: 'Пользователи Менеджер',
            },
            children: [
              {
                path: '',
                name: 'UsersManager',
                meta: {
                  permissions: ['admin', 'manager'],
                },
                component: () => import('@/pages/users/manager/ManagerMain.vue'),
              },
              {
                path: 'add',
                name: 'UsersManagerAdd',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Добавить “Менеджера”',
                  title: 'Добавить пользователя Менеджер',
                },
                component: () => import('@/pages/users/manager/ManagerAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'UsersManagerEdit',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Редактировать “Менеджера”',
                  title: 'Редактировать пользователя Менеджер',
                },
                component: () => import('@/pages/users/manager/ManagerEdit.vue'),
              },
              {
                path: ':id',
                name: 'UsersManagerView',
                meta: {
                  permissions: ['admin', 'manager'],
                  breadcrumbName: 'Просмотр “Менеджера”',
                  title: 'Просмотр пользователя Менеджер',
                },
                component: () => import('@/pages/users/manager/ManagerView.vue'),
              },
            ],
          },

          {
            path: 'client',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Клиенты',
              title: 'Пользователи Клиент',
            },
            children: [
              {
                path: '',
                name: 'UsersClient',
                meta: {
                  permissions: ['admin', 'manager'],
                },
                component: () => import('@/pages/users/client/ClientMain.vue'),
              },
              {
                path: ':id',
                name: 'UsersClientView',
                meta: {
                  permissions: ['admin', 'manager'],
                  breadcrumbName: 'Просмотр “Клиента”',
                  title: 'Просмотр пользователя Клиент',
                },
                component: () => import('@/pages/users/client/ClientView.vue'),
              },
            ],
          },
        ],
      },
      {
        path: '/faq',
        component: TheEmptyRouterView,
        meta: {
          breadcrumbName: 'Вопрос-Ответ',
          title: 'Вопрос-Ответ',
        },
        children: [
          {
            path: '',
            name: 'FaqMain',
            component: () => import('@/pages/faq/FaqMain.vue'),
          },
          {
            path: 'add',
            name: 'FaqAdd',
            meta: {
              permissions: ['admin', 'manager'],
              breadcrumbName: 'Добавить “FAQ”',
              title: 'Добавить “FAQ”',
            },
            component: () => import('@/pages/faq/FaqAdd.vue'),
          },
          {
            path: ':id',
            name: 'FaqView',
            meta: {
              breadcrumbName: 'Просмотр “FAQ”',
              title: 'Просмотр “FAQ”',
            },
            component: () => import('@/pages/faq/FaqView.vue'),
          },
          {
            path: ':id/edit',
            name: 'FaqEdit',
            meta: {
              breadcrumbName: 'Редактировать “FAQ”',
              title: 'Редактировать “FAQ”',
              permissions: ['admin', 'manager'],
            },
            component: () => import('@/pages/faq/FaqEdit.vue'),
          },
        ],
      },
      {
        path: '/payment',
        component: TheEmptyRouterView,
        meta: {
          breadcrumbName: 'Онлайн оплата',
          title: 'Онлайн оплата',
        },
        children: [
          {
            path: '',
            name: 'Payment',
            component: () => import('@/pages/payment/PaymentMain.vue'),
            meta: {
              permissions: ['admin'],
            },
          },
        ],
      },
      {
        path: '/about-us',
        component: TheEmptyRouterView,
        meta: {
          breadcrumbName: 'Документы и контакты разработчиков',
          title: 'Документы и контакты разработчиков',
        },
        children: [
          {
            path: '',
            name: 'About',
            component: () => import('@/pages/about/AboutMain.vue'),
            meta: {
              permissions: ['admin', 'manager', 'client'],
            },
          },
        ],
      },
    ],
  },

  {
    path: '/malformed-link',
    name: 'ErrorMalformedLink',
    meta: {
      title: 'Malformed link',
      public: true,
    },
    component: () => import('@/pages/errors/ErrorMalformedLink.vue'),
  },

  {
    path: '/forbidden',
    name: 'Error403',
    meta: {
      title: '403',
    },
    component: () => import('@/pages/errors/Error403.vue'),
  },

  {
    path: '/internal-server-error',
    name: 'Error500',
    meta: {
      title: '500',
    },
    /*
     * Эта страница должна быть загружена заранее,
     * т.к. если будет проблема с интернетом, мы легко сможем на неё редиректнуть
     */
    component: Error500,
    beforeEnter: [setFromRedirect],
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'Error404',
    meta: {
      title: '404',
    },
    component: () => import('@/pages/errors/Error404.vue'),
  },
];
