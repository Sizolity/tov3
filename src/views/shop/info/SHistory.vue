<template>
  <el-table
    :data="dataInTable()"
    style="width: 100%"
    height="500"
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
    <el-table-column prop="consumerName" label="顾客名字"> </el-table-column>
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

    <!--        搜索和编辑-->
    <el-table-column align="right">
      <template slot="header" slot-scope="scope">
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const historyList = ref([])
const search = ref('')
const spanArr = ref([])
let pos = ref(1)

// global
const $get = inject('$get')
const $db = inject('$db')

// todo 未实现的方法 dataInTbale 请仔细检查与源码的不同点

// 获取订单历史记录
const fetchOrderHistory = async () => {
  try {
    const res = await $get('/shop/getOrderHistory', {
      SID: $db.get('USER_ID')
    })
    historyList.value = res.data.data
    getSpanArr(res.data.data)
  } catch (err) {
    console.error(err)
  }
}

// 计算属性-过滤后的数据
const filteredData = computed(() => {
  return historyList.value.filter(
    (data) =>
      !search.value ||
      data.goodsName.toLowerCase().includes(search.value.toLowerCase()) ||
      data.consumerName.toLowerCase().includes(search.value.toLowerCase())
  )
})

// 获取合并数据
const getSpanArr = (data) => {
  console.log(data) // 从后台获取的数据
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
  console.log(spanArr.value)
}

// 合并行数的方法
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0 || columnIndex === 1) {
    // 合并时间和消费者列
    const _row = spanArr.value[rowIndex]
    const _col = _row > 0 ? 1 : 0
    return {
      rowspan: _row,
      colspan: _col
    }
  }
}

// 根据状态返回标签类型
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
  }
}

// 组件创建时获取订单历史
onMounted(() => {
  fetchOrderHistory()
})
</script>

<style scoped></style>
