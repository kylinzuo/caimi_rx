<template>
  <div class="kChart">
    <div id="kChartContainer" class="kChartContainer" onselectstart="return false;" ></div>
    <div>
      <button @click='refreshChart'>refreshChart</button>
    </div>
  </div>
</template>

<script>
// import RenderTsChart from '../charts/ts.chart'
import { getKchartService } from '../service/stockService'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      kChart: null,
      filterData: [],
      newData: []
    }
  },
  mounted () {
    let param = {}
    param.id = 'kChartContainer' // 画布容器
    param.theme = 0 // 颜色主题
    // 000001.SS 000001.SZ 000625.SZ 002312.SZ {symbol, period, startTime, lastNPoints = 0}
    getKchartService({
      symbol: '000001.SS',
      period: 'Day1'
    }, data => {
      this.filterData = data.slice(0, 100)
      this.newData = data.slice(100)
      param.data = this.filterData // 绘图数据
      param.period = 'Day1'
      console.log(param.data)
    //   this.tsChart = new RenderTsChart(param, this.toggleChart.bind(this))
    })
  },
  methods: {
    toggleChart (data) {
      console.log('切换：' + data)
    },
    refreshChart () {
      console.log('refreshChart')
    //   this.filterData.push(this.newData.shift())
    //   this.tsChart.refreshChart(this.filterData)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.kChart {
  width: 100%;
  height: 90%;
  /*height: 406px;*/
  border: 1px solid #ccc;
  background-color: #fff;
}
.kChartContainer {
  width: 100%;
  height: 100%;
}
</style>
