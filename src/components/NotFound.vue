<template>
  <div>{{ text }}</div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['content'])
const text = props.content
</script>

<style scoped></style>
