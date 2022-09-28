<template>
  <ALayoutSider
    breakpoint="xl"
    class="sidebar"
    collapsed-width="0"
    width="240"
  >
    <RouterLink class="sidebar__logo" to="/">
      <img alt="" src="@/assets/images/logo-tanbalau-white.svg">
    </RouterLink>
    <AMenu mode="inline" theme="dark">
      <template v-for="item in items">
        <template v-if="item.title">
          <ASubMenu
            v-if="item.children.some((i) => $canUse(i.permissions))"
            :key="`sub-menu-${item.title}`"
          >
            <template #title>
              <QIcon
                v-if="item.icon"
                class="mr-2"
                :type="item.icon"
              />
              {{ item.title }}
            </template>
            <template v-for="child in item.children">
              <AMenuItem
                v-if="$canUse(child.permissions)"
                :key="`child_${child.name}_${item.title}`"
              >
                <RouterLink :to="{ name: child.link }" />
                <QIcon
                  v-if="child.icon"
                  class="mr-2"
                  :type="child.icon"
                />
                {{ child.name }}
              </AMenuItem>
            </template>
          </ASubMenu>
        </template>
        <template v-else>
          <AMenuItem
            v-if="$canUse(item.permissions)"
            :key="`sub-menu${item.name}`"
          >
            <RouterLink :to="{ name: item.link }" />
            <QIcon
              v-if="item.icon"
              class="mr-2"
              :type="item.icon"
            />
            {{ item.name }}
          </AMenuItem>
        </template>
      </template>
    </AMenu>
  </ALayoutSider>
</template>

<script>
export default {
  name: 'TheSidebar',
  data() {
    return {
      items: [
        {
          link: 'Statistics',
          name: 'Статистика',
          icon: 'pie-chart',
        },
        {
          title: 'НКТ',
          icon: 'shopping-cart',
          children: [
            {
              link: 'Groups',
              name: 'Группы товаров',
              icon: 'appstore',
            },
            {
              link: 'ProductList',
              name: 'Список товаров',
              icon: 'bars',
            },
          ],
        },
        {
          link: 'Application',
          name: 'Заявки',
        },
        {
          title: 'CУЗ',
          icon: 'qrcode',
          children: [
            {
              link: 'Order',
              name: 'Формирование КМ',
              icon: 'scan',
            },
            {
              link: 'Print',
              name: 'Печать',
              icon: 'printer',
            },
          ],
        },
        {
          link: 'Payment',
          name: 'Онлайн оплата',
          icon: 'dollar-circle',
        },
        {
          link: 'OrganizationsAdd',
          name: 'Организация',
        },
        {
          title: 'Справочники',
          icon: 'read',
          children: [
            {
              link: 'CatalogBranches',
              name: 'Филиалы',
            },
            {
              link: 'CatalogOrganizations',
              name: 'Организации клиентов',
            },
            {
              link: 'CatalogRegion',
              name: 'ГРЗ/Область',
            },
            {
              link: 'CatalogCity',
              name: 'Город',
            },
          ],
        },
        {
          title: 'Пользователи',
          icon: 'team',
          children: [
            {
              link: 'UsersAdmin',
              name: 'Администратор',
            },
            {
              link: 'UsersManager',
              name: 'Менеджер',
            },
            {
              link: 'UsersClient',
              name: 'Клиент',
            },
          ],
        },
        {
          link: 'FaqMain',
          name: 'Вопрос-Ответ',
          icon: 'question-circle',
        },
        {
          link: 'About',
          name: 'Документы и контакты',
          icon: 'read',
        },
      ],
    };
  },
  created() {
    this.resolvePermissions();
  },
  methods: {
    resolvePermissions() {
      for (const item of this.items) {
        const { meta } = this.$router.resolve({ name: item.link });
        if ('title' in item) {
          for (const child of item.children) {
            const { meta } = this.$router.resolve({ name: child.link });
            child.permissions = meta.permissions;
          }
        } else {
          item.permissions = meta.permissions;
        }
      }
    },
  },
};
</script>
