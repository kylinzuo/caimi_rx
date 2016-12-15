/**
 * WR配置参数
 */
let initParam = {
  name: 'WR',
  type: 'polyline',
  caculateParam: [10, 6]
}

/**
 * Caculator 数据处理
 *
 */
/**
 * Caculator 数据处理
 * @param  {array} rawData
 * @param  {array} caculateParam
 */
function caculate (rawData, caculateParam) {
  if (!(rawData instanceof Array && caculateParam instanceof Array)) throw new Error('Data or caculateParam is not Array')
  let data = []
  rawData.forEach((d, i) => { data.push(d) })
  let dataArray = []
  // console.log('%c WR data: ', 'color: #f0f', data, caculateParam);
  caculateParam.forEach((d) => {
    dataArray.push(WR(data, d))
  })
  return dataArray
}

// 简单移动平均线。
function WR (data, N) {
  let WRs = []
  for (let i = 0; i < data.length; i++) {
    let start = i - N + 1
    if (start < 0) {
      start = 0
    }
    let end = i + 1

    let highest = 0
    let lowest = 999999
    for (let j = start; j < end; j++) {
      if (data[j].high > highest) {
        highest = data[j].high
      }
      if (data[j].low < lowest) {
        lowest = data[j].low
      }
    }
    let close = data[i].close

    let WR = 50
    if (highest - lowest > 0) {
      WR = 100 * (close - lowest) / (highest - lowest)
    }
    WRs.push(WR)
  }

  let dataPoints = []
  for (let i = 0; i < data.length; i++) {
    let dataPoint = {}
    dataPoint.time = data[i].time
    dataPoint.value = WRs[i]
    dataPoints.push(dataPoint)
  }
  return dataPoints
}

export default {
  initParam: initParam,
  caculate: caculate
}
