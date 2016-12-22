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
  sourceLists: [], // => 原始指标显示列表
  lists: [], // => 指标显示列表
  Kdata: [], // => k线绘图数据
  MAdata: [], // => MA移动均线绘图数据
  MAVolumedata: [], // => 成交量／成交额 均线绘图数据
  MACDdata: [], // => MACD绘图数据
  VMACDdata: [], // => VMACD绘图数据
  RSIdata: [], // => RSI绘图数据
  KDJdata: [], // => KDJ绘图数据
  WRdata: [], // => WR绘图数据
  BOLLdata: [], // => BOLL绘图数据
  MAParam: [5, 10, 20, 30, 60], // => MA移动均线设置参数
  MAVolumeParam: [5, 10, 20],
  MABalanceParam: [5, 10, 20],
  MACDParam: [12, 26, 9],
  VMACDParam: [12, 26, 9],
  RSIParam: [6, 12, 24],
  KDJParam: [9, 3, 3],
  WRParam: [10, 6],
  BOLLParam: [20]

}

// => 设置默认最多能显示哪些指标 如果增加新的指标时需要在此添加新的指标名称
let indicatorsLists = ['VOL', 'MACD', 'RSI', 'KDJ', 'VMACD', 'WR']

// => k线区高度&各指标区高度
let kChartH
let unitH
// => 每一区域头部高度
let headH = 25
// => 水平网格数量&竖直网格数量
let khGridNums = 6 // => K线区
let ihGridNums = 4 // => 指标区
let vGridNums = 8

// => 存储所有需要用到的比例尺 便于交互时取用
let scale = {}

// => 成交量／成交额 可切换指标
let indicators1ToggleArr = ['成交量', '成交额']
let indicators1ToggleArrType = ['volume', 'balance']
let toggleArr1index = 0

export default function (param, cb) {
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
  store.VMACDParam = param.VMACDParam || store.VMACDParam
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
    store.sourceLists = Array.isArray(lists)
      ? Object.assign([], lists)
      : store.sourceLists
    // => 差集 找出哪些指标被去除并将其从视图中删除
    store.lists.forEach((d) => {
      if (!(new Set(store.sourceLists)).has(d)) {
        d3.select(`.${d}G`).remove()
      }
    })

    store.MAflag = false
    store.MAVOLflag = false
    store.BOLLflag = false
    // 过滤出需要单独一个指标区的指标
    store.lists = store.sourceLists.filter(d => {
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

    // => 计算k线区水平网格数量
    khGridNums = Math.max(Math.floor((kChartH - headH) / 30), 3)
    ihGridNums = (unitH - headH) > 30 * 3
      ? (unitH - headH) > 30 * 5
        ? 6
        : 4
      : 2
    vGridNums = Math.max(Math.floor(chartW / 100), 2)
    // => 添加k线区容器
    if (!document.querySelector('.KHeadG')) {
      let KG = svgG.append('g')
        .attr('class', 'KG')
        .attr('transform', `translate(0, 0)`)

      // => 底部时间轴&滑动条容器
      let floorG = svgG.append('g')
        .attr('class', 'floorG')
        .attr('transform', `translate(0, ${chartH})`)
      df.drawRect(floorG, {
        x: 0,
        y: 0,
        width: chartW,
        height: 46,
        fill: colors[svgArgs.theme].bgColor
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
      // => BOLL容器
      KG.append('g')
        .attr({
          class: `BOLLchart`,
          transform: `translate(${0},${headH})`
        })

      // => k线区头部
      let KHeadG = df.drawBox({
        G: KG,
        gClassName: 'KHeadG',
        w: chartW,
        h: headH,
        color: colors[svgArgs.theme].headColor
      })
      // => 添加设置按钮
      df.drawBtn({
        G: KHeadG,
        className: 'kSettingG',
        offsetW: chartW - headH,
        offsetH: 5,
        d: icons.settings,
        color: colors[svgArgs.theme].settingBtnColor,
        scaleX: 0.15,
        scaleY: 0.15
      })
    }
    // => 判断k线部分设置按钮是否需要显示
    d3.select('.kSettingG')
      .attr('opacity', () => {
        return store.MAflag || store.BOLLflag ? 1 : 0
      })
    // => 添加按钮事件接收器 设置按钮与关闭按钮
    df.drawRect(d3.select('.kSettingG'), {
      class: 'btnEventR',
      x: 0,
      y: 0,
      width: 15,
      height: 15,
      fill: '#fff',
      opacity: 0
    })
    .attr('cursor', 'pointer')
    .on('mouseover', () => {
      if (!(store.MAflag || store.BOLLflag)) {
        return
      }
      // => 鼠标放在设置按钮上时 放大按钮
      d3.select(`.kSettingG`)
        .attr({
          opacity: 0.5,
          transform: `translate(${chartW - headH}, ${3.5})`
        })
        .select('path')
        .attr({
          fill: 'red',
          transform: `scale(${0.18}, ${0.18})`
        })
    })
    .on('mouseout', () => {
      if (!(store.MAflag || store.BOLLflag)) {
        return
      }
      // => 鼠标离开设置按钮上时 恢复按钮
      d3.select(`.kSettingG`)
        .attr({
          opacity: 1,
          transform: `translate(${chartW - headH}, ${5})`
        })
        .select('path')
        .attr({
          fill: colors[svgArgs.theme].settingBtnColor,
          transform: `scale(${0.15}, ${0.15})`
        })
    })
    .on('click', () => {
      if (!(store.MAflag || store.BOLLflag)) {
        return
      }
      // => 回调函数 通知弹出设置模态框
      cb({
        type: 'setting',
        data: store.MAflag ? 'MA' : 'BOLL'
      })
    })

    // => 更新网格位置
    df.drawGrid(d3.select('.KgridG'), svgArgs, khGridNums, vGridNums, {
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
      if (!document.querySelector(`.${d}HeadG`)) {
        let g = svgG.append('g')
          .attr('class', `${d}G`)
          .attr('transform', `translate(0, ${kChartH + i * unitH})`)

        // => 添加背景
        df.drawRect(g, {
          class: `${d}BG`,
          x: 0,
          y: headH,
          width: chartW,
          height: unitH - headH,
          fill: colors[svgArgs.theme].bgColor
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
        // 添加头部
        let hg = df.drawBox({
          G: g,
          gClassName: `${d}HeadG`,
          w: chartW,
          h: headH,
          color: colors[svgArgs.theme].headColor
        })
        // => 添加指标区标题
        df.drawText(hg, {
          'font-family': 'PingFangSC-Medium',
          'font-size': 12,
          stroke: 'none',
          fill: colors[svgArgs.theme].indexTextColor,
          x: 4,
          y: 16.5
        })
        .text(d === 'VOL' ? indicators1ToggleArr[toggleArr1index] : d)
        // => 添加设置按钮
        df.drawBtn({
          G: hg,
          className: `${d}SettingG`,
          offsetW: chartW - 50,
          offsetH: 5,
          d: icons.settings,
          color: colors[svgArgs.theme].settingBtnColor,
          scaleX: 0.15,
          scaleY: 0.15
        })
        // => 添加关闭按钮
        df.drawBtn({
          G: hg,
          className: `${d}CloseG`,
          offsetW: chartW - 25,
          offsetH: 5,
          d: icons.close,
          color: colors[svgArgs.theme].settingBtnColor,
          scaleX: 0.1667,
          scaleY: 0.1667
        })
        // => 添加按钮事件接收器 设置按钮与关闭按钮
        df.drawRect(hg, {
          class: 'btnEventR',
          x: chartW - 50,
          y: 5,
          width: 15,
          height: 15,
          fill: '#fff',
          opacity: 0
        })
        .attr('cursor', 'pointer')
        .on('mouseover', () => {
          // => 鼠标放在设置按钮上时 放大按钮
          d3.select(`.${d}SettingG`)
            .attr({
              opacity: 0.5,
              transform: `translate(${chartW - 50}, ${3.5})`
            })
            .select('path')
            .attr({
              fill: 'red',
              transform: `scale(${0.18}, ${0.18})`
            })
        })
        .on('mouseout', () => {
          // => 鼠标离开设置按钮上时 恢复按钮
          d3.select(`.${d}SettingG`)
            .attr({
              opacity: 1,
              transform: `translate(${chartW - 50}, ${5})`
            })
            .select('path')
            .attr({
              fill: colors[svgArgs.theme].settingBtnColor,
              transform: `scale(${0.15}, ${0.15})`
            })
        })
        .on('click', () => {
          // => 回调函数 通知弹出设置模态框
          cb({
            type: 'setting',
            data: d
          })
        })
        // => 关闭指示框按钮
        df.drawRect(hg, {
          class: 'btnEventR',
          x: chartW - 25,
          y: 5,
          width: 15,
          height: 15,
          fill: 'fff',
          opacity: 0
        })
        .attr('cursor', 'pointer')
        .on('mouseover', () => {
          // => 鼠标放在关闭按钮上时 放大按钮
          d3.select(`.${d}CloseG`)
            .attr({
              opacity: 0.5,
              transform: `translate(${chartW - 25}, ${3.5})`
            })
            .select('path')
            .attr({
              fill: 'red',
              transform: `scale(${0.2}, ${0.2})`
            })
        })
        .on('mouseout', () => {
          // => 鼠标离开关闭按钮上时 恢复按钮
          d3.select(`.${d}CloseG`)
            .attr({
              opacity: 1,
              transform: `translate(${chartW - 25}, ${5})`
            })
            .select('path')
            .attr({
              fill: colors[svgArgs.theme].settingBtnColor,
              transform: `scale(${0.1667}, ${0.1667})`
            })
        })
        .on('click', () => {
          // => 回调函数 通知删除指标框
          cb({
            type: 'close',
            data: d
          })
          // => 关闭指标框
          let index = store.sourceLists.indexOf(d)
          store.sourceLists.splice(index, 1)
          this.updateIndicators(store.sourceLists)
        })
      } else {
        d3.select(`.${d}G`)
          .attr('transform', `translate(0, ${kChartH + i * unitH})`)

        // 更新背景矩形位置
        d3.select(`.${d}BG`)
          .attr({
            x: 0,
            y: headH,
            width: chartW,
            height: unitH - headH,
            fill: colors[svgArgs.theme].bgColor
          })
      }
      // => 更新网格位置
      df.drawGrid(d3.select(`.${d}gridG`), svgArgs, ihGridNums, vGridNums, {
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
    endIndex = store.data.length - 2 === endIndex
      ? store.data.length - 1
      : endIndex
    startIndex = (endIndex - rectNum) >= 0 ? endIndex - rectNum : 0
    dataFilter()
  }

  /**
   * 数据处理 将所有处理好用于绘图的数据存储于store数据仓库中
   */
  function dataFilter () {
    // => K线数据
    store.Kdata = store.data.slice(startIndex, endIndex)

    // =>
    if (store.MAflag) {
      d3.selectAll('.MApath').attr('opacity', 1)
      CaclMA()
    } else {
      d3.selectAll('.MApath').attr('opacity', 0)
    }

    // =>  计算BOLL
    if (store.BOLLflag) {
      d3.select('.BOLLchart').attr('opacity', 1)
      CaclBOLL()
    } else {
      d3.select('.BOLLchart').attr('opacity', 0)
    }

    // => 计算其他指标
    store.lists.forEach((d, i) => {
      switch (d) {
        case 'VOL': CaclVol(); break
        case 'MACD': CaclMACD(); break
        case 'VMACD': CaclVMACD(); break
        case 'RSI': CaclRSI(); break
        case 'KDJ': CaclKDJ(); break
        case 'WR': CaclWR(); break
      }
    })

    // => 计算k线 移动均线
    function CaclMA () {
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
    }

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
    }

    // 计算MACD
    function CaclMACD () {
      let calcResult = MACDCalc.caculate(store.data, store.MACDParam, 'close')
      // 清楚上次计算结果
      store.MACDdata.splice(0, store.MACDdata.length)

      calcResult.forEach((d) => {
        d = d.slice(startIndex, endIndex)
        store.MACDdata.push(d)
      })
    }
    // 计算VMACD
    function CaclVMACD () {
      let calcResult = MACDCalc.caculate(store.data, store.VMACDParam, 'volume')
      // 清楚上次计算结果
      store.VMACDdata.splice(0, store.VMACDdata.length)

      calcResult.forEach((d) => {
        d = d.slice(startIndex, endIndex)
        store.VMACDdata.push(d)
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
    // => 绘制BOLL图形
    if (store.BOLLflag) {
      renderBOLL(d3.select(`.BOLLchart`))
    }
    // => 按指标渲染图形
    store.lists.forEach((d, i) => {
      switch (d) {
        case 'VOL': renderVol(d3.select(`.${d}chart`)); break
        case 'MACD': renderMACD(d3.select(`.${d}chart`)); break
        case 'VMACD': renderVMACD(d3.select(`.${d}chart`)); break
        case 'RSI': renderRSI(d3.select(`.${d}chart`)); break
        case 'KDJ': renderKDJ(d3.select(`.${d}chart`)); break
        case 'WR': renderWR(d3.select(`.${d}chart`)); break
      }
    })
    // => 绘制成交量／成交额
    function renderVol (G) {
      let max = d3.max(store.Kdata, (d) => { return d[indicators1ToggleArrType[toggleArr1index]] })

      let maxH = unitH - 25
      scale.volumeScale = df.linear([0, max], [0, maxH - 5])
      // => 绘制成交量成交额柱状图
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
      // => 曲线生产器
      let line = df.kLine({
        rectWidth: rectWidth,
        rectSpace: rectSpace,
        scaleY: scale.volumeScale
      })
      // => 绘制成交量／成交额 移动均线
      df.drawPolyline(
        G,
        {
          class: 'VolumeMApath',
          fill: 'none',
          'stroke-width': 1,
          'stroke': (d, i) => {
            return colors[svgArgs.theme].curveColor[i]
          }
        },
        store.MAVolumedata,
        line
      )
    }
    // => 绘制MACD
    function renderMACD (G) {
      _MACD(G, 'MACD', store.MACDdata)
    }
    // => 绘制VMACD
    function renderVMACD (G) {
      _MACD(G, 'VMACD', store.VMACDdata)
    }
    function _MACD (G, type, data) {
      let minMACDY0 = d3.min(data[0], (d) => { return d.value })
      let maxMACDY0 = d3.max(data[0], (d) => { return d.value })
      let minMACDY1 = d3.min(data[1], (d) => { return d.value })
      let maxMACDY1 = d3.max(data[1], (d) => { return d.value })
      let minMACDY2 = d3.min(data[2], (d) => { return d.value })
      let maxMACDY2 = d3.max(data[2], (d) => { return d.value })
      let max = Math.max(
        Math.abs(minMACDY0),
        Math.abs(maxMACDY0),
        Math.abs(minMACDY1),
        Math.abs(maxMACDY1),
        Math.abs(minMACDY2),
        Math.abs(maxMACDY2)
      ).toFixed(2)
      // => macd比例尺
      let maxH = unitH - 25
      scale[`${type}scale`] = df.linear([-max, max], [5, maxH - 5])
      let lineScale = df.linear([-max, max], [maxH - 5, 5])
      // => 曲线生成器
      let line = df.kLine({
        rectWidth: rectWidth,
        rectSpace: rectSpace,
        scaleY: lineScale
      })
      // => MACD柱状图
      df.drawRectChart({
        G: G,
        data: data[0],
        className: 'volumeR',
        x: (d, i) => {
          return rectSpace + i * (rectWidth + rectSpace)
        },
        y: (d, i) => {
          if (d.value >= 0) {
            return maxH - scale[`${type}scale`](d.value)
          } else {
            return maxH - scale[`${type}scale`](0)
          }
        },
        width: rectWidth,
        height: (d, i) => {
          if (d.value >= 0) {
            return scale[`${type}scale`](d.value) - scale[`${type}scale`](0)
          } else {
            return scale[`${type}scale`](0) - scale[`${type}scale`](d.value)
          }
        },
        fill: (d, i) => {
          if (d.value >= 0) {
            return colors[svgArgs.theme].kRed
          } else {
            return colors[svgArgs.theme].kGreen
          }
        }
      })
      // => 绘制MACD DIF, DEA曲线
      df.drawPolyline(
        G,
        {
          class: `${type}path`,
          fill: 'none',
          'stroke-width': 1,
          'stroke': (d, i) => {
            return colors[svgArgs.theme].curveColor[i]
          }
        },
        data.slice(1),
        line
      )
    }
    // => 绘制RSI
    function renderRSI (G) {
      renderCurve(G, store.RSIdata, `RSIpath`, `RSIscale`)
    }
    // => 绘制KDJ
    function renderKDJ (G) {
      renderCurve(G, store.KDJdata, `KDJpath`, `KDJscale`)
    }
    // => 绘制WR
    function renderWR (G) {
      renderCurve(G, store.WRdata, `WRpath`, `WRscale`)
    }
    // => 绘制BOLL
    function renderBOLL (G) {
      renderCurve(G, store.BOLLdata, `BOLLpath`, `BOLLscale`)
    }
    // => RSI/KDJ/WR
    function renderCurve (G, data, className, scaleProp) {
      if (scaleProp === 'BOLLscale') {
        scale[scaleProp] = scale.priceScale
      } else {
        let min = d3.min(data[0], (d) => { return d.value })
        let max = d3.max(data[0], (d) => { return d.value })
        data.forEach((d, i) => {
          let minY = d3.min(d, (d) => { return d.value })
          let maxY = d3.max(d, (d) => { return d.value })
          min = minY < min ? minY : min
          max = maxY > max ? maxY : max
        })
        // => 比例尺
        let maxH = unitH - 25
        scale[scaleProp] = df.linear([min, max], [maxH - 5, 5])
      }
      // => 曲线生成器
      let line = df.kLine({
        rectWidth: rectWidth,
        rectSpace: rectSpace,
        scaleY: scale[scaleProp]
      })
      // => 绘制MACD DIF, DEA曲线
      df.drawPolyline(
        G,
        {
          class: className,
          fill: 'none',
          'stroke-width': 1,
          'stroke': (d, i) => {
            return colors[svgArgs.theme].curveColor[i]
          }
        },
        data,
        line
      )
    }
  }
}
