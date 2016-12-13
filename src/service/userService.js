import {
  register,
  login,
  opts,
  exit,
  userself,
  userInfo,
  pwd,
  phone,
  qiniutoken,
  unbind
} from './url-types'

const fetch = window.fetch

/**
 * [注册]
 * @param  {[String]}   options.username   [用户名 / 电话号码]
 * @param  {[String]}     options.otp      [验证码]
 * @param  {[String]}   options.password   [密码]
 * @param  {Function}         cb           [回调函数]
 */
export const signup = (params, cb) => {
  fetch(`${register}`, {
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
 * [登录]
 * @param  {[String]}   options.username [用户名 / 电话号码]
 * @param  {[String]}   options.password [密码]
 * @param  {Function}   cb               [回调函数]
 */
export const signin = (params, cb) => {
  fetch(`${login}`, {
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
 * [登出]
 * @param  {Function} cb [回调函数]
 */
export const logout = cb => {
  fetch(`${exit}`, {
    method: 'POST',
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
 * [发送验证码]
 * @param  {[String]}   phone [手机号码]
 * @param  {Function}   cb    [回调函数]
 */
export const sendOpts = (phone, cb) => {
  fetch(`${opts}`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({phone})
  }).then(response => {
    return response.ok ? null : response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [获取用户自身信息 - 后台已登录状态]
 * @param  {Function} cb [回调函数]
 */
export const getUserInfo = cb => {
  fetch(`${userself}`, {
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
 * [设置用户信息 (头像 || 用户名)]
 * @param  {[Object]} params [参数 id && (avatar || nick)]
 * @param  {Function} cb     [回调函数]
 */
export const setUserInfo = (params, cb) => {
  fetch(`${userInfo}/${params.id}`, {
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
 * [重置用户密码]
 * @param {[String]}   username [用户名]
 * @param {[String]}   password [密码]
 * @param {[String]}   otp      [验证码]
 * @param {[Function]} cb       [回调函数]
 */
export const resetPwd = (params, cb) => {
  fetch(`${pwd}`, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(response => {
    return response.ok ? null : response.json()
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}

/**
 * [绑定、修改手机号]
 * @param {[String]}   id       [用户 ID]
 * @param {[String]}   username [手机号]
 * @param {[String]}   otp      [验证码]
 * @param {[Function]} cb       [回调函数]
 */
export const bindPhone = (params, cb) => {
  fetch(`${phone}/${params.id}/phone`, {
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
 * 请求七牛文件上传 token
 */
export const getQiNiuToken = cb => {
  fetch(`${qiniutoken}`, {
    mehod: 'GET',
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
 * [修改头像]
 * @param  {[Object]}   params [file & token & id]
 * @param  {Function}   cb     [回调函数]
 */
export const modifyHeadImg = (params, cb) => {
  const uploadUrl = window.location.protocol.indexOf('https') > -1
    ? 'https://up.qbox.me'
    : 'http://up.qiniu.com'

  const FormData = window.FormData
  const XMLHttpRequest = window.XMLHttpRequest

  let xhr = new XMLHttpRequest()
  let fd = new FormData()
  fd.append('file', params.file)
  fd.append('token', params.token)

  xhr.open('POST', uploadUrl, true)
  xhr.onreadystatechange = response => {
    if (xhr.readyState === 4 && xhr.status === 200 && xhr.responseText !== '') {
      let blkRet = JSON.parse(xhr.responseText)
      const infoParams = {
        id: params.id,
        avatar: blkRet.url
      }
      setUserInfo(infoParams, data => {
        cb(data)
      })
    }
  }
  xhr.send(fd)
}

/**
 * [解绑微信]
 * @param  {[String]} id [用户ID]
 * @param  {Function} cb [回调函数]
 */
export const unbindWeChat = (id, cb) => {
  fetch(`${unbind}/${id}/wechat`, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include'
  }).then(response => {
    return
  }).then(data => {
    cb(data)
  }).catch(error => {
    console.log(error)
  })
}
