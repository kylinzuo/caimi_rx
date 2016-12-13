<template>
  <div class="tsChart">
    <div id="tsChartContainer" class="tsChartContainer"></div>
  </div>
</template>

<script>
import RenderTsChart from '../charts/ts.chart'
import { getTimeseriesService } from '../service/stockService'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tsChart: null
    }
  },
  mounted () {
    let param = {}
    param.id = 'tsChartContainer' // 画布容器
    param.theme = 0 // 颜色主题
    getTimeseriesService('000001.SZ', 240, data => {
      param.data = data // 绘图数据
      param.priceMid = 9.64 // 上一个交易日的收盘价
      this.tsChart = new RenderTsChart(param)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tsChart {
  width: 100%;
  height: 90%;
  border: 1px solid #ccc;
  background-color: #fff;
}
.tsChartContainer {
  width: 100%;
  height: 100%;
}
</style>
