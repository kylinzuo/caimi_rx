/**
 * K线图入口
 * @param id 绘图容器id
 * @param data 绘图数据
 * @param period 绘图周期 Day30、Day7、Day1、Min60、Min30、Min15、Min5、Min1、Sec30、Sec15
 * @param return {}
 * 调用方法 kChart = new RenderKChart(param, cb)
 * socekt 更新分时图调用实例方法 refreshChart
 * @data 新的绘图数据
 * @data return []
 * kChart.refreshChart(data)
 */
import * as df from './lib/index'
import DrawKChart from './kchart/render.k.chart'

export default class RenderKChart {
  constructor (param) {
    this.param = param
    this.renderChart()
  }
  /**
   * 渲染视图
   */
  renderChart () {
    let margin = {top: 0, right: 0, bottom: 0, left: 0}
    let svgArgs = df.getSvgSize(this.param, margin)
    this.kChart = new DrawKChart(this.param, svgArgs)
  }
  /**
   * 数据更新视图
   */
  refreshChart (filterData) {
    this.kChart.render(filterData)
  }
}
