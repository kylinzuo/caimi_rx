/**
 * 分时图入口
 */
import * as df from './lib/index'
import DrawTsChart from './tschart/render.ts.chart'

export default class RenderTsChart {
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
    this.tsChart = new DrawTsChart(this.param, svgArgs)
  }
  /**
   * 数据更新视图
   */
  refreshChart () {

  }
}
