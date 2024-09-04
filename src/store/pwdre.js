import { defineStore } from 'pinia'

const useSyspostStore = defineStore('syspost', {
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
