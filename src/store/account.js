import db from '../../utils/localstorage'

// export default {
//   namespaced: true,
//   state: {
//     token: db.get('USER_TOKEN'),
//     expireTime: db.get('EXPIRE_TIME'),
//     user: db.get('USER'),
//     permissions: db.get('PERMISSIONS'),
//     roles: db.get('ROLES'),
//     id: db.get('USER_ID'),
//     info: db.get('USER_INFO')
//   },
//   mutations: {
//     setToken (state, val) {
//       db.save('USER_TOKEN', val)
//       state.token = val
//     },
//     setExpireTime (state, val) {
//       db.save('EXPIRE_TIME', val)
//       state.expireTime = val
//     },
//     setUser (state, val) {
//       db.save('USER', val)
//       state.user = val
//     },
//     setPermissions (state, val) {
//       db.save('PERMISSIONS', val)
//       state.permissions = val
//     },
//     setRoles (state, val) {
//       db.save('ROLES', val)
//       state.roles = val
//     },
//     setId(state, val) {
//       db.save('USER_ID', val)
//       state.id = val
//     },
//     setInfo(state, val) {
//       db.save('USER_INFO', val)
//       state.info = val
//     }
//   }
// }

import { defineStore } from 'pinia'

export const useAuthStore = defineStore('account', {
  state: () => ({
    token: null,
    expireTime: null,
    user: null,
    permissions: null,
    roles: null,
    id: null,
    info: null
  }),
  getters: {
    // 在这里定义派生状态
  },
  actions: {
    // 在这里定义异步操作
    setToken(state, val) {
      db.save('USER_TOKEN', val)
      state.token = val
    },
    setExpireTime(state, val) {
      db.save('EXPIRE_TIME', val)
      state.expireTime = val
    },
    setUser(state, val) {
      db.save('USER', val)
      state.user = val
    },
    setPermissions(state, val) {
      db.save('PERMISSIONS', val)
      state.permissions = val
    },
    setRoles(state, val) {
      db.save('ROLES', val)
      state.roles = val
    },
    setId(state, val) {
      db.save('USER_ID', val)
      state.id = val
    },
    setInfo(state, val) {
      db.save('USER_INFO', val)
      state.info = val
    }
  }
})

export default useAuthStore
