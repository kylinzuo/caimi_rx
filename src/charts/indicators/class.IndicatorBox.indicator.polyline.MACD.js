/**
 * MACD配置参数
 */
let initParam = {
  name: 'MACD',
  type: 'polyline',
  caculateParam: [12, 26, 9]  // K线MA默认显示5，10，20，60天简单平均
}

/**
 * Caculator 数据处理
 *
 */
/**
 * Caculator 数据处理
 * @param  {array} rawData
 * @param  {array} caculateParam
 * @return {array} 二维数组
 * type 'close' => MACD ／ 'volume' => VMACD
 */

function caculate (rawData, caculateParam, type) {
  if (!(rawData instanceof Array && caculateParam instanceof Array)) throw new Error('Data or caculateParam is not Array')
  let mathData = []
  rawData.forEach((d, i) => {
    mathData.push(d)
  })
  return MACD(mathData, type, caculateParam[0], caculateParam[1], caculateParam[2])
}
// type = close: MACD; type = volume: VMACD;
function MACD (data, type, tShort, tLong, N) {
  let values = []
  for (let i = 0; i < data.length; i++) {
    values.push(data[i][type])
  }
  let avgShorts = eAverage(values, tShort)
  let avgLongs = eAverage(values, tLong)
  let DIFs = diff(avgShorts, avgLongs)
  let DEAs = average(DIFs, N)

  let MACD = []
  let DIF = []
  let DEA = []
  for (let i = 0; i < data.length; i++) {
    MACD.push({time: data[i].time, value: 2 * (DIFs[i] - DEAs[i])})
    DIF.push({time: data[i].time, value: DIFs[i]})
    DEA.push({time: data[i].time, value: DEAs[i]})
  }
  return [MACD, DIF, DEA]
}
// 计算两个数组每个点的差值。
function diff (array1, array2) {
  let diffs = []
  for (let i = 0; i < array1.length; i++) {
    diffs.push(array1[i] - array2[i])
  }
  return diffs
}
// 计算一个数组的指数平均
function eAverage (values, T) {
  let averages = []
  for (let i = 0; i < values.length; i++) {
    let avg = values[i]
    if (i > 0) {
      avg = (2 * values[i] + (T - 1) * averages[i - 1]) / (T + 1)
    }
    averages.push(avg)
  }

  return averages
}
// 计算一个数组的简单平均
function average (values, K) {
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
