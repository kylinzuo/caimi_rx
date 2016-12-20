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
  lists: []
}
// => 设置默认最多能显示哪些指标 如果增加新的指标时需要在此添加新的指标名称
let indicatorsLists = ['VOL', 'MACD', 'RSI', 'KDJ', 'VMACD', 'WR']

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
  store.data = param.data

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
    'fill': colors[param.theme].bgColor
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
    let kChartH = store.lists.length !== 0
      ? store.lists.length > 1
        ? chartH * 2 / (store.lists.length + 2)
        : chartH * 3 / 4
      : chartH
    let unitH = store.lists.length !== 0 ? (chartH - kChartH) / store.lists.length : 0

    // 添加k线区容器
    if (!document.querySelector('.kG')) {
      let kG = df.drawBox({
        G: svgG,
        gClassName: 'kG',
        w: chartW,
        h: 25,
        color: colors[param.theme].headColor
      })
      .attr('transform', `translate(0, 0)`)

      // 添加设置按钮
      df.drawBtn({
        G: kG,
        className: 'kSettingG',
        offsetW: chartW - 25,
        offsetH: 5,
        d: icons.settings,
        color: colors[param.theme].settingBtnColor,
        scaleX: 0.15,
        scaleY: 0.15
      })
    }

    // => 添加指标区容器
    store.lists.forEach((d, i) => {
      if (!document.querySelector(`.${d}G`)) {
        let g = df.drawBox({
          G: svgG,
          gClassName: `${d}G`,
          w: chartW,
          h: 25,
          color: colors[param.theme].headColor
        })
        .attr('transform', `translate(0, ${kChartH + i * unitH})`)

        // => 添加设置按钮
        df.drawBtn({
          G: g,
          className: 'kSettingG',
          offsetW: chartW - 50,
          offsetH: 5,
          d: icons.settings,
          color: colors[param.theme].settingBtnColor,
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
          color: colors[param.theme].settingBtnColor,
          scaleX: 0.1667,
          scaleY: 0.1667
        })
      } else {
        d3.select(`.${d}G`)
          .attr('transform', `translate(0, ${kChartH + i * unitH})`)
      }
    })

    renderChart(store.data)
  }

  this.updateIndicators(param.lists)

  // => socket 推送数据时更新k线图
  this.render = function (filterData) {
    // 数据更新视图
    renderChart(filterData)
  }

  function renderChart (filterData) {
    //
  }
}
