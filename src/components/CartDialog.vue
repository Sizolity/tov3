<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="cartList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      max-height="250"
    >
      <!--      <el-table-column-->
      <!--        type="selection"-->
      <!--        width="55"></el-table-column>-->
      <el-table-column prop="goodsName" label="商品" align="center">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="100" trigger="hover">
            <el-image :src="scope.row.picture"></el-image>
            <el-button slot="reference" style="border: 0px">{{ scope.row.goodsName }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="数量" align="center" width="160">
        <template scope="scope">
          <el-input-number
            v-model="scope.row.num"
            size="mini"
            :min="0"
            @change="handleChange(scope.row)"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="价格(￥)" align="center"></el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-popover placement="top" width="160" v-model="visible">
        <p>确认购买吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click.native="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click.native="Buy">确定</el-button>
        </div>
        <el-button slot="reference" icon="el-icon-check" type="primary">购买</el-button>
      </el-popover>
      <el-button @click.native="Clear" type="warning" icon="el-icon-delete">清空</el-button>
      <!--      <el-button @click.native="Clear" type="danger" style="text-align: right">清空购物</el-button>-->
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'

// 引入 props 和 emit 作为定义
const props = defineProps(['sid'])
const emit = defineEmits(['Buy', 'Delete', 'Change'])

// 定义状态
const cartList = ref([])
const visible = ref(false)

// 创建生命周期钩子
onMounted(() => {
  refreshData()
})

// 定义方法
function getCnt(gid) {
  const item = cartList.value.find((item) => item.gid === gid)
  return item ? item.num : 0
}

async function refreshData() {
  // 清空购物车列表
  cartList.value = []

  try {
    const res = await $get('/consumer/getShoppingCartByCidSid', {
      CID: $db.get('USER_ID'),
      SID: props.sid
    })
    // 更新购物车列表
    cartList.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

function toggleSelection(rows) {
  if (rows) {
    rows.forEach((row) => {
      $refs.multipleTable.toggleRowSelection(row)
    })
  } else {
    $refs.multipleTable.clearSelection()
  }
}

function handleSelectionChange(val) {
  // 由于这里的 "multipleSelection" 没有被定义，所以您可以考虑将其添加为 ref 或 reactive
}

// 添加商品到购物车
function Add(GID) {
  // 实现逻辑
}

// 减少商品数量
function Sub(GID) {
  // 实现逻辑
}

// 购买逻辑
async function Buy() {
  if (cartList.value.length === 0) {
    $message({
      type: 'info',
      message: '购物车为空'
    })
    return
  }
  let date = new Date().toISOString().slice(0, 19).replace('T', ' ') // 日期格式化
  for (let item of cartList.value) {
    try {
      await $get('/ShoppingCart/confirmItemWithDate', {
        CID: $db.get('USER_ID'),
        GID: item.gid,
        now: date
      })
    } catch (err) {
      console.error(err)
    }
  }
  ElMessage({
    type: 'success',
    message: '购买成功'
  })
  emit('Buy', cartList.value)
}

// 清空购物车
async function Clear() {
  for (let item of cartList.value) {
    try {
      await $get('/ShoppingCart/deleteItem', {
        CID: $db.get('USER_ID'),
        GID: item.gid
      })
    } catch (err) {
      console.error(err)
    }
  }
  emit('Delete', cartList.value)
  cartList.value = []
}

// 更新数量逻辑
async function handleChange(row) {
  try {
    const res = await $get('/ShoppingCart/numChoose', {
      CID: $db.get('USER_ID'),
      GID: row.gid,
      num: row.num
    })

    row.total = res.data.data.total

    // 更新父组件
    emit('Change', row)

    // 如果数量为0，则删除该项
    if (row.num === 0) {
      await $get('/ShoppingCart/deleteItem', {
        CID: $db.get('USER_ID'),
        GID: row.gid
      })
      cartList.value = cartList.value.filter((item) => item.gid !== row.gid)
      emit('Delete', [row])
    }
  } catch (err) {
    console.error(err)
    // 将数据还原
    const res = await $get('/ShoppingCart/queryById', {
      CID: $db.get('USER_ID'),
      GID: row.gid
    })
    row.num = res.data.data.num
  }
}
</script>

<style scoped></style>
