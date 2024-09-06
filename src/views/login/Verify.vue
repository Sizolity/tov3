<template>
  <div class="food-img">
    <el-row class="t">?</el-row><el-row class="t">?</el-row> <el-row class="t">?</el-row
    ><el-row class="t">?</el-row> <el-row class="t">?</el-row><el-row class="t">?</el-row>
    <el-row class="t">?</el-row><el-row class="t">?</el-row>
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <el-radio-group v-model="radio" class="text">
        <el-radio value="1">用户</el-radio>
        <el-radio value="2">商家</el-radio>
      </el-radio-group>

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
        <div class="code" @click="router.push('/login')">>>>用户名密码登录>>></div>
      </el-row>
      <el-row>
        <el-button type="warning" class="login-btn" v-on:click="onSubmit">登 录</el-button>
        <el-button class="sign-btn" @click="router.push('/signin')">注 册</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/updateAccount'
import { jwtDecode } from 'jwt-decode'
import { ElMessage } from 'element-plus'

const router = useRouter()
const $syspost = inject('$syspost')
const $db = inject('$db')

const store = useAccountStore()
const formRef = ref(null)

const radio = ref(1)
const form = ref({
  phone: '',
  code: ''
})
const disabled = ref(false)
const time = ref(0)
const btntxt = ref('重新发送')
const verifyCode = ref('')

// 表单验证规则
const rules = {
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^((13|14|15|17|18)[0-9]\d{8})$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
}

// 发送验证码
const sendCode = () => {
  if (form.value.phone === '') {
    ElMessage.error('手机号不能为空')
    return
  }

  // 判断手机号格式
  const reg = /^((13|14|15|17|18)[0-9]\d{8})$/
  if (!reg.test(form.value.phone)) {
    ElMessage.error('请输入正确的手机号')
    return
  }

  // 发送请求
  console.log(form.value.phone)
  $syspost('/sms/smsXxs', {
    phone: form.value.phone
  })
    .then((res) => {
      if (res.data.isOk === 'OK') {
        ElMessage.success('发送成功，请注意接收')
        verifyCode.value = res.data.verifyCode
        time.value = 60
        disabled.value = true
        timer()
      } else {
        ElMessage.error('发送出错，可能服务器发生了错误')
      }
    })
    .catch((err) => console.log(err))
}

// 60秒倒计时
const timer = () => {
  if (time.value > 0) {
    time.value--
    btntxt.value = `${time.value}s后重新获取`
    setTimeout(timer, 1000)
  } else {
    time.value = 0
    btntxt.value = '获取验证码'
    disabled.value = false
  }
}

// 表单提交
const onSubmit = () => {
  // 验证手机号格式
  const reg = /^((13|14|15|17|18)[0-9]\d{8})$/
  if (form.value.phone === '' || !reg.test(form.value.phone)) {
    ElMessage.error('请输入正确的手机号')
    return
  }

  // 验证验证码
  if (
    form.value.code === '' ||
    form.value.code.length !== 6 ||
    form.value.code !== verifyCode.value
  ) {
    ElMessage.error('验证码错误')
    return
  }

  let url = ''
  if (radio.value === 1) {
    url = '/consumer/loginWithoutPass'
  } else if (radio.value === 2) {
    url = '/shop/loginWithoutPass'
  }

  // 开始登录请求
  $syspost(url, {
    telephone: form.value.phone
  })
    .then((r) => {
      saveLogin(r.data)
      router.push('/index')
      location.reload()
    })
    .catch((err) => {
      ElMessage.error('服务器错误啦')
      // 清空用户信息
      $db.clear()
    })
}

// 保存登录状态
const saveLogin = (data) => {
  const decode = jwtDecode(data.data)
  store.setToken(data.data)
  store.setExpireTime(decode.expire_time)
  store.setUser(decode.username)
  store.setPermissions(decode.permission)
  store.setRoles(decode.roles)
  store.setId(decode.id)
  store.setInfo(data.info)
}
</script>

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
