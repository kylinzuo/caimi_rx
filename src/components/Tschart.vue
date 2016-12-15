<template>
  <div class="tsChart">
    <div id="tsChartContainer" class="tsChartContainer" onselectstart="return false;" ></div>
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
    // 000001.SS 000001.SZ 000625.SZ 002312.SZ
    getTimeseriesService('002312.SZ', 240, data => {
      param.data = data // 绘图数据
      param.period = 1
      // param.priceMid = 3100 // 上一个交易日的收盘价
      // param.priceMid = 9.4 // 上一个交易日的收盘价
      // param.priceMid = 15.74 // 上一个交易日的收盘价
      param.priceMid = 8.68 // 上一个交易日的收盘价
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
  /*height: 406px;*/
  border: 1px solid #ccc;
  background-color: #fff;
}
.tsChartContainer {
  width: 100%;
  height: 100%;
}
</style>
