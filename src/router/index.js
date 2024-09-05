import { createRouter, createWebHistory } from 'vue-router'
import LogIn from '@/views/login/LogIn.vue'
import SignIn from '@/views/login/SignIn.vue'
import ShoppingTrolley from '@/views/consumer/ShoppingTrolley.vue'
import SetUp from '@/views/shop/SetUp.vue'
import Index from '@/views/Index.vue'
import TakeawayOrder from '@/views/consumer/TakeawayOrder.vue'
import db from '@/utils/localstorage'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import TakeawayService from '@/views/common/TakeawayService.vue'
import ConsumerInfo from '@/views/consumer/info/ConsumerInfo.vue'
import Info from '@/views/consumer/info/Info.vue'
import Password from '@/views/consumer/info/Password.vue'
import Setting from '@/views/consumer/info/Setting.vue'
import History from '@/views/consumer/info/History.vue'
import ShopInfo from '@/views/shop/info/ShopInfo.vue'
import MenuEdit from '@/views/shop/menu_edit/MenuEdit.vue'
import SInfo from '@/views/shop/info/SInfo.vue'
import SHistory from '@/views/shop/info/SHistory.vue'
import SContact from '@/views/shop/info/SContact.vue'
import SPassword from '@/views/shop/info/SPassword.vue'
import SSetting from '@/views/shop/info/SSetting.vue'
import Contact from '@/views/consumer/info/Contact.vue'
import ConsumerSignIn from '@/views/login/ConsumerSignIn.vue'
import ShopSignIn from '@/views/login/ShopSignIn.vue'
import Verify from '@/views/login/Verify.vue'
import ShopDetail from '@/views/consumer/shop_view/ShopDetail.vue'
import OrderManager from '@/views/shop/service/OrderManager.vue'
import PasswordReset from '@/views/login/PasswordReset.vue'
import { ElMessage } from 'element-plus'

// nprogress样式文件
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})

//路由规则
const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/index',
    component: Index
  },
  {
    path: '/takeawayorder',
    component: TakeawayOrder
  },
  {
    path: '/login',
    component: LogIn
  },
  // 更新密码
  {
    path: '/password_reset/:role',
    component: PasswordReset
  },
  {
    path: '/verify',
    component: Verify
  },
  {
    path: '/signin',
    component: SignIn
  },
  {
    path: '/signin/consumer',
    component: ConsumerSignIn
  },
  {
    path: '/signin/shop',
    component: ShopSignIn
  },
  {
    path: '/shoppingtrolley',
    component: ShoppingTrolley
  },
  {
    path: '/setup',
    component: SetUp
  },
  {
    path: '/service',
    component: TakeawayService
  },
  {
    path: '/consumerinfo',
    component: ConsumerInfo,
    children: [
      {
        path: '/consumerinfo/',
        redirect: '/consumerinfo/info'
      },
      {
        path: '/consumerinfo/info',
        component: Info
      },
      {
        path: '/consumerinfo/history',
        component: History
      },
      {
        path: '/consumerinfo/password',
        component: Password
      },
      {
        path: '/consumerinfo/setting',
        component: Setting
      },
      {
        path: '/consumerinfo/contact',
        component: Contact
      }
    ]
  },
  {
    path: '/shopinfo',
    component: ShopInfo,
    children: [
      {
        path: '/shopinfo/',
        redirect: '/shopinfo/info'
      },
      {
        path: '/shopinfo/info',
        component: SInfo
      },
      {
        path: '/shopinfo/history',
        component: SHistory
      },
      {
        path: '/shopinfo/contact',
        component: SContact
      },
      {
        path: '/shopinfo/password',
        component: SPassword
      },
      {
        path: '/shopinfo/setting',
        component: SSetting
      }
    ]
  },
  {
    path: '/menuedit',
    component: MenuEdit
  },
  {
    path: '/ordermanager',
    component: OrderManager
  },
  //  用户购买部分
  {
    path: '/shop/:id',
    component: ShopDetail
  }
]

// 白名单
const whiteList = [
  '/index',
  '/login',
  '/verify',
  '/signin',
  '/signin/consumer',
  '/signin/shop',
  '/password_reset/consumer',
  '/password_reset/shop'
]

// 路由
const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// router.beforeEach((to, from, next) => {
//   // 开启进度条
//   NProgress.start()
//   if (whiteList.indexOf(to.path) !== -1) {
//     next()
//   } else {
//     let token = db.get('USER_TOKEN')
//     let user = db.get('USER')
//     if (token.length && user) {
//       next()
//     } else {
//       ElMessage.info('请先登录')
//       // 本来就是登录界面，就不用更改
//       if (from.path === '/login') {
//         // 先结束路由进度
//         NProgress.done()
//         return
//       }
//       next('/login')
//     }
//   }
// })

// router.afterEach(() => {
//   // 关闭进度条
//   NProgress.done()
// })

export default router
