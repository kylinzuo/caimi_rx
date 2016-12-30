<template>
  <div class="kChart">
    <ul>
      <li v-for='d in period'>
        <div :id='d'></div>
      </li>
    </ul>
    <div id="kChartContainer" class="kChartContainer" onselectstart="return false;" ></div>
  </div>
</template>

<script>
// import RenderKChart from '../charts/k.chart'
// import { getKchartService } from '../service/stockService'
// let filterData = []
// let newData = []
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      lists: ['MA', 'VOL', 'VOL(MA)'],
      kChart: null,
      period: ['Sec15', 'Sec30', 'Min1', 'Min5', 'Min15', 'Min30', 'Min60', 'Day1', 'Day7', 'Day30']
    }
  }
  // mounted () {
  //   // 000001.SS 000001.SZ 000625.SZ 002312.SZ {symbol, period, startTime, lastNPoints = 0}
  //   period.forEach((d, i) => {
  //     getKchartService({
  //       symbol: '002312.SZ',
  //       period: d
  //     }, data => {
  //       filterData = data.slice(0, 200)
  //       newData = data.slice(200)
  //       let param = {
  //         id: 'kChartContainer', // 画布容器
  //         title: '三态控股', // 股票名称
  //         period: d, // 周期
  //         lists: this.lists, // 指标列表
  //         totalShares: 1378091733, // 总股本
  //         data: filterData // k线数据
  //       }
  //       let config = {
  //         mode: 0, // 默认模式0 九宫格模式1
  //         theme: 0, // 默认白色颜色主题0
  //         scrollBar: false, // 是否显示底部滑动条
  //         cursorInteract: false, // 是否允许光标交互
  //         dragZoom: false, // 是否允许拖拽与缩放
  //         settingBtn: false, // 是否显示设置按钮
  //         title: false // 是否显示股票名称
  //       }
  //       this.tsChart = new RenderKChart({
  //         param: param,
  //         config: config,
  //         cb: this.cb})
  //     })
  //   })
  // },
  // methods: {
  //   refreshChart () {
  //     console.log('refreshChart')
  //     if (newData.length > 0) {
  //       filterData.push(newData.shift())
  //     }
  //     this.tsChart.refreshChart(filterData)
  //   },
  //   checkLists (val) {
  //     let index = this.lists.indexOf(val)
  //     if (index >= 0) {
  //       this.lists.splice(index, 1)
  //       if (val === 'VOL') {
  //         if (this.lists.indexOf('MA(VOL)') >= 0) {
  //           this.lists.splice(this.lists.indexOf('MA(VOL)'), 1)
  //         }
  //       }
  //     } else {
  //       this.lists.push(val)
  //       if (val === 'MA(VOL)') {
  //         if (this.lists.indexOf('VOL') < 0) {
  //           this.lists.push('VOL')
  //         }
  //       }
  //     }
  //     this.tsChart.updateIndicators(Object.assign([], this.lists))
  //   },
  //   cb (data) {
  //     console.log(data)
  //     if (data.type === 'close') {
  //       let index = this.lists.indexOf(data.data)
  //       this.lists.splice(index, 1)
  //     }
  //   }
  // }
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
ul li {
  margin: 0;
  padding: 0;
}

</style>
