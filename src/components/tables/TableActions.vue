<template>
  <ADropdown
    v-if="getActions.length"
    placement="bottomRight"
    :trigger="['click']"
  >
    <QBtn class="fz-18 text-gray-600" type="icon">
      <QIcon type="menu" />
    </QBtn>
    <template #overlay>
      <AMenu>
        <template v-for="action in getActions" :key="action.title">
          <AMenuItem>
            <RouterLink v-if="action.to" :to="getRoute(action)">
              {{ action.title }}
            </RouterLink>
            <a
              v-else
              @click.prevent="action.click(record)"
            >
              {{ action.title }}
            </a>
          </AMenuItem>
        </template>
      </AMenu>
    </template>
  </ADropdown>
</template>

<script>

import { isFunction } from '@/utils/type-checks';

export default {
  props: {
    record: {
      type: Object,
      default: () => {},
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    getActions() {
      return this.actions.filter(action => !('condition' in action) || !!action.condition(this.record));
    },
  },
  methods: {
    getRoute(action) {
      return isFunction(action.to) ? action.to(this.record) : action.to;
    },
  },
};
</script>
