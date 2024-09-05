// import './assets/main.css'
import 'element-plus/dist/index.css'

import App from './App.vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'

import request from './utils/request'
import _global from './utils/global'
import router from './router'
import Elementplus, { ElNotification } from 'element-plus'

import db from './utils/localstorage'

const app = createApp(App)
const persist = createPersistedState({})
const pinia = createPinia()
pinia.use(persist)
app.use(pinia)
app.use(router)
app.use(Elementplus)

// app 顶层函数，全局变量 注入
app.provide('$db', db)

// axios全局配置
app.provide('$post', request.post)
app.provide('$get', request.get)
app.provide('$put', request.put)
app.provide('$delete', request.delete)
app.provide('$syspost', request.syspost)
app.provide('$sysget', request.sysget)
app.provide('GLOBAL', _global) // 定义全局变量

// js 时间格式化
Date.prototype.Format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o)
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

// 判断当前浏览器是否支持 WebSocket
// if ('WebSocket' in window) {
//   app.config.globalProperties.$webscoket = new WebSocket('ws://localhost:8080/takeout/myWebSocket')
//   app.config.globalProperties.$buyNotification = new WebSocket(
//     'ws://localhost:8080/takeout/buyNotification'
//   )

//   // 设置新订单通知
//   app.config.globalProperties.$buyNotification.onmessage = function (res) {
//     let data = JSON.parse(res.data)
//     if (db.get('ROLES') === '"shop"' && String(db.get('USER_ID')) === String(data.SID)) {
//       Notification({
//         title: '提示',
//         message: '您有新的订单了，请及时处理！',
//         duration: 0 // FIXME: 不关掉，让商家自己关
//       })
//     }
//   }
// } else {
//   alert('当前浏览器不支持 websocket')
// }

// 定义 routerAppend 方法
app.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}

app.mount('#app')
