<!--评论模块-->
<template>
  <div class="container">
    <div class="comment" v-for="(item, idx) in comments">
      <div class="info">
        <img class="avatar" :src="item.fromAvatar" width="36" height="36" />
        <div class="right">
          <div class="name">{{ item.fromName }}</div>
          <div class="date">{{ item.date }}</div>
        </div>
      </div>
      <div class="content">
        <el-rate
          v-model="item.stars"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}"
        >
        </el-rate>
        {{ item.content }}
      </div>
      <div class="control">
        <span class="like" :class="{ active: item.isLike }" @click="likeClick(item)">
          <i class="iconfont icon-like"></i>
          <span class="like-num">{{ item.likeNum > 0 ? item.likeNum + '人赞' : '赞' }}</span>
        </span>
        <span class="comment-reply" @click="changeOpenReply(item)">
          <i class="iconfont icon-comment"></i>
          <span v-if="item.show === false">展开</span>
          <span v-else>折叠</span>
        </span>
        <span class="comment-reply" @click="showCommentInput(idx, item)">
          <i class="iconfont icon-comment"></i>
          <span>回复</span>
        </span>
      </div>
      <div class="reply" v-show="item.show">
        <div class="item" v-for="(reply, ridx) in item.reply">
          <div class="reply-content">
            <span class="from-name">{{ reply.fromName }}</span
            ><span>: </span>
            <!--            <span class="to-name">@{{reply.toName}}</span>-->
            <span> {{ reply.content }}</span>
          </div>
          <div class="reply-bottom">
            <span>{{ reply.date }}</span>
            <span
              class="reply-text"
              v-if="
                String(reply.fromId) === String($db.get('USER_ID')) &&
                String(reply.replyRole) === role
              "
              @click="deleteComment(idx, ridx, item, reply)"
            >
              <i class="iconfont icon-comment"></i>
              <span>删除</span>
            </span>
          </div>
        </div>
        <div class="write-reply" @click="showCommentInput(idx, item)">
          <i class="el-icon-edit"></i>
          <span class="add-comment">添加新回复</span>
        </div>
        <transition name="fade">
          <div class="input-wrapper" v-if="showItemId === item.id">
            <el-input
              class="gray-bg-input"
              v-model="inputComment"
              type="textarea"
              :rows="3"
              autofocus
              placeholder="写下你的回复"
            >
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button class="btn" type="success" round @click="commitComment">确定</el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCommentsStore } from '../utils/'

const commentsStore = useCommentsStore()
const comments = computed(() => commentsStore.comments)
const inputComment = ref('')
const showItemId = ref('')
const replyIndex = ref('')

const likeComment = (item) => {
  commentsStore.likeComment(item)
}

const commitComment = async (showItemId_, inputComment_, replyIndex_) => {
  await commentsStore.commitComment(showItemId_, inputComment_, replyIndex_)
  inputComment.value = '' // 清空输入框
  showItemId.value = '' // 关闭输入框
}

const deleteComment = async (idx, reply) => {
  await commentsStore.deleteComment(idx, reply)
}

const showCommentInput = (idx, item) => {
  inputComment.value = '' // Reset input comment
  replyIndex.value = idx
  showItemId.value = item.id
  item.show = true // 展开输入框
}

const cancel = () => {
  showItemId.value = '' // Hide input
}
</script>

<style scoped lang="scss">
@import '../assets/index';

.container {
  padding: 0 10px;
  box-sizing: border-box;
  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid $border-fourth;
    .info {
      display: flex;
      align-items: center;
      .avatar {
        border-radius: 50%;
      }
      .right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .name {
          font-size: 16px;
          color: $text-main;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .date {
          font-size: 12px;
          color: $text-minor;
        }
      }
    }
    .content {
      text-align: left;
      font-size: 16px;
      color: $text-main;
      line-height: 20px;
      padding: 10px 0;
    }
    .control {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: $text-minor;
      .like {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;
        &.active,
        &:hover {
          color: $color-main;
        }
        .iconfont {
          font-size: 14px;
          margin-right: 5px;
        }
      }
      .comment-reply {
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          color: $text-333;
        }
        .iconfont {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
    .reply {
      margin: 10px 0;
      border-left: 2px solid $border-first;
      .item {
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: 1px dashed $border-third;
        .reply-content {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-main;
          .from-name {
            color: $color-main;
          }
          .to-name {
            color: $color-main;
            margin-left: 5px;
            margin-right: 5px;
          }
        }
        .reply-bottom {
          display: flex;
          align-items: center;
          margin-top: 6px;
          font-size: 12px;
          color: $text-minor;
          .reply-text {
            display: flex;
            align-items: center;
            margin-left: 10px;
            cursor: pointer;
            &:hover {
              color: $text-333;
            }
            .icon-comment {
              margin-right: 5px;
            }
          }
        }
      }
      .write-reply {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: $text-minor;
        padding: 10px;
        cursor: pointer;
        &:hover {
          color: $text-main;
        }
        .el-icon-edit {
          margin-right: 5px;
        }
      }
      .fade-enter-active,
      fade-leave-active {
        transition: opacity 0.5s;
      }
      .fade-enter,
      .fade-leave-to {
        opacity: 0;
      }
      .input-wrapper {
        padding: 10px;
        .gray-bg-input,
        .el-input__inner {
          background-color: #67c23a;
        }
        .btn-control {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 10px;
          .cancel {
            font-size: 16px;
            color: $text-normal;
            margin-right: 20px;
            cursor: pointer;
            &:hover {
              color: $text-333;
            }
          }
          .confirm {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
