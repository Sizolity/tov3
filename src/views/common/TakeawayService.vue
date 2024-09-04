<template>
  <div>
    <component :is="componentName"></component>
  </div>
</template>

<script>
import consumerHomePage from '../consumer/ConsumerHomePage.vue'
import shopHomePage from '../shop/ShopHomePage.vue'

// 获取当前实例
const { proxy } = getCurrentInstance()

export default {
  name: 'TakeawayService',
  components: {
    consumerHomePage,
    shopHomePage
  },
  computed: {
    componentName() {
      if (proxy.$db.get('ROLES') === '"shop"') {
        return 'shopHomePage'
      } else {
        return 'consumerHomePage'
      }
    }
  }
}
</script>

<style scoped></style>
