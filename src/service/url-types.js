export const SERVER = process.env.NODE_ENV === 'production' ? 'https://test.58caimi.com/v1' : 'https://test.58caimi.com/v1'
// 股票搜索
export const stocksearch = `${SERVER}/stock/search`
// 单只股票的 summary 数据
export const summary = `${SERVER}/stock/summaries`
// k线数据
export const kchart = `${SERVER}/stock/kcharts`
// 分时数据
export const timeseries = `${SERVER}/stock/timeseries`
// 获取股票报价数据
export const stockquotation = `${SERVER}/stock/summaries/quotation`
// 获取新闻
export const news = `${SERVER}/stock/news`
// 获取公告
export const announcements = `${SERVER}/stock/announcements`
// 获取研报
export const reports = `${SERVER}/stock/reports`
// 获取f10
export const f10 = `${SERVER}/stock/f10`
// 获取股票所属板块
export const symbol2blocks = `${SERVER}/stock/symbol2blocks`
// 获取板块下的成分股
export const block2symbols = `${SERVER}/stock/block2symbols`
// 获取分笔数据
export const tickseries = `${SERVER}/stock/tickseries`
// 微信解绑
export const unbind = `${SERVER}/users`
// 用户注册
export const register = `${SERVER}/signup`
// 用户登录
export const login = `${SERVER}/login`
// 用户登出
export const exit = `${SERVER}/logout`
// 发送验证码
export const opts = `${SERVER}/sms/otps`
// 获取用户信息
export const userself = `${SERVER}/users/me`
// 用户资料修改
export const userInfo = `${SERVER}/users`
// 重置密码
export const pwd = `${SERVER}/resetpwd`
// 绑定、更换电话号码
export const phone = `${SERVER}/users`
// 获取七牛图片上传令牌
export const qiniutoken = `${SERVER}/tokens/qnput`
// 自选股 - 加载、新建、删除、重命名、移动、添加股票
export const watchlist = `${SERVER}/watchlists`
// 获取行情沪深排行榜
export const hs = `${SERVER}/stock/quotes/rank`
// 获取行情深沪排行榜更多细节
export const hsmore = `${SERVER}/stock/quotes/more`
// 获取行情指数
export const quoteindexes = `${SERVER}/stock/quotes/index`
// 获取不同类型的板块
export const quoteblocks = `${SERVER}/stock/quotes/block`
// 获取默认直播间信息
export const liveInfos = `${SERVER}/live/rooms`
