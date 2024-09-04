<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="10" :offset="6"><i class="el-icon-user"></i>{{ welcome() }}</el-col>
      </el-row>
    </el-header>

    <el-main style="margin-left: 350px">
      <el-row>
        <el-col :span="4"><el-tag type="warning">店铺姓名</el-tag></el-col>
        <el-col :span="4" effect="plain"
          ><el-tag type="info" effect="plain" style="width: 200px">{{
            user.username
          }}</el-tag></el-col
        >
      </el-row>
      <br />
      <el-row>
        <el-col :span="4"><el-tag type="warning">联系方式</el-tag></el-col>
        <el-col :span="4"
          ><el-tag type="info" effect="plain" style="width: 200px">{{
            user.telephone
          }}</el-tag></el-col
        >
      </el-row>
      <br />
      <el-row>
        <el-col :span="4"><el-tag type="warning">店铺地址</el-tag></el-col>
        <el-col :span="4"
          ><el-tag type="info" effect="plain" style="width: 200px">{{
            user.address
          }}</el-tag></el-col
        >
      </el-row>
      <br />
      <el-row>
        <el-col :span="4"><el-tag type="warning">店主姓名</el-tag></el-col>
        <el-col :span="4"
          ><el-tag type="info" effect="plain" style="width: 200px">{{
            user.managerName
          }}</el-tag></el-col
        >
      </el-row>
      <br />
      <el-row>
        <el-col :span="4"><el-tag type="warning">店主邮箱</el-tag></el-col>
        <el-col :span="4"
          ><el-tag type="info" effect="plain" style="width: 200px">{{
            user.managerEmail
          }}</el-tag></el-col
        >
      </el-row>
      <br />
      <el-row>
        <el-col :span="4"><el-tag type="warning">评分</el-tag></el-col>
        <el-col :span="4"
          ><el-tag type="info" effect="plain" style="width: 200px">{{ user.score }}</el-tag></el-col
        >
      </el-row>
      <br />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import util from '@/utils/util'
import { useRouter } from 'vue-router'

// 获取当前实例
const { proxy } = getCurrentInstance()

// 响应式用户数据
const user = ref({
  name: '',
  telephone: '',
  address: '',
  managerName: '',
  managerEmail: '',
  pictureUrl: '',
  score: 0
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await proxy.$get('/shop/getInfoBySid', {
      SID: proxy.$db.get('USER_ID')
    })
    user.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

// 欢迎信息
const welcome = () => {
  return util.welcome(proxy.$db.get('USER'))
}

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>

<style scoped></style>
