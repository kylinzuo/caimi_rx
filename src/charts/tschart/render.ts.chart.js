/**
 * 分时图 by zuozhengqi 2016/12/08
 */
import * as df from '../lib/index'
import { colors } from '../lib/colors'

/**
 * 数据仓库
 */
let store = {
  data: [],
  chartData: []
}

/**
 * 输出分时图对外接口
 */
export default function (param, svgArgs) {
  // 将传入的数据缓存起来
  store.data = param.data.concat([])
  // df.log(svgArgs)
  // 在绘图容器中添加 SVG
  let svg = df.createSVG(svgArgs)
  df.log('param')
  df.log(param)
  // 绘制背景矩形
  let bgG = svg.append('g')
  let bgGRectArgs = {
    'class': 'bgG',
    'x': 0,
    'y': 0,
    'width': svgArgs.width,
    'height': svgArgs.height,
    'fill': colors[param.theme].bgColor
  }
  df.drawRect(bgG, bgGRectArgs)

  // 图形四周宽度
  let lw = 60
  let rw = 60
  let th = 0
  let bh = 22
  let chartW = svgArgs.width - lw - rw
  let chartH = svgArgs.height - th - bh

  // 添加绘图容器 g
  let svgG = svg.append('g')
    .attr('class', 'svgG')
    .attr('transform', `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th})`)

  // 绘制网格
  let gridG = svgG.append('g')
    .attr('class', 'gridG')
  let gridGargs = {
    width: chartW,
    height: chartH,
    top: th,
    bottom: bh,
    left: lw,
    right: rw,
    stroke: colors[svgArgs.theme].gray
  }
  df.drawGrid(gridG, svgArgs, 20, 11, gridGargs)

  /**
   * socket 推送数据更新视图
   */
  this.render = function (svg, store) {
    df.log(store.data)
    let timeSet = new Set()
    // let lastDay = null
    store.data.forEach((d, i) => {
      let simpleT = d.time.slice(0, d.time.indexOf(' '))
      if (!timeSet.has(simpleT)) {
        timeSet.add(simpleT)
      }
    })
    let time = [...timeSet]
    let xTime = []
    let xWidth = []
    time.forEach((d, i) => {
      let newD = d.replace(/-/g, '/')
      xTime.push((new Date(`${newD} 09:30`)).getTime())
      xTime.push((new Date(`${newD} 11:30`)).getTime())
      xTime.push((new Date(`${newD} 13:00`)).getTime())
      xTime.push((new Date(`${newD} 15:00`)).getTime())
      let startVal = i * chartW / time.length
      let endVal = (i + 1) * chartW / time.length
      xWidth = [...xWidth, ...[startVal, startVal + (endVal - startVal) / 2, startVal + (endVal - startVal) / 2, endVal]]
    })
    df.log(xTime)
    df.log(xWidth)
    let priceMin = df.min(store.data, 'close')
    let priceMax = df.max(store.data, 'close')
    let volumeMin = df.min(store.data, 'volume')
    let volumeMax = df.max(store.data, 'volume')
    // let balanceMin = df.min(store.data, 'balance')
    // let balanceMin = df.max(store.data, 'balance')
    let priceMaxDiff = Math.max(Math.abs(priceMin - param.priceMid), Math.abs(priceMax - param.priceMid))
    let chartH1 = chartH * 11 / 20
    let chartH2 = chartH - chartH1
    df.log(volumeMin + '==>' + volumeMax)

    let scaleX = df.linear(xTime, xWidth)
    let scaleY1 = df.linear([param.priceMid - priceMaxDiff, param.priceMid + priceMaxDiff], [chartH1, 0])
    let scaleY2 = df.linear([volumeMin, volumeMax], [0, chartH2])
    df.log(scaleY2(100))
    /**
     * 行情区
     */
    // => 添加线性渐变
    let startColor = `rgba(20,107,206,0.3)`
    let endColor = `rgba(255,255,255,0.3)`
    let tsLinearGradient = df.linearGradient(svg, 'tsLinearColor', startColor, endColor)
    // => 面积曲线用于填充线性渐变
    let tsChartG = svg.append('g')
      .attr('transform', `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th})`)
    let tsArea = df.area(scaleX, scaleY1, 'time', 'close', chartH1)
    let areaArgs = {
      class: 'tsArea',
      fill: 'url(#' + tsLinearGradient.attr('id')
    }
    df.drawAreaPolyline(tsChartG, areaArgs, [store.data], tsArea)
    // => 价格曲线
    let tsLine = df.line(scaleX, scaleY1, 'time', 'close')
    let polylineArgs = {
      class: 'tsLine',
      fill: 'none',
      stroke: colors[param.theme].blue,
      'stroke-width': 1
    }
    df.drawPolyline(tsChartG, polylineArgs, [store.data], tsLine)
    // 指标一区
    let tsChartVolumeG = svg.append('g')
      .attr('transform', `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th + chartH1})`)
    df.log(tsChartVolumeG)
    let rectArgs = {
      class: 'volumeR',
      'width': 1
    }
    df.drawHistogram(tsChartVolumeG, rectArgs, store.data, scaleX, scaleY2, chartH2, colors[param.theme].fillRed, colors[param.theme].fillGreen)
  }
  // 初始化视图
  this.render(svg, store)
}
