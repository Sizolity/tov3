<template>
  <comment :comments="comments" @add="addNewReplay" @remove="removeReply"></comment>
</template>

<script setup>
import { ref, watch, onMounted, inject } from 'vue'
import comment from '/src/components/comment.vue'

const props = defineProps(['sid'])
const comments = ref([])
const SID = ref('')

const $get = inject('$get')

onMounted(() => {
  SID.value = props.sid
  refreshPage()
})

watch(
  () => props.sid,
  (newSid) => {
    SID.value = newSid
    refreshPage()
  }
)

const refreshPage = () => {
  comments.value = []

  // 1. 先获取评论
  $get('/commentary/getInfoBySid', { Sid: SID.value })
    .then((res) => {
      let allComments = res.data.data
      allComments.forEach((comment) => {
        let newComment = {
          id: comment.id,
          date: comment.time,
          ownerId: comment.id,
          fromId: comment.cid,
          fromName: comment.cname,
          fromAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg',
          likeNum: 3,
          content: comment.content,
          reply: [],
          stars: comment.stars,
          show: false
        }
        comments.value.push(newComment)

        // 2. 获取回复
        getReplies(comment.id, newComment.id)
      })
    })
    .catch((err) => console.log(err))
}

// 获取回复的函数
const getReplies = (nowCoId, parentId) => {
  // 2.1 商家回复
  $get('/shopReply/getInfoByCoid', { coid: nowCoId })
    .then((res) => {
      let allShopReply = res.data.data
      allShopReply.forEach((reply) => {
        comments.value.forEach((comment) => {
          if (comment.id === parentId) {
            comment.reply.push({
              id: `${reply.coid}${reply.sid}`,
              commentId: parentId,
              fromId: reply.sid,
              fromName: `${reply.sname} (商家)`,
              fromAvatar: 'https://wx4.sinaimg.cn/mw690/69e273f8gy1ft1541dmb7j215o0qv7wh.jpg',
              toId: comment.cid,
              toName: comment.cname,
              toAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg',
              content: reply.content,
              date: reply.time,
              replyRole: 'shop'
            })
          }
        })
      })
      getConsumerReplies(nowCoId, parentId)
    })
    .catch((err) => console.log(err))
}

// 获取消费者回复的函数
const getConsumerReplies = (nowCoId, parentId) => {
  $get('/consumerReply/getInfoByCoid', { coid: nowCoId })
    .then((res) => {
      let allConsumerReply = res.data.data
      allConsumerReply.forEach((reply) => {
        comments.value.forEach((comment) => {
          if (comment.id === parentId) {
            comment.reply.push({
              id: `${reply.coid}${reply.cid}`,
              commentId: parentId,
              fromId: reply.cid,
              fromName: reply.cname,
              fromAvatar: 'https://wx4.sinaimg.cn/mw690/69e273f8gy1ft1541dmb7j215o0qv7wh.jpg',
              toId: comment.cid,
              toName: comment.cname,
              toAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg',
              content: reply.content,
              date: reply.time,
              replyRole: 'consumer'
            })
          }
        })
      })
    })
    .catch((err) => console.log(err))
}

const addNewReplay = (idx, newReply) => {
  comments.value[idx].reply.unshift(newReply)
}

const removeReply = (idx, ridx) => {
  comments.value[idx].reply.splice(ridx, 1)
}
</script>

<style scoped></style>
