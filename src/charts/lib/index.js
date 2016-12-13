/**
 * 绘图工具 by zuozhengqi 2016/12/08
 */
import d3 from 'd3'

// 输出到控制
export function log (val) {
  console.log(val)
}

// 简体中文本地化
export let zh = d3.locale({
  decimal: '.',
  thousands: ',',
  grouping: [3],
  currency: ['¥', ''],
  dateTime: '%a %b %e %X %Y',
  date: '%Y/%-m/%-d',
  time: '%H:%M:%S',
  periods: ['上午', '下午'],
  days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  shortDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
})

// 时间比例尺
export function timeScale (dom, ran) {
  return d3.time.scale()
    .domain(dom)
    .range(ran)
}

// 线性比例尺
export function linear (dom, ran) {
  return d3.scale.linear()
    .domain(dom)
    .range(ran)
}

// 序数比例尺
export function ordinal (dom, ran) {
  return d3.scale.ordinal()
    .domain(dom)
    .range(ran)
}

// 获取最大值
export function max (arr, prop) {
  return d3.max(arr, (d) => {
    return d[prop]
  })
}

// 获取最小值
export function min (arr, prop) {
  return d3.min(arr, (d) => {
    return d[prop]
  })
}

// 线生成器
export function line (scaleX, scaleY, time, y) {
  return d3.svg.line()
    .x((d) => {
      // => 兼容safari
      let newTime = d[time].replace(/-/g, '/')
      return scaleX((new Date(newTime).getTime()))
    })
    .y((d) => {
      return scaleY(d[y])
    })
}
// 面积生成器
export function area (scaleX, scaleY, time, y, h) {
  return d3.svg.area()
    .x((d, i) => {
      // => 兼容safari
      let newTime = d[time].replace(/-/g, '/')
      return scaleX((new Date(newTime).getTime()))
    })
    .y0(h)
    .y1((d) => {
      return scaleY(d[y])
    })
}

// 定义一个线性渐变
export function linearGradient (svg, id, startColor, endColor) {
  let defs = svg.append('defs')

  let linearGradient = defs.append('linearGradient')
    .attr('id', id)
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%')

  linearGradient.append('stop')
    .attr('offset', '0%')
    .style('stop-color', startColor.toString())

  linearGradient.append('stop')
    .attr('offset', '100%')
    .style('stop-color', endColor.toString())

  return linearGradient
}

/**
 * 获取画布容器大小
 */
export function getSvgSize (param, margin) {
  let width = document.getElementById(`${param.id}`).offsetWidth
  let height = document.getElementById(`${param.id}`).offsetHeight

  let svgArgs = {
    id: param.id,
    theme: param.theme || 0,
    margin: margin,
    width: width,
    height: height
  }

  return svgArgs
}

// 创建SVG
export function createSVG (svgArgs) {
  d3.select(`#${svgArgs.id} svg`).remove()
  let svg = d3.select(`#${svgArgs.id}`).append('svg')
    .attr('width', svgArgs.width + svgArgs.margin.left + svgArgs.margin.right)
    .attr('height', svgArgs.height + svgArgs.margin.top + svgArgs.margin.bottom)
    // .append('g')
    // .attr('transform', `translate(${svgArgs.margin.left},${svgArgs.margin.top})`)

  return svg
}

// 生成一个连续数组
export function _getSerialArr (nums) {
  let arr = []
  for (let i = 0; i <= nums; i++) {
    arr.push(i)
  }
  return arr
}

/**
 * 绘制网格
 * gridG  => 网格容器
 * svgArgs  => svg参数
 * hNums => 水平线根数
 * vNums => 竖直线根数
 * gridGargs => 网格线参数 width, height, top, bottom, left, right, stroke
 */
export function drawGrid (gridG, svgArgs, hNums, vNums, gridGargs) {
  let hArr = _getSerialArr(hNums)
  let vArr = _getSerialArr(vNums)
  let w = gridGargs.width
  let h = gridGargs.height
  // 网格水平分隔线
  gridG.selectAll('.horizontalLines')
    .data(hArr)
    .enter()
    .append('path')
    .attr('class', 'horizontalLines') // horizontalLines
    .attr('stroke', gridGargs.stroke)
    .attr('stroke-Width', 1)
    .attr('fill', 'none')
    .attr('d', function (d, i) {
      return `M0,${(i * (h / hNums))}L${w},${(i * (h / hNums))}`
    })
  // 网格垂直分隔线
  gridG.append('g')
    .selectAll('.verticalLines')
    .data(vArr)
    .enter()
    .append('path')
    .attr('class', 'verticalLines')
    .attr('stroke', gridGargs.stroke)
    .attr('stroke-Width', 1)
    .attr('fill', 'none')
    .attr('d', function (d, i) {
      return `M${(i * (w / vNums))},0L${(i * (w / vNums))},${h}`
    })
}

/**
 * 绘制矩形
 * G => 容器
 * rectArgs => 参数{'class': '', 'x': 0, 'y': 0, 'width': 0, 'height': 0, 'fill': 'none'}
 */
export function drawRect (G, rectArgs) {
  G.append('rect')
    .attr(rectArgs)

  return G
}

/**
 * 绘制具有区域颜色的折线图
 * G => 容器
 * areaArgs => 参数{'class': '', 'fill', ''}
 * data => 绘图数据
 * area => 面积生成器
*/
export function drawAreaPolyline (G, areaArgs, data, area) {
  let update = G.selectAll(`.${areaArgs.class}`)
    .data(data)
  let enter = update.enter()
  let exit = update.exit()

  update.attr(areaArgs)
  enter.append('path')
    .attr('d', area)
    .attr(areaArgs)
  exit.remove()
}

/**
 * 绘制曲线
 * G => 容器
 * polylineArgs => 参数
 * data => 绘图数据
 * line => 线生成器
 */
export function drawPolyline (G, polylineArgs, data, line) {
  let update = G.selectAll(`.${polylineArgs.class}`)
    .data(data)
  let enter = update.enter()
  let exit = update.exit()

  update.attr(polylineArgs)
  enter.append('path')
    .attr('d', line)
    .attr(polylineArgs)
  exit.remove()
}

/**
 * 绘制柱状图
 * G => 容器
 * rectArgs => 参数
 * data => 绘图数据
 */
export function drawHistogram (G, rectArgs, data, scaleX, scaleY, h, red, green) {
  let update = G.selectAll(`.${rectArgs.class}`)
    .data(data)
  let enter = update.enter()
  let exit = update.exit()

  update.attr(rectArgs)
  enter.append('rect')
    .attr(rectArgs)
    .attr('x', (d, i) => {
      return scaleX((new Date(d.time)).getTime())
    })
    .attr('y', (d, i) => {
      return h - scaleY(d.volume)
    })
    .attr('height', (d, i) => {
      return scaleY(d.volume)
    })
    .attr('fill', (d, i) => {
      return d.close - d.open >= 0 ? red : green
    })
  exit.remove()
}
