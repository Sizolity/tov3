<template>
  <el-container>
    <el-aside width="200px">
      <el-image :src="good.pictureUrl" fit="fill"></el-image>
    </el-aside>
    <el-main>
      <el-card>
        <div>商品名: {{ good.name }}</div>
        <div>价格: ￥{{ good.price }}</div>
        <div>库存: {{ good.stock }}</div>
        <div>描述: {{ good.desc }}</div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
// buyCount: 331,
//   desc: "好康的，也是好吃的",
//   id: 3,
//   name: "炒面",
//   pictureUrl: "http://localhost:8080/takeout/upload/201907011702352.jpg",
//   praise: 0,
//   price: 200,
//   sid: 1,
//   stock: 1,
//   type: "主食"

import { computed } from 'vue'
import { defineProps } from 'vue'

const props = defineProps['value']
const good = computed(() => props.value) //只读属性 ref
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>
