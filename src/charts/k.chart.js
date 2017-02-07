/**
 * K线图入口
 * @param id 绘图容器id
 * @param theme 颜色主题
 * @param title 股票名称
 * @param period 绘图周期 Day30、Day7、Day1、Min60、Min30、Min15、Min5、Min1、Sec30、Sec15
 * @param lists 指标列表[MA, VOL, MA(VOL), MACD, RSI, KDJ, BOLL, VMACD, WR] 其中 MA与BOLL最多只能存在一个
 * @param totalShares 总股本 => 计算换手率
 * @param data 绘图数据
 * @param return {}
 * 调用方法 kChart = new RenderKChart(param, cb)
 * socekt 更新分时图调用实例方法 refreshChart
 * @data 新的绘图数据
 * @data return []
 * kChart.refreshChart(data)
 * 调用方法 updateArgs 指标参数更新刷新视图
 * kChart.updateArgs(data) data格式{type: 'setting', data: 'MACD', args: [12, 26, 9]}
 * @config mode 模式选择 默认模式0 九宫格模式1 简版模式2
 * @config theme 预留颜色主题 默认为白色主题0
 * @config cursorInteract 是否允许光标交互 默认允许
 * @config dragZoom 是否允许拖拽与缩放 默认允许
 * @config settingBtn 是否显示设置按钮 默认显示
 * @config title 是否显示股票名称 默认显示
 * @config return {}
 */
import DrawKChart from './kchart/render.k.chart'

export default class RenderKChart {
  constructor ({param, config, cb}) {
    this.param = param
    this.config = config
    this.cb = cb
    this.renderChart()
  }
  /**
   * 渲染视图
   */
  renderChart () {
    this.kChart = new DrawKChart({
      param: this.param,
      config: this.config,
      cb: this.cb})
  }
  /**
   * 数据更新视图
   */
  refreshChart (filterData) {
    this.kChart.render(filterData)
  }
  /**
   * 更新显示指标列表
   */
  updateIndicators (lists) {
    this.kChart.updateIndicators(lists)
  }
  /**
   * 指标参数更新刷新视图
   */
  updateArgs (data) {
    this.kChart.updateArgs(data)
  }
  /**
   * 方向键更新十字光标与更新视图
   */
  keyboardEmit (action) {
    this.kChart.keyboardEmit(action)
  }
}
