import {
  stocksearch,
  summary,
  kchart,
  timeseries,
  stockquotation,
  news,
  reports,
  announcements,
  f10,
  symbol2blocks,
  block2symbols,
  tickseries
} from './url-types'

const fetch = window.fetch

/**
 * [股票搜索接口]
 * @param  {[String]} key [关键字]
 * @param  {Function} cb  [回调函数]
 */
export const searchStock = (key, cb) => {
  fetch(`${stocksearch}?key=${key}`, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [获取单只股票的 summary 数据]
 * @param  {[String]}   symbol [股票代码]
 * @param  {Function}   cb     [回调函数]
 */
export const getStockSummary = (symbol, cb) => {
  fetch(`${summary}/${symbol}`, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [获取K线数据]
 * @param  {[String]}     symbol       [股票代码]
 * @param  {[String]}     period       [K线周期]
 * @param  {[Number]}     lastNPoints  [按时间从后往前返回的点的数量，0表示返回所有点的数据]
 * @param  {Function}     cb           [回调函数]
 */
export const getKchartService = ({symbol, period, startTime, lastNPoints = 0}, cb) => {
  let query = !startTime
    ? `period=${period}&lastNPoints=${lastNPoints}`
    : `period=${period}&startTime=${startTime}&lastNPoints=${lastNPoints}`

  fetch(`${kchart}/${symbol}?${query}`, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [获取分时数据]
 * @param  {[String]}   symbol        [股票代码]
 * @param  {[type]}     lastNPoints   [按时间从后往前返回的点的数量，0表示返回所有点的数据]
 * @param  {Function}   cb            [回调函数]
 */
export const getTimeseriesService = (symbol, lastNPoints, cb) => {
  let query = lastNPoints
    ? `?lastNPoints=${lastNPoints}`
    : ''

  fetch(`${timeseries}/${symbol}${query}`, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [获取股票报价 - 自选股股票简易信息]
 * @param  {[Array]}   symbols [股票代码集合]
 * @param  {Function}  cb      [回调函数]
 */
export const getStocksQuotation = (symbols, cb) => {
  let url = `${stockquotation}`
  let len = symbols.length
  for (let i = 0; i < len; i++) {
    url += i === 0
      ? `?symbol=${symbols[i]}`
      : `&symbol=${symbols[i]}`
  }

  fetch(url, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [getNews 获取新闻]
 * @param  {[Object]}  params [参数]
 * @param  {Function}  cb     [回调函数]
 */
export const getNews = (params, cb) => {
  const { symbol, page, limit, startId, id } = params
  const url = id
    ? `${news}/${symbol}?id=${id}&startId=${startId}`
    : `${news}/${symbol}?page=${page}&perpage=${limit}&startId=${startId}`

  fetch(url, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [getAnnouncements 获取公告]
 * @param  {[Object]}  params [参数]
 * @param  {Function}  cb     [回调函数]
 */
export const getAnnouncements = (params, cb) => {
  const { symbol, page, limit, startId, id } = params
  const url = id
    ? `${announcements}/${symbol}?id=${id}&startId=${startId}`
    : `${announcements}/${symbol}?page=${page}&perpage=${limit}&startId=${startId}`

  fetch(url, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [getReports 获取研报]
 * @param  {[Object]}  params [参数]
 * @param  {Function}  cb     [回调函数]
 */
export const getReports = (params, cb) => {
  const { symbol, page, limit, startId, id } = params
  const url = id
    ? `${reports}/${symbol}?id=${id}&startId=${startId}`
    : `${reports}/${symbol}?page=${page}&perpage=${limit}&startId=${startId}`

  fetch(url, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [getF10 获取 F10 数据]
 * @param  {[Object]} symbol [参数]
 * @param  {Function} cb     [回调函数]
 */
export const getF10 = (symbol, cb) => {
  fetch(`${f10}/${symbol}`, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [getStock2blocks 获取股票所属板块信息]
 * @param  {[String]}  symbol [股票代码]
 * @param  {Function}  cb     [回调函数]
 */
export const getStock2blocks = (symbol, cb) => {
  fetch(`${symbol2blocks}/${symbol}`, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [getBlocks2symbols 获取板块下的成分股]
 * @param  {[String]} symbol [股票编码]
 * @param  {Function} cb     [回调函数]
 */
export const getBlock2symbols = (symbol, cb) => {
  fetch(`${block2symbols}/${symbol}`, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [getTickSeries 获取分笔数据]
 * @param  {[String]} symbol [股票代码]
 * @param  {Function} cb     [回调函数]
 */
export const getTickSeries = (symbol, cb) => {
  fetch(`${tickseries}/${symbol}`, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}
