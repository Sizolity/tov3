import { defineStore } from 'pinia'

// ?? 未引用的 工具函数
export const useSyspostStore = defineStore('usesyspost', {
  state: () => ({
    url: '/sms/smsXxs',
    data: { phone: '' }
  }),
  actions: {
    setUrl(url) {
      this.url = url
    },
    setData(data) {
      this.data = data
    },
    send() {
      // 在这里实现发送请求的逻辑
    }
  }
})

export default useSyspostStore
