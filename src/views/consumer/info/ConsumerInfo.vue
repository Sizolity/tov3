<template>
  <el-container style="height: 600px; border: 1px solid #eee">
    <el-aside>
      <el-row class="tac">
        <el-col>
          <h5>个人信息</h5>
          <el-menu
            :default-active="nowPageIndex"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item index="1" class="title" @click="$router.push('/consumerinfo/info')">
              <i class="el-icon-user"></i>
              <span slot="title">个人资料</span>
            </el-menu-item>
            <el-menu-item index="2" class="title" @click="$router.push('/consumerinfo/history')">
              <i class="el-icon-s-order"></i>
              <span slot="title">历史订单</span>
            </el-menu-item>
            <el-menu-item index="3" class="title" @click="$router.push('/consumerinfo/contact')">
              <i class="el-icon-bell"></i>
              <span slot="title">店家互动</span>
            </el-menu-item>
            <el-menu-item index="4" class="title" @click="$router.push('/consumerinfo/password')">
              <i class="el-icon-key"></i>
              <span slot="title">修改密码</span>
            </el-menu-item>
            <el-menu-item index="5" class="title" @click="$router.push('/consumerinfo/setting')">
              <i class="el-icon-setting"></i>
              <span slot="title">账号设置</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>

    <el-main>
      <!--      <component :is="componentName"></component>-->
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Method to handle opening
const handleOpen = (key) => {
  console.log(key)
  // 这里可以添加打开页面的逻辑
}

// Method to handle closing
const handleClose = (key) => {
  console.log(key)
  // 这里可以添加关闭页面的逻辑
}

// Computed property to determine the current page index
const nowPageIndex = computed(() => {
  switch (route.path) {
    case '/consumerinfo/info':
      return '1'
    case '/consumerinfo/history':
      return '2'
    case '/consumerinfo/contact':
      return '3'
    case '/consumerinfo/password':
      return '4'
    case '/consumerinfo/setting':
      return '5'
    default:
      return '1'
  }
})
</script>

<style scoped>
.title:hover {
  color: #ffcd56;
  border-color: #ffcd56;
  background-color: rgba(255, 205, 86, 0.1);
}
.title:focus {
  color: #ffcd56;
  border-color: #ffcd56;
  background-color: rgba(255, 205, 86, 0.1);
}
</style>
