<template>
  <v-chart :options="barChartOptions"/>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'

export default {
  name: 'Echart1',
  components: { 'v-chart': ECharts },
  data () {
    return {
      loading: true,
      barChartOptions: {
        title: { text: 'ECharts' },
        tooltip: {},
        xAxis: { data: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'] },
        yAxis: {},
        series: [{ name: 'Clouds', type: 'bar', data: [5, 20, 36, 10, 10, 20] }]
      }
    }
  },
  mounted() { 
    console.log('Echart1 Widget - Component Loaded!');
  }
}
</script>
