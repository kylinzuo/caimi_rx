import { watchlist } from './url-types'

const fetch = window.fetch

/**
 * 创建自选股
 * @param {Object} params [id && name]
 */
export const createWatchlist = (params, cb) => {
  fetch(`${watchlist}`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * 删除自选股分组
 * @param {Object} id [自选股组 ID]
 */
export const delWatchlist = (id, cb) => {
  fetch(`${watchlist}/${id}`, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include'
  }).then(response => {
    return
  }).then(() => {
    cb()
  }).catch(error => {
    console.log(error)
  })
}

/**
 * 重命名自选股组
 * @param {Object} params [id && name]
 */
export const renameWatchlist = (params, cb) => {
  fetch(`${watchlist}/${params.id}/name`, {
    method: 'PATCH',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * 移动自选股组
 * @param {Object} params [id & direction]
 */
export const moveWatchlist = (params, cb) => {
  fetch(`${watchlist}/${params.id}/order`, {
    method: 'PATCH',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({direction: params.direction})
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * 获取用户自选股组
 */
export const getUserWatchlist = cb => {
  fetch(`${watchlist}`, {
    method: 'GET',
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
 * 自选股组加入新个股
 * @param {Obejct} params [id & symbols]
 */
export const pushStock = (params, cb) => {
  fetch(`${watchlist}/${params.id}/symbols`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ symbols: params.symbol })
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * 复制自选股 / 个股到某支自选股中
 * @param {Object} params [id & symbols]
 */
export const cpWatchlist = (params, cb) => {
  fetch(`${watchlist}/${params.id}/symbols`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ symbols: params.symbols })
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * 个股置顶
 * @param {Object} params [id & symbol]
 */
export const stockMoveTop = (params, cb) => {
  fetch(`${watchlist}/${params.id}/symbols/${params.symbol}`, {
    method: 'PATCH',
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
 * 从自选股中删除个股
 * @param {Object} params [id & symbols]
 */
export const delStock = (params, cb) => {
  fetch(`${watchlist}/${params.id}/symbols`, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ symbols: params.symbols })
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}
