/**
 * BOLL配置参数
 */
let initParam = {
  name: 'BOLL',
  type: 'polyline',
  caculateParam: [20]
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
 */
function caculate (rawData, caculateParam) {
  if (!(rawData instanceof Array && caculateParam instanceof Array)) throw new Error('Data or caculateParam is not number')

  // console.log('%c BOLL data: ', 'color: #f0f', rawData, caculateParam);
  return _caculator(rawData, caculateParam[0], 2)
}
function _caculator (data, T, D) {
  let values = []
  for (let i = 0; i < data.length; i++) {
    values.push(data[i].close)
  }

  let middles = _average(values, T)
  let ups = []
  let downs = []
  for (let i = 0; i < data.length; i++) {
    let middle = middles[i]
    let start = i - T + 1
    if (start < 0) {
      start = 0
    }
    let end = i + 1

    let dev = _deviation(values.slice(start, end))
    ups.push(middle + D * dev)
    downs.push(middle - D * dev)
  }
//   ups.reverse()
//   middles.reverse()
//   downs.reverse()
  let upsFormate = []
  let middlesFormate = []
  let downsFormate = []
  for (let i = 0; i < data.length; i++) {
    upsFormate.push({time: data[i].time, value: ups[i]})
    middlesFormate.push({time: data[i].time, value: middles[i]})
    downsFormate.push({time: data[i].time, value: downs[i]})
  }
  return [upsFormate, middlesFormate, downsFormate]
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
// 计算数组的标准差
function _deviation (array) {
  let sum = 0
  for (let i = 0; i < array.length; i++) {
    sum += array[i]
  }
  let avg = sum / array.length

  let devSum = 0
  for (let i = 0; i < array.length; i++) {
    devSum += (array[i] - avg) * (array[i] - avg)
  }
  devSum = devSum / array.length
  devSum = Math.sqrt(devSum)

  return devSum
}

export default {
  initParam: initParam,
  caculate: caculate
}
