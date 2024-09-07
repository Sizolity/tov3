<template>
  <div class="top">
    <el-row id="nav-fixed" :class="{ nav_fixed: isFixed }">
      <el-col :span="2" class="logo"></el-col>
      <el-col :span="2"><div class="grid-content" @click="router.push('/index')">首页</div></el-col>
      <!--      左侧-->
      <template v-if="userRole === 'consumer'">
        <el-col :span="2">
          <div class="grid-content" @click="router.push('/service')">外卖服务</div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content" @click="router.push('/shoppingtrolley')">订单管理</div>
        </el-col>
      </template>
      <template v-else-if="userRole === 'shop'">
        <el-col :span="2"
          ><div class="grid-content" @click="router.push('/menuedit')">菜单管理</div></el-col
        >
        <el-col :span="2"
          ><div class="grid-content" @click="router.push('/service')">评论管理</div></el-col
        >
        <el-col :span="2"
          ><div class="grid-content" @click="router.push('/ordermanager')">订单管理</div></el-col
        >
      </template>
      <template v-else>
        <el-col :span="2"></el-col>
      </template>
      <!--      空白-->
      <el-col :span="emptySpan()"></el-col>
      <!--      右侧， 分别为用户和商家 和 不登录状态-->
      <template v-if="userRole === 'consumer'">
        <el-col :span="2">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-s-custom"></i>
              {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-medal-1"
                class="dropdown"
                @click.native="router.push('/consumerinfo')"
                >{{ userName }}</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-user"
                class="dropdown"
                @click.native="router.push('/consumerinfo/info')"
                divided
                >个人资料</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-s-order"
                class="dropdown"
                @click.native="router.push('/consumerinfo/history')"
                >历史订单</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-bell"
                class="dropdown"
                @click.native="router.push('/consumerinfo/contact')"
                >店家互动</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-setting"
                class="dropdown"
                @click.native="router.push('/consumerinfo/setting')"
                >账号设置</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-circle-close"
                class="dropdown"
                @click.native="logout"
                divided
                >退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </template>
      <template v-else-if="userRole === 'shop'">
        <el-col :span="2">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-s-shop"></i>
              {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-medal-1"
                class="dropdown"
                @click.native="router.push('/shopinfo')"
                >{{ userName }}</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-platform-eleme"
                class="dropdown"
                @click.native="router.push('/shopinfo/info')"
                divided
                >店铺资料</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-s-order"
                class="dropdown"
                @click.native="router.push('/shopinfo/history')"
                >历史订单</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-bell"
                class="dropdown"
                @click.native="router.push('/shopinfo/contact')"
                >顾客互动</el-dropdown-item
              >
              <!--              <el-dropdown-item icon="el-icon-key" class="dropdown" @click.native="router.push('/shopinfo/password')">修改密码</el-dropdown-item>-->
              <el-dropdown-item
                icon="el-icon-setting"
                class="dropdown"
                @click.native="router.push('/shopinfo/setting')"
                >账号设置</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-circle-close"
                class="dropdown"
                @click.native="logout"
                divided
                >退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </template>
      <template v-else>
        <el-col :span="1"
          ><div class="grid-content" @click="router.push('/login')">登录</div></el-col
        >
        <el-col :span="1"
          ><div class="grid-content" @click="router.push('/signin')">注册</div></el-col
        >
      </template>
      <!--el-col :span="2"><div class="grid-content" @click="router.push('/shoppingtrolley')">购物车</div></el-col-->
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'
import { useRouter } from 'vue-router'

//global
const db = inject('$db')
const router = useRouter()

//局部变量
const activeIndex = ref('1')
const isFixed = ref(false)
const offsetTop = ref(0)

// 设置bar浮动阈值为 #fixedBar 至页面顶部的距离
const setOffsetTop = () => {
  offsetTop.value = document.querySelector('#nav-fixed').offsetTop
}

// 滚动监听  滚动触发的效果写在这里
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
  isFixed.value = scrollTop >= offsetTop.value
}

// 登出
const logout = () => {
  console.log('登出')
  db.value.clear()
  router.push('/index')
  location.reload()
}

// 根据角色返回不同的 span 值
const emptySpan = () => {
  const roles = db.get('ROLES')
  if (roles === '"consumer"') {
    return 10
  } else if (roles === '"shop"') {
    return 7
  } else {
    return 12
  }
}

// 计算用户角色
const userRole = computed(() => {
  const role = db.get('ROLES')
  if (role === '"consumer"') {
    return 'consumer'
  } else if (role === '"shop"') {
    return 'shop'
  } else {
    return 'none'
  }
})

// 计算用户名
const userName = computed(() => {
  const name = db.get('USER')
  return name.substr(1).substr(0, name.length - 2)
})

onMounted(() => {
  setOffsetTop()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.top {
  margin-bottom: 1.25rem;
}
#nav-fixed {
  background: rgb(255, 205, 86);
  border: 0;
  border-radius: 10px;
}
.nav_fixed {
  position: fixed;
  z-index: 2;
  top: 0;
  width: 77.2%;
  margin: 0 auto;
}
.el-row {
  background: rgba(255, 255, 255, 0);
  border-radius: 10px;
  line-height: 2.2rem;
}
.el-col {
  margin: 0.625rem 1.5rem;
}
.el-col div:hover {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0.625rem;
  cursor: pointer;
  transition: all 0.5s;
}
.logo {
  background-image: url('images/orange_logo.png');
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  width: 50px;
  height: 40px;
  background-repeat: no-repeat;
  position: relative;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.grid-content span {
  border: 1px solid;
  border-radius: 50px;
  padding: 5px;
  margin-right: 0.5rem;
}
.dropdown:hover {
  color: #ffcd56;
  border-color: #ffcd56;
  background-color: rgba(255, 205, 86, 0.1);
}

/* .el-menu {
  --el-menu-bg-color: #ffcd56;
}

.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
} */
</style>
