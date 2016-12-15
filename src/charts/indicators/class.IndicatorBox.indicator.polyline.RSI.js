/**
 * RSI配置参数
 */
let initParam = {
  name: 'RSI',
  type: 'polyline',
  caculateParam: [6, 12, 24]
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
  let dataArray = []
  rawData.forEach((d, i) => { data.push(d) })
  // console.log('%c RSI data: ', 'color: #f0f', data, caculateParam);
  caculateParam.forEach((d) => {
    dataArray.push(RSI(data, d))
  })
  return dataArray
}
function RSI (data, T) {
  let changes = []
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      changes.push(0)
    } else {
      changes.push(data[i].close - data[i - 1].close)
    }
  }

  let RSIs = []
  for (let i = 0; i < changes.length; i++) {
    let start = i - T + 1
    if (start < 0) {
      start = 0
    }
    let end = i + 1

    let totalUp = 0
    let totalDown = 0
    for (let j = start; j < end; j++) {
      if (changes[j] > 0) {
        totalUp += changes[j]
      } else {
        totalDown -= changes[j]
      }
    }

    let RSI = 50
    if (totalUp + totalDown > 0) {
      RSI = 100 * totalUp / (totalUp + totalDown)
    }
    RSIs.push(RSI)
  }

  let dataPoints = []
  for (let i = 0; i < data.length; i++) {
    let dataPoint = {}
    dataPoint.time = data[i].time
    dataPoint.value = RSIs[i]
    dataPoints.push(dataPoint)
  }
  return dataPoints
}

export default {
  initParam: initParam,
  caculate: caculate
}
