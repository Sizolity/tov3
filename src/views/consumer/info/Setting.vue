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
        <el-form-item label="姓名" prop="name" placeholder="请输入姓名">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio value="男" style="margin-right: 100px"></el-radio>
            <el-radio value="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="ruleForm.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="ruleForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="submitForm" class="login-btn">修改</el-button>
          <el-button @click="resetForm" class="reset-btn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { inject, onMounted, ref } from 'vue'

// global
const $db = inject('$db')
const $get = inject('$get')

let oldData = ref({})
let ruleForm = ref({
  name: '',
  options: [
    {
      value: '1',
      label: '男'
    },
    {
      value: '2',
      label: '女'
    }
  ],
  age: '',
  telephone: '',
  email: '',
  address: ''
})
const rules = ref({
  name: [
    { required: true, message: '请输入名字', trigger: 'blur' },
    { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
  ],
  telephone: [{ min: 11, max: 11, message: '长度在必须为 11 位', trigger: 'blur' }]
})

onMounted(() => {
  oldData.value = ruleForm.value
  dataReset()
})

const submitForm = () => {
  ruleForm.value
    .validate()
    .then((res) => {
      // 先询问是否修改
      ElMessageBox.confirm('是否确认修改个人信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          $get('/consumer/editInfo', {
            CID: $db.get('USER_ID'),
            name: ruleForm.value.name,
            sex: ruleForm.value.sex,
            age: ruleForm.value.age,
            telephone: ruleForm.value.telephone,
            email: ruleForm.value.email,
            address: ruleForm.value.address
          })
            .then((res) => {
              $db.save('USER_INFO', res.data.data)
              oldData = JSON.parse($db.get('USER_INFO'))
              dataReset()
              // 修改成功
              ElMessage({
                type: 'success',
                message: '修改成功!',
                center: true
              })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消更改',
            center: true
          })
          dataReset()
        })
    })
    .catch((err) => {
      console.log(err, '校验失败')
    })
}

const resetForm = () => {
  ruleForm.value.resetFields()
  dataReset()
}

const dataReset = () => {
  ruleForm = {
    name: oldData.username,
    sex: oldData.sex,
    age: oldData.age,
    telephone: oldData.telephone,
    email: oldData.email,
    address: oldData.address
  }
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
