/**
 * KDJ配置参数
 */
let initParam = {
  name: 'KDJ',
  type: 'polyline',
  caculateParam: [9, 3, 3]
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
  if (!(rawData instanceof Array && caculateParam instanceof Array)) throw new Error('Data or caculateParam is not Array')
  let data = []
  rawData.forEach((d, i) => { return data.push(d) })
  // console.log('%c KDJ data: ', 'color: #f0f', data, caculateParam);
  let dataArray = KDJ(data, ...caculateParam)
  return dataArray
}
function KDJ (data, T, N_1, N_2) {
  let RSVs = []
  for (let i = 0; i < data.length; i++) {
    let start = i - T + 1
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

    let RSV = 50
    if (highest - lowest > 0) {
      RSV = 100 * (close - lowest) / (highest - lowest)
    }
    RSVs.push(RSV)
  }

  let Ks = []
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      Ks.push(50)
    } else {
      Ks.push(Ks[i - 1] * (N_1 - 1) / (N_1) + RSVs[i] * 1 / (N_1))
    }
  }

  let Ds = []
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      Ds.push(50)
    } else {
      Ds.push(Ds[i - 1] * (N_2 - 1) / (N_2) + Ks[i] * 1 / (N_2))
    }
  }

  let Js = []
  for (let i = 0; i < data.length; i++) {
    Js.push(3 * Ks[i] - 2 * Ds[i])
  }

  let K = []
  let D = []
  let J = []
  for (let i = 0; i < data.length; i++) {
    K.push({time: data[i].time, value: Ks[i]})
    D.push({time: data[i].time, value: Ds[i]})
    J.push({time: data[i].time, value: Js[i]})
  }
  return [K, D, J]
}

export default {
  initParam: initParam,
  caculate: caculate
}
