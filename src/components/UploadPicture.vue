<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="http://localhost:8080/takeout/img/upload"
      ref="upload"
      name="picture"
      list-type="picture-card"
      :limit="1"
      :file-list="fileList"
      :on-exceed="onExceed"
      :before-upload="beforeUpload"
      :on-preview="handlePreview"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
    >
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'

const props = defineProps(['upUrl'])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref([{ name: '', url: '' }])

// 监听 props 的变化
watch(
  () => props.upUrl,
  (newVal) => {
    fileList.value = newVal ? [{ name: '', url: newVal }] : []
    dialogImageUrl.value = newVal
  }
)

// 文件上传成功的钩子函数
function handleSuccess(res, file) {
  emit('getUrl', res.data)
  dialogImageUrl.value = res.data
  this.$message({
    type: 'info',
    message: '图片上传成功',
    duration: 6000
  })
  if (file.response.success) {
    // 假设 editor 是在父组件中定义的
    this.editor.picture = file.response.message // 将返回的文件储存路径赋值 picture 字段
  }
}

// 删除文件之前的钩子函数
function handleRemove(file, fileList) {
  ElMessage({
    type: 'info',
    message: '已删除原有图片',
    duration: 6000
  })
}

// 点击列表中已上传的文件时的钩子函数
function handlePreview(file) {
  dialogVisible.value = true
}

// 上传的文件个数超出设定时触发的函数
function onExceed(files, fileList) {
  this.$message({
    type: 'info',
    message: '最多只能上传一个图片',
    duration: 6000
  })
}

// 文件上传前的钩子函数
function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg'
  const isGIF = file.type === 'image/gif'
  const isPNG = file.type === 'image/png'
  const isBMP = file.type === 'image/bmp'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isGIF && !isPNG && !isBMP) {
    this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
  }
  if (!isLt2M) {
    this.$message.error('上传图片大小不能超过 2MB!')
  }
  return (isJPG || isBMP || isGIF || isPNG) && isLt2M
}

// 让父组件通知上传 refs?
function submitUpload() {
  this.$refs.upload.submit()
}
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
