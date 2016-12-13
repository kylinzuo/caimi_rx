import io from 'socket.io-client'

// const location = window.location
// const subDomain = process.env.NODE_ENV === 'production' ? location.host : 'http://test.58caimi.com'
const subDomain = 'https://test.58caimi.com'
let socket
let socketService = {
  /**
   * [建立链接]
   * @param  {[type]} opts [description]
   * @return {[Object]}    [链式调用]
   */
  connect (opts) {
    socket = io.connect(subDomain, opts)
    return socketService
  },
  /**
   * [建立直播链接 暂时写死]
   * @param  {[type]} opts [description]
   * @return {[Object]}    [链式调用]
   */
  connectLive (opts) {
    socket = io.connect('https://test.58caimi.com', opts)
    return socketService
  },
  /**
   * [进入指定频道]
   * @param  {[String]} channel [指定频道]
   * @param  {Function} cb      [回调函数]
   * @return {[Object]}         [链式调用]
   */
  listen (channel, cb) {
    socket.on(channel, cb)
    return socketService
  },
  /**
   * [订阅股票组详情]
   * @param  {[String]} channel [指定频道]
   * @param  {[Array]}  symbols [股票组]
   * @return {[Object]}         [链式调用]
   */
  subscribe (channel, symbols) {
    socket.emit('sub', {
      channel,
      symbols
    })
    return socketService
  },
  /**
   * [取消订阅股票组]
   * @param  {[String]} channel [指定股票组]
   * @param  {[Array]} stocks   [股票组]
   * @return {[Object]}         [链式调用]
   */
  unsubscribe (channel, symbols) {
    symbols.length > 0 && socket.emit('unsub', {
      channel,
      symbols
    })
    return socketService
  },
  /**
   * [订阅 K 线、分时画图数据]
   * @param  {[String]} interval [K线周期]
   * @param  {[Array]}  symbols  [股票组]
   * @return {[Object]}          [链式调用]
   */
  subscribeChart (interval, symbol) {
    socket.emit('sub', {
      interval,
      symbol
    })
    return socketService
  },
  /**
   * [取消订阅 k 线、分时图数据]
   * @param  {[String]} interval [周期]
   * @param  {[Array]}  symbols  [股票组]
   * @return {[Object]}          [链式调用]
   */
  unsubscribeChart (interval, symbol) {
    socket.emit('unsub', {
      interval,
      symbol
    })
    return socketService
  },
  /**
   * [订阅排行榜]
   * @param  {[String]} channel [排行榜类型]
   * @return {[Object]}         [链式调用]
   */
  subscribeRank (channel) {
    socket.emit('sub', {
      channel
    })
    return socketService
  },
  /**
   * [取消订阅排行榜]
   * @param  {[String]} channel [排行榜类型]
   * @return {[Object]}         [链式调用]
   */
  unsubscribeRank (channel) {
    socket.emit('sub', {
      channel
    })
    return socketService
  },
  /**
   * [进入直播间]
   * @param  {[Object]} room [指定房间]
   * @return {[type]}        [链式调用]
   */
  join (room) {
    room && room.mark && socket.emit('join', {
      roomId: room.mark
    })
    return socketService
  },
  /**
   * [离开直播间]
   * @param  {[Object]} room [指定房间]
   * @return {[Object]}      [链式调用]
   */
  leave (room) {
    room && room.mark && socket.emit('leave', {
      roomId: room.mark
    })
    return socketService
  },
  /**
   * [推送消息]
   * @param  {[Object]} room [指定房间]
   * @param  {[String]} msg  [消息]
   * @return {[Object]}      [链式调用]
   */
  chat (msg) {
    msg && socket.emit('chat', msg)
    return socketService
  },
  /**
   * [在线人数监听]
   * @param  {[Object]} room [指定房间]
   * @return {[Object]}      [链式调用]
   */
  online (room) {
    room && room.mark && socket.emit('online', {
      room: room.mark
    })
    return socketService
  },
  /**
   * [直播间断线重连]
   * @param  {[Object]} room [指定房间]
   * @return {[Object]}      [链式调用]
   */
  reconnect (cb) {
    socket.on('reconnect', cb)
    return socketService
  }
}

export default socketService
