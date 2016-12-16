/**
 * 分时图入口
 * @param id 绘图容器id
 * @param data 绘图数据
 * @param period 绘图周期 1、2 ... 1日分时、2日分时...
 * @param priceMid 绘图数据上一个交易日收盘价 作为绘图中间价
 * @param return {}
 * @cb 上下案件回调函数
 * @cb return function
 * 调用方法 tsChart = new RenderTsChart(param, cb)
 * socekt 更新分时图调用实例方法 refreshChart
 * @data 新的绘图数据
 * @data return []
 * tsChart.refreshChart(data)
 */
import * as df from './lib/index'
import DrawTsChart from './tschart/render.ts.chart'

export default class RenderTsChart {
  constructor (param, toggleChart) {
    this.param = param
    this.toggleChart = toggleChart
    this.renderChart()
  }
  /**
   * 渲染视图
   */
  renderChart () {
    let margin = {top: 0, right: 0, bottom: 0, left: 0}
    let svgArgs = df.getSvgSize(this.param, margin)
    this.tsChart = new DrawTsChart(this.param, svgArgs, this.toggleChart)
  }
  /**
   * 数据更新视图
   */
  refreshChart (filterData) {
    this.tsChart.render(filterData)
  }
}
