<template>
  <div>
    <el-col :span="1">
      <el-tooltip :content="switchValue === '0' ? '按条件检索' : '关闭'" placement="bottom">
        <el-switch v-model="switchValue" active-value="1" inactive-value="0"> </el-switch>
      </el-tooltip>
    </el-col>

    <div v-show="switchValue === '1'">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="ID">
          <el-input v-model="searchForm.id" placeholder="请输入用户id"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="searchForm.sex" placeholder="用户性别">
            <el-option label="不选择" value=""></el-option>
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchConsumers">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="最小年龄">
          <el-input v-model="searchForm.ageBegin" placeholder="请输入用户最小年龄"></el-input>
        </el-form-item>
        <el-form-item label="最大年龄">
          <el-input v-model="searchForm.ageEnd" placeholder="请输入用户最大年龄"></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="searchForm.tel" placeholder="请输入用户电话号码"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="searchForm.address" placeholder="请输入用户地址"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <!--    main-->
    <el-col :span="14" :offset="5">
      <el-tabs v-model="activeName">
        <el-tab-pane label="全部" name="全部">
          <!--        <div>{{hashMap}}</div>-->
          <el-table :data="dataInPage">
            <el-table-column type="expand" border stripe highlight-current-row>
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <!--       FIXME: 多个食物，多张卡片         -->
                  <el-card class="box-card" v-for="card in props.row">
                    <el-form-item slot="header" label="商品 ID: ">
                      <span>{{ card.gid }}</span>
                      <el-button
                        v-if="card.state === '未完成'"
                        type="warning"
                        size="small"
                        style="margin-left: 520px"
                        @click="confirmOrder(card)"
                        >接单</el-button
                      >
                    </el-form-item>
                    <el-container>
                      <el-aside>
                        <!-- 图片 -->
                        <el-form-item>
                          <div>
                            <!-- 默认 -->
                            <el-image
                              v-if="card.picture === '' || card.picture === null"
                              style="width: 100px; height: 100px"
                              :src="require('@/assets/img/default.jpg')"
                              fit="fill"
                            ></el-image>
                            <!-- 商家添加的 -->
                            <el-image
                              v-else
                              style="width: 100px; height: 100px"
                              :src="card.picture"
                              fit="fill"
                            ></el-image>
                          </div>
                        </el-form-item>
                      </el-aside>
                      <el-main>
                        <div>
                          <el-form-item label="商品名称">{{ card.goodsName }}</el-form-item>
                        </div>
                        <div class="price">
                          <el-form-item label="商品单价">￥{{ card.price }}</el-form-item>
                        </div>
                        <div>
                          <el-form-item label="购买数量">{{ card.num }}</el-form-item>
                        </div>
                        <div>
                          <el-form-item label="状态">{{ card.state }}</el-form-item>
                        </div>
                      </el-main>
                    </el-container>
                  </el-card>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="订单时间" prop="time" sortable width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="顾客姓名" prop="consumerName" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.consumerName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单总价" prop="total" sortable width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.total }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.some((x) => x.state === '未完成')"
                  @click="confirmSomeOrder(scope.row)"
                  type="success"
                  size="small"
                  >接单</el-button
                >
                <el-button
                  v-if="!scope.row.some((x) => x.state !== '已完成')"
                  type="info"
                  size="small"
                  disabled
                  >已完成</el-button
                >
                <el-button
                  v-if="!scope.row.some((x) => x.state !== '已取消')"
                  type="info"
                  size="small"
                  disabled
                  >已取消</el-button
                >
                <el-button
                  v-if="
                    !scope.row.some((x) => x.state === '已完成' || x.state === '未完成') &&
                    scope.row.some((x) => x.state === '待评价')
                  "
                  type="info"
                  size="small"
                  disabled
                  >待评价</el-button
                >
              </template>
            </el-table-column>
            <!--   联系       -->
            <el-table-column label="联系" width="150">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="contactTo(scope.row)"
                  round
                  icon="el-icon-chat-dot-round"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!----------------------------------------------------------------------------------------------------------------------->
        <el-tab-pane label="未完成" name="未完成">
          <el-table :data="dataInPage.filter((x) => x.some((y) => y.state === '未完成'))">
            <el-table-column type="expand" border stripe highlight-current-row>
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <!--       FIXME: 多个食物，多张卡片         -->
                  <el-card
                    class="box-card"
                    v-for="card in props.row"
                    v-if="card.state === '未完成'"
                  >
                    <el-form-item slot="header" label="商品 ID: ">
                      <span>{{ card.gid }}</span>
                      <el-button
                        type="warning"
                        size="small"
                        style="margin-left: 520px"
                        @click="confirmOrder(card)"
                        >接单</el-button
                      >
                    </el-form-item>
                    <el-container>
                      <el-aside>
                        <!-- 图片 -->
                        <el-form-item>
                          <div>
                            <!-- 默认 -->
                            <el-image
                              v-if="card.picture === '' || card.picture === null"
                              style="width: 100px; height: 100px"
                              :src="require('@/assets/img/default.jpg')"
                              fit="fill"
                            ></el-image>
                            <!-- 商家添加的 -->
                            <el-image
                              v-else
                              style="width: 100px; height: 100px"
                              :src="card.picture"
                              fit="fill"
                            ></el-image>
                          </div>
                        </el-form-item>
                      </el-aside>
                      <el-main>
                        <div>
                          <el-form-item label="商品名称">{{ card.goodsName }}</el-form-item>
                        </div>
                        <div class="price">
                          <el-form-item label="商品单价">￥{{ card.price }}</el-form-item>
                        </div>
                        <div>
                          <el-form-item label="购买数量">{{ card.num }}</el-form-item>
                        </div>
                      </el-main>
                    </el-container>
                  </el-card>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="订单时间" prop="time" sortable width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="顾客姓名" prop="consumerName" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.consumerName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单总价" prop="total" sortable width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ notFinishPrice(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button @click="confirmSomeOrder(scope.row)" type="success" size="small"
                  >接单</el-button
                >
              </template>
            </el-table-column>
            <!--   联系       -->
            <el-table-column label="联系" width="150">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="contactTo(scope.row)"
                  round
                  icon="el-icon-chat-dot-round"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!----------------------------------------------------------------------------------------------------------------------->
        <el-tab-pane label="待评价" name="待评价">
          <el-table
            :data="
              dataInPage.filter(
                (x) =>
                  !x.some((y) => y.state === '已完成' || y.state === '未完成') &&
                  x.some((y) => y.state === '待评价')
              )
            "
          >
            <el-table-column type="expand" border stripe highlight-current-row>
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <!--       FIXME: 多个食物，多张卡片         -->
                  <el-card class="box-card" v-for="card in props.row">
                    <el-form-item slot="header" label="商品 ID: "
                      ><span>{{ card.gid }}</span></el-form-item
                    >
                    <el-container>
                      <el-aside>
                        <!-- 图片 -->
                        <el-form-item>
                          <div>
                            <!-- 默认 -->
                            <el-image
                              v-if="card.picture === '' || card.picture === null"
                              style="width: 100px; height: 100px"
                              :src="require('@/assets/img/default.jpg')"
                              fit="fill"
                            ></el-image>
                            <!-- 商家添加的 -->
                            <el-image
                              v-else
                              style="width: 100px; height: 100px"
                              :src="card.picture"
                              fit="fill"
                            ></el-image>
                          </div>
                        </el-form-item>
                      </el-aside>
                      <el-main>
                        <div>
                          <el-form-item label="商品名称">{{ card.goodsName }}</el-form-item>
                        </div>
                        <div class="price">
                          <el-form-item label="商品单价">￥{{ card.price }}</el-form-item>
                        </div>
                        <div>
                          <el-form-item label="购买数量">{{ card.num }}</el-form-item>
                        </div>
                        <div>
                          <el-form-item label="状态">{{ card.state }}</el-form-item>
                        </div>
                      </el-main>
                    </el-container>
                  </el-card>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="订单时间" prop="time" sortable width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="顾客姓名" prop="consumerName" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.consumerName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单总价" prop="total" sortable width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.total }}</span>
              </template>
            </el-table-column>
            <!--   联系       -->
            <el-table-column label="联系" width="150">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="contactTo(scope.row)"
                  round
                  icon="el-icon-chat-dot-round"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!----------------------------------------------------------------------------------------------------------------------->

        <el-tab-pane label="已完成" name="已完成">
          <el-table :data="dataInPage.filter((x) => !x.some((y) => y.state !== '已完成'))">
            <el-table-column type="expand" border stripe highlight-current-row>
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <!--       FIXME: 多个食物，多张卡片         -->
                  <el-card class="box-card" v-for="card in props.row">
                    <el-form-item slot="header" label="商品 ID: ">
                      <span>{{ card.gid }}</span>
                    </el-form-item>
                    <el-container>
                      <el-aside>
                        <!-- 图片 -->
                        <el-form-item>
                          <div>
                            <!-- 默认 -->
                            <el-image
                              v-if="card.picture === '' || card.picture === null"
                              style="width: 100px; height: 100px"
                              :src="require('@/assets/img/default.jpg')"
                              fit="fill"
                            ></el-image>
                            <!-- 商家添加的 -->
                            <el-image
                              v-else
                              style="width: 100px; height: 100px"
                              :src="card.picture"
                              fit="fill"
                            ></el-image>
                          </div>
                        </el-form-item>
                      </el-aside>
                      <el-main>
                        <div>
                          <el-form-item label="商品名称">{{ card.goodsName }}</el-form-item>
                        </div>
                        <div class="price">
                          <el-form-item label="商品单价">￥{{ card.price }}</el-form-item>
                        </div>
                        <div>
                          <el-form-item label="购买数量">{{ card.num }}</el-form-item>
                        </div>
                      </el-main>
                    </el-container>
                  </el-card>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="订单时间" prop="time" sortable width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="顾客姓名" prop="consumerName" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.consumerName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单总价" prop="total" sortable width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.total }}</span>
              </template>
            </el-table-column>
            <!--   联系       -->
            <el-table-column label="联系" width="150">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="contactTo(scope.row)"
                  round
                  icon="el-icon-chat-dot-round"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!----------------------------------------------------------------------------------------------------------------------->

        <el-tab-pane label="已取消" name="已取消">
          <el-table :data="dataInPage.filter((x) => !x.some((y) => y.state !== '已取消'))">
            <el-table-column type="expand" border stripe highlight-current-row>
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <!--       FIXME: 多个食物，多张卡片         -->
                  <el-card class="box-card" v-for="card in props.row">
                    <el-form-item slot="header" label="商品 ID: ">
                      <span>{{ card.gid }}</span>
                    </el-form-item>
                    <el-container>
                      <el-aside>
                        <!-- 图片 -->
                        <el-form-item>
                          <div>
                            <!-- 默认 -->
                            <el-image
                              v-if="card.picture === '' || card.picture === null"
                              style="width: 100px; height: 100px"
                              :src="require('@/assets/img/default.jpg')"
                              fit="fill"
                            ></el-image>
                            <!-- 商家添加的 -->
                            <el-image
                              v-else
                              style="width: 100px; height: 100px"
                              :src="card.picture"
                              fit="fill"
                            ></el-image>
                          </div>
                        </el-form-item>
                      </el-aside>
                      <el-main>
                        <div>
                          <el-form-item label="商品名称">{{ card.goodsName }}</el-form-item>
                        </div>
                        <div class="price">
                          <el-form-item label="商品单价">￥{{ card.price }}</el-form-item>
                        </div>
                        <div>
                          <el-form-item label="购买数量">{{ card.num }}</el-form-item>
                        </div>
                      </el-main>
                    </el-container>
                  </el-card>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="订单时间" prop="time" sortable width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="顾客姓名" prop="consumerName" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.consumerName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单总价" prop="total" sortable width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.total }}</span>
              </template>
            </el-table-column>
            <!--   联系       -->
            <el-table-column label="联系" width="150">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="contactTo(scope.row)"
                  round
                  icon="el-icon-chat-dot-round"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!----------------------------------------------------------------------------------------------------------------------->

      <el-dialog title="聊天" :visible.sync="dialogVisible" width="65%">
        <ContactDialog :other="nowContactConsumer" v-if="dialogVisible"></ContactDialog>
      </el-dialog>
    </el-col>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import ContactDialog from '@/components/ContactDialog.vue'
import util from '@/utils/util'
import { ElMessage, ElMessageBox } from 'element-plus'

// global
const $db = inject('$db')
const $get = inject('$get')

const radio = ref('全部')
const id = ref('')
const confirmIndex = ref('')
const activeName = ref('全部')

// 要展开的行，数值的元素是row的key值
const expands = ref([])

// 数据
const orderList = ref([])
const dialogVisible = ref(false)
const nowContactConsumer = ref('')

// 新数据
const formatData = ref([])

// 检索
const searchForm = ref({
  id: '',
  name: '',
  sex: '',
  ageBegin: '',
  ageEnd: '',
  tel: '',
  email: '',
  address: ''
})

const allConsumers = ref([])
const searchConsumerRes = ref([])
const switchValue = ref('0')

// 获取历史订单
const fetchOrderHistory = () => {
  $get('/shop/getOrderHistory', {
    SID: $db.get('USER_ID')
  })
    .then((res) => {
      orderList.value = res.data.data
      formatData.value = util.filterByTimeAndName(orderList.value, 'time', 'consumerName')
    })
    .catch((err) => console.log(err))
}

// 得到所有用户数据
const fetchConsumers = () => {
  $get('/shop/queryAllConsumers').then((res) => {
    allConsumers.value = res.data.data
    searchConsumerRes.value = allConsumers.value.map((x) => x.cId)
  })
}

// 加载数据
onMounted(() => {
  fetchOrderHistory()
  fetchConsumers()
})

function searchConsumers() {
  searchConsumerRes.value = allConsumers.value
    .filter((x) => !searchForm.value.id || Number(searchForm.value.id) === Number(x.cId))
    .filter(
      (x) =>
        !searchForm.value.name ||
        x.cName.toLowerCase().includes(searchForm.value.name.toLowerCase())
    )
    .filter((x) => !searchForm.value.sex || searchForm.value.sex === x.cSex)
    .filter((x) => !searchForm.value.ageBegin || Number(searchForm.value.ageBegin) <= x.cAge)
    .filter((x) => !searchForm.value.ageEnd || Number(searchForm.value.ageEnd) >= x.cAge)
    .filter((x) => !searchForm.value.tel || x.cTel.includes(searchForm.value.tel))
    .filter(
      (x) =>
        !searchForm.value.address ||
        x.cAddress.toLowerCase().includes(searchForm.value.address.toLowerCase())
    )
    .map((x) => x.cId)
}

function confirmOrder(row) {
  ElMessageBox.confirm('是否确认接下此订单?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      $get('/shop/confirmOrder', { OID: row.id }).then(() => {
        const order = orderList.value.find((order) => order.id === row.id)
        if (order) {
          order.state = '待评价'
          ElMessage({ type: 'success', message: '已成功接单' })
        }
      })
    })
    .catch((err) => {
      console.log(err)
      ElMessage({ type: 'info', message: '已取消' })
    })
}

function contactTo(row) {
  nowContactConsumer.value = row.cid
  dialogVisible.value = true
}

const dataInPage = computed(() => {
  return formatData.value.filter((x) => searchConsumerRes.value.includes(x.cid))
})

function tagType(row) {
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
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.price {
  color: #ffcd56;
  font-size: 30px;
}
.box-card {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
