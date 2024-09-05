<template>
  <el-table
    ref="filterTable"
    :data="history_list"
    height="500"
    style="width: 100%"
    :row-class-name="tableRowClassName"
    :span-method="objectSpanMethod"
  >
    <el-table-column sortable prop="time" label="购买时间" width="180"> </el-table-column>
    <el-table-column prop="goodsName" label="商品名字" width="180">
      <template slot-scope="scope">
        <el-popover placement="top-start" width="200" trigger="hover">
          <el-image :src="scope.row.picture"></el-image>
          <el-button slot="reference" style="border: 0px">{{ scope.row.goodsName }}</el-button>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column sortable prop="num" label="购买数量"> </el-table-column>
    <el-table-column prop="shopName" label="商店名字">
      <template slot-scope="scope">
        <el-link @click.native="$router.push(`/shop/${scope.row.sid}`)">{{
          scope.row.shopName
        }}</el-link>
      </template>
    </el-table-column>
    <el-table-column sortable prop="total" label="总价"> </el-table-column>
    <el-table-column
      prop="state"
      label="状态"
      :filters="[
        { text: '已完成', value: '已完成' },
        { text: '已取消', value: '已取消' },
        { text: '未完成', value: '未完成' },
        { text: '待评价', value: '待评价' }
      ]"
      :filter-method="filterTag"
      filter-placement="bottom-end"
    >
      <template slot-scope="scope">
        <el-tag :type="tagType(scope.row)" disable-transitions>{{ scope.row.state }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const history_list = ref([])
const spanArr = ref([])
let pos = ref(1) // 用于追踪合并行的位置
const $get = inject('$get')

onMounted(() => {
  const userId = localStorage.getItem('USER_ID') // 假设从本地存储中获取用户ID
  $get('/consumer/getOrderHistory', { CID: userId })
    .then((res) => {
      history_list.value = res.data.data
      getSpanArr(res.data.data) // 获取合并数据
    })
    .catch((err) => {
      console.log(err)
    })
})

// 方法
const tagType = (row) => {
  switch (row.state) {
    case '已完成':
      return 'primary'
    case '未完成':
      return 'danger'
    case '待评价':
      return 'warning'
    case '已取消':
      return 'info'
    default:
      return ''
  }
}

const getSpanArr = (data) => {
  spanArr.value = []
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      spanArr.value.push(1)
      pos.value = 0
    } else {
      if (data[i].time === data[i - 1].time && data[i].consumerName === data[i - 1].consumerName) {
        spanArr.value[pos.value] += 1
        spanArr.value.push(0)
      } else {
        spanArr.value.push(1)
        pos.value = i
      }
    }
  }
}

const objectSpanMethod = ({ rowIndex }) => {
  if (rowIndex >= spanArr.value.length) return {}
  const _row = spanArr.value[rowIndex]
  return {
    rowspan: _row,
    colspan: _row > 0 ? 1 : 0
  }
}

// 计算属性
const dateSet = computed(() => {
  const res = new Set()
  for (let i = 0; i < history_list.value.length; i++) {
    res.add(history_list.value[i].time)
  }
  return Array.from(res)
})
</script>

<style scoped></style>
