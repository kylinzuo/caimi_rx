/**
 * 分时图 by zuozhengqi 2016/12/08
 */
import d3 from 'd3'
import * as df from '../lib/index'
import { colors } from '../lib/colors'
import { average } from '../indicators/MA'

/**
 * export time series chart
 */
export default function (param, svgArgs, toggleChart) {
  // => database
  let store = {
    priceMid: 0,
    data: [],
    maData: [],
    chartData: [],
    dataDict: {}
  }

  // => config
  let conf = {
    theme: 0 // default white color theme 0
  }

  // => indicators1 chart types
  let indicators1 = ['成交量', '成交额']
  let indicators1Index = 0
  let cursorFlag = false

  // => cache data
  store.data = [...param.data]
  store.priceMid = param.priceMid || store.priceMid

  // => cache config
  conf.theme = param.theme !== undefined ? param.theme : conf.theme

  // => parent container svg
  let svg = df.createSVG(svgArgs)

  // => draw background
  let bgG = svg.append('g')
    .attr('class', 'bgG')
  df.drawRect(bgG, {
    'class': 'bgR',
    'x': 0,
    'y': 0,
    'width': svgArgs.width,
    'height': svgArgs.height,
    'fill': colors[conf.theme].bgColor
  })

  // => chart around size
  const lw = 60
  const rw = 60
  const th = 15
  const bh = 22
  let chartW = svgArgs.width - lw - rw
  let chartH = svgArgs.height - th - bh

  // => Chart container
  let svgG = svg.append('g')
    .attr({
      class: 'svgG',
      transform: `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th})`
    })

  // => 添加放射性渐变标签
  df.radialGradient(svg, `${svgArgs.id}RadialGradientRed`, colors[conf.theme].lampRed, colors[conf.theme].lampWhite)
  df.radialGradient(svg, `${svgArgs.id}radialGradientGreen`, colors[conf.theme].lampGreen, colors[conf.theme].lampWhite)

  // => 添加高斯模糊标签
  df.gaussianBlur(svg, `${svgArgs.id}gaussianBlur`)

  // => latest price breath lamp
  let lampG = svg.append('g')
    .attr({
      class: `lampG`,
      transform: `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th})`
    })
  let latestLamp = df.drawBreathLamp(lampG, {
    class: 'lamp',
    cx: -100,
    cy: -100,
    r: 5,
    filter: `url(#${svgArgs.id}gaussianBlur)`
  })
  let latestLampwick = df.drawBreathLamp(lampG, {
    class: 'lampwick',
    cx: -100,
    cy: -100,
    r: 3.5
  })
  // => cursor price pilot lamp
  let pilotLamp = df.drawBreathLamp(lampG, {
    class: 'pilotLamp',
    cx: -100,
    cy: -100,
    r: 8,
    fill: colors[conf.theme].lampBlue,
    opacity: 0.5
  })
  let pilotLampwick = df.drawBreathLamp(lampG, {
    class: 'pilotLampwick',
    cx: -100,
    cy: -100,
    r: 2.5,
    fill: colors[conf.theme].lampwickBlue
  })

  // => grid Container
  let gridG = svgG.append('g')
    .attr('class', 'gridG')

  // => tsChart container
  let tsChartG = svgG.append('g')

  // => indicators1 container
  let tsChartVolumeG = svgG.append('g')

  // => cross cursor
  let cursorG = svgG.append('g')
    .attr({
      class: `cursorG`,
      opacity: 0
    })
  let cursorLineX = df.drawLine(cursorG, {
    class: 'cursorLineX',
    x1: 0,
    x2: chartW,
    stroke: colors[conf.theme].cursorBlue,
    'stroke-width': 1,
    'stroke-dasharray': '5, 2, 1, 2'
  })
  let cursorLineY = df.drawLine(cursorG, {
    class: 'cursorLineY',
    y1: 0,
    y2: chartH,
    stroke: colors[conf.theme].cursorBlue,
    'stroke-width': 1,
    'stroke-dasharray': '5, 3, 1, 3'
  })

  // => axis container
  let timeAxisG = svg.append('g')
  let priceAxisG = svg.append('g')
  let PercentAxisG = svg.append('g') // 涨跌比率坐标轴容器
  let vbAxisG = svg.append('g') // 成交量与成交额坐标轴容器

  // => time tag
  let timeTagG = svg.append('g')
    .attr({
      class: `timeTagG`,
      opacity: 0
    })
  df.drawRect(timeTagG, {
    x: 0,
    y: 0,
    width: 76,
    height: 20,
    stroke: colors[conf.theme].tagBorderBlue,
    'stroke-width': 1,
    fill: colors[conf.theme].tagBlue
  })
  let timeTagText = df.drawText(timeTagG, {
    // 'font-family': 'PingFangSC-Regular',
    'font-size': 12,
    dx: 38,
    dy: 14,
    stroke: 'none',
    fill: colors[conf.theme].tagTextBlue,
    'text-anchor': 'middle'
  })

  // => price tag
  let priceTagG = svg.append('g')
    .attr({
      class: `priceTagG`,
      opacity: 0
    })
  df.drawRect(priceTagG, {
    x: 0,
    y: 0,
    width: lw,
    height: 18,
    stroke: colors[conf.theme].tagBorderBlue,
    'stroke-width': 1,
    fill: colors[conf.theme].tagBlue
  })
  let priceTagText = df.drawText(priceTagG, {
    // 'font-family': 'PingFangSC-Regular',
    'font-size': 12,
    dx: lw - 5,
    dy: 14,
    stroke: 'none',
    fill: colors[conf.theme].tagTextBlue,
    'text-anchor': 'end'
  })

  let percentTagG = svg.append('g')
    .attr({
      class: `percentTagG`,
      opacity: 0
    })
  df.drawRect(percentTagG, {
    x: 0,
    y: 0,
    width: rw,
    height: 18,
    stroke: colors[conf.theme].tagBorderBlue,
    'stroke-width': 1,
    fill: colors[conf.theme].tagBlue
  })
  let percentTagText = df.drawText(percentTagG, {
    // 'font-family': 'PingFangSC-Regular',
    'font-size': 12,
    dx: 5,
    dy: 14,
    stroke: 'none',
    fill: colors[conf.theme].tagTextBlue
  })

  // => linear gradient
  let startColor = `rgba(20,107,206,0.3)`
  let endColor = `rgba(255,255,255,0.3)`
  let tsLinearGradient = df.linearGradient(svg, `${svgArgs.id}tsLinearColor`, startColor, endColor)

  // => volume & balance toggle button container
  let toggleBtnG = svg.append('g')
    .attr({
      class: `toggleBtnG`,
      opacity: 0,
      cursor: `pointer`
    })

  let toggleBtnR = df.drawRect(toggleBtnG, {
    x: 0,
    y: 0,
    rx: 5,
    ry: 5,
    width: 45,
    height: 20,
    stroke: colors[conf.theme].tagBorderBlue,
    'stroke-width': 1,
    fill: colors[conf.theme].tagBlue
  })
  let toggleTagText = df.drawText(toggleBtnG, {
    // 'font-family': 'PingFangSC-Regular',
    'font-size': 12,
    dx: 22.5,
    dy: 14,
    stroke: 'none',
    fill: colors[conf.theme].tagTextBlue,
    'pointer-events': 'none',
    'text-anchor': 'middle'
  })
  .text(indicators1[indicators1Index])

  // => float box
  let floatBox = svg.append('g')
    .attr({
      class: `floatBox`,
      opacity: 0,
      transform: `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th})`
    })

  df.drawRect(floatBox, {
    class: 'floatBoxR',
    x: 0,
    y: 0,
    width: 140,
    height: 165,
    stroke: colors[conf.theme].floatGray,
    fill: colors[conf.theme].floatBg,
    opacity: 0.5
  })
  let floatConf = ['时间:', '价格:', '均价:', '涨跌额:', '涨跌幅:', '成交量:', '成交额:']
  let floatVal = {}
  floatConf.forEach((d, i) => {
    df.drawText(floatBox, {
      // 'font-family': 'PingFangSC-Regular',
      'font-size': 14,
      dx: 8,
      dy: 17 + 23 * i,
      stroke: 'none',
      fill: colors[conf.theme].floatTextGray,
      'pointer-events': 'none',
      'text-anchor': 'start'
    }).text(d)
    floatVal[`index${i}`] = df.drawText(floatBox, {
      // 'font-family': 'PingFangSC-Medium',
      'font-size': 14,
      dx: 140 - 8,
      dy: 17 + 23 * i,
      stroke: 'none',
      fill: colors[conf.theme].floatTextGray,
      'pointer-events': 'none',
      'text-anchor': 'end'
    })
  })

  // => event container
  let eventG = svg.append('g')
    .attr('class', 'eventG')
    .attr('transform', `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th})`)
  let eventGRect = df.drawRect(eventG, {
    'class': 'eventGRect',
    'x': 0,
    'y': 0,
    'width': chartW,
    'height': chartH,
    'fill': 'none',
    'pointer-events': 'all'
  })

  /**
   * socket 推送数据更新视图
   */
  this.render = function (filterData) {
    // => update chart data
    store.data = filterData !== undefined
      ? Array.isArray(filterData)
        ? filterData.length >= store.data.length
          ? [...filterData]
          : store.data
        : store.data
      : store.data

    let gridHNums = svgArgs.height > 450 ? 20 : 8 // 水平分割多少格

    // => no data only draw grid
    if (store.data.length === 0) {
      df.drawGrid(gridG, svgArgs, gridHNums, 8, {
        width: chartW,
        height: chartH,
        top: th,
        bottom: bh,
        left: lw,
        right: rw,
        stroke: colors[conf.theme].gray
      })
      return
    }
    // => store unique date such as:2016-01-01
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
      xTime.push((new Date(`${newD} 11:31`)).getTime())
      xTime.push((new Date(`${newD} 13:01`)).getTime())
      // => more than one day time series
      if (i === time.length - 1) {
        xTime.push((new Date(`${newD} 15:00`)).getTime())
      } else {
        xTime.push((new Date(`${newD} 15:01`)).getTime())
      }
      let startVal = i * chartW / time.length
      let endVal = (i + 1) * chartW / time.length
      xWidth = [...xWidth, ...[startVal, startVal + (endVal - startVal) / 2, startVal + (endVal - startVal) / 2, endVal]]
    })
    // => price min & max
    let priceMin = df.min(store.data, 'close')
    let priceMax = df.max(store.data, 'close')
    let priceMaxDiff = Math.max(Math.abs(priceMin - store.priceMid), Math.abs(priceMax - store.priceMid))

    // => x axis
    let scaleTimeArr = time.length > 1
      ? [...time, '']
      : chartW > 450
        ? df.tradeTime
        : df.tradeTimeSimple
    let scaleWidth = []
    let unitW = chartW / (scaleTimeArr.length - 1)
    scaleTimeArr.forEach((d, i) => {
      scaleWidth.push(i * unitW)
    })

    let scaleTime = df.ordinal(scaleTimeArr, scaleWidth)

    // bottom time axis
    timeAxisG.attr('class', 'x axis')
      .attr('transform', `translate(${lw},${chartH + th})`)
      .call(df.axis(scaleTime, 'bottom'))
      .selectAll('text')
      .attr({
        fill: colors[conf.theme].axitTextGray,
        transform: `translate(0,4)`
      })

    // => draw grid
    let gridVNums = scaleTimeArr.length - 1 // 垂直分割多少格
    df.drawGrid(gridG, svgArgs, gridHNums, gridVNums, {
      width: chartW,
      height: chartH,
      top: th,
      bottom: bh,
      left: lw,
      right: rw,
      stroke: colors[conf.theme].gray
    })

    // grid height
    let unitGridH = chartH / gridHNums
    let chartH1GridNums = gridHNums / 2 // => 价格曲线垂直方向所占网格数量
    let chartH2GridNums = gridHNums / 2 - 1 // => 分时量&分时额垂直方向所占网格数量
    let chartH1 = unitGridH * chartH1GridNums
    let chartH2 = unitGridH * chartH2GridNums

    // => x & y axis scale
    let scaleX = df.linear(xTime, xWidth)
    let scaleY1 = df.linear([store.priceMid - priceMaxDiff, store.priceMid + priceMaxDiff], [chartH1, 0])
    let scaleY2
    let scaleYPercent = df.linear([-(priceMaxDiff / store.priceMid * 100), priceMaxDiff / store.priceMid * 100], [chartH1, 0])

    // y axis value
    let priceRange = []
    let pricePercentRange = []
    let scalePriceHeight = []
    let priceUnit = (2 * priceMaxDiff) / chartH1GridNums
    let pricePercentUnit = priceMaxDiff / store.priceMid / chartH1GridNums * 2
    let chartH1Unit = chartH1 / chartH1GridNums
    df.getSerialArr(chartH1GridNums)
      .forEach((d, i) => {
        priceRange = [...priceRange, store.priceMid - priceMaxDiff + i * priceUnit]
        scalePriceHeight = [...scalePriceHeight, i * chartH1Unit]
        pricePercentRange = [...pricePercentRange, (i - chartH1GridNums / 2) * pricePercentUnit * 100]
      })
    scalePriceHeight.reverse()
    // => draw y axis value
    let scalePrice = df.ordinal(priceRange, scalePriceHeight)
    priceAxisG.attr('class', 'y axis')
      .attr('transform', `translate(${lw},${th})`)
      .call(df.axis(scalePrice, 'left'))
      .selectAll('text')
      .attr('fill', (d, i) => {
        return i !== chartH1GridNums / 2
          ? (i < chartH1GridNums / 2
            ? colors[conf.theme].axisTextGreen
            : colors[conf.theme].axisTextRed)
          : colors[conf.theme].axitTextGray
      })

    let scalePricePercent = df.ordinal(pricePercentRange, scalePriceHeight)
    PercentAxisG.attr('class', 'y axis')
      .attr('transform', `translate(${lw + chartW},${th})`)
      .call(df.axis(scalePricePercent, 'right', '%'))
      .selectAll('text')
      .attr('fill', (d, i) => {
        return i !== chartH1GridNums / 2
          ? (i < chartH1GridNums / 2
            ? colors[conf.theme].axisTextGreen
            : colors[conf.theme].axisTextRed)
          : colors[conf.theme].axitTextGray
      })

    // => update breath lamp location
    latestLamp
      .attr('cx', () => {
        return scaleX(df.getMsec(store.data[store.data.length - 1].time))
      })
      .attr('cy', () => {
        return scaleY1(store.data[store.data.length - 1].close)
      })
      .attr('fill', () => {
        let lastIndex = store.data.length - 1
        if (lastIndex > 0) {
          if (store.data[lastIndex].time.indexOf('15:00:00') >= 0) {
            // 收盘后，价格收阳线的，呼吸灯为红色。价格收阴线的，呼吸灯为绿色。
            return store.data[lastIndex].close - store.priceMid >= 0
              ? `url(#${svgArgs.id}RadialGradientRed)`
              : `url(#${svgArgs.id}radialGradientGreen)`
          } else {
            // 现价高于/等于前一个点的，呼吸灯为红色。现价低于前一个点的，呼吸灯为绿色。
            return store.data[lastIndex].close - store.data[lastIndex - 1].close >= 0
              ? `url(#${svgArgs.id}RadialGradientRed)`
              : `url(#${svgArgs.id}radialGradientGreen)`
          }
        } else {
          return `url(#${svgArgs.id}RadialGradientRed)`
        }
      })
    latestLampwick
      .attr('cx', () => {
        return scaleX(df.getMsec(store.data[store.data.length - 1].time))
      })
      .attr('cy', () => {
        return scaleY1(store.data[store.data.length - 1].close)
      })
      .attr('fill', () => {
        let lastIndex = store.data.length - 1
        if (lastIndex > 0) {
          if (store.data[lastIndex].time.indexOf('15:00:00') >= 0) {
            // 收盘后，价格收阳线的，呼吸灯为红色。价格收阴线的，呼吸灯为绿色。
            return store.data[lastIndex].close - store.priceMid >= 0
              ? colors[conf.theme].lampRed
              : colors[conf.theme].lampGreen
          } else {
            return store.data[lastIndex].close - store.data[lastIndex - 1].close >= 0
              ? colors[conf.theme].lampRed
              : colors[conf.theme].lampGreen
          }
        } else {
          return colors[conf.theme].lampRed
        }
      })
    /**
     * 行情区价格、均线走势 + 成交量、成交额柱状图
     */
    let tsArea = df.area(scaleX, scaleY1, 'time', 'close', chartH1)
    let areaArgs = {
      class: 'tsArea',
      fill: 'url(#' + tsLinearGradient.attr('id')
    }
    df.drawAreaPolyline(tsChartG, areaArgs, [store.data], tsArea, svgArgs)
    // => close polyline
    let tsLine = df.line(scaleX, scaleY1, 'time', 'close')
    let polylineArgs = {
      class: 'tsLine',
      fill: 'none',
      stroke: colors[conf.theme].blue,
      'stroke-width': 1
    }
    df.drawPolyline(tsChartG, polylineArgs, [store.data], tsLine, svgArgs)

    // => average polyline
    store.maData = average(store.data)
    let tsMaLine = df.line(scaleX, scaleY1, 'time', 'value')
    let maPolylineArgs = {
      class: 'tsMaLine',
      fill: 'none',
      stroke: colors[conf.theme].orange,
      'stroke-width': 1
    }
    df.drawPolyline(tsChartG, maPolylineArgs, [store.maData], tsMaLine, svgArgs)

    // average data dictionary
    store.maDataDict = {}
    store.maData.forEach((d, i) => {
      store.maDataDict[d.time] = d
    })

    // draw tsvolume | tsbalance histogram
    function updateIndicators1 () {
      let volumeMax = indicators1[indicators1Index] === '成交量'
        ? df.max(store.data, 'volume')
        : df.max(store.data, 'balance')
      let vbRange = []
      let scaleVBHeight = []
      let vbUnit = chartH2 / chartH2GridNums
      df.getSerialArr(chartH2GridNums)
        .forEach((d, i) => {
          vbRange = i === 0 ? [...vbRange, ''] : [...vbRange, volumeMax / chartH2GridNums * i]
          scaleVBHeight = [...scaleVBHeight, i * vbUnit]
        })
      scaleVBHeight.reverse()
      let scaleVB = df.ordinal(vbRange, scaleVBHeight)
      vbAxisG.attr('class', 'y axis')
        .attr('transform', `translate(${lw},${th + chartH1 + unitGridH})`)
        .call(df.axis(scaleVB, 'left'))
        .selectAll('text')
        .attr('fill', colors[conf.theme].axitTextGray)
      scaleY2 = df.linear([0, volumeMax], [0, chartH2])
      tsChartVolumeG.attr('transform', `translate(0,${unitGridH * (chartH1GridNums + 1)})`)
      let rectArgs = {
        class: 'volumeR',
        'width': 1
      }
      let rectType = indicators1[indicators1Index] === '成交量' ? 'volume' : 'balance'

      df.drawHistogram(
        tsChartVolumeG,
        rectArgs,
        store.data,
        rectType,
        scaleX,
        scaleY2,
        chartH2,
        colors[conf.theme].fillRed,
        colors[conf.theme].fillGreen,
        svgArgs
      )
    }
    updateIndicators1()

    // => toggle volume | balance
    toggleBtnG.attr('opacity', 1)
      .attr('transform', `translate(${chartW + lw + 7.5},${chartH - chartH2 + th})`)

    toggleBtnR.on('click', function () {
      d3.event.preventDefault()

      indicators1Index += 1
      indicators1Index = indicators1Index > 1 ? 0 : indicators1Index

      toggleTagText.text(indicators1[indicators1Index])

      updateIndicators1()
    })

    // => prevent default dblclick zoom in
    svg.on('dblclick.zoom', null)

    //  => mouse event
    eventGRect
      .on('click', function () {
        d3.event.preventDefault()
        cursorFlag = !cursorFlag
        if (cursorFlag) {
          showCousor()
        } else {
          hideCorsor()
          return
        }
        let x = d3.mouse(this)[0]
        let y = d3.mouse(this)[1]
        mousemove({
          x,
          y,
          scaleX,
          chartH1,
          chartH2,
          scaleY1,
          scaleY2,
          scaleYPercent
        })
      })
      .on('mousemove', function () {
        let x = d3.mouse(this)[0]
        let y = d3.mouse(this)[1]
        mousemove({
          x,
          y,
          scaleX,
          chartH1,
          chartH2,
          scaleY1,
          scaleY2,
          scaleYPercent
        })
      })
  }
  // => init render chart
  this.render()

  // => listen window resize
  window.addEventListener('resize', () => {
    svgArgs = df.getSvgSize(param, {top: 0, right: 0, bottom: 0, left: 0})
    chartW = svgArgs.width - lw - rw
    chartH = svgArgs.height - th - bh
    svg.attr({
      width: svgArgs.width + svgArgs.margin.left + svgArgs.margin.right,
      height: svgArgs.height + svgArgs.margin.top + svgArgs.margin.bottom
    })
    d3.select('.bgR')
      .attr({
        'width': svgArgs.width,
        'height': svgArgs.height
      })
    eventGRect.attr({
      width: chartW,
      height: chartH
    })
    cursorLineX.attr({
      x1: 0,
      x2: chartW
    })
    cursorLineY.attr({
      y1: 0,
      y2: chartH
    })
    // => update chart
    this.render()
  })

  // => show cursor
  function showCousor () {
    cursorG.attr('opacity', 1)
    timeTagG.attr('opacity', 1)
    priceTagG.attr('opacity', 1)
    percentTagG.attr('opacity', 1)
    pilotLamp.attr('opacity', 0.5)
    pilotLampwick.attr('opacity', 1)
    floatBox.attr('opacity', 1)
  }
  // => hide cursor
  function hideCorsor () {
    cursorG.attr('opacity', 0)
    timeTagG.attr('opacity', 0)
    priceTagG.attr('opacity', 0)
    percentTagG.attr('opacity', 0)
    pilotLamp.attr('opacity', 0)
    pilotLampwick.attr('opacity', 0)
    floatBox.attr('opacity', 0)
  }

  // => mouse move update cursor time price
  function mousemove ({x, y, scaleX, scaleY1, scaleY2, scaleYPercent, chartH1, chartH2}) {
    if (+cursorG.attr('opacity') !== 1) {
      return
    }
    // => update cursor time
    let tagTime = df.getDate(scaleX.invert(x))
    timeTagG.attr('transform', `translate(${x + lw - 38},${th + chartH + 1})`)
    timeTagText.text(df.formatTime('%m/%d %H:%M')(tagTime))

    let timeIndex = `${df.formatTime('%Y-%m-%d %H:%M')(tagTime)}:00`
    let cursorPrice = store.dataDict[timeIndex] ? store.dataDict[timeIndex] : {}
    let cursorMaPrice = store.maDataDict[timeIndex] ? store.maDataDict[timeIndex].value : 0

    // => update cursor location
    cursorLineX.attr('y1', y)
      .attr('y2', y)
    cursorLineY
      .attr('x1', () => {
        return store.dataDict[timeIndex]
          ? scaleX(df.getMsec(store.dataDict[timeIndex].time))
          : x
      })
      .attr('x2', () => {
        return store.dataDict[timeIndex]
          ? scaleX(df.getMsec(store.dataDict[timeIndex].time))
          : x
      })

    // update pilot lamp location
    pilotLamp
      .attr('cx', () => {
        return store.dataDict[timeIndex]
          ? scaleX(df.getMsec(store.dataDict[timeIndex].time))
          : 0
      })
      .attr('cy', () => {
        return cursorPrice.close !== undefined
          ? scaleY1(cursorPrice.close)
          : -100
      })
    pilotLampwick
      .attr('cx', () => {
        return store.dataDict[timeIndex]
          ? scaleX(df.getMsec(store.dataDict[timeIndex].time))
          : 0
      })
      .attr('cy', () => {
        return cursorPrice.close !== undefined
          ? scaleY1(cursorPrice.close)
          : -100
      })

    // 水平光标线在行情区与第一指标区之间时隐藏
    let priceTagVal = 0
    let percentTagVal = 0
    if (y < chartH1) {
      cursorLineX.attr('opacity', 1)
      priceTagG.attr('opacity', 1)
      percentTagG.attr('opacity', 1)
      priceTagVal = scaleY1.invert(y)
      percentTagVal = df.formatVal(scaleYPercent.invert(y))
    } else if (y > chartH - chartH2) {
      cursorLineX.attr('opacity', 1)
      priceTagG.attr('opacity', 1)
      percentTagG.attr('opacity', 0)
      priceTagVal = scaleY2.invert(chartH - y)
      percentTagVal = 0
    } else {
      cursorLineX.attr('opacity', 0)
      priceTagG.attr('opacity', 0)
      percentTagG.attr('opacity', 0)
      priceTagVal = 0
      percentTagVal = 0
    }
    priceTagVal = df.formatVal(priceTagVal)
    priceTagG.attr('transform', `translate(${0},${y > 10 ? (y < chartH - 9 ? th + y - 10 : th + chartH - 18) : th})`)
    priceTagText.text(priceTagVal)

    percentTagG.attr('transform', `translate(${lw + chartW},${y > 10 ? th + y - 10 : th})`)
    percentTagText.text(`${percentTagVal}%`)

    // => update float box location and value
    if (cursorPrice.close) {
      floatBox.attr('opacity', 1)
      floatBox.attr('transform', () => {
        return x <= chartW / 2 ? `translate(${lw + chartW - 140},${th})` : `translate(${lw},${th})`
      })
      let cursorPriceClose = cursorPrice.close ? cursorPrice.close : 0
      let flafloatValArr = [df.formatTime('%m/%d %H:%M')(tagTime),
        cursorPrice.close,
        df.formatVal(cursorMaPrice),
        df.formatVal(cursorPriceClose !== 0 ? cursorPriceClose - store.priceMid : cursorPriceClose),
        `${cursorPriceClose !== 0 ? df.formatVal((cursorPriceClose - store.priceMid) / store.priceMid * 100) : 0}%`,
        df.formatVal(cursorPrice.volume || 0),
        df.formatVal(cursorPrice.balance || 0)
      ]
      flafloatValArr.forEach((d, i) => {
        floatVal[`index${i}`].text(d)
          .attr('fill', () => {
            if (i === 1) {
              return cursorPriceClose - store.priceMid >= 0
                ? colors[conf.theme].floatTextRed
                : colors[conf.theme].floatTextGreen
            } else if (i === 2) {
              return cursorMaPrice - store.priceMid >= 0
              ? colors[conf.theme].floatTextRed
              : colors[conf.theme].floatTextGreen
            } else if (i === 3) {
              return cursorPriceClose - store.priceMid >= 0
              ? colors[conf.theme].floatTextRed
              : colors[conf.theme].floatTextGreen
            } else if (i === 4) {
              return cursorPriceClose - store.priceMid >= 0
              ? colors[conf.theme].floatTextRed
              : colors[conf.theme].floatTextGreen
            } else {
              return colors[conf.theme].floatTextGray
            }
          })
      })
    } else {
      floatBox.attr('opacity', 0)
    }
  }
}
