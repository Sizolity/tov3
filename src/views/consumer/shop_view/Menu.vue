<template>
  <div>
    <div>
      <!--        顶部工具-->
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ sortType }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!--        <el-dropdown-item>默认</el-dropdown-item>-->
          <el-dropdown-item @click.native="sortByPrice">按价格</el-dropdown-item>
          <el-dropdown-item @click.native="sortByCnt">按热门</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-radio-group v-model="radio" fill="#FFCD56">
        <el-radio-button
          value="全部"
          class="radio"
          @click.native="dataInPage = goodsList"
        ></el-radio-button>
        <el-radio-button
          value="主食"
          @click.native="dataInPage = goodsList.filter((data) => '主食' === data.type)"
        ></el-radio-button>
        <el-radio-button
          value="小吃"
          @click.native="dataInPage = goodsList.filter((data) => '小吃' === data.type)"
        ></el-radio-button>
        <el-radio-button
          value="饮料"
          @click.native="dataInPage = goodsList.filter((data) => '饮料' === data.type)"
        ></el-radio-button>
      </el-radio-group>
      <el-autocomplete
        class="input inline-input"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        @select="handleSelect"
        placeholder="搜索商品名称"
        v-model="input"
        style="width: 300px"
      >
      </el-autocomplete>
      <el-button icon="el-icon-search" @click="searchGoods" class="search" size="small"
        >搜索</el-button
      >
      <!--  购物车  -->
      <el-popover placement="bottom" width="400" trigger="manual" v-model="visible">
        <!-- TODO -->
        <CartDialog
          v-if="visible"
          :sid="SID"
          ref="cart"
          @Buy="sonBuy"
          @Add="sonAddCnt"
          @Sub="sonSubCnt"
          @Delete="sonDelete"
          @Change="sonChange"
        >
        </CartDialog>
        <el-button
          slot="reference"
          size="small"
          icon="el-icon-shopping-cart-full"
          type="success"
          @click="visible = !visible"
        >
          查看购物车
        </el-button>
      </el-popover>
    </div>

    <!--      main-->
    <el-col
      :span="5"
      v-for="(o, index) in dataInPage"
      :key="o.id"
      :offset="index > 0 ? 3 : 0"
      class="box-card"
    >
      <el-card :body-style="{ padding: '0px' }" shadow="hover" class="card">
        <el-container>
          <el-aside width="180px">
            <div class="header-style">
              <img
                v-if="o.pictureUrl === '' || o.pictureUrl === null"
                :src="require('@/assets/img/default.jpg')"
                class="food-image"
              />
              <img v-else :src="o.pictureUrl" class="food-image" />
            </div>
          </el-aside>
          <el-container>
            <el-header>
              <span style="float: left; padding: 18px 0">{{ o.name }}</span>
              <el-button
                style="float: right; padding: 20px 0"
                type="text"
                @click="showBuyCard(o.id, index)"
                >选规格</el-button
              >
            </el-header>
            <el-main>
              <span style="float: left; color: #ffcd56; font-weight: bolder">￥{{ o.price }}</span>
              <el-button
                type="danger"
                v-show="getMapCnt(o.id) > 0"
                @click="showBuyCard(o.id, index)"
                round
                size="mini"
                style="float: right"
                >{{ getMapCnt(o.id) }}</el-button
              >
            </el-main>
            <el-footer></el-footer>
          </el-container>
        </el-container>
      </el-card>
    </el-col>

    <!--      购物栏      -->
    <el-dialog :visible.sync="dialogFormVisible" center>
      <!--商品信息-->
      <GoodsCard :value="goodsList[nowEditIndex]"></GoodsCard>
      <el-divider></el-divider>
      <!--你的购物车-->

      <!--底部操作-->
      <div slot="footer" class="dialog-footer">
        <!--    选择数量为零或不为零    -->
        <el-button
          size="mini"
          v-if="selectedNum === 0"
          type="warning"
          @click="addToCart(goodsList[nowEditIndex].id)"
          >+加入购物车</el-button
        >
        <template v-else>
          <el-button
            type="danger"
            icon="el-icon-minus"
            @click="subCnt(goodsList[nowEditIndex].id)"
            circle
            size="mini"
          ></el-button>
          <el-tag type="info" style="width: 100px">{{ selectedNum }}</el-tag>
          <el-button
            type="success"
            icon="el-icon-plus"
            @click="addCnt(goodsList[nowEditIndex].id)"
            circle
            size="mini"
            style="background-color: #ebb563; border-color: #ebb563"
          ></el-button>
          <el-button
            type="primary"
            v-show="selectedNum > 0"
            @click="submit"
            size="mini"
            class="dia-btn"
            >确定</el-button
          >
          <el-button
            type="primary"
            v-show="selectedNum > 0"
            @click="buy(goodsList[nowEditIndex].id, new Date().Format('yyyy-MM-dd hh:mm:ss'))"
            size="mini"
            class="dia-btn"
            >直接购买</el-button
          >
          <el-button size="mini" style="float: right" type="success" @click="lookCart"
            ><i class="el-icon-shopping-cart-1"> 购物车</i></el-button
          >
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
//todo 仔细检查一下
import { ref, reactive, watch, onMounted, inject } from 'vue'
import GoodsCard from '/src/components/card/GoodsCard.vue'
import CartDialog from '/src/components/CartDialog.vue'
import { ElMessage } from 'element-plus'

//global
const $get = inject('$get')
const $set = inject('$set')
const $db = inject('$db')

const props = defineProps(['sid'])
const SID = ref(1)

// 对话框\
const formLabelWidth = '70px'
const visible = ref(false)
const dialogFormVisible = ref(false)
const nowEditIndex = ref(0)
const selectedNum = ref(0)
const selectedNumMap = reactive({})

// 输入框
const radio = ref('全部')
const input = ref('')

// 数据
const sortType = ref('默认')
const dataInPage = ref([])
const goodsList = ref([
  {
    buyCount: 331,
    desc: '好康的，也是好吃的',
    id: 3,
    name: '炒面',
    value: '炒面',
    pictureUrl: 'http://localhost:8080/takeout/upload/201907011702352.jpg',
    praise: 0,
    price: 200,
    sid: 1,
    stock: 1,
    type: '主食'
  }
])

// 组件挂载
onMounted(() => {
  SID.value = props.sid
  refreshPage()
})

// 监听SID变化
watch(
  () => props.sid,
  (newSid) => {
    SID.value = newSid
    refreshPage()
  }
)

// 刷新页面
const refreshPage = () => {
  // 获取购物车信息
  $get('/consumer/getShoppingCartByCid', {
    CID: $db.get('USER_ID')
  })
    .then((res) => {
      const data = res.data.data
      data.forEach((item) => {
        selectedNumMap[item.gid] = item.num // 映射
      })
    })
    .catch((err) => console.log(err))

  // 获取商品信息
  $get('/shop/getAllGoodsBySid', {
    SID: SID.value
  })
    .then((res) => {
      goodsList.value = res.data.data
      goodsList.value.forEach((item) => {
        item.value = item.name // 初始化
      })
      dataInPage.value = goodsList.value
      radio.value = '全部'
    })
    .catch((err) => console.log(err))
}

// # 展示购买卡片
const showBuyCard = (GID) => {
  nowEditIndex.value = goodsList.value.findIndex((item) => item.id === GID)
  if (nowEditIndex.value === -1) {
    ElMessage({ type: 'info', message: '真奇怪，出错了.' })
    return
  }

  // 获取购物车中的商品数量
  $get('/consumer/getShoppingCartByCid', {
    CID: $db.get('USER_ID')
  })
    .then((res) => {
      const data = res.data.data
      const item = data.find((i) => i.gid === GID)
      selectedNum.value = item ? item.num : 0
      selectedNumMap[GID] = selectedNum.value
    })
    .catch((err) => console.log(err))

  // 显示对话框
  dialogFormVisible.value = true
}

// 确认购买
const submit = () => {
  dialogFormVisible.value = false
}

// 添加到购物车
const addToCart = (GID) => {
  if (goodsList[nowEditIndex].stock === 0) {
    ElMessage({
      type: 'info',
      message: '没库存啦，抱歉!'
    })
    return
  }
  //
  $get('/ShoppingCart/add', {
    CID: $db.get('USER_ID'),
    GID: GID
  })
    .then((res) => {
      // 挑选数量现在为1
      selectedNum = 1
      selectedNumMap[GID] = 1
    })
    .catch((err) => console.log(err))
}

// 计数器
const addCnt = (GID) => {
  // 库存不够了
  if (selectedNum.value >= goodsList.value[nowEditIndex].stock) {
    ElMessage({
      type: 'info',
      message: '库存不够了，不要太贪心哟!'
    })
    return
  }
  $get('/ShoppingCart/numAdd', {
    CID: $db.get('USER_ID'),
    GID: GID
  })
    .then((res) => {
      selectedNum += 1
      selectedNumMap[GID] += 1
    })
    .catch((err) => console.log(err))
}

const subCnt = (GID) => {
  // 为 0 则删掉
  if (selectedNum === 1) {
    $get('/ShoppingCart/deleteItem', {
      CID: $db.get('USER_ID'),
      GID: GID
    })
      .then((res) => {
        selectedNum = 0
        selectedNumMap[GID] = 0
      })
      .catch((err) => console.log(err))
    return
  }
  //
  $get('/ShoppingCart/numSub', {
    CID: $db.get('USER_ID'),
    GID: GID
  })
    .then((res) => {
      selectedNum -= 1
      selectedNumMap[GID] -= 1
    })
    .catch((err) => console.log(err))
}

// 智能提示
const querySearch = (queryString, cb) => {
  let goods = goodsList.value
  let results = queryString ? goods.filter(createFilter(queryString)) : goods
  // 调用 callback 返回建议列表的数据
  cb(results)
}
const createFilter = (queryString) => {
  return (good) => {
    return good.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
  }
}
const handleSelect = (item) => {
  console.log(item)
}

// 排序
const sortByPrice = () => {
  sortType.value = '按价格'
  dataInPage.value = dataInPage.value.sort((x, y) => x.price - y.price)
}
const sortByCnt = () => {
  sortType.value = '按热门'
  dataInPage.value = dataInPage.value.sort((x, y) => x.buyCount - y.buyCount)
}

// 通信
const sonBuy = (items) => {
  // console.log("buy")
  for (let item of items) {
    // 视图操作
    selectedNumMap[item.gid] = 0
  }
  // 关掉购物车
  visible = false
  // FIXME: 广播通知所有商家
  // $buyNotification.send(JSON.stringify({ SID: SID }))
}
const sonAddCnt = (GID) => {
  selectedNumMap[GID] += 1
}
const sonSubCnt = (GID) => {
  selectedNumMap[GID] -= 1
}
const sonChange = (row) => {
  $set(selectedNumMap, row.gid, row.num)
  // console.log(selectedNumMap)
  // console.log("change")
  visible = false
  visible = true
}
const sonDelete = (items) => {
  // console.log("delete")
  for (let item of items) {
    selectedNumMap[item.gid] = 0
  }
  visible = false
  visible = true
}

// sb
const getMapCnt = (gid) => {
  return selectedNumMap[gid]
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.bg-light {
  background: #fdf2d4;
}
.grid-content {
  border-radius: 4px;
  min-height: 80px;
}
.bg-white {
  background: #fdfdfd;
}
.shop-name {
  margin: 10px 20px 10px;
  padding: 0;
  background-color: #fdf2d4;
  font-weight: bold;
  float: left;
}
.header {
  margin: 0;
  padding: 0;
  background-color: #fdf2d4;
  font-weight: bold;
  height: 25px;
  border-radius: 4px;
}
.message {
  height: 75px;
  background-color: #f5f5f5;
}
.shop-image {
  width: 150px;
  height: 80px;
  margin: 10px;
  display: block;
}
.shop-info {
  float: left;
  margin-right: 40px;
}
.food-image {
  width: 150px;
  height: 100px;
  margin: 10px;
  display: block;
}
.box-card {
  width: 400px;
  height: 150px;
  margin: 10px auto 10px 70px;
}
.card {
  height: 130px;
}
.card:hover {
  background-color: #f5f5f5;
}
.input {
  width: 250px;
  margin: auto auto auto 25px;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #ffcd56 !important;
}
.el-pagination.is-background .el-pager li:hover {
  color: #ffcd56 !important;
}
.input {
  border-color: #ffcd56;
}
.search {
  margin: 10px;
}
.search:hover {
  color: #ffcd56;
  border-color: #ffcd56;
  background-color: rgba(255, 205, 86, 0.1);
}
.search:focus {
  color: #ffcd56;
  border-color: #ffcd56;
  background-color: rgba(255, 205, 86, 0.1);
}
.trolley:hover {
  color: #ffcd56;
  border-color: #ffcd56;
  background-color: rgba(255, 205, 86, 0.1);
}
.trolley:focus {
  color: #ffcd56;
  border-color: #ffcd56;
  background-color: rgba(255, 205, 86, 0.1);
}
.dia-btn {
  background-color: #ebb563;
  border-color: #ebb563;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
