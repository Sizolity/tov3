import db from '../utils/localstorage'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore(
  'updateAccount',
  () => {
    const token = ref('')
    const expireTime = ref('.0')
    const permissions = ref([])
    const roles = ref([])
    const user = ref('')
    const id = ref(null)
    const info = ref('')

    // getter

    //setter
    function setToken(data) {
      token.value = data.token
      db.save('USER_TOKEN', data)
    }

    function setExpiretime(data) {
      expireTime.value = data
      db.save('EXPIRE_TIME', data)
    }

    function setPermissions(data) {
      permissions.value = data
      db.save('PERMISSIONS', data)
    }

    function setRoles(data) {
      roles.value = data
      db.save('ROLES', data)
    }

    function setUser(data) {
      user.value = data
      db.save('USER', data)
    }

    function setId(data) {
      id.value = data
      db.save('USER_ID', data)
    }

    function setInfo(data) {
      info.value = data
      db.save('USER_INFO', data)
    }
    return {
      token,
      expireTime,
      permissions,
      roles,
      user,
      id,
      info,
      //setter
      setToken,
      setExpiretime,
      setPermissions,
      setRoles,
      setUser,
      setId,
      setInfo
    }
  },
  { persist: true }
)

export default useAuthStore
