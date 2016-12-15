/**
 * 分时图 by zuozhengqi 2016/12/08
 */
import d3 from 'd3'
import * as df from '../lib/index'
import { colors } from '../lib/colors'
import { average } from '../indicators/MA'

/**
 * 数据仓库
 */
let store = {
  data: [],
  maData: [],
  chartData: [],
  dataDict: {}
}

// 指标一区绘图数据
let indicators1 = ['成交量', '成交额']
let indicators1Index = 0

/**
 * 输出分时图对外接口
 */
export default function (param, svgArgs) {
  // 将传入的数据缓存起来
  store.data = param.data.concat([])
  // df.log(svgArgs)
  // 在绘图容器中添加 SVG
  let svg = df.createSVG(svgArgs)
  // df.log('param')
  // df.log(param)
  // 绘制背景矩形
  let bgG = svg.append('g')
    .attr('class', 'bgG')
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

  // 添加放射性渐变标签
  df.radialGradient(svg, 'radialGradientRed', colors[param.theme].lampRed, colors[param.theme].lampWhite)
  df.radialGradient(svg, 'radialGradientGreen', colors[param.theme].lampGreen, colors[param.theme].lampWhite)
  // 添加高斯模糊标签
  df.gaussianBlur(svg, 'gaussianBlur')

  // 添加最新价点位呼吸灯
  let lampG = svg.append('g')
    .attr('class', 'lampG')
    .attr('transform', `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th})`)
  let latestLamp = df.drawBreathLamp(lampG, {
    class: 'lamp',
    cx: -100,
    cy: -100,
    r: 5,
    filter: 'url(#gaussianBlur)'
  })
  let latestLampwick = df.drawBreathLamp(lampG, {
    class: 'lampwick',
    cx: -100,
    cy: -100,
    r: 2.5
  })
  // 随光标移动价格圆点
  let historyLamp = df.drawBreathLamp(lampG, {
    class: 'historyLamp',
    cx: -100,
    cy: -100,
    r: 8,
    fill: colors[param.theme].lampBlue,
    opacity: 0.5
  })
  let historyLampwick = df.drawBreathLamp(lampG, {
    class: 'historyLampwick',
    cx: -100,
    cy: -100,
    r: 2.5,
    fill: colors[param.theme].lampwickBlue
  })

  // 网格容器
  let gridG = svgG.append('g')
    .attr('class', 'gridG')

  // 行情区容器 => 面积曲线用于填充线性渐变
  let tsChartG = svgG.append('g')

  // 指标一区容器
  let tsChartVolumeG = svgG.append('g')

  // => 十字光标
  let cursorG = svgG.append('g')
    .attr('class', 'cursorG')
    .attr('opacity', 0)
  let cursorX = df.drawLine(cursorG, {
    class: 'cursorX',
    x1: 0,
    x2: chartW,
    stroke: colors[param.theme].cursorBlue,
    'stroke-width': 1,
    'stroke-dasharray': '3, 3'
  })
  let cursorY = df.drawLine(cursorG, {
    class: 'cursorY',
    y1: th,
    y2: th + chartH,
    stroke: colors[param.theme].cursorBlue,
    'stroke-width': 1,
    'stroke-dasharray': '3, 3'
  })

  // 坐标轴刻度容器
  let timeAxisG = svg.append('g')
  let priceAxisG = svg.append('g')
  let PercentAxisG = svg.append('g') // 涨跌比率坐标轴容器
  let vbAxisG = svg.append('g') // 成交量与成交额坐标轴容器

  // => 光标指示
  let timeTipG = svg.append('g')
    .attr('class', 'timeTipG')
    .attr('opacity', 0)
  df.drawRect(timeTipG, {
    x: 0,
    y: 0,
    width: 76,
    height: 20,
    stroke: colors[param.theme].tipBorderBlue,
    'stroke-width': 1,
    fill: colors[param.theme].tipBlue
  })
  let timeTipText = df.drawText(timeTipG, {
    'font-family': 'PingFangSC-Regular',
    'font-size': 12,
    dx: 38,
    dy: 14,
    stroke: 'none',
    fill: colors[param.theme].tipTextBlue,
    'text-anchor': 'middle'
  })

  let priceTipG = svg.append('g')
    .attr('class', 'priceTipG')
    .attr('opacity', 0)
  df.drawRect(priceTipG, {
    x: 0,
    y: 0,
    width: lw,
    height: 18,
    stroke: colors[param.theme].tipBorderBlue,
    'stroke-width': 1,
    fill: colors[param.theme].tipBlue
  })
  let priceTipText = df.drawText(priceTipG, {
    'font-family': 'PingFangSC-Regular',
    'font-size': 12,
    dx: lw - 5,
    dy: 14,
    stroke: 'none',
    fill: colors[param.theme].tipTextBlue,
    'text-anchor': 'end'
  })

  let percentTipG = svg.append('g')
    .attr('class', 'percentTipG')
    .attr('opacity', 0)
  df.drawRect(percentTipG, {
    x: 0,
    y: 0,
    width: rw,
    height: 18,
    stroke: colors[param.theme].tipBorderBlue,
    'stroke-width': 1,
    fill: colors[param.theme].tipBlue
  })
  let percentTipText = df.drawText(percentTipG, {
    'font-family': 'PingFangSC-Regular',
    'font-size': 12,
    dx: 5,
    dy: 14,
    stroke: 'none',
    fill: colors[param.theme].tipTextBlue
  })

  // => 添加线性渐变
  let startColor = `rgba(20,107,206,0.3)`
  let endColor = `rgba(255,255,255,0.3)`
  let tsLinearGradient = df.linearGradient(svg, 'tsLinearColor', startColor, endColor)

  // 成交量、成交额切换
  let toggleBtnG = svg.append('g')
    .attr('class', 'toggleBtnG')
    .attr('opacity', 0)
    .attr('cursor', 'pointer')

  let toggleBtnR = df.drawRect(toggleBtnG, {
    x: 0,
    y: 0,
    rx: 5,
    ry: 5,
    width: 45,
    height: 20,
    stroke: colors[param.theme].tipBorderBlue,
    'stroke-width': 1,
    fill: colors[param.theme].tipBlue
  })
  let toggleTipText = df.drawText(toggleBtnG, {
    'font-family': 'PingFangSC-Regular',
    'font-size': 12,
    dx: 22.5,
    dy: 14,
    stroke: 'none',
    fill: colors[param.theme].tipTextBlue,
    'pointer-events': 'none',
    'text-anchor': 'middle'
  })
  toggleTipText.text(indicators1[indicators1Index])

  // 浮动提示框
  let floatBox = svg.append('g')
    .attr('class', 'floatBox')
    .attr('transform', `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th})`)

  df.drawRect(floatBox, {
    class: 'floatBoxR',
    x: 0,
    y: 0,
    width: 140,
    height: 165,
    stroke: colors[param.theme].floatGray,
    fill: colors[param.theme].floatBg,
    opacity: 0.5
  })
  let floatConf = ['时间:', '价格:', '均价:', '涨跌额:', '涨跌幅:', '成交量:', '成交额:']
  let floatVal = {}
  floatConf.forEach((d, i) => {
    df.drawText(floatBox, {
      'font-family': 'PingFangSC-Regular',
      'font-size': 14,
      dx: 8,
      dy: 17 + 23 * i,
      stroke: 'none',
      fill: colors[param.theme].floatTextGray,
      'pointer-events': 'none',
      'text-anchor': 'start'
    }).text(d)
    floatVal[`index${i}`] = df.drawText(floatBox, {
      'font-family': 'PingFangSC-Regular',
      'font-size': 14,
      dx: 140 - 8,
      dy: 17 + 23 * i,
      stroke: 'none',
      fill: colors[param.theme].floatTextGray,
      'pointer-events': 'none',
      'text-anchor': 'end'
    })
  })

  // 事件触发容器
  let eventG = svg.append('g')
    .attr('class', 'eventG')
    .attr('transform', `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th})`)
  let eventGRectArgs = {
    'class': 'eventGRect',
    'x': 0,
    'y': 0,
    'width': chartW,
    'height': chartH,
    'fill': 'none',
    'pointer-events': 'all'
  }
  let eventGRect = df.drawRect(eventG, eventGRectArgs)

  /**
   * socket 推送数据更新视图
   */
  this.render = function (svg, store) {
    // df.log(store.data)
    let timeSet = new Set()
    store.data.forEach((d, i) => {
      store.dataDict[d.time] = d
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
    // 获取价格、成交量、成交额最大最小值
    let priceMin = df.min(store.data, 'close')
    let priceMax = df.max(store.data, 'close')
    let priceMaxDiff = Math.max(Math.abs(priceMin - param.priceMid), Math.abs(priceMax - param.priceMid))

    // => 横坐标轴刻度
    let scaleTimeArr = time.length > 1 ? [...time, ''] : df.tradeTime
    let scaleWidth = []
    let unitW = chartW / (scaleTimeArr.length - 1)
    scaleTimeArr.forEach((d, i) => {
      scaleWidth.push(i * unitW)
    })

    let scaleTime = df.ordinal(scaleTimeArr, scaleWidth)
    // 底部时间坐标轴
    timeAxisG.attr('class', 'x axis')
      .attr('transform', `translate(${lw},${chartH})`)
      .call(df.axis(scaleTime, 'bottom'))
      .selectAll('text')
      .attr('fill', colors[param.theme].axitTextGray)
      .attr('transform', `translate(0,4)`)

    // => 绘制网格
    let gridHNums = svgArgs.height > 450 ? 20 : 8 // 水平分割多少格
    let gridVNums = scaleTimeArr.length - 1 // 垂直分割多少格
    let gridGargs = {
      width: chartW,
      height: chartH,
      top: th,
      bottom: bh,
      left: lw,
      right: rw,
      stroke: colors[svgArgs.theme].gray
    }
    df.drawGrid(gridG, svgArgs, gridHNums, gridVNums, gridGargs)

    // 每格网格的高度
    let unitGridH = chartH / gridHNums
    let chartH1GridNums = gridHNums / 2 // => 价格曲线垂直方向所占网格数量
    let chartH2GridNums = gridHNums / 2 - 1 // => 分时量&分时额垂直方向所占网格数量
    let chartH1 = unitGridH * chartH1GridNums
    let chartH2 = unitGridH * chartH2GridNums

    // 生成纵坐标轴刻度
    let priceRange = []
    let pricePercentRange = []
    let scalePriceHeight = []
    let priceUnit = (2 * priceMaxDiff) / chartH1GridNums
    let pricePercentUnit = priceMaxDiff / param.priceMid / chartH1GridNums * 2
    let chartH1Unit = chartH1 / chartH1GridNums
    df.getSerialArr(chartH1GridNums)
      .forEach((d, i) => {
        priceRange = [...priceRange, param.priceMid - priceMaxDiff + i * priceUnit]
        scalePriceHeight = [...scalePriceHeight, i * chartH1Unit]
        pricePercentRange = [...pricePercentRange, (i - chartH1GridNums / 2) * pricePercentUnit * 100]
      })
    // 反转数组
    scalePriceHeight.reverse()
    // => 绘制纵坐标刻度
    let scalePrice = df.ordinal(priceRange, scalePriceHeight)
    priceAxisG.attr('class', 'y axis')
      .attr('transform', `translate(${lw},${th})`)
      .call(df.axis(scalePrice, 'left'))
      .selectAll('text')
      .attr('fill', (d, i) => {
        return i !== chartH1GridNums / 2 ? (i < chartH1GridNums / 2 ? colors[param.theme].axisTextGreen : colors[param.theme].axisTextRed) : colors[param.theme].axitTextGray
      })
      .attr('transform', (d, i) => {
        return i === chartH1GridNums ? `translate(0,6)` : `translate(0,0)`
      })

    let scalePricePercent = df.ordinal(pricePercentRange, scalePriceHeight)
    PercentAxisG.attr('class', 'y axis')
      .attr('transform', `translate(${lw + chartW},${th})`)
      .call(df.axis(scalePricePercent, 'right', '%'))
      .selectAll('text')
      .attr('fill', (d, i) => {
        return i !== chartH1GridNums / 2 ? (i < chartH1GridNums / 2 ? colors[param.theme].axisTextGreen : colors[param.theme].axisTextRed) : colors[param.theme].axitTextGray
      })
      .attr('transform', (d, i) => {
        return i === chartH1GridNums ? `translate(0,6)` : `translate(0,0)`
      })

    // => 横纵坐标比例尺
    let scaleX = df.linear(xTime, xWidth)
    let scaleY1 = df.linear([param.priceMid - priceMaxDiff, param.priceMid + priceMaxDiff], [chartH1, 0])
    let scaleY2
    let scaleYPercent = df.linear([-(priceMaxDiff / param.priceMid * 100), priceMaxDiff / param.priceMid * 100], [chartH1, 0])

    // => 更新呼吸灯位置与颜色
    latestLamp
      .attr('cx', () => {
        return scaleX(df.getMsec(param.data[param.data.length - 1].time))
      })
      .attr('cy', () => {
        return scaleY1(param.data[param.data.length - 1].close)
      })
      .attr('fill', () => {
        let lastIndex = param.data.length - 1
        // return lastIndex > 0 ? (param.data[lastIndex].close - param.data[lastIndex].close >= 0 ? colors[param.theme].lampRed : colors[param.theme].lampGreen) : colors[param.theme].lampRed
        return lastIndex > 0 ? (param.data[lastIndex].close - param.data[lastIndex - 1].close >= 0 ? `url(#radialGradientRed)` : `url(#radialGradientGreen)`) : `url(#radialGradientRed)`
      })
    latestLampwick
      .attr('cx', () => {
        return scaleX(df.getMsec(param.data[param.data.length - 1].time))
      })
      .attr('cy', () => {
        return scaleY1(param.data[param.data.length - 1].close)
      })
      .attr('fill', () => {
        let lastIndex = param.data.length - 1
        return lastIndex > 0 ? (param.data[lastIndex].close - param.data[lastIndex - 1].close >= 0 ? colors[param.theme].lampRed : colors[param.theme].lampGreen) : colors[param.theme].lampRed
      })
    /**
     * 行情区价格、均线走势 + 成交量、成交额柱状图
     */
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

    // 计算平均线数据并绘制曲线
    store.maData = average(store.data)
    let tsMaLine = df.line(scaleX, scaleY1, 'time', 'value')
    let maPolylineArgs = {
      class: 'tsMaLine',
      fill: 'none',
      stroke: colors[param.theme].orange,
      'stroke-width': 1
    }
    df.drawPolyline(tsChartG, maPolylineArgs, [store.maData], tsMaLine)
    // 获取均价字典
    store.maDataDict = {}
    store.maData.forEach((d, i) => {
      store.maDataDict[d.time] = d
    })

    // 指标一区 => 分时量 || 分时额类型
    function updateIndicators2 () {
      let volumeMax = indicators1[indicators1Index] === '成交量' ? df.max(store.data, 'volume') : df.max(store.data, 'balance')
      let vbRange = []
      let scaleVBHeight = []
      let vbUnit = chartH2 / chartH2GridNums
      df.getSerialArr(chartH2GridNums)
        .forEach((d, i) => {
          vbRange = i === 0 ? [...vbRange, ''] : [...vbRange, volumeMax / chartH2GridNums * i]
          scaleVBHeight = [...scaleVBHeight, i * vbUnit]
        })
      // 反转数组
      scaleVBHeight.reverse()
      let scaleVB = df.ordinal(vbRange, scaleVBHeight)
      vbAxisG.attr('class', 'y axis')
        .attr('transform', `translate(${lw},${th + chartH1 + unitGridH})`)
        .call(df.axis(scaleVB, 'left'))
        .selectAll('text')
        .attr('fill', colors[param.theme].axitTextGray)
      scaleY2 = df.linear([0, volumeMax], [0, chartH2])
      tsChartVolumeG.attr('transform', `translate(0,${unitGridH * (chartH1GridNums + 1)})`)
      let rectArgs = {
        class: 'volumeR',
        'width': 1
      }
      let rectType = indicators1[indicators1Index] === '成交量' ? 'volume' : 'balance'

      df.drawHistogram(tsChartVolumeG, rectArgs, store.data, rectType, scaleX, scaleY2, chartH2, colors[param.theme].fillRed, colors[param.theme].fillGreen)
    }
    updateIndicators2()

    // 成交量、成交额切换
    toggleBtnG.attr('opacity', 1)
      .attr('transform', `translate(${chartW + lw + 7.5},${chartH - chartH2})`)
    toggleBtnR.on('click', function () {
      d3.event.preventDefault()
      indicators1Index += 1
      indicators1Index = indicators1Index > 1 ? 0 : indicators1Index

      toggleTipText.text(indicators1[indicators1Index])
      // 更新指标一区
      updateIndicators2()
    })

    /**
     * 定义鼠标事件
     */
    // 阻止默认双击放大事件
    svg.on('dblclick.zoom', null)
    eventGRect
      .on('mouseover', () => {
        showCousor()
      })
      .on('mousemove', function () {
        let x = d3.mouse(this)[0]
        let y = d3.mouse(this)[1]
        mousemove({
          x: x,
          y: y,
          scaleX: scaleX,
          chartH1: chartH1,
          chartH2: chartH2,
          scaleY1: scaleY1,
          scaleY2: scaleY2,
          scaleYPercent: scaleYPercent
        })
      })
      .on('mouseout', () => {
        hideCorsor()
      })
      .on('click', function () {
        // 阻止默认事件
        d3.event.preventDefault()
        let x = d3.mouse(this)[0]
        let y = d3.mouse(this)[1]
        mousemove({
          x: x,
          y: y,
          scaleX: scaleX,
          chartH1: chartH1,
          chartH2: chartH2,
          scaleY1: scaleY1,
          scaleY2: scaleY2,
          scaleYPercent: scaleYPercent
        })
      })
  }
  // 初始化视图
  this.render(svg, store)

  // 显示光标
  function showCousor () {
    cursorG.attr('opacity', 1)
    timeTipG.attr('opacity', 1)
    priceTipG.attr('opacity', 1)
    percentTipG.attr('opacity', 1)
    historyLamp.attr('opacity', 0.5)
    historyLampwick.attr('opacity', 1)
  }
  // 隐藏光标
  function hideCorsor () {
    cursorG.attr('opacity', 0)
    timeTipG.attr('opacity', 0)
    priceTipG.attr('opacity', 0)
    percentTipG.attr('opacity', 0)
    historyLamp.attr('opacity', 0)
    historyLampwick.attr('opacity', 0)
  }

  // 光标移动时更新光标指示数据
  function mousemove ({x, y, scaleX, scaleY1, scaleY2, scaleYPercent, chartH1, chartH2}) {
    if (+cursorG.attr('opacity') !== 1) {
      return
    }
    // 更新时间指示框位置 & 指示时间
    let tipTime = df.getDate(scaleX.invert(x))
    timeTipG.attr('transform', `translate(${x + lw - 38},${th + chartH + 1})`)
    timeTipText.text(df.formatTime('%m/%d %H:%M')(tipTime))

    let timeIndex = `${df.formatTime('%Y-%m-%d %H:%M')(tipTime)}:00`
    let cursorPrice = store.dataDict[timeIndex] ? store.dataDict[timeIndex] : {}
    let cursorMaPrice = store.maDataDict[timeIndex] ? store.maDataDict[timeIndex].value : 0

    // 更新十字光标位置
    cursorX.attr('y1', y)
      .attr('y2', y)
    cursorY
      .attr('x1', () => {
        return store.dataDict[timeIndex] ? scaleX(df.getMsec(store.dataDict[timeIndex].time)) : x
      })
      .attr('x2', () => {
        return store.dataDict[timeIndex] ? scaleX(df.getMsec(store.dataDict[timeIndex].time)) : x
      })

    // 更新随光标移动价格圆点位置 store.dataDict
    historyLamp
      .attr('cx', () => {
        return store.dataDict[timeIndex] ? scaleX(df.getMsec(store.dataDict[timeIndex].time)) : 0
      })
      .attr('cy', () => {
        return cursorPrice.close !== undefined ? scaleY1(cursorPrice.close) : -100
      })
    historyLampwick
      .attr('cx', () => {
        return store.dataDict[timeIndex] ? scaleX(df.getMsec(store.dataDict[timeIndex].time)) : 0
      })
      .attr('cy', () => {
        return cursorPrice.close !== undefined ? scaleY1(cursorPrice.close) : -100
      })

    // 水平光标线在行情区与第一指标区之间时隐藏
    let priceTipVal = 0
    let percentTipVal = 0
    if (y < chartH1) {
      // df.log(y)
      cursorX.attr('opacity', 1)
      priceTipG.attr('opacity', 1)
      percentTipG.attr('opacity', 1)
      priceTipVal = scaleY1.invert(y)
      percentTipVal = df.formatVal(scaleYPercent.invert(y))
    } else if (y > chartH - chartH2) {
      // df.log(chartH - y)
      cursorX.attr('opacity', 1)
      priceTipG.attr('opacity', 1)
      percentTipG.attr('opacity', 0)
      priceTipVal = scaleY2.invert(chartH - y)
      percentTipVal = 0
    } else {
      cursorX.attr('opacity', 0)
      priceTipG.attr('opacity', 0)
      percentTipG.attr('opacity', 0)
      priceTipVal = 0
      percentTipVal = 0
    }
    priceTipVal = df.formatVal(priceTipVal)
    priceTipG.attr('transform', `translate(${0},${y > 10 ? th + y - 10 : th})`)
    priceTipText.text(priceTipVal)

    percentTipG.attr('transform', `translate(${lw + chartW},${y > 10 ? th + y - 10 : th})`)
    percentTipText.text(`${percentTipVal}%`)

    // 更新浮动框位置 与 内容
    floatBox.attr('transform', () => {
      return x <= chartW / 2 ? `translate(${lw + chartW - 140},${th})` : `translate(${lw},${th})`
    })
    let cursorPriceClose = cursorPrice.close ? cursorPrice.close : 0
    let flafloatValArr = [df.formatTime('%m/%d %H:%M')(tipTime),
      cursorPrice.close,
      df.formatVal(cursorMaPrice),
      df.formatVal(cursorPriceClose - param.priceMid),
      `${df.formatVal((cursorPriceClose - param.priceMid) / param.priceMid * 100)}%`,
      df.formatVal(cursorPrice.volume || 0),
      df.formatVal(cursorPrice.balance || 0)
    ]
    flafloatValArr.forEach((d, i) => {
      floatVal[`index${i}`].text(d)
    })
  }
}
