// => 分时图颜色 => colors[svgArgs.theme].gray
export let colors = []
// => 白色主题
colors[0] = {
  bgColor: '#fff', // 背景色
  gray: '#E8E8E8', // 网格线
  blue: '#599DFF', // 分时线价格曲线颜色
  orange: '#F47B00', // 平均线颜色
  fillRed: '#F56965', // 红色柱状图
  fillGreen: '#7ACA67', // 绿色柱状图
  axisTextRed: '#F34A47', // 纵坐标轴刻度颜色
  axisTextGreen: '#44BF3E', // 纵坐标轴刻度颜色
  axitTextGray: '#535353', // 纵坐标轴刻度颜色
  cursorBlue: '#307CD5', // 十字光标颜色
  tagBlue: '#D4E8FF', // 十字光标提示框颜色
  tagBorderBlue: '#7CB0EC', // 十字光标提示框边框颜色
  tagTextBlue: '#146BCF', // 十字光标提示框字体颜色
  lampBlue: '#439BFF', // 呼吸灯蓝色
  lampwickBlue: '#146BCF', // 呼吸灯芯蓝色
  lampRed: '#E74B47', // 呼吸灯红色
  lampGreen: '#44BF3E', // 呼吸灯绿色
  lampWhite: '#fff', // 呼吸灯白色
  floatBg: '#fff', // 浮动框背景色
  floatGray: '#D5D5D5', // 浮动框灰色
  floatTextGray: '#535353', // 浮动框灰色字体
  floatTextRed: '#F34A47', // 浮动框红色色字体
  floatTextGreen: '#14C041' // 浮动框绿色色字体
}

// => k线图颜色主题
export let kcolors = []
// => 白色主题
kcolors[0] = {
  bgColor: '#fff', // 背景色
  titleColor: '#333333', // 股票标题颜色
  headColor: '#fff', // 指标区头部颜色
  settingBtnColor: '#B2B2B2', // 设置按钮颜色
  btnHighlight: 'red', // 按钮高亮颜色
  gridGray: '#E8E8E8', // 网格线颜色
  kRed: '#FF6E6B', // k线红色
  kGreen: '#44BF3E', // k线绿色
  curveColor: ['#000000', '#E93030', '#00A600', '#F08C00', '#2775F8', '#909090'], // 曲线颜色 黑色、红色、绿色、黄色、蓝色、灰色
  indexTextColor: '#535353', // 指标区标题颜色
  slideBgRStroke: '#E8E8E8', // 滑动条背景框边框颜色
  slideHalfCircle: '#B2B2B2', // 滑动条半圆颜色
  slideFill: '#E8E8E8', // 滑动条色
  cursorBlue: '#307CD5', // 十字光标颜色
  tipBlue: '#D4E8FF', // 十字光标提示框颜色
  tipBorderBlue: '#7CB0EC', // 十字光标提示框边框颜色
  tipTextBlue: '#146BCF', // 十字光标提示框字体颜色
  floatBg: '#fff', // 浮动框背景色
  floatGray: '#D5D5D5', // 浮动框灰色
  floatTextGray: '#535353', // 浮动框灰色字体
  floatTextRed: '#F34A47', // 浮动框红色色字体
  floatTextGreen: '#14C041', // 浮动框绿色色字体
  arrowColor: '#535353' // 最大最小值箭头颜色
}

// => 黑色主题
kcolors[1] = {
  bgColor: '#000', // 背景色
  titleColor: '#fff', // 股票标题颜色
  headColor: '#000', // 指标区头部颜色
  settingBtnColor: '#B2B2B2', // 设置按钮颜色
  btnHighlight: '#fff', // 按钮高亮颜色
  gridGray: '#333', // 网格线颜色
  kRed: '#FF6E6B', // k线红色
  kGreen: '#44BF3E', // k线绿色
  curveColor: ['#888', '#E93030', '#00A600', '#F08C00', '#2775F8', '#909090'], // 曲线颜色 黑色、红色、绿色、黄色、蓝色、灰色
  indexTextColor: '#fff', // 指标区标题颜色
  slideBgRStroke: '#333', // 滑动条背景框边框颜色
  slideHalfCircle: '#888', // 滑动条半圆颜色
  slideFill: '#666', // 滑动条色
  cursorBlue: '#307CD5', // 十字光标颜色
  tipBlue: '#D4E8FF', // 十字光标提示框颜色
  tipBorderBlue: '#7CB0EC', // 十字光标提示框边框颜色
  tipTextBlue: '#146BCF', // 十字光标提示框字体颜色
  floatBg: '#000', // 浮动框背景色
  floatGray: '#333', // 浮动框灰色
  floatTextGray: '#fff', // 浮动框灰色字体
  floatTextRed: '#F34A47', // 浮动框红色色字体
  floatTextGreen: '#14C041', // 浮动框绿色色字体
  arrowColor: '#fff' // 最大最小值箭头颜色
}
