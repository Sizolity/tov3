<template>
  <el-row :gutter="20">
    <el-col :span="8" :offset="7" style="margin-top: 70px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="oldPass">
          <el-input
            type="password"
            v-model="ruleForm.oldPass"
            autocomplete="off"
            placeholder="请输入旧密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            placeholder="请再次输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="submitForm" class="login-btn">提交</el-button>
          <el-button @click="resetForm" class="reset-btn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { ElNotification } from 'element-plus'
import { inject, ref } from 'vue'

// global
const $post = inject('$post')
const $db = inject('$db')

const ruleForm = ref({
  oldPass: '',
  pass: '',
  checkPass: ''
})

const rules = ref({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }]
})

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.checkPass !== '') {
      ruleForm.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.pass) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const submitForm = () => {
  ruleForm.value
    .validate()
    .then((res) => {
      $post('/consumer/changePassword', {
        CID: $db.get('USER_ID'),
        oldPassword: ruleForm.oldPass,
        newPassword: ruleForm.pass
      })
        .then((res) => {
          ElNotification.success({
            title: '系统提示',
            message: '修改成功'
          })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      ElNotification.error({
        title: '系统提示',
        message: '两次密码不一致'
      })
    })
}

const resetForm = () => {
  ruleForm.value.resetFields()
}
</script>

<style scoped>
.login-btn {
  margin: 10px 30px 10px 30px;
}
.login-btn:hover {
  background: rgba(230, 162, 60, 0.7);
}
.reset-btn {
  margin: 10px 30px 10px 30px;
}
.reset-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #000;
}
</style>
