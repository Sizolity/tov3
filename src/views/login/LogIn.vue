<template>
  <div class="food-img">
    <el-row class="t">?</el-row>
    <el-row class="t">?</el-row>
    <el-row class="t">?</el-row>
    <el-row class="t">?</el-row>
    <el-row class="t">?</el-row>
    <el-row class="t">?</el-row>
    <el-row class="t">?</el-row>
    <el-row class="t">?</el-row>
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <el-radio-group v-model="radio" class="text">
        <el-radio :value="1">用户</el-radio>
        <el-radio :value="2">商家</el-radio>
      </el-radio-group>

      <el-form-item label="用户名" prop="username" class="form-item">
        <el-input
          type="text"
          prefix-icon="el-icon-user"
          placeholder="请输入用户名"
          clearable
          v-model="form.username"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password" class="form-item">
        <el-input
          type="password"
          prefix-icon="el-icon-lock"
          placeholder="请输入密码"
          clearable
          v-model="form.password"
        />
      </el-form-item>

      <el-row>
        <div class="code" @click="router.push('/verify')">>>>手机验证码登录>>></div>
      </el-row>

      <el-row>
        <el-button type="warning" class="login-btn" @click="onSubmit">登 录</el-button>
        <el-button class="sign-btn" @click="router.push('/signin')">注 册</el-button>
      </el-row>

      <el-row>
        <div class="code" style="text-align: right; color: #8c939d" @click="resetPassword">
          Forget password?
        </div>
      </el-row>

      <el-dialog :model-value="dialogVisible" width="30%" v-on:close="dialogVisible = false">
        <span>请输入用户名和密码</span>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button type="warning" size="small" @click="dialogVisible = false">确 定</el-button>
        </span> -->
      </el-dialog>
    </el-form>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useAccountStore } from '../../stores/updateAccount'
import { jwtDecode } from 'jwt-decode'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const accountStore = useAccountStore()

// global
const $syspost = inject('$syspost')
const $db = inject('$db')

// 响应式数据
const loginForm = ref(null)
const radio = ref(1)
const form = ref({
  username: '',
  password: ''
})

// 表单验证规则
const rules = {
  username: [{ required: true, message: '用户名不可为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不可为空', trigger: 'blur' }]
}

// 对话框显示和隐藏
const dialogVisible = ref(false)

// 提交处理
const onSubmit = () => {
  // console.log(loginForm.value, 'loginForm.value')
  loginForm.value
    .validate()
    .then((res) => {
      // console.log(res, '校验成功')
      const url = radio.value === 1 ? 'consumer/login' : 'shop/login'
      console.log(url)
      console.log(form.value.username)
      // ??? 无法登录
      $syspost({
        url,
        data: {
          username: form.value.username,
          password: form.value.password
        }
      })
        .then((r) => {
          saveLoginData(r.data)
          // 跳转到首页并重载
          router.push('/index')
          location.reload()
        })
        .catch((err) => {
          ElNotification.error({
            title: '系统提示',
            message: '账号或密码错误'
          })
          // 清空用户信息
          $db.clear('clearUserData')
        })
    })
    .catch((err) => {
      dialogVisible.value = true
      console.log(err, '校验失败')
    })
}

// 保存登录数据
const saveLoginData = (data) => {
  const decode = jwtDecode(data.data)

  accountStore.setToken(data.data)
  accountStore.setExpireTime(decode.expire_time)
  accountStore.setUser(decode.username)
  accountStore.setPermissions(decode.permission)
  accountStore.setRoles(decode.roles)
  accountStore.setId(decode.id)
  accountStore.setInfo(data.info)
}

// 重置密码
const resetPassword = () => {
  const path = radio.value === 1 ? '/password_reset/consumer' : '/password_reset/shop'
  router.push(path)
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
.t {
  color: rgba(0, 0, 0, 0);
}
</style>
