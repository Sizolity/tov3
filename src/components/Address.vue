<template>
  <div class="block">
    <el-row>
      <span class="demonstration">配送地址</span>
      <el-cascader
        placeholder="请选择地址"
        v-model="value"
        :options="options"
        @change="handleChange"
        style="width: 300px"
      ></el-cascader>
      <span class="demonstration">详细地址</span>
      <el-input
        placeholder="请输入详细地址"
        v-model="input"
        clearable
        style="width: 300px"
      ></el-input>
      <el-button type="warning" size="small" @click="inputAddress">确 定</el-button>
    </el-row>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, getCurrentInstance, inject } from 'vue'

const selectedOptions = ref([]) //存放默认地址
const options = inject('GLOBAL').options //存放城市数据
const input = ref('')
const value = ref('')

const handleChange = (value) => {
  console.log(value)
}
const inputAddress = () => {
  ElMessage({
    type: 'success',
    message: '地址修改成功!'
  })
}
</script>

<style scoped>
.block {
  float: left;
  margin-left: 250px;
  margin-bottom: 40px;
}
.demonstration {
  margin-left: 40px;
  margin-right: 10px;
}
</style>
