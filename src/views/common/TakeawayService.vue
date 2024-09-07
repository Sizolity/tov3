<template>
  <div>
    <component :is="componentName"></component>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import consumerHomePage from '@/views/consumer/ConsumerHomePage.vue'
import shopHomePage from '@/views/shop/ShopHomePage.vue'

const $db = inject('$db')
const roles = $db.get('ROLES')

const componentName = computed(() => {
  return roles === '"shop"' ? shopHomePage : consumerHomePage
})
</script>

<style scoped></style>
