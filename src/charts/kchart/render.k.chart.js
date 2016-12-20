/**
 * 分时图 by zuozhengqi 2016/12/17
 */
import d3 from 'd3'
import * as df from '../lib/index'
import { kcolors as colors } from '../lib/colors'
import icons from '../lib/icons'

/**
 * 定义全局变量
 */
// => 数据仓库
let store = {
  data: [],
  MAflag: false,
  MAVOLflag: false,
  BOLLflag: false,
  lists: [],
  Kdata: [],
  MAdata: [],
  MAVolumedata: [],
  MACDdata: [],
  RSIdata: [],
  KDJdata: [],
  WRdata: [],
  BOLLdata: []
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

  /**
   * rectWidth => k线实体默认宽度
   * rectNum => 行情区显示K线的数量
   * rectSpace => k线实体之间的距离
   */
  let rectWidth = 8
  let rectNum = Math.floor(chartW / (2 + rectWidth))
  let rectSpace = 2 + (chartW - (2 + rectWidth) * rectNum) / rectNum
  df.log('rectNum', rectNum)
  df.log('rectSpace', rectSpace)

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

  // => 定义两个指向原始数据的指针 每次绘图提取出指针指向范围内的数据
  let endIndex = store.data.length
  let startIndex = (endIndex - rectNum) >= 0 ? endIndex - rectNum : 0

  /**
   * 数据处理 将所有处理好用于绘图的数据存储于store数据仓库中
   */
  function dataFilter () {
    // K线数据
    store.Kdata = store.data.slice(startIndex, endIndex)
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
  }
}
