/**
 * 分时图 by zuozhengqi 2016/12/17
 */
import d3 from 'd3'
import * as df from '../lib/index'
import { kcolors as colors } from '../lib/colors'
import icons from '../lib/icons'
import MACalc from '../indicators/class.KChart.indicator.polyline.MA'
import MACDCalc from '../indicators/class.IndicatorBox.indicator.polyline.MACD'
import RSICalc from '../indicators/class.IndicatorBox.indicator.polyline.RSI'
import KDJCalc from '../indicators/class.IndicatorBox.indicator.polyline.KDJ'
import WRCalc from '../indicators/class.IndicatorBox.indicator.polyline.WR'
import BOLLCalc from '../indicators/class.KChart.indicator.polyline.BOLL'

/**
 * 定义全局变量
 */
// => 数据仓库
let store = {
  data: [], // => 绘图原始数据
  MAflag: false, // => MA 移动平局线是否显示标志
  MAVOLflag: false, // => 成交量／成交额 是否显示标志
  BOLLflag: false, // => 布林线是否显示标志
  lists: [], // => 指标显示列表
  Kdata: [], // => k线绘图数据
  MAdata: [], // => MA移动均线绘图数据
  MAVolumedata: [], // => 成交量／成交额 均线绘图数据
  MACDdata: [], // => MACD绘图数据
  RSIdata: [], // => RSI绘图数据
  KDJdata: [], // => KDJ绘图数据
  WRdata: [], // => WR绘图数据
  BOLLdata: [], // => BOLL绘图数据
  MAParam: [5, 10, 20, 30, 60], // => MA移动均线设置参数
  MAVolumeParam: [5, 10, 20],
  MABalanceParam: [5, 10, 20],
  MACDParam: [12, 26, 9],
  RSIParam: [6, 12, 24],
  KDJParam: [9, 3, 3],
  WRParam: [10, 6],
  BOLLParam: [20]

}

// => 设置默认最多能显示哪些指标 如果增加新的指标时需要在此添加新的指标名称
let indicatorsLists = ['VOL', 'MACD', 'RSI', 'KDJ', 'VMACD', 'WR']

// => k线区高度 与 各指标区高度
let kChartH
let unitH
// => 每一区域头部高度
let headH = 25

// => 存储所有需要用到的比例尺 便于交互时取用
let scale = []

// => 成交量／成交额 可切换指标
let indicators1ToggleArr = ['成交量', '成交额']
let indicators1ToggleArrType = ['volume', 'balance']
let toggleArr1index = 0

export default function (param) {
  // => 获取svg尺寸
  let svgArgs = df.getSvgSize(param, {top: 0, right: 0, bottom: 0, left: 0})

  // 图形四周宽度
  let lw = 56
  let rw = 0
  let th = 0
  let bh = 46
  let chartW = svgArgs.width - lw - rw
  let chartH = svgArgs.height - th - bh

  // => 缓存传入的绘图数据
  store.data = param.data.sort(df.compare('time'))
  store.MAParam = param.MAParam || store.MAParam
  store.MAVolumeParam = param.MAVolumeParam || store.MAVolumeParam
  store.MABalanceParam = param.MABalanceParam || store.MABalanceParam
  store.MACDParam = param.MACDParam || store.MACDParam
  store.RSIParam = param.RSIParam || store.RSIParam
  store.KDJParam = param.KDJParam || store.KDJParam
  store.WRParam = param.WRParam || store.WRParam
  store.BOLLParam = param.BOLLParam || store.BOLLParam

  /**
   * rectWidth => k线实体默认宽度
   * rectNum => 行情区显示K线的数量
   * rectSpace => k线实体之间的距离
   */
  let rectWidth = 8
  let rectNum = Math.floor(chartW / (2 + rectWidth))
  let rectSpace = 2 + (chartW - (2 + rectWidth) * rectNum) / rectNum

  // => 定义两个指向原始数据的指针 每次绘图提取出指针指向范围内的数据
  let endIndex = store.data.length
  let startIndex = (endIndex - rectNum) >= 0 ? endIndex - rectNum : 0

  // => 绘图容器中添加画布svg
  let svg = df.createSVG(svgArgs)

  // => 绘制背景矩形
  let bgG = svg.append('g')
    .attr('class', 'bgG')
  df.drawRect(bgG, {
    'class': 'bgG',
    'x': 0,
    'y': 0,
    'width': svgArgs.width,
    'height': svgArgs.height,
    'fill': colors[svgArgs.theme].bgColor
  })

  // 添加绘图容器
  let svgG = svg.append('g')
    .attr('class', 'svgG')
    .attr('transform', `translate(${svgArgs.margin.left + lw},${svgArgs.margin.top + th})`)

  // => 新增或减少指标区
  this.updateIndicators = function (lists) {
    lists = Array.isArray(lists) ? lists : store.lists
    // => 差集 找出哪些指标被去除并将其从视图中删除
    let diffVal = store.lists.filter(d => {
      return !(new Set(lists)).has(d)
    })
    diffVal.forEach(d => {
      d3.select(`.${d}G`).remove()
    })

    // 过滤出需要单独一个指标区的指标
    store.lists = lists.filter(d => {
      if (d === 'MA') {
        store.MAflag = true
      } else if (d === 'MA(VOL)') {
        store.MAVOLflag = true
      } else if (d === 'BOLL') {
        store.BOLLflag = true
      } else {
        return indicatorsLists.indexOf(d) > -1
      }
    })

    // => 计算k线区高度 与 指标容器高度
    kChartH = store.lists.length !== 0
      ? store.lists.length > 1
        ? chartH * 2 / (store.lists.length + 2)
        : chartH * 3 / 4
      : chartH
    unitH = store.lists.length !== 0 ? (chartH - kChartH) / store.lists.length : 0

    // => 添加k线区容器
    if (!document.querySelector('.KG')) {
      let KG = df.drawBox({
        G: svgG,
        gClassName: 'KG',
        w: chartW,
        h: headH,
        color: colors[svgArgs.theme].headColor
      })
      .attr('transform', `translate(0, 0)`)

      // => 添加设置按钮
      df.drawBtn({
        G: KG,
        className: 'kSettingG',
        offsetW: chartW - headH,
        offsetH: 5,
        d: icons.settings,
        color: colors[svgArgs.theme].settingBtnColor,
        scaleX: 0.15,
        scaleY: 0.15
      })

      // => 添加网格容器
      KG.append('g')
        .attr({
          class: `KgridG`,
          transform: `translate(${0},${headH})`
        })

      // => k线容器
      KG.append('g')
        .attr({
          class: `Kchart`,
          transform: `translate(${0},${headH})`
        })
    }
    // => 更新网格位置
    df.drawGrid(d3.select('.KgridG'), svgArgs, 6, 8, {
      width: chartW,
      height: kChartH - 25,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      stroke: colors[svgArgs.theme].gridGray
    })

    // => 添加指标区容器
    store.lists.forEach((d, i) => {
      if (!document.querySelector(`.${d}G`)) {
        let g = df.drawBox({
          G: svgG,
          gClassName: `${d}G`,
          w: chartW,
          h: headH,
          color: colors[svgArgs.theme].headColor
        })
        .attr('transform', `translate(0, ${kChartH + i * unitH})`)

        // => 添加设置按钮
        df.drawBtn({
          G: g,
          className: 'kSettingG',
          offsetW: chartW - 50,
          offsetH: 5,
          d: icons.settings,
          color: colors[svgArgs.theme].settingBtnColor,
          scaleX: 0.15,
          scaleY: 0.15
        })
        // => 添加关闭按钮
        df.drawBtn({
          G: g,
          className: 'kCloseG',
          offsetW: chartW - 25,
          offsetH: 5,
          d: icons.close,
          color: colors[svgArgs.theme].settingBtnColor,
          scaleX: 0.1667,
          scaleY: 0.1667
        })

        // 添加网格容器
        g.append('g')
          .attr({
            class: `${d}gridG`,
            transform: `translate(${0},${headH})`
          })
        // => 各指标容器容器
        g.append('g')
          .attr({
            class: `${d}chart`,
            transform: `translate(${0},${headH})`
          })
      } else {
        d3.select(`.${d}G`)
          .attr('transform', `translate(0, ${kChartH + i * unitH})`)
      }
      // => 更新网格位置
      df.drawGrid(d3.select(`.${d}gridG`), svgArgs, 4, 8, {
        width: chartW,
        height: unitH - 25 > 1 ? unitH - 25 : 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        stroke: colors[svgArgs.theme].gridGray
      })
    })

    dataFilter()
  }

  this.updateIndicators(param.lists)

  // => socket 推送数据时更新k线图
  this.render = function (data) {
    // => 更新绘图数据
    store.data = Array.isArray(data) ? data : store.data
    dataFilter()
  }

  /**
   * 数据处理 将所有处理好用于绘图的数据存储于store数据仓库中
   */
  function dataFilter () {
    // => K线数据
    store.Kdata = store.data.slice(startIndex, endIndex)
    // => MA移动均线数据
    let max = Math.max(...store.MAParam)
    // => 数组长度不足以往前推maxMA个数据时从数组开始处获取数据
    let startIndexb = (startIndex - max) >= 0 ? startIndex - max : 0
    // => MA计算要多取max个数据
    let MAdataInit = store.data.slice(startIndexb, endIndex)
    // => MA均线数据
    let MAdataCalc = MACalc.caculate(MAdataInit, store.MAParam, 'close')
    // 清空上一次绘图数据
    store.MAdata.splice(0, store.MAdata.length)
    // => 截取绘图所需要的数据
    MAdataCalc.forEach((d) => {
      // => 数据长度小于能显示的K线条数时 截取整个数组
      let startIndexc = (d.length - rectNum) >= 0 ? d.length - rectNum : 0
      d = d.slice(startIndexc, d.length)
      store.MAdata.push(d)
    })

    // => 计算其他指标
    store.lists.forEach((d, i) => {
      df.log('d', d)
      switch (d) {
        case 'VOL': CaclVol(); break
        case 'MACD': CaclMACD(); break
        case 'RSI': CaclRSI(); break
        case 'KDJ': CaclKDJ(); break
        case 'WR': CaclWR(); break
        case 'BOLL': CaclBOLL(); break
      }
    })

    // => 计算成交量／成交额 移动均线
    function CaclVol () {
      let max = indicators1ToggleArr[toggleArr1index] === '成交量'
        ? Math.max(...store.MAVolumeParam)
        : Math.max(...store.MABalanceParam)
      // => 数组长度不足以往前推maxMA个数据时从数组开始处获取数据
      let startIndexb = (startIndex - max) >= 0 ? startIndex - max : 0
      // => MA计算要多取max个数据
      let dataInit = store.data.slice(startIndexb, endIndex)
      // => 确定是成交量还是成交额计算参数
      let MATVParam = indicators1ToggleArr[toggleArr1index] === '成交量'
        ? store.MAVolumeParam
        : store.MABalanceParam
      // => 成交量／成交额均线数据
      let MAVolumedataCalc = MACalc.caculate(dataInit, MATVParam, indicators1ToggleArrType[toggleArr1index])
      store.MAVolumedata.splice(0, store.MAVolumedata.length)
      MAVolumedataCalc.forEach((d) => {
        // => 数据长度小于能显示的K线条数时 截取整个数组
        let startIndexc = (d.length - rectNum) >= 0 ? d.length - rectNum : 0
        d = d.slice(startIndexc, d.length)
        store.MAVolumedata.push(d)
      })
      df.log('store.MAVolumedata', store.MAVolumedata)
    }

    // 计算MACD
    function CaclMACD () {
      let calcResult = MACDCalc.caculate(store.data, store.MACDParam)
      // 清楚上次计算结果
      store.MACDdata.splice(0, store.MACDdata.length)

      calcResult.forEach((d) => {
        d = d.slice(startIndex, endIndex)
        store.MACDdata.push(d)
      })
    }
    // 计算RSI
    function CaclRSI () {
      let calcResult = RSICalc.caculate(store.data, store.RSIParam)
      // 清楚上次计算结果
      store.RSIdata.splice(0, store.RSIdata.length)
      calcResult.forEach((d) => {
        d = d.slice(startIndex, endIndex)
        store.RSIdata.push(d)
      })
    }
    // 计算KDJ
    function CaclKDJ () {
      let calcResult = KDJCalc.caculate(store.data, store.KDJParam)
      // 清楚上次计算结果
      store.KDJdata.splice(0, store.KDJdata.length)
      calcResult.forEach((d) => {
        d = d.slice(startIndex, endIndex)
        store.KDJdata.push(d)
      })
    }
    // 计算WR
    function CaclWR () {
      let calcResult = WRCalc.caculate(store.data, store.WRParam)
      // 清楚上次计算结果
      store.WRdata.splice(0, store.WRdata.length)
      calcResult.forEach((d) => {
        d = d.slice(startIndex, endIndex)
        store.WRdata.push(d)
      })
    }
    // 计算BOLL
    function CaclBOLL () {
      let calcResult = BOLLCalc.caculate(store.data, store.BOLLParam)
      // 清楚上次计算结果
      store.BOLLdata.splice(0, store.BOLLdata.length)
      calcResult.forEach((d) => {
        d = d.slice(startIndex, endIndex)
        store.BOLLdata.push(d)
      })
    }

    // => 绘制图形
    renderChart()
  }

  /**
   * 绘制图形
   */
  function renderChart () {
    // => k线比例尺
    let minPrice = d3.min(store.Kdata, (d) => { return d.low })
    let maxPrice = d3.max(store.Kdata, (d) => { return d.high })
    scale.priceScale = df.linear([minPrice, maxPrice], [kChartH - headH - 11, 11])
    let line = df.kLine({
      rectWidth: rectWidth,
      rectSpace: rectSpace,
      scaleY: scale.priceScale
    })
    // => 绘制k线上下引线
    df.drawkLeads({
      G: d3.select('.Kchart'),
      data: store.Kdata,
      className: 'kLine',
      rectWidth: rectWidth,
      rectSpace: rectSpace,
      scaleY: scale.priceScale,
      red: colors[svgArgs.theme].kRed,
      green: colors[svgArgs.theme].kGreen
    })
    // => 绘制k线实体
    df.drawkRect({
      G: d3.select('.Kchart'),
      data: store.Kdata,
      className: 'kRect',
      rectWidth: rectWidth,
      rectSpace: rectSpace,
      scaleY: scale.priceScale,
      red: colors[svgArgs.theme].kRed,
      green: colors[svgArgs.theme].kGreen
    })
    // => 绘制ma移动均线
    df.drawPolyline(
      d3.select('.Kchart'),
      {
        class: 'MApath',
        fill: 'none',
        'stroke-width': 1,
        'stroke': (d, i) => {
          return colors[svgArgs.theme].curveColor[i]
        }
      },
      store.MAdata,
      line
    )
    // => 按指标渲染图形
    store.lists.forEach((d, i) => {
      df.log('d', d)
      switch (d) {
        case 'VOL': CaclVol(d3.select(`.${d}chart`)); break
        case 'MACD': CaclMACD(d3.select(`.${d}chart`)); break
        case 'RSI': CaclRSI(d3.select(`.${d}chart`)); break
        case 'KDJ': CaclKDJ(d3.select(`.${d}chart`)); break
        case 'WR': CaclWR(d3.select(`.${d}chart`)); break
        case 'BOLL': CaclBOLL(d3.select(`.${d}chart`)); break
      }
    })
    // => 绘制成交量／成交额
    function CaclVol (G) {
      df.log('G', G)
      let max = d3.max(store.Kdata, (d) => { return d[indicators1ToggleArrType[toggleArr1index]] })
      df.log('max==', max)
      let maxH = unitH - 25 - 5
      scale.volumeScale = df.linear([0, max], [0, maxH])
      df.drawRectChart({
        G: G,
        data: store.Kdata,
        className: 'volumeR',
        x: (d, i) => {
          return rectSpace + i * (rectWidth + rectSpace)
        },
        y: (d, i) => {
          return maxH - scale.volumeScale(d[indicators1ToggleArrType[toggleArr1index]])
        },
        width: rectWidth,
        height: (d, i) => {
          return scale.volumeScale(d[indicators1ToggleArrType[toggleArr1index]])
        },
        fill: (d, i) => {
          if (d.close > d.open) {
            return colors[svgArgs.theme].kRed
          } else if (d.close < d.open) {
            return colors[svgArgs.theme].kGreen
          } else {
            if (i !== 0) {
              if (store.Kdata[i - 1].close <= d.close) {
                return colors[svgArgs.theme].kRed
              } else {
                return colors[svgArgs.theme].kGreen
              }
            } else {
              return colors[svgArgs.theme].kRed
            }
          }
        }
      })
    }
    // => 绘制MACD
    function CaclMACD (G) {

    }
    // => 绘制RSI
    function CaclRSI (G) {

    }
    // => 绘制KDJ
    function CaclKDJ (G) {

    }
    // => 绘制WR
    function CaclWR (G) {

    }
    // => 绘制BOLL
    function CaclBOLL (G) {

    }
  }
}
