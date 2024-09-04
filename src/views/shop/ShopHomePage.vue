<template>
  <el-container>
    <el-col :span="12" :offset="6">
      <comment :comments="comments" @add="addNewReplay" @remove="removeReply"></comment>
    </el-col>
  </el-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import comment from '@/components/comment.vue'

// 获取当前实例
const { proxy } = getCurrentInstance()

const comments = ref([]) // 使用 ref 定义响应式数组

// 创建新的评论对象的函数
const createComment = (data) => ({
  id: data.id,
  date: data.time,
  ownerId: data.id,
  fromId: data.cid,
  fromName: data.cname,
  fromAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg',
  likeNum: 3,
  content: data.content,
  reply: [],
  stars: data.stars,
  show: false
})

// 创建新的回复对象的函数
const createReply = (replyData, parentComment, isConsumer = false) => ({
  id: String(replyData.coid) + String(isConsumer ? replyData.cid : replyData.sid),
  commentId: parentComment.id,
  fromId: isConsumer ? replyData.cid : replyData.sid,
  fromName: isConsumer ? replyData.cname : `${replyData.sname} (商家)`,
  fromAvatar: isConsumer
    ? 'https://wx4.sinaimg.cn/mw690/69e273f8gy1ft1541dmb7j215o0qv7wh.jpg'
    : 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg',
  toId: parentComment.cid,
  toName: parentComment.cname,
  toAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg',
  content: replyData.content,
  date: replyData.time,
  replyRole: isConsumer ? 'consumer' : 'shop'
})

// 获取历史订单
const fetchOrderHistory = () => {
  proxy
    .$get('/shop/getOrderHistory', {
      SID: proxy.$db.get('USER_ID')
    })
    .then((res) => {
      console.log(res.data)
    })
    .catch((err) => console.log(err))
}

// 获取评论
const fetchComments = () => {
  proxy
    .$get('/commentary/getInfoBySid', {
      Sid: proxy.$db.get('USER_ID')
    })
    .then((res) => {
      let allComments = res.data.data
      for (let i = 0; i < allComments.length; i++) {
        comments.value.push(createComment(allComments[i]))
        fetchReplies(allComments[i].id, i)
      }
    })
    .catch((err) => console.log(err))
}

// 获取回复
const fetchReplies = (commentId, index) => {
  // 商家回复
  proxy
    .$get('/shopReply/getInfoByCoid', { coid: commentId })
    .then((res) => {
      let allShopReply = res.data.data
      allShopReply.forEach((reply) => {
        comments.value[index].reply.push(createReply(reply, comments.value[index]))
      })
      // 用户回复
      fetchConsumerReplies(commentId, index)
    })
    .catch((err) => console.log(err))
}

// 获取用户回复
const fetchConsumerReplies = (commentId, index) => {
  proxy
    .$get('/consumerReply/getInfoByCoid', { coid: commentId })
    .then((res) => {
      let allConsumerReply = res.data.data
      allConsumerReply.forEach((reply) => {
        comments.value[index].reply.push(createReply(reply, comments.value[index], true))
      })
    })
    .catch((err) => console.log(err))
}

// 添加新回复
const addNewReplay = (idx, comment) => {
  comments.value[idx].reply.unshift(comment)
}

// 删除回复
const removeReply = (idx, ridx) => {
  comments.value[idx].reply.splice(ridx, 1)
}

// 生命周期钩子
onMounted(() => {
  fetchOrderHistory()
  fetchComments()
})
</script>

<style scoped></style>
