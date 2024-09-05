import { defineStore } from 'pinia'

export const useAccountStore = defineStore('updateAccount', {
  state: () => ({
    token: null,
    expireTime: null,
    permissions: [],
    roles: [],
    user: null,
    id: null,
    info: null
  }),
  actions: {
    setToken(token) {
      this.token = token
    },
    setExpireTime(expireTime) {
      this.expireTime = expireTime
    },
    setPermissions(permissions) {
      this.permissions = permissions
    },
    setRoles(roles) {
      this.roles = roles
    },
    setUser(user) {
      this.user = user
    },
    setId(id) {
      this.id = id
    },
    setInfo(info) {
      this.info = info
    }
  }
})

export default useAccountStore
