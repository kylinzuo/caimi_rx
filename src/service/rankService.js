import {
  hs,
  hsmore,
  quoteindexes,
  quoteblocks
} from './url-types'
const fetch = window.fetch

/**
 * [获取排行榜数据]
 * @param  {[String]}   type [排行榜类型]
 * @param  {Function}   cb   [回调函数]
 */
export const getRank = (type, cb) => {
  fetch(`${hs}?type=${type}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [获取沪深排行榜数据]
 * @param  {[String]}  type  [排行榜类型]
 * @param  {Function}  cb    [回调函数]
 */
export const getHSrankDetail = (params, cb) => {
  const { type, sort } = params

  fetch(`${hsmore}?sortBy=${type}&sortType=${sort}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [getIndexes 获取排行行情模块固定几只指数信息]
 */
export const getIndexes = cb => {
  fetch(`${quoteindexes}`, {
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
 * [getBlocks 获取不同类型的板块数据]
 * @param  {[String]} type [板块类型]
 * @param  {Function} cb   [回调函数]
 */
export const getBlocks = (type, cb) => {
  fetch(`${quoteblocks}?type=${type}`, {
    method: 'GET'
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}
