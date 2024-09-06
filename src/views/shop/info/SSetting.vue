<template>
  <el-row style="margin-top: 50px">
    <el-col :span="10" :offset="6">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入店铺名称"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="telephone">
          <el-input v-model="ruleForm.telephone" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="店铺地址" prop="address">
          <el-input v-model="ruleForm.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="店主姓名" prop="managerName">
          <el-input v-model="ruleForm.managerName" placeholder="请输入店主姓名"></el-input>
        </el-form-item>
        <el-form-item label="店主邮箱" prop="manageEmail">
          <el-input v-model="ruleForm.managerEmail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="submitForm('ruleForm')" class="login-btn"
            >修改</el-button
          >
          <el-button @click="resetForm('ruleForm')" class="reset-btn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { ElNotification, ElMessageBox } from 'element-plus'

// global
const $db = inject('$db')
const $get = inject('$get')

// 响应式数据
const oldData = ref({})
const ruleForm = ref({
  name: '',
  telephone: '',
  address: '',
  managerName: '',
  managerEmail: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入名字', trigger: 'blur' },
    { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
  ],
  telephone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { min: 11, max: 11, message: '长度在必须是 11 个字符', trigger: 'blur' }
  ]
}

// 组件挂载时获取用户信息
onMounted(() => {
  oldData.value = JSON.parse($db.get('USER_INFO'))
  dataReset()
})

// 提交表单
const submitForm = async (formName) => {
  const valid = await validateForm(formName)
  if (valid) {
    ElMessageBox.confirm('是否确认修改个人信息?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          const res = await $get('/shop/editInfo', {
            SID: $db.get('USER_ID'),
            name: ruleForm.value.name,
            telephone: ruleForm.value.telephone,
            address: ruleForm.value.address,
            managerName: ruleForm.value.managerName,
            managerEmail: ruleForm.value.managerEmail
          })
          $db.save('USER_INFO', res.data.data)
          oldData.value = JSON.parse($db.get('USER_INFO'))
          dataReset()
          Notification.success({
            title: '系统提示',
            message: '修改成功!'
          })
        } catch (err) {
          console.error(err)
        }
      })
      .catch(() => {
        ElNotification.info({
          title: '系统提示',
          message: '已取消更改'
        })
        dataReset()
      })
  } else {
    console.log('error submit!!')
    return false
  }
}

// 重置表单
const resetForm = (formName) => {
  formName.resetFields()
  dataReset()
}

// 数据重置
const dataReset = () => {
  ruleForm.value = {
    name: oldData.value.username,
    telephone: oldData.value.telephone,
    address: oldData.value.address,
    managerName: oldData.value.managerName,
    managerEmail: oldData.value.managerEmail
  }
}

// 验证表单
const validateForm = (formName) => {
  return new Promise((resolve) => {
    formName.validate((valid) => {
      resolve(valid)
    })
  })
}
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>

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
