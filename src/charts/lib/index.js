/**
 * 绘图工具 by zuozhengqi 2016/12/08
 */
import d3 from 'd3'
// import {numAdd, numSub, numMulti, numDiv} from './util'
// 输出到控制
export function log (key, val) {
  if (val) {
    console.log(key, val)
  } else {
    console.log(key)
  }
}

// 按对象属性排序比较函数
export function compare (propertyName) {
  return function (object1, object2) {
    let value1 = object1[propertyName]
    let value2 = object2[propertyName]
    if (value2 < value1) {
      return 1
    } else if (value2 > value1) {
      return -1
    } else {
      return 0
    }
  }
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
  tipTime: '%m/%d %H:%M',
  periods: ['上午', '下午'],
  days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  shortDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
})

// 格式化时间样式
export const timerStyle = {
  Ymd: '%Y/%m/%d',
  md: '%m/%d',
  YmdHM: '%Y/%m/%d %H:%M',
  YmdHMS: '%Y/%m/%d %H:%M:%S',
  mdHM: '%m/%d %H:%M',
  HMS: '%d %H:%M:%S'
}

// 格式化时间
export function formatTime (style) {
  return d3.time.format(style)
}

// 每日交易时间
export let tradeTime = ['09:30', '10:00', '10:30', '11:00', '11:30', '13:30', '14:00', '14:30', '15:00']

// 返回距 1970 年 1 月 1 日之间的毫秒数
export function getMsec (time) {
  return (new Date(time)).getTime()
}

// 根据毫米数返回时间
export function getDate (sec) {
  return new Date(sec)
}

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

// 坐标轴
export function axis (scaleVal, direction, type) {
  return d3.svg.axis()
    .scale(scaleVal)
    // .ticks(n)
    .tickSize(0, 0)
    .orient(direction)
    .tickFormat(function (d) {
      if (type === '%') {
        return `${formatVal(d)}%`
      } else {
        return d === '' || isNaN(Number(d)) === true ? `${d}` : formatVal(d)
      }
    })
}

export function formatVal (val) {
  if (typeof (val) === 'number') {
    if (Math.abs(val) < 1000) {
      return val.toFixed(2)
    } else if (Math.abs(val) < 10000) {
      return Math.floor(val)
    } else if (Math.abs(val) < 1000000) {
      return `${(val / 10000).toFixed(2)}万`
    } else if (Math.abs(val) < 10000000) {
      return `${(val / 10000).toFixed(1)}万`
    } else {
      return Math.abs(val) > 100000000 ? `${(val / 100000000).toFixed(1)}亿` : `${(val / 10000).toFixed(0)}万`
    }
  } else {
    return val
  }
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

// 定义线性渐变
export function linearGradient (svg, id, startColor, endColor) {
  let defs = svg.append('defs')

  let linearGradientEl = defs.append('linearGradient')
    .attr('id', id)
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%')

  linearGradientEl.append('stop')
    .attr('offset', '0%')
    .style('stop-color', startColor.toString())

  linearGradientEl.append('stop')
    .attr('offset', '100%')
    .style('stop-color', endColor.toString())

  return linearGradientEl
}

// 定义放射性渐变
export function radialGradient (svg, id, startColor, endColor) {
  let defs = svg.append('defs')

  let radialGradientEl = defs.append('radialGradient')
    .attr('id', id)
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', '50%')
    .attr('fx', '50%')
    .attr('fy', '50%')

  radialGradientEl.append('stop')
    .attr('offset', '0%')
    .style('stop-color', startColor.toString())
    .style('stop-opacity', 0.8)

  radialGradientEl.append('stop')
    .attr('offset', '100%')
    .style('stop-color', endColor.toString())
    .style('stop-opacity', 0)

  return radialGradientEl
}

// 定义SVG滤镜 高斯模糊
export function gaussianBlur (svg, id) {
  let defs = svg.append('defs')

  let filter = defs.append('filter')
    .attr('id', id)

  let gaussianBlurEl = filter.append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', 5)

  return gaussianBlurEl
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

  return svg
}

// 生成一个连续数组
export function getSerialArr (nums) {
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
  let hArr = getSerialArr(hNums)
  let vArr = getSerialArr(vNums)
  let w = gridGargs.width
  let h = gridGargs.height

  let update1 = gridG.selectAll('.horizontalLines')
    .data(hArr)
  let enter1 = update1.enter()
  let exit1 = update1.exit()
  // 网格水平分隔线
  update1.attr('class', 'horizontalLines')
    .attr('stroke', gridGargs.stroke)
    .attr('d', function (d, i) {
      return `M0,${(i * (h / hNums))}L${w},${(i * (h / hNums))}`
    })
  enter1.append('path')
    .attr('class', 'horizontalLines')
    .attr('stroke', gridGargs.stroke)
    .attr('stroke-Width', 1)
    .attr('fill', 'none')
    .attr('d', function (d, i) {
      return `M0,${(i * (h / hNums))}L${w},${(i * (h / hNums))}`
    })
  exit1.remove()
  // 网格垂直分隔线
  let update2 = gridG.selectAll('.verticalLines')
    .data(vArr)
  let enter2 = update2.enter()
  let exit2 = update2.exit()
  update2.attr('stroke', gridGargs.stroke)
    .attr('d', function (d, i) {
      return `M${(i * (w / vNums))},0L${(i * (w / vNums))},${h}`
    })
  enter2.append('path')
    .attr('class', 'verticalLines')
    .attr('stroke', gridGargs.stroke)
    .attr('stroke-Width', 1)
    .attr('fill', 'none')
    .attr('d', function (d, i) {
      return `M${(i * (w / vNums))},0L${(i * (w / vNums))},${h}`
    })
  exit2.remove()
}

/**
 * 绘制矩形
 * G => 容器
 * rectArgs => 参数{'class': '', 'x': 0, 'y': 0, 'width': 0, 'height': 0, 'fill': 'none'}
 */
export function drawRect (G, rectArgs) {
  return G.append('rect')
    .attr(rectArgs)
}

/**
 * 添加文字
 * G => 容器
 * textArgs => 参数
 */
export function drawText (G, textArgs) {
  return G.append('text')
    .attr(textArgs)
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

  update.attr('d', area)
    // .attr(areaArgs)
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

  update.attr('d', line)
    // .attr(polylineArgs)
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
export function drawHistogram (G, rectArgs, data, type, scaleX, scaleY, h, red, green) {
  let update = G.selectAll(`.${rectArgs.class}`)
    .data(data)
  let enter = update.enter()
  let exit = update.exit()

  update
    .attr(rectArgs)
    .attr('x', (d, i) => {
      return scaleX((new Date(d.time)).getTime())
    })
    .attr('y', (d, i) => {
      return h - scaleY(d[type])
    })
    .attr('height', (d, i) => {
      return scaleY(d[type])
    })
    .attr('fill', (d, i) => {
      return d.close - d.open >= 0 ? red : green
    })
  enter.append('rect')
    .attr(rectArgs)
    .attr('x', (d, i) => {
      return scaleX((new Date(d.time)).getTime())
    })
    .attr('y', (d, i) => {
      return h - scaleY(d[type])
    })
    .attr('height', (d, i) => {
      return scaleY(d[type])
    })
    .attr('fill', (d, i) => {
      return d.close - d.open >= 0 ? red : green
    })
  exit.remove()
}

/**
 * 绘制呼吸灯
 * G => 容器
 * lampArgs => 参数
 */
export function drawBreathLamp (G, lampArgs) {
  let breathLamp = G.append('circle')
    .attr(lampArgs)

  return breathLamp
}

/**
 * 绘制一条直线
 * G => 容器
 * lineArgs => 参数
 */
export function drawLine (G, lineArgs) {
  let line = G.append('line')
    .attr(lineArgs)

  return line
}

/**
 * ================================================
 * 以下k线图部分
 * ================================================
 */

/**
 * k线各指标容器模版
 * G => 容器
 */
export function drawBox ({G, gClassName, w, h, color}) {
  let g = G.append('g')
    .attr('class', gClassName)

  g.append('rect')
    .attr({
      class: 'head',
      x: 0,
      y: 0,
      width: w,
      height: h,
      stroke: 'none',
      fill: color
    })

  return g
}

/**
 * k线各指标设置按钮与关闭按钮
 * G => 容器
 */
export function drawBtn ({G, className, offsetW, offsetH, d, color, scaleX, scaleY}) {
  return G.append('g')
    .attr({
      class: className,
      transform: `translate(${offsetW}, ${offsetH})`
    })
    .append('path')
    .attr({
      d: d,
      fill: color,
      transform: `scale(${scaleX}, ${scaleY})`
    })
}

/**
 * 绘制k线网格之中间的竖直线 => 需要每根竖直线正好位于相近k线中间
 */
export function drawkGrid (G, vNums, rectW, rectS, gridGargs) {
  let vArr = getSerialArr(vNums)
  let w = gridGargs.width
  let h = gridGargs.height
  let unitW = w / vNums
  let x = Math.ceil(unitW / (rectW + rectS)) * (rectW + rectS)
  // 网格垂直分隔线
  let update = G.selectAll('.kverticalLines')
    .data(vArr)
  let enter = update.enter()
  let exit = update.exit()
  update
    .attr('stroke', (d, i) => {
      if (i === 0 || i === vNums) {
        return 'none'
      } else {
        return gridGargs.stroke
      }
    })
    .attr('d', function (d, i) {
      return `M${i * x - rectW / 2},0L${i * x - rectW / 2},${h}`
    })
  enter.append('path')
    .attr('class', 'kverticalLines')
    .attr('stroke', (d, i) => {
      if (i === 0 || i === vNums) {
        return 'none'
      } else {
        return gridGargs.stroke
      }
    })
    .attr('stroke-Width', 1)
    .attr('fill', 'none')
    .attr('d', function (d, i) {
      return `M${i * x - rectW / 2},0L${i * x - rectW / 2},${h}`
    })
  exit.remove()
}

/**
 * 绘制K线上下引线
 * G => 容器
 */
export function drawkLeads ({G, data, className, direction, rectWidth, rectSpace, scaleY, red, green}) {
  // k线上下引线部分
  let update = G.selectAll(`.${className}`)
    .data(data)
  let enter = update.enter()
  let exit = update.exit()

  update
    .attr('x1', (d, i) => {
      return rectSpace + rectWidth / 2 + i * (rectWidth + rectSpace)
    })
    .attr('y1', (d, i) => {
      return direction === 'up'
        ? scaleY(d.high)
        : scaleY(d.low)
    })
    .attr('x2', (d, i) => {
      return rectSpace + rectWidth / 2 + i * (rectWidth + rectSpace)
    })
    .attr('y2', (d, i) => {
      return direction === 'up'
        ? d.close >= d.open
          ? scaleY(d.close)
          : scaleY(d.open)
        : d.close >= d.open
          ? scaleY(d.open)
          : scaleY(d.close)
    })
    .attr('stroke', (d, i) => {
      if (d.close > d.open) {
        return red
      } else if (d.close < d.open) {
        return green
      } else {
        if (i !== 0) {
          if (data[i - 1].close <= d.close) {
            return red
          } else {
            return green
          }
        } else {
          return red
        }
      }
    })

  enter.append('line').attr('class', className)
    .attr('x1', (d, i) => {
      return rectSpace + rectWidth / 2 + i * (rectWidth + rectSpace)
    })
    .attr('y1', (d, i) => {
      return direction === 'up'
        ? scaleY(d.high)
        : scaleY(d.low)
    })
    .attr('x2', (d, i) => {
      return rectSpace + rectWidth / 2 + i * (rectWidth + rectSpace)
    })
    .attr('y2', (d, i) => {
      return direction === 'up'
        ? d.close >= d.open
          ? scaleY(d.close)
          : scaleY(d.open)
        : d.close >= d.open
          ? scaleY(d.open)
          : scaleY(d.close)
    })
    .attr('stroke-width', 1)
    .attr('stroke', (d, i) => {
      if (d.close > d.open) {
        return red
      } else if (d.close < d.open) {
        return green
      } else {
        if (i !== 0) {
          if (data[i - 1].close <= d.close) {
            return red
          } else {
            return green
          }
        } else {
          return red
        }
      }
    })

  exit.remove()
}

/**
 * 绘制K线实体
 * G => 容器
 */
export function drawkRect ({G, data, className, rectWidth, rectSpace, scaleY, red, green}) {
  let update = G.selectAll(`.${className}`)
    .data(data)
  let enter = update.enter()
  let exit = update.exit()

  update
    .attr('x', (d, i) => {
      return rectSpace + i * (rectWidth + rectSpace)
    })
    .attr('y', (d, i) => {
      if (d.close > d.open) {
        return scaleY(d.close)
      } else {
        return scaleY(d.open)
      }
    })
    .attr('width', rectWidth)
    .attr('height', (d, i) => {
      if (Math.abs(scaleY(d.close) - scaleY(d.open)) !== 0) {
        return Math.abs(scaleY(d.close) - scaleY(d.open)) > 1.5
          ? Math.abs(scaleY(d.close) - scaleY(d.open))
          : 1.5
      } else {
        return 1
      }
    })
    .attr('stroke', (d, i) => {
      if (d.close > d.open) {
        return rectWidth < 2
          ? 'none'
          : red
      } else if (d.close < d.open) {
        return 'none'
      } else {
        if (i !== 0) {
          if (data[i - 1].close <= d.close) {
            return rectWidth < 2
              ? 'none'
              : red
          } else {
            return 'none'
          }
        } else {
          return rectWidth < 2
            ? 'none'
            : red
        }
      }
    })
    .attr('fill', (d, i) => {
      if (d.close > d.open) {
        return rectWidth < 2
          ? red
          : 'none'
      } else if (d.close < d.open) {
        return green
      } else {
        if (i !== 0) {
          if (data[i - 1].close <= d.close) {
            return rectWidth < 2
              ? red
              : 'none'
          } else {
            return green
          }
        } else {
          return rectWidth < 2
            ? red
            : 'none'
        }
      }
    })

  enter.append('rect').attr('class', className)
    .attr('x', (d, i) => {
      return rectSpace + i * (rectWidth + rectSpace)
    })
    .attr('y', (d, i) => {
      if (d.close >= d.open) {
        return scaleY(d.close)
      } else {
        return scaleY(d.open)
      }
    })
    .attr('width', rectWidth)
    .attr('height', (d, i) => {
      if (Math.abs(scaleY(d.close) - scaleY(d.open)) !== 0) {
        return Math.abs(scaleY(d.close) - scaleY(d.open)) > 1.5
          ? Math.abs(scaleY(d.close) - scaleY(d.open))
          : 1.5
      } else {
        return 1
      }
    })
    .attr('stroke', (d, i) => {
      if (d.close > d.open) {
        return rectWidth < 2
          ? 'none'
          : red
      } else if (d.close < d.open) {
        return 'none'
      } else {
        if (i !== 0) {
          if (data[i - 1].close <= d.close) {
            return rectWidth < 2
              ? 'none'
              : red
          } else {
            return 'none'
          }
        } else {
          return rectWidth < 2
            ? 'none'
            : red
        }
      }
    })
    .attr('fill', (d, i) => {
      if (d.close > d.open) {
        return rectWidth < 2
          ? red
          : 'none'
      } else if (d.close < d.open) {
        return green
      } else {
        if (i !== 0) {
          if (data[i - 1].close <= d.close) {
            return rectWidth < 2
              ? red
              : 'none'
          } else {
            return green
          }
        } else {
          return rectWidth < 2
            ? red
            : 'none'
        }
      }
    })
    .on('click', (d) => { console.log(d) })

  exit.remove()
}

/**
 * k线曲线生产器
 */
export function kLine ({rectWidth, rectSpace, scaleY}) {
  return d3.svg.line()
    .x(function (d, i) {
      return rectSpace + rectWidth / 2 + i * (rectWidth + rectSpace)
    })
    .y(function (d) {
      return scaleY(d.value)
    })
    .interpolate('linear')
}

/**
 * 绘制通用柱状图
 * G => 容器
 */
export function drawRectChart ({G, data, className, x, y, width, height, fill}) {
  let update = G.selectAll(`.${className}`)
    .data(data)
  let enter = update.enter()
  let exit = update.exit()

  update.attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', fill)

  enter.append('rect')
    .attr('class', className)
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', fill)
    .on('click', (d) => { console.log(d) })

  exit.remove()
}

/**
 * 绘制文本
 */
export function drawTexts (G, className, texts, textArgs, fn) {
  let update = G.selectAll(`.${className}`)
    .data(texts)
  let enter = update.enter()
  let exit = update.exit()

  update.attr(textArgs)
    .text(fn)
  enter.append('text')
    .attr(textArgs)
    .text(fn)
  exit.remove()
}

/**
 * 定义缩放事件
 * scaleExtent 用于设置最小和最大的缩放比例
 * d3.event.translate 是平移的坐标值
 * d3.event.scale 是缩放的值
 */
export function zoom (range, fn) {
  return d3.behavior.zoom()
    .scale(1)
    .scaleExtent(range)
    .on('zoom', fn)
}

/**
 * 定义拖拽事件
 * d3.event.x d3.event.y => 当前鼠标的位置
 */
export function drag (fn) {
  return d3.behavior.drag()
    .on('drag', fn)
}

/**
 * 定义弧线生成器
 */
export function drawArcs ({innerR, outerR, sAngle, eAngle}) {
  return d3.svg.arc()
    .innerRadius(innerR)
    .outerRadius(outerR)
    .startAngle(sAngle * (Math.PI / 180))
    .endAngle(eAngle * (Math.PI / 180))
}

/**
 * 绘制网格
 * gridG  => 网格容器
 * svgArgs  => svg参数
 * hNums => 水平线根数
 * vNums => 竖直线根数
 * gridGargs => 网格线参数 width, height, top, bottom, left, right, stroke
 */
export function drawSlideGrid (gridG, svgArgs, vNums, gridGargs) {
  let vArr = getSerialArr(vNums)
  let w = gridGargs.width
  let h = gridGargs.height

  // 网格垂直分隔线
  let update = gridG.selectAll('.verticalLines')
    .data(vArr)
  let enter = update.enter()
  let exit = update.exit()
  update.attr('stroke', gridGargs.stroke)
    .attr('opacity', (d, i) => {
      return i !== 0 && i !== vNums ? 1 : 0
    })
    .attr('d', function (d, i) {
      return `M${(i * (w / vNums))},0L${(i * (w / vNums))},${h}`
    })
  enter.append('path')
    .attr('class', 'verticalLines')
    .attr('stroke', gridGargs.stroke)
    .attr('stroke-Width', 1)
    .attr('fill', 'none')
    .attr('opacity', (d, i) => {
      return i !== 0 && i !== vNums ? 1 : 0
    })
    .attr('d', function (d, i) {
      return `M${(i * (w / vNums))},0L${(i * (w / vNums))},${h}`
    })
  exit.remove()
}
