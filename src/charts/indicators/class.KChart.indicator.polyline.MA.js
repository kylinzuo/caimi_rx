/**
 * MA配置参数
 */
let initParam = {
  name: 'MA',
  type: 'polyline',
  caculateParam: [5, 10, 20, 30, 60],  // K线MA默认显示5，10，20，60天简单平均
  caculateVolumeParam: [5, 10, 20]     // K线MA默认显示5，10，20，60天简单平均
}

/**
 * Caculator 数据处理
 *
 */
/**
 * Caculator 数据处理
 * @param  {array} rawData
 * @param  {array} caculateParam
 * @param  {string} prop //指定计算哪个字段   close volume balance
 * @return {array} 二维数组
 */
function caculate (rawData, caculateParam, prop = 'close') {
  if (!(rawData instanceof Array && caculateParam instanceof Array)) throw new Error('Data or caculateParam is not Array')
  let mathData = []
  // console.log('%c MA data: ', 'color: #f0f', rawData, 'close', caculateParam);
  caculateParam.forEach((days, i) => {
    mathData[i] = _caculator(rawData, prop, days)
  })
  return mathData
}

function _caculator (rawData, type, K) {
  let values = []
  for (let i = 0; i < rawData.length; i++) {
    values.push(rawData[i][type])
  }
  let averages = _average(values, K)
  let dataPoints = []
  for (let i = 0; i < averages.length; i++) {
    let dataPoint = {}
    dataPoint.time = rawData[i].time
    dataPoint.value = averages[i]
    dataPoints.push(dataPoint)
  }
  return dataPoints
}
function _average (values, K) {
  let averages = []
  for (let i = 0; i < values.length; i++) {
    let sum = 0
    let start = i - K + 1
    if (start < 0) {
      start = 0
    }
    for (let j = start; j <= i; j++) {
      sum += values[j]
    }
    let avg = sum / (i - start + 1)
    avg = Math.round(avg * 10000) / 10000
    averages.push(avg)
  }
  return averages
}

export default {
  initParam: initParam,
  caculate: caculate
}
