<template>
  <div>
    <div
      class="examItem"
      v-for="(item) in scoreList"
      :key="item.id"
    >
      <div class="test">
        <img
          class="gift"
          v-if="!!item.iconUrl"
          :src="item.iconUrl"
          @click="showTips"
        >
        <div class="people">{{item.paperMeta.cardCounts || 0}}人已估分</div>
        <h3>{{item.name}}</h3>
        <div class="time mt20">活动时间：{{formatDateFn(item.onlineTime)}}-{{formatDateFn(item.offlineTime)}}</div>
        <template v-if="item.positionFlag===1&&item.userMeta">
          <div
            class="goJobInfo mt20"
            :class="{gray : item.status !== 1 && item.status !== 2 && item.status !== 5}"
            v-if="item.userMeta.currentPracticeIdStr"
            @click="goJobInfo(item)"
          >{{item.userMeta.schoolName!==''?`${item.userMeta.schoolName}`: item.status === 1 || item.status === 2 || item.status === 5?'去完善信息':''}}{{item.status === 1 || item.status === 2 || item.status === 5?'>>':''}}
          </div>
        </template>
        <div
          class="btnWrapper"
          :class="[item.userMeta.score!==undefined&&item.status===6?'mt90':'']"
        >
          <button
            v-if="item.status===2 || item.status===5"
            @getuserinfo="bindGetUserInfo($event, item)"
            open-type="getUserInfo"
            class="btn mt40"
          >{{item.status===2?'立即答题':'继续答题'}}</button>
          <button
            class="btn mt40 disabled"
            v-if="item.status===1"
          >考试未开始</button>
          <button
            class="btn mt40 disabled"
            v-if="item.status===7"
          >未出报告</button>
          <button
            class="btn mt40 disabled"
            v-if="item.status===3"
          >考试已结束</button>
          <button
            class="btn mt40 disabled"
            v-if="item.status===6&&item.userMeta.practiceIdsStr"
            @click="goReport(item.userMeta.practiceIdsStr[0])"
          >查看报告</button>
          <div
            class="score"
            v-show="item.userMeta.score!==undefined&&item.status===6"
          >{{itemScore(item)}}分</div>
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
          @getuserinfo="bindGetUserInfo($event,3,undefined,undefined,item.courseInfo.rid)"
          open-type="getUserInfo"
          class="btnPlay"
          v-if="item.courseInfo.isHaveLive || !isLogin"
        >免费看直播</button>
        <div
          v-if="item.courseInfo.isHaveLive === 0 && isLogin"
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
  import { createSheet } from '@/utils/api'
  import { mapState, mapMutations } from 'vuex'
  export default {
    components: {
      modal,
    },
    props: {
      scoreList: {
        type: Array,
        default: [],
      },
    },
    data() {
      return {
        isShow: false,
      }
    },
    computed: {
      ...mapState(['loginInfo', 'isLogin']),
    },
    methods: {
      itemScore(item) {
        if (!item.userMeta) return 0
        if (!item.userMeta.score) return 0
        return item.userMeta.score.toFixed(1)
      },
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
          url: `/pages/grade/index?id=${id}`,
        })
      },
      // 跳转职位信息填写页面
      goJobInfo({ id, examType, userMeta, status }) {
        if (status === 1 || status === 2 || status === 5) {
          this.setExamInfo({
            examType,
            id,
          })
          this.setSchoolInfo(userMeta.schoolInfo)
          uni.navigateTo({
            url: '/pages/home/jobInfo?type=exam',
          })
        }
      },
      bindGetUserInfo(e, { id, userMeta, positionFlag, examType }) {
        if (e.detail.userInfo) {
          if (uni.getStorageSync('userInfo') === '') {
            this.setUserInfo(e.detail.userInfo)
            uni.navigateTo({
              url: '/pages/mine/login',
            })
          } else {
            if (this.loginInfo.token) {
              let url
              if (userMeta && userMeta.currentPracticeIdStr) {
                url = `/pages/examination/index?answerId=${userMeta.currentPracticeIdStr}`
              } else {
                if (positionFlag === 1) {
                  createSheet(id).then(res => {
                    console.log(res.data.idStr)
                    this.setExamInfo({
                      examType,
                      id,
                    })
                    this.setSchoolInfo({})
                    uni.navigateTo({
                      url: `/pages/home/jobInfo?type=exam&answerId=${res.data.idStr}`,
                    })
                    return
                  })
                } else {
                  url = `/pages/examination/index?paperId=${id}`
                }
              }
              if (!uni.getStorageSync('navigated') && positionFlag !== 1) {
                uni.navigateTo({
                  url: `/pages/examGuide/index?path=${encodeURIComponent(url)}`,
                })
              } else {
                uni.navigateTo({
                  url: url,
                })
              }
            } else {
              uni.navigateTo({
                url: '/pages/mine/login',
              })
            }
          }
        }
      },
      ...mapMutations(['setUserInfo']),
      ...mapMutations('home', ['setExamInfo', 'setSchoolInfo']),
    },
  }
</script>
<style lang='scss' scoped>
  .mt90 {
    margin-top: 90rpx;
  }
  .examItem {
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
      .goJobInfo {
        font-size: 26rpx;
        color: #ff6d73;
        text-align: center;
        &.gray {
          color: #999;
        }
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
        /* width: 650rpx; */
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