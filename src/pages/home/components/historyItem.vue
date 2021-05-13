<template>
  <div>
    <div
      class="examItem"
      v-for="item in historyData"
      :key="item.idStr"
    >
      <div class="test">
        <img
          class="gift"
          v-if="!!item.paper.iconUrl"
          :src="item.paper.iconUrl"
          @click="showTips"
        >
        <div class="people">{{item.paper.paperMeta.cardCounts||0}}人已估分</div>
        <h3>{{item.name}}</h3>
        <div class="time mt20">活动时间：{{formatDateFn(item.paper.onlineTime)}}-{{formatDateFn(item.paper.offlineTime)}}</div>
        <div
          class="btnWrapper"
          :class="[item.score?'mt90':'']"
        >
          <button
            v-if="item.status===1||item.status===2"
            @click="answerFn(item.idStr)"
            class="btn mt40"
          >继续答题</button>
          <button
            class="btn mt40 disabled"
            v-if="item.status===3"
            @click="goReport(item.idStr)"
          >查看报告</button>
          <div
            class="score"
            v-show="item.score&&item.status===3"
          >{{item.score}}分</div>
        </div>
      </div>
      <!-- <div
        class="lesson"
        v-if="item.courseInfo.rid"
      >
        <div class="leftCon">
          <div class="classNmae ellipsis">{{item.courseInfo.title}}</div>
          <div class="teacher ellipsis mt10">
            主讲人：{{item.courseInfo.teacherName}}
          </div>
        </div>
        <button
          @click="goLive(item.paper.courseId)"
          class="btnPlay"
          v-if="item.courseInfo.isHaveLive"
        >免费看直播</button>
        <div
          v-else
          class="btnPlay over"
        >直播已结束</div>
      </div> -->
    </div>
    <modal
      :showCancel="false"
      confirmText="知道啦"
      v-if="isShow"
      title="参加本次估分可领取精美大礼包，请估分结束后在'成绩统计'页面领取"
      confirmStyle="background:linear-gradient(90deg,rgba(255,228,164,1) 0%,rgba(255,181,39,1) 100%);color:#AB5214"
      @confirmCB="confirmCB"
    ></modal>
  </div>
</template>

<script>
  import modal from '@/components/modal/index'
  import { formatDate } from '@/utils/util'
  import { mapState } from 'vuex'
  export default {
    components: {
      modal
    },
    props: {
      historyData: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        isShow: false
      }
    },
    computed: {
      ...mapState(['loginInfo'])
    },

    methods: {
      // 确定回调
      confirmCB() {
        this.isShow = false
      },
      // 格式化时间
      formatDateFn(val) {
        return formatDate(val)
      },
      // 礼包提示
      showTips() {
        this.isShow = true
      },
      goReport(id) {
        uni.navigateTo({
          url: `/pages/grade/index?id=${id}`
        })
      },
      answerFn(id) {
        uni.navigateTo({
          url: `/pages/examination/index?answerId=${id}`
        })
      },
      goLive(id) {
        uni.navigateTo({
          url: `/pages/course/list?classId=${id}`
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  .mt90 {
    margin-top: 90rpx;
  }
  .examItem {
    width: 710rpx;
    margin: 40rpx auto 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 12rpx 20rpx 0px rgba(54, 19, 17, 0.1);
    border-radius: 20rpx;
    position: relative;
    .gift {
      position: absolute;
      right: 0;
      width: 118rpx;
      height: 118rpx;
      top: 212rpx;
      z-index: 99;
      object-fit: contain;
    }
    .people {
      text-align: right;
      font-size: 26rpx;
      font-weight: 800;
      color: rgba(153, 95, 37, 1);
      line-height: 36rpx;
      width: 224rpx;
      height: 40rpx;
      box-sizing: border-box;
      padding-right: 15rpx;
      background: linear-gradient(270deg, rgba(240, 163, 88, 1) 0%, rgba(255, 224, 201, 1) 100%);
      border-radius: 0px 20rpx 0px 20rpx;
      position: absolute;
      top: 0;
      right: 0;
      text-indent: 20rpx;
    }
    .test {
      background: linear-gradient(134deg, rgba(255, 241, 222, 1) 0%, rgba(255, 210, 183, 1) 100%);
      box-shadow: 0px 2rpx 6rpx 0px rgba(255, 255, 255, 0.5);
      border-radius: 20rpx 20rpx 0px 0px;
      padding: 40rpx 30rpx;
      h3 {
        font-size: 36rpx;
        font-weight: 800;
        color: rgba(153, 68, 37, 1);
        line-height: 60rpx;
        text-align: center;
      }
      .time {
        height: 42rpx;
        font-size: 30rpx;
        font-weight: 800;
        color: rgba(153, 95, 37, 1);
        line-height: 42rpx;
        text-align: center;
      }
      .btnWrapper {
        position: relative;
        .score {
          background: url('http://p.htwx.net/wxTk/scoreBg.png') no-repeat center;
          background-size: 100%;
          width: 196rpx;
          height: 104rpx;
          text-align: center;
          color: #ec6f63;
          font-size: 40rpx;
          line-height: 56rpx;
          padding-top: 6rpx;
          box-sizing: border-box;
          transform: translateX(-50%);
          left: 50%;
          top: -75rpx;
          position: absolute;
        }
      }
      .btn {
        width: 650rpx;
        height: 88rpx;
        background: linear-gradient(90deg, rgba(255, 243, 243, 1) 0%, rgba(255, 243, 210, 1) 100%);
        box-shadow: 0px 4rpx 8rpx 0px rgba(240, 98, 80, 0.2), 0px 2rpx 6rpx 0px rgba(255, 255, 255, 0.5);
        border-radius: 44rpx;
        font-size: 38rpx;
        font-weight: 800;
        color: rgba(153, 68, 37, 1);
        line-height: 88rpx;
        text-align: center;
      }
      .disabled {
        background: rgba(255, 255, 255, 0.3);
        color: rgba(227, 145, 79, 1);
      }
    }
    .lesson {
      height: 148rpx;
      display: flex;
      align-items: center;
      padding-left: 30rpx;
      .classNmae {
        width: 390rpx;
        height: 42rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 42rpx;
      }
      .teacher {
        width: 390rpx;
        height: 36rpx;
        font-size: 26rpx;
        font-weight: 400;
        color: rgba(158, 158, 158, 1);
        line-height: 36rpx;
      }
      .btnPlay {
        background: url('http://p.htwx.net/wxTk/playBtn.png') no-repeat center;
        background-size: 100%;
        width: 240rpx;
        height: 90rpx;
        position: absolute;
        right: -10rpx;
        bottom: 24rpx;
        font-size: 30rpx;
        font-weight: 800;
        color: rgba(153, 95, 37, 1);
        line-height: 80rpx;
        text-indent: 70rpx;
      }
      .over {
        background: url('http://p.htwx.net/wxTk/endBtn.png') no-repeat center;
        background-size: 100%;
        color: #6f788c;
        text-indent: 46rpx;
      }
    }
  }
</style>