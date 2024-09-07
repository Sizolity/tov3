<template>
  <div>
    <el-container>
      <el-aside width="160px">
        <div
          class="friendListDiv"
          v-for="u in filterList"
          @click="toggleFriend(u)"
          :class="{ currentChatFriend: uName(u) === nowOther }"
        >
          <!--   聊天人员       -->
          <el-badge :is-dot="false">{{ uName(u) }}</el-badge>
        </div>
        <div style="background-color: #ffcd56; height: 1px; width: 160px" />
      </el-aside>
      <el-main style="padding-top: 0px; padding-bottom: 0px">
        <div class="chatDiv" ref="chatDiv" id="chatDiv">
          <p v-show="true">
            与
            <el-tag type="warning" size="small" style="margin-left: 5px; margin-right: 5px">
              <el-link
                v-if="!isShop()"
                @click="router.push(`/shop/{nowContactList[0].sid}`)"
                type="primary"
              >
                {{ nowContactList[0].sname }}
              </el-link>
              <div v-else>{{ nowContactList[0].cname }}</div>
            </el-tag>
            聊天中
          </p>
          <template v-for="message in nowContactList">
            <!--发送来的消息-->
            <div
              style="
                display: flex;
                justify-content: flex-start;
                align-items: center;
                box-sizing: border-box;
              "
              v-if="isFrom(message)"
            >
              <div
                style="
                  display: inline-flex;
                  border-style: solid;
                  border-width: 1px;
                  border-color: #ffcd56;
                  border-radius: 5px;
                  padding: 5px 8px 5px 8px;
                "
              >
                {{ message.content }}
              </div>
            </div>
            <!--发出去的消息-->
            <div
              v-else
              style="
                display: flex;
                justify-content: flex-end;
                align-items: center;
                box-sizing: border-box;
              "
            >
              <div
                style="
                  display: inline-flex;
                  border-style: solid;
                  border-width: 1px;
                  border-color: #ffcd56;
                  border-radius: 5px;
                  padding: 5px 8px 5px 8px;
                  margin-right: 3px;
                  background-color: #9eea6a;
                "
              >
                {{ message.content }}
              </div>
            </div>
          </template>
        </div>
        <div style="text-align: left; margin-top: 10px">
          <el-input
            v-model="msg"
            placeholder="请输入内容"
            size="mini"
            style="width: 600px"
            type="textarea"
            autosize
          ></el-input>
          <el-button :disabled="false" size="small" type="primary" class="sendBtn" @click="sendMsg"
            ><i class="fa fa-send" style="margin-right: 15px"></i>发送
          </el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import util from '@/utils/util'
import { ElMessage } from 'element-plus'

const router = useRouter()
const props = defineProps(['other'])

const $db = inject('$db')
const $get = inject('$get')

// 响应式数据定义
const contactList = ref([])
const filterList = ref([])
const msg = ref('')
const nowContactList = ref([
  {
    cid: 20,
    cname: '',
    content: '请选择聊天对象',
    sid: 1,
    sname: '无人',
    state: '1',
    time: '2019-06-24 12:33:17'
  }
])
const nowOther = ref('')
const nowOtherId = ref(1)

// Created 钩子
onMounted(() => {
  if (typeof props.other === 'undefined') {
    let url = '',
      otherId

    if ($db.get('ROLES') === '"shop"') {
      url = '/contact/getInfoBySid'
      otherId = 'cid'
    } else {
      url = '/contact/getInfoByCid'
      otherId = 'sid'
    }

    $get(url, {
      uid: $db.get('USER_ID')
    })
      .then((res) => {
        contactList.value = res.data.data
        filterList.value = util.formatList(contactList.value, otherId)
        nowContactList.value = filterList.value[0]
        nowOther.value = uName(nowContactList.value)
        nowOtherId.value = isShop() ? nowContactList.value[0].cid : nowContactList.value[0].sid
      })
      .catch((err) => console.log(err))
  } else {
    let params
    if ($db.get('ROLES') === '"shop"') {
      params = {
        sid: $db.get('USER_ID'),
        cid: props.other
      }
    } else {
      params = {
        sid: props.other,
        cid: $db.get('USER_ID')
      }
    }

    $get('/contact/getInfoBySidCid', params)
      .then((res) => {
        contactList.value = res.data.data
        filterList.value = [contactList.value]
        nowContactList.value = filterList.value[0]
        nowOther.value = uName(nowContactList.value)
        nowOtherId.value = isShop() ? nowContactList.value[0].cid : nowContactList.value[0].sid
      })
      .catch((err) => console.log(err))
  }

  // // 设置 websocket
  //todo ? websocket 的使用
  // $websocket.onmessage = (res) => {
  //   // TODO: 判断是否属于自己的聊天
  //   const data = JSON.parse(res.data)
  //   if (isShop()) {
  //     if (data.state === '1') return
  //   } else {
  //     if (data.state === '0') return
  //   }
  //   for (let i = 0, len = filterList.value.length; i < len; i++) {
  //     if (
  //       String(filterList.value[i][0].sid) === String(data.sid) &&
  //       String(filterList.value[i][0].cid) === String(data.cid)
  //     ) {
  //       filterList.value[i].push(data)
  //     }
  //   }
  // }
})

// 辅助函数
function isShop() {
  return $db.get('ROLES') === '"shop"'
}

function uName(u) {
  return $db.get('ROLES') === '"shop"' ? u[0].cname : u[0].sname
}

// 发送消息
function sendMsg() {
  const date = new Date().toLocaleString() // 使用 toLocaleString 处理时间格式
  let params
  if (isShop()) {
    params = {
      cid: nowOtherId.value,
      sid: $db.get('USER_ID'),
      ctime: date,
      state: '1',
      content: msg.value
    }
  } else {
    params = {
      cid: $db.get('USER_ID'),
      sid: nowOtherId.value,
      ctime: date,
      state: '0',
      content: msg.value
    }
  }

  $get('/contact/add', params)
    .then((res) => {
      ElMessage({
        message: '发送成功',
        type: 'info'
      })
      msg.value = ''
      nowContactList.value.push(params)
      // $websocket.send(JSON.stringify(params))
    })
    .catch((err) => console.log(err))
}

function toggleFriend(otherUser) {
  nowContactList.value = otherUser
  nowOther.value = uName(otherUser)
  nowOtherId.value = isShop() ? nowContactList.value[0].cid : nowContactList.value[0].sid
}
</script>

<style scoped>
.userfaceImg {
  width: 37px;
  height: 37px;
  border-radius: 30px;
  margin-right: 10px;
}
.friendListDiv {
  display: flex;
  justify-content: flex-start;
  padding-left: 20px;
  box-sizing: border-box;
  align-items: center;
  width: 160px;
  height: 40px;
  border-color: #ffcd56;
  border-left-style: solid;
  border-top-style: solid;
  border-right-style: solid;
  border-width: 1px;
  cursor: pointer;
}
.chatDiv {
  border-color: #ffcd56;
  border-style: solid;
  border-radius: 5px;
  border-width: 1px;
  box-sizing: border-box;
  width: 700px;
  height: 450px;
  overflow-y: auto;
  padding-bottom: 50px;
}
.sendBtn {
  padding-left: 25px;
  padding-right: 25px;
}
.currentChatFriend {
  background-color: #ffcd56;
}
</style>
