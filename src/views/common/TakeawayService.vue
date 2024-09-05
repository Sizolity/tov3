<template>
  <div>
    <component :is="componentName"></component>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import consumerHomePage from '/src/views/consumer/ConsumerHomePage.vue'
import shopHomePage from '/src/views/shop/ShopHomePage.vue'

const $db = inject('$db')
const componentName = computed(() => {
  const roles = $db.get('ROLES')
  return roles === '"shop"' ? shopHomePage : consumerHomePage
})

// export default {
//   name: 'TakeawayService',
//   components: {
//     consumerHomePage,
//     shopHomePage
//   },
//   computed: {
//     componentName() {
//       if (proxy.$db.get('ROLES') === '"shop"') {
//         return 'shopHomePage'
//       } else {
//         return 'consumerHomePage'
//       }
//     }
//   }
// }
</script>

<style scoped></style>
