<template>
  <el-row>
    <el-col :span="4" :offset="4">
      <el-button class="button-new-tag" size="small" @click="addNewMenu">新增菜单</el-button>
    </el-col>

    <!--    main-->
    <el-col :span="14" :offset="5">
      <el-table
        :data="
          goodsList.value.filter(
            (data) => !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品 ID"
                ><span>{{ props.row.id }}</span></el-form-item
              >
              <el-form-item label="商品评价"
                ><span>{{
                  props.row.praise === 0 ? '暂无评价' : props.row.praise
                }}</span></el-form-item
              >
              <el-form-item label="商品名称"
                ><span>{{ props.row.name }}</span></el-form-item
              >
              <el-form-item label="商品价格"
                ><span>{{ props.row.price }}</span></el-form-item
              >
              <el-form-item label="商品库存"
                ><span>{{ props.row.stock }}</span></el-form-item
              >
              <el-form-item label="商品类型"
                ><span>{{
                  props.row.type === null ? '无类型' : props.row.type
                }}</span></el-form-item
              >
              <el-form-item label="商品描述"
                ><span>{{ props.row.desc }}</span></el-form-item
              >
              <!-- 图片 -->
              <el-form-item label="商品图片">
                <div class="block">
                  <!-- 默认 -->
                  <el-image
                    v-if="props.row.pictureUrl === '' || props.row.pictureUrl === null"
                    style="width: 100px; height: 100px"
                    :src="require('@/assets/img/default.jpg')"
                    fit="fill"
                  >
                  </el-image>
                  <!-- 商家添加的 -->
                  <el-image
                    v-else
                    style="width: 100px; height: 100px"
                    :src="props.row.pictureUrl"
                    fit="fill"
                  ></el-image>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="名字" prop="name"></el-table-column>
        <el-table-column label="价格" prop="price" sortable></el-table-column>
        <el-table-column label="库存" prop="stock" sortable></el-table-column>
        <el-table-column
          label="类型"
          prop="type"
          :filter-method="filterHandler"
          :filters="[
            { text: '小吃', value: '小吃' },
            { text: '饮料', value: '饮料' },
            { text: '主食', value: '主食' }
          ]"
        >
        </el-table-column>

        <!--        搜索和编辑-->
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="button-new-tag"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!--      新增和编辑 dialog-->
      <el-dialog
        title="菜单编辑"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
        center
      >
        <el-form :model="form">
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" :label-width="formLabelWidth">
            <el-input v-model="form.price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品库存" :label-width="formLabelWidth">
            <el-input v-model="form.stock" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品类型" :label-width="formLabelWidth">
            <el-select v-model="form.type" placeholder="请选择商品类型">
              <el-option label="小吃" value="小吃"></el-option>
              <el-option label="饮料" value="饮料"></el-option>
              <el-option label="主食" value="主食"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" :label-width="formLabelWidth">
            <el-input v-model="form.desc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品图片" :label-width="formLabelWidth">
            <!-- TODO: 上传图片 -->
            <UploadPicture v-if="dialogFormVisible" :upUrl="form.url" @getUrl="setFormUrl">
            </UploadPicture>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" class="reset-btn">取 消</el-button>
          <el-button type="warning" @click="submitChange" class="login-btn">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import UploadPicture from '@/components/UploadPicture.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// global
const $db = inject('$db')
const $post = inject('$post')
const $get = inject('$get')

// todo prop slot-scope  仔细检查源码实现 和slot-scope 用法

const goodsList = ref([])
const search = ref('')
const dialogFormVisible = ref(false)
const form = ref({
  name: '',
  price: '',
  stock: '',
  type: '',
  desc: '',
  url: ''
})
const formLabelWidth = '70px'
const addOpt = ref(true)
const nowEditGid = ref(null)
const nowEditIndex = ref(null)

// 获取商品列表
const fetchGoodsList = async () => {
  try {
    const res = await $get('/shop/getAllGoodsBySid', {
      SID: $db.get('USER_ID')
    })
    goodsList.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

// 组件创建时获取商品列表
onMounted(() => {
  fetchGoodsList()
})

// 编辑商品
const handleEdit = (index, row) => {
  nowEditIndex.value = index
  nowEditGid.value = row.id
  addOpt.value = false
  form.value = {
    name: row.name,
    price: row.price,
    stock: row.stock,
    type: row.type,
    desc: row.desc,
    url: row.pictureUrl
  }
  dialogFormVisible.value = true
}

// 删除商品
const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm('是否确认删除此菜单?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await $post('/shop/deleteGoodsByGid', {
      GID: row.id
    })
    ElMessage({ type: 'info', message: '删除成功' })
    goodsList.value = goodsList.value.filter((x) => x.id !== row.id)
  } catch {
    ElMessage({ type: 'info', message: '已取消删除' })
  }
}

// 提交表单
const submitChange = async () => {
  dialogFormVisible.value = false
  try {
    if (addOpt.value) {
      // 添加商品
      const res = await $post('/shop/addGoods', {
        SID: Number($db.get('USER_ID')),
        name: String(form.value.name),
        price: Number(form.value.price),
        stock: Number(form.value.stock),
        type: String(form.value.type),
        desc: form.value.desc,
        url: form.value.url
      })
      goodsList.value.push(res.data.data)
      ElMessage({ type: 'info', message: '已添加商品' })
    } else {
      // 修改商品
      const res = await $post('/shop/updateGoods', {
        GID: nowEditGid.value,
        name: form.value.name,
        price: form.value.price,
        stock: form.value.stock,
        type: form.value.type,
        desc: form.value.desc,
        url: form.value.url
      })
      goodsList.value[nowEditIndex.value] = res.data.data
      ElMessage({ type: 'info', message: '修改成功' })
    }
  } catch (err) {
    ElMessage({ type: 'error', message: '操作失败，请联系管理员' })
  }
}

// 添加新商品
const addNewMenu = () => {
  addOpt.value = true
  form.value = {
    name: '',
    price: '',
    stock: '',
    type: '主食',
    desc: '',
    url: ''
  }
  dialogFormVisible.value = true
}

// 设置上传图片的 URL
const setFormUrl = (url) => {
  form.value.url = url
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
  width: 50%;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.button-new-tag:hover {
  color: #ffcd56;
  border-color: #ffcd56;
  background-color: rgba(255, 205, 86, 0.1);
}
.button-new-tag:focus {
  color: #ffcd56;
  border-color: #ffcd56;
  background-color: rgba(255, 205, 86, 0.1);
}
.login-btn {
  margin: 10px 30px 10px 30px;
}
.login-btn:hover {
  background: rgba(230, 162, 60, 0.7);
}
.reset-btn {
  margin: 10px 30px 10px 30px;
}
.reset-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #000;
}
</style>
