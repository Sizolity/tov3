// import db from '../../utils/localstorage'

// export default {
//   namespaced: true,
//   state: {
//     systemName: '外卖点单系统',
//     copyright: `${new Date().getFullYear()} Liznsalt`
//   },
//   mutations: {

//   }
// }

import { defineStore } from 'pinia'

export const useAppStore = defineStore('setting', {
  state: () => ({
    systemName: '外卖点单系统',
    copyright: `${new Date().getFullYear()} Liznsalt`
  }),
  getters: {
    // 在这里定义派生状态
  },
  actions: {
    // 在这里定义异步操作
  }
})

export default useAppStore
