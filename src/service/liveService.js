import { liveInfos } from './url-types'

const fetch = window.fetch

/**
 * 直播-获取默认直播间信息
 */
export const getLiveInfos = (cb) => {
  fetch(`${liveInfos}/default`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * 直播-加载最近的互动消息
 */

export const getHistoryInfos = ({roomId, page = 1, perPage = 10}, cb) => {
  let query = `page=${page}&perPage=${perPage}`

  fetch(`${liveInfos}/${roomId}/chats?${query}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}
