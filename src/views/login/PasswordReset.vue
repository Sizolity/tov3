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
        <el-button class="login-btn" v-on:click="router.push('/login')">返回登录</el-button>
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
import { ref, inject } from 'vue'
import { useAuthStore } from '../../stores/account' // Adjust path as needed
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { jwtDecode } from 'jwt-decode'

// 注入顶层变量
const $syspost = inject('$syspost')
const $db = inject('$db')
const router = useRoute()

const store = useAuthStore()
const route = useRoute()

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
  username: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
}

// 发送验证码
// todo ?
const sendcode = () => {
  const reg = /^((13|14|15|17|18)[0-9]\d{8})$/
  if (form.value.phone === '') {
    ElMessage({ message: '手机号不能为空', type: 'error', center: true })
    return
  }
  if (!reg.test(form.value.phone)) {
    ElMessage({ message: '请输入正确的手机号', type: 'error', center: true })
  } else {
    // 发送短信验证码
    $syspost('/sms/smsXxs', { phone: form.value.phone })
      .then((res) => {
        if (res.data.isOk === 'OK') {
          ElMessage({ message: '发送成功，请注意接收', type: 'success', center: true })
          verifyCode.value = res.data.verifyCode
          time.value = 60
          disabled.value = true
          timer()
        } else {
          ElMessage({ message: '发送出错，可能服务器发生了错误', type: 'error', center: true })
        }
      })
      .catch((err) => console.log(err))
  }
}

// 倒计时
function timer() {
  if (time.value > 0) {
    time.value--
    btntxt.value = time.value + 's后重新获取'
    setTimeout(timer, 1000)
  } else {
    time.value = 0
    btntxt.value = '获取验证码'
    disabled.value = false
  }
}

// 提交表单
function onSubmit() {
  const reg = /^((13|14|15|17|18)[0-9]\d{8})$/
  if (form.value.phone === '') {
    ElMessage({ message: '手机号不能为空', type: 'error', center: true })
    return
  }
  if (!reg.test(form.value.phone)) {
    ElMessage({ message: '请输入正确的手机号', type: 'error', center: true })
    return
  }
  if (
    form.value.phone &&
    form.value.code &&
    verifyCode.value.length === 6 &&
    form.value.code === verifyCode.value
  ) {
    dialogFormVisible.value = true // 打开对话框修改密码
  }
}

// 处理对话框关闭
function handleClose(done) {
  ElMessage('将丢失操作，确认关闭？')
    .then(() => {
      done()
    })
    .catch(() => {})
}

// 修改密码
function changeFinish() {
  if (dialogForm.value.pass !== dialogForm.value.newPass) {
    ElMessage({ message: '两次密码不一致', type: 'error' })
    return
  }

  const url =
    route.params.role === 'consumer'
      ? '/consumer/changePasswordByPhoneCode'
      : '/shop/changePasswordByPhoneCode'

  $syspost(url, {
    telephone: form.value.phone,
    password: dialogForm.value.pass
  })
    .then((res) => {
      ElMessage('重置密码成功，是否直接登录?', '提示', {
        confirmButtonText: '直接登录',
        cancelButtonText: '返回登录界面',
        type: 'warning'
      })
        .then(() => {
          doLogin()
        })
        .catch(() => {
          router.push('/login')
        })
    })
    .catch((err) => console.log(err))
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

// 登录方法
function doLogin() {
  const url =
    route.params.role === 'consumer' ? '/consumer/loginWithoutPass' : '/shop/loginWithoutPass'

  $syspost(url, {
    telephone: form.value.phone
  })
    .then((r) => {
      saveLogin(r.data)
      router.push('/index')
      location.reload()
    })
    .catch((err) => {
      ElMessage({ message: '服务器错误啦', type: 'error', center: true })
      $db.clear()
    })
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
