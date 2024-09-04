<template>
  <div class="food-img">
    <el-row class="t">?</el-row><el-row class="t">?</el-row> <el-row class="t">?</el-row
    ><el-row class="t">?</el-row> <el-row class="t">?</el-row><el-row class="t">?</el-row>
    <el-row class="t">?</el-row><el-row class="t">?</el-row>
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <el-form-item label="手机号" prop="username" class="form-item">
        <el-input
          type="text"
          prefix-icon="el-icon-mobile"
          placeholder="请输入手机号"
          clearable
          v-model="form.phone"
          oninput="value=value.replace(/[^\d]/g,'')"
          maxlength="11"
        />
      </el-form-item>
      <el-form-item label="验证码" prop="password" class="form-item">
        <el-input
          type="code"
          placeholder="请输入验证码"
          clearable
          v-model="form.code"
          class="input-code"
        />
        <el-button
          type="warning"
          size="small"
          class="get-code-btn"
          @click="sendcode"
          :disabled="disabled"
          v-if="disabled === false"
          >获取验证码</el-button
        >
        <el-button
          type="button"
          size="small"
          @click="sendcode"
          :disabled="disabled"
          v-if="disabled === true"
          >{{ btntxt }}</el-button
        >
      </el-form-item>

      <el-row>
        <el-button type="warning" class="login-btn" v-on:click="onSubmit">提 交</el-button>
        <el-button class="login-btn" v-on:click="$router.push('/login')">返回登录</el-button>
      </el-row>
    </el-form>

    <el-dialog
      title="重置密码"
      :visible.sync="dialogFormVisible"
      width="35%"
      :before-close="handleClose"
    >
      <el-form :model="dialogForm">
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="dialogForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="dialogForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--        <el-button @click="dialogFormVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="changeFinish" style="text-align: center">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSyspostStore } from '@/store/modules/pwdre'
import jwtDecode from 'jwt-decode'
import { ElMessage, ElConfirm } from 'element-plus'

const store = useSyspostStore()

// 响应式数据
const form = ref({
  phone: '',
  code: ''
})
const disabled = ref(false)
const time = ref(0)
const btntxt = ref('重新发送')
const verifyCode = ref('')
const dialogFormVisible = ref(false)
const dialogForm = ref({
  pass: '',
  newPass: ''
})

// 表单验证规则
const rules = {
  phone: [{ required: true, message: '手机号不可为空', trigger: 'blur' }],
  code: [{ required: true, message: '验证码不可为空', trigger: 'blur' }]
}

// 获取角色
const role = computed(() => {
  return route.params.role
})

// 发送验证码
const sendcode = () => {
  const reg = /^((13|14|15|17|18)[0-9]\d{8})$/
  if (form.value.phone === '') {
    ElMessage.error('手机号不能为空')
    return
  }
  if (!reg.test(form.value.phone)) {
    ElMessage.error('请输入正确的手机号')
    return
  }

  store
    .dispatch('syspost', {
      url: '/sms/smsXxs',
      data: { phone: form.value.phone }
    })
    .then((res) => {
      if (res.data.isOk === 'OK') {
        ElMessage.success('发送成功，请注意接收')
        verifyCode.value = res.data.verifyCode
        startTimer()
      } else {
        ElMessage.error('发送出错，可能服务器发生了错误')
      }
    })
    .catch((err) => console.error(err))
}

// 启动60秒倒计时
const startTimer = () => {
  time.value = 60
  disabled.value = true
  btntxt.value = time.value + 's后重新获取'
  const interval = setInterval(() => {
    if (time.value > 0) {
      time.value--
      btntxt.value = time.value + 's后重新获取'
    } else {
      clearInterval(interval)
      btntxt.value = '获取验证码'
      disabled.value = false
    }
  }, 1000)
}

// 提交处理
const onSubmit = () => {
  const reg = /^((13|14|15|17|18)[0-9]\d{8})$/
  if (form.value.phone === '') {
    ElMessage.error('手机号不能为空')
    return
  }
  if (!reg.test(form.value.phone)) {
    ElMessage.error('请输入正确的手机号')
    return
  }
  if (
    form.value.phone !== '' &&
    form.value.code !== '' &&
    verifyCode.value.length === 6 &&
    form.value.code === verifyCode.value
  ) {
    dialogFormVisible.value = true // 打开对话框修改密码
  }
}

// 关闭对话框确认
const handleClose = (done) => {
  ElConfirm({
    title: '提示',
    message: '将丢失操作，确认关闭？'
  })
    .then(done)
    .catch(() => {})
}

// 更改密码
const changeFinish = () => {
  if (dialogForm.value.pass !== dialogForm.value.newPass) {
    ElMessage.error('两次密码不一致')
    return
  }

  let url =
    role.value === 'consumer'
      ? '/consumer/changePasswordByPhoneCode'
      : '/shop/changePasswordByPhoneCode'

  store
    .dispatch('syspost', {
      url,
      data: {
        telephone: form.value.phone,
        password: dialogForm.value.pass
      }
    })
    .then((res) => {
      ElConfirm({
        title: '提示',
        message: '重置密码成功，是否直接登录?'
      })
        .then(() => {
          doLogin()
        })
        .catch(() => {
          router.push('/login')
        })
    })
    .catch((err) => console.error(err))
}

// 登录
const doLogin = () => {
  let url = role.value === 'consumer' ? '/consumer/loginWithoutPass' : '/shop/loginWithoutPass'

  store
    .dispatch('syspost', {
      url,
      data: { telephone: form.value.phone }
    })
    .then((r) => {
      saveLogin(r.data)
      router.push('/index')
      location.reload()
    })
    .catch((err) => {
      ElMessage.error('服务器错误啦')
      store.dispatch('clearUserData')
    })
}

// 保存登录数据
const saveLogin = (data) => {
  const decode = jwtDecode(data.data)

  store.commit('account/setToken', data.data)
  store.commit('account/setExpireTime', decode.expire_time)
  store.commit('account/setUser', decode.username)
  store.commit('account/setPermissions', decode.permission)
  store.commit('account/setRoles', decode.roles)
  store.commit('account/setId', decode.id)
  store.commit('account/setInfo', data.info)
}
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>

<style scoped>
.food-img {
  background-image: url('../images/orange.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  height: 100%;
}
.login-box {
  border: 1px solid #dcdfe6;
  width: 25%;
  background: rgba(255, 255, 255, 0.7);
  margin: auto auto 140px 35%;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
}

.text {
  text-align: center;
  margin: 0 auto 20px auto;
  color: #e7b563;
}
.code {
  color: rgb(64, 158, 255);
  text-align: center;
  cursor: pointer;
}

.form-item {
  margin: 10px 0 20px 0;
}
.login-btn {
  margin: 10px 30px 10px 30px;
}
.login-btn:hover {
  background: rgba(230, 162, 60, 0.7);
}
.sign-btn {
  margin: 10px 30px 10px 30px;
}
.sign-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #000;
}

.input-code {
  width: 140px;
  float: left;
}

.get-code-btn {
  margin: 5px 10px 0 auto;
  float: right;
}

.t {
  color: rgba(0, 0, 0, 0);
}
</style>
