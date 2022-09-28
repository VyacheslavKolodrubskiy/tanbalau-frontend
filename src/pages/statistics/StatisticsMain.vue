<template>
  <div>
    <APageHeader title="Статистика" />
    <ARow :gutter="[24,24]">
      <ACol
        :lg="11"
        :md="24"
        :sm="24"
        :xs="24"
        :xxl="11"
      >
        <ACard>
          <template #title>
            <div>Заявки - <span class="font-weight-bold">{{ applicationsTotal }}</span></div>
          </template>
          <template #extra>
            <RouterLink :to="{ name: 'StatisticsApplication'}">
              Детально
            </RouterLink>
          </template>
          <PieChart
            v-if="applications"
            :chart-data="setChart(applicationChart).data"
            :height="300"
            :options="setChart(applicationChart).options"
            style="height: 382px;"
            :width="300"
          />
        </ACard>
      </ACol>

      <ACol
        :lg="11"
        :md="24"
        :sm="24"
        :xs="24"
        :xxl="11"
      >
        <ACard>
          <template #title>
            <div>НКТ - <span class="font-weight-bold">{{ npcTotal }}</span></div>
          </template>
          <template #extra>
            <RouterLink :to="{ name: 'StatisticsNpc'}">
              Детально
            </RouterLink>
          </template>
          <PieChart
            v-if="npc"
            :chart-data="setChart(npcChart).data"
            :height="300"
            :options="setChart(npcChart).options"
            style="height: 382px;"
            :width="300"
          />
        </ACard>
      </ACol>
      <ACol
        :lg="11"
        :md="24"
        :sm="24"
        :xs="24"
        :xxl="11"
      >
        <ARow class="h-100" :gutter="[24,24]">
          <ACol :span="24">
            <ACard class="h-100" title="Распечатано КМ">
              <span class="fz-32 text-primary">{{ printedKmCount }}</span>
            </ACard>
          </ACol>
          <ACol :span="24">
            <ACard class="h-100" title="Повторно распечатано КМ ">
              <span class="fz-32 text-primary">{{ reprintedKmCount }}</span>
            </ACard>
          </ACol>
        </ARow>
      </ACol>
      <ACol
        :lg="11"
        :md="24"
        :sm="24"
        :xs="24"
        :xxl="11"
      >
        <ACard>
          <template #title>
            <div>СУЗ - <span class="font-weight-bold">{{ suzTotal }}</span></div>
          </template>
          <template #extra>
            <RouterLink :to="{ name: 'StatisticsSuz'}">
              Детально
            </RouterLink>
          </template>
          <PieChart
            v-if="suz"
            :chart-data="setChart(orderChart).data"
            :height="300"
            :options="setChart(orderChart).options"
            style="height: 382px;"
            :width="300"
          />
        </ACard>
      </ACol>
    </ARow>
  </div>
</template>

<script>
import { PieChart } from 'vue-chart-3';
import { fastClone } from '@/utils/object';
import { APPLICATION_STATUSES, ORDER_STATUSES, PRODUCT_STATUSES } from '@/config/types';
import { getAxios } from '@/services/http/request';

export default {
  name: 'MainStatistics',
  components: {
    PieChart,
  },
  data() {
    return {
      applications: null,
      npc: null,
      suz: null,
      appLables: [],
      npcLables: [],
      suzLables: [],
      npcTotal: 0,
      suzTotal: 0,
      applicationsTotal: 0,
      printedKmCount: 0,
      reprintedKmCount: 0,
      chartData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderWidth: 0,
          },
        ],
      },
      chartOptions: {
        plugins: {
          datalabels: {},
          legend: {
            display: true,
            position: 'right',
          },
          tooltip: {
            usePointStyle: true,
            callbacks: {},
          },
        },
      },
    };
  },
  computed: {
    applicationChart() {
      return {
        labels: this.appLables,
        backgroundColor: Object.values(APPLICATION_STATUSES).map(el => el.hexColor),
        data: this.applications,
      };
    },
    npcChart() {
      return {
        labels: this.npcLables,
        backgroundColor: Object.values(PRODUCT_STATUSES).map(el => el.hexColor),
        data: this.npc,
      };
    },
    orderChart() {
      return {
        labels: this.suzLables,
        backgroundColor: Object.values(ORDER_STATUSES).map(el => el.hexColor),
        data: this.suz,
      };
    },
  },
  created() {
    this.fetchPrintedKmCount();
  },
  methods: {
    setChart(chart) {
      const chartData = fastClone(this.chartData);
      const chartOptions = fastClone(this.chartOptions);
      chartData.labels = chart.labels;
      chartData.datasets[0].data = chart.data;
      chartData.datasets[0].backgroundColor = chart.backgroundColor;
      chartOptions.plugins.datalabels = {
        display: (context) => {
          const total = context.dataset.data.reduce((prev, curr) => prev + curr);
          return (100 * context.dataset.data[context.dataIndex] / total) >= 5;
        },
        color: '#FFF',
        font: { size: '18px' },
      };
      chartOptions.plugins.legend.labels = {
        usePointStyle: true,
      };
      chartOptions.plugins.tooltip.callbacks = {
        label: (context) => {
          return ` ${context.label}`;
        },
      };
      return { data: chartData, options: chartOptions };
    },
    fetchPrintedKmCount(params = {}) {
      return getAxios(
        '/statistics/general',
        { ...params },
      ).then((res) => {
        this.printedKmCount = res.printed_km;
        this.reprintedKmCount = res.reprinted_km;
        this.applications = [res.applications[0].new, res.applications[0].responded, res.applications[0].not_responded, res.applications[0].closed];
        this.appLables = Object.values(APPLICATION_STATUSES).map((el, i) => `${el.title}: ${this.applications[i]}`);
        this.applicationsTotal = res.applications[0].total;
        this.npc = [res.nkt[0].draft, res.nkt[0].moderation, res.nkt[0].errors, res.nkt[0].notsigned, res.nkt[0].published, res.nkt[0].layout];
        this.npcLables = Object.values(PRODUCT_STATUSES).map((el, i) => `${el.title}: ${this.npc[i]}`);
        this.npcTotal = res.nkt[0].total;
        this.suz = [res.suz[0].created, res.suz[0].pending, res.suz[0].declined, res.suz[0].approved, res.suz[0].ready, res.suz[0].closed];
        this.suzLables = Object.values(ORDER_STATUSES).map((el, i) => `${el.title}: ${this.suz[i]}`);
        this.suzTotal = res.suz[0].total;
      });
    },
  },
};
</script>
