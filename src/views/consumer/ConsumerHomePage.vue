<template>
  <!-- <el-row> -->
  <!-- <userAddress></userAddress> -->
  <!-- </el-row> -->
  <el-container>
    <el-container>
      <!--        顶部工具-->
      <!-- <el-radio-group v-model="radio" fill="#FFCD56"> -->
      <!-- <el-radio-button value="全部" class="radio"></el-radio-button> -->
      <!-- <el-radio-button value="主食"></el-radio-button> -->
      <!-- <el-radio-button value="小吃"></el-radio-button> -->
      <!-- <el-radio-button value="饮料"></el-radio-button> -->
      <!-- </el-radio-group> -->
      <el-input
        placeholder="搜索店铺名称"
        v-model="input"
        class="input"
        clearable
        style="width: 300px"
      ></el-input>
      <el-button icon="el-icon-search" @click="searchShop" class="search"> 搜索 </el-button>
      <el-button size="small" @click="router.push('/shoppingtrolley')" class="trolley">
        订单
      </el-button>
    </el-container>

    <!--      main-->
    <el-container>
      <el-main>
        <el-col
          :span="5"
          v-for="(o, index) in dataInPage"
          :item="o"
          :key="o.sId"
          :offset="index > 0 ? 3 : 0"
          class="box-card"
        >
          <el-card
            :body-style="{ padding: '0px' }"
            shadow="hover"
            @card-message="cardMessage"
            class="card"
          >
            <el-container>
              <el-aside style="width: 180px">
                <div class="header-style">
                  <img
                    src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                    class="image"
                    alt=""
                  />
                </div>
              </el-aside>
              <el-container>
                <el-header>
                  <span style="float: left; padding: 18px 0">{{ o.sName }}</span>
                  <el-button
                    style="float: right; padding: 20px 0"
                    type="primary"
                    @click="router.push(`/shop/${o.sId}`)"
                  >
                    进入店铺
                  </el-button>
                </el-header>
                <el-main>
                  <el-rate v-model="o.score" disabled show-score text-color="#ff9900">
                    {{ o.score }}
                  </el-rate>
                </el-main>
                <el-footer> </el-footer>
              </el-container>
            </el-container>
          </el-card>
        </el-col>
      </el-main>
    </el-container>
  </el-container>
  <!--    分页-->
  <el-pagination background layout="prev, pager, next" :total="Math.ceil(shopList.length / 4)">
  </el-pagination>
</template>

<script setup>
// ?
// import userAddress from '@/components/Address.vue'
import { ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const $get = inject('$get')

//data

const shopList = ref([])
const dataInPage = ref([])
const input = ref('')
const num = ref(1)
const radio = ref('全部')
const tableData = ref([])
let card = ref([])

onMounted(() => {
  $get('/shop/getAllShopInfo')
    .then((res) => {
      console.log(res.data.data)
      shopList.value = res.data.data
      console.log(typeof shopList.value[0].sName)
      dataInPage.value = shopList.value.filter(
        (data) => !input.value || data.sName.toLowerCase().includes(input.value.toLowerCase())
      )
    })
    .catch((err) => console.log(err))
})

// methods
const cardMessage = (val) => {
  card = val
}

const searchShop = () => {
  dataInPage.value = shopList.value.filter(
    (data) => !input.value || data.sName.toLowerCase().includes(input.value.toLowerCase())
  )
}
</script>

<style scoped>
.image {
  width: 150px;
  height: 100px;
  margin: 10px;
  display: block;
}
.box-card {
  width: 400px;
  height: 150px;
  margin: 16px auto 16px 80px;
}
.card {
  height: 130px;
}
.card:hover {
  background-color: #f5f5f5;
  cursor: pointer;
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
</style>
