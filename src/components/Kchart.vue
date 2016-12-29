<template>
  <div class="kChart">
    <div id="kChartContainer" class="kChartContainer" onselectstart="return false;" ></div>
    <div class="btnGroup">
      <button @click="checkLists('MA')" :class="{highLight: lists.indexOf('MA') > -1 ? true : false}">MA</button>
      <button @click="checkLists('VOL')" :class="{highLight: lists.indexOf('VOL') > -1 ? true : false}">VOL</button>
      <button @click="checkLists('MA(VOL)')" :class="{highLight: lists.indexOf('MA(VOL)') > -1 ? true : false}">MA(VOL)</button>
      <button @click="checkLists('MACD')" :class="{highLight: lists.indexOf('MACD') > -1 ? true : false}">MACD</button>
      <button @click="checkLists('RSI')" :class="{highLight: lists.indexOf('RSI') > -1 ? true : false}">RSI</button>
      <button @click="checkLists('KDJ')" :class="{highLight: lists.indexOf('KDJ') > -1 ? true : false}">KDJ</button>
      <button @click="checkLists('BOLL')" :class="{highLight: lists.indexOf('BOLL') > -1 ? true : false}">BOLL</button>
      <button @click="checkLists('VMACD')" :class="{highLight: lists.indexOf('VMACD') > -1 ? true : false}">VMACD</button>
      <button @click="checkLists('WR')" :class="{highLight: lists.indexOf('WR') > -1 ? true : false}">WR</button>
      <button @click='refreshChart'>refreshChart</button>
    </div>
  </div>
</template>

<script>
import RenderKChart from '../charts/k.chart'
import { getKchartService } from '../service/stockService'
let filterData = []
let newData = []
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      lists: ['MA', 'VOL', 'MACD', 'RSI'],
      kChart: null
    }
  },
  mounted () {
    let param = {}
    param.id = 'kChartContainer' // 画布容器
    param.theme = 0 // 颜色主题
    param.totalShares = 1378091733 // 总股本
    // 000001.SS 000001.SZ 000625.SZ 002312.SZ {symbol, period, startTime, lastNPoints = 0}
    getKchartService({
      symbol: '002312.SZ',
      period: 'Day1'
    }, data => {
      filterData = data.slice(0, 200)
      newData = data.slice(200)
      param.data = filterData // 绘图数据
      param.period = 'Day1'
      param.title = '上证指数'
      param.lists = this.lists
      this.tsChart = new RenderKChart(param, this.cb)
    })
  },
  methods: {
    refreshChart () {
      console.log('refreshChart')
      if (newData.length > 0) {
        filterData.push(newData.shift())
      }
      this.tsChart.refreshChart(filterData)
    },
    checkLists (val) {
      let index = this.lists.indexOf(val)
      if (index >= 0) {
        this.lists.splice(index, 1)
        if (val === 'VOL') {
          if (this.lists.indexOf('MA(VOL)') >= 0) {
            this.lists.splice(this.lists.indexOf('MA(VOL)'), 1)
          }
        }
      } else {
        this.lists.push(val)
        if (val === 'MA(VOL)') {
          if (this.lists.indexOf('VOL') < 0) {
            this.lists.push('VOL')
          }
        }
      }
      this.tsChart.updateIndicators(Object.assign([], this.lists))
    },
    cb (data) {
      console.log(data)
      if (data.type === 'close') {
        let index = this.lists.indexOf(data.data)
        this.lists.splice(index, 1)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.kChart {
  width: 100%;
  height: 88%;
  /*height: 406px;*/
  border: 1px solid #ccc;
  background-color: #fff;
}
.kChartContainer {
  width: 100%;
  height: 100%;
}
.btnGroup {
  margin-top: 10px;
}
.highLight {
  color: #fff;
  background-color: #979797;
}
button {
  width: 80px;
  height: 30px;
  color: #535353;
  border: none;
  border-radius: 2px;
  background-color: #fff;
}
</style>
