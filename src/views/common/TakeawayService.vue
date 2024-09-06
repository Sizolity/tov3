<template>
  <div>
    <component :is="componentName"></component>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import consumerHomePage from '@/views/consumer/ConsumerHomePage.vue'
import shopHomePage from '@/views/shop/ShopHomePage.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const $db = inject('$db')
const roles = $db.get('ROLES')

const componentName = computed((roles) => {
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
//       if ($db.get('ROLES') === '"shop"') {
//         return 'shopHomePage'
//       } else {
//         return 'consumerHomePage'
//       }
//     }
//   }
// }
</script>

<style scoped></style>
