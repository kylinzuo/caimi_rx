// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import VueRouter from 'vue-router'
import App from './App'
import Rx from 'rxjs/Rx'
// import * as kylin from './util/index'
// console.log(VueRouter)
require('!style-loader!css-loader!less-loader!./less/ts.chart.less')
require('!style-loader!css-loader!less-loader!./less/style.less')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

/* ==设置html根元素font-size大小以确定rem值======================================================== */
// ;(function (doc, win) {
//   let docEl = doc.documentElement
//   let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
//   let recalc = function () {
//     let clientWidth = docEl.clientWidth
//     if (!clientWidth) return
//     docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'
//     // console.log(docEl.style.fontSize)
//   }
//   if (!doc.addEventListener) return
//   win.addEventListener(resizeEvt, recalc, false)
//   doc.addEventListener('DOMContentLoaded', recalc, false)
// })(document, window)
/* ==设置html根元素font-size大小以确定rem值======================================================== */

Rx.Observable.of(1, 2, 3)
  .map(x => console.log(x))

/**
 * util工具函数测试
 */
// kylin.print(kylin)

