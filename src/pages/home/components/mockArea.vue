<template>
  <div
    class="area"
    :class="areaShow ? 'show' : 'hide'"
  >
    <div
      class="mask"
      @click="toggleShowFn"
    ></div>
    <div class="areaWrapper">
      <div class="titleWrapper">
        <h3 class="title">{{applyInfo.examType === 1?'报考机构性质':'报考地区'}}</h3>
        <p class="desc mt10">填写信息可获得更精准的模考报告</p>
        <i
          class="iconfont iconbianzu"
          @click="toggleShowFn"
        ></i>
      </div>
      <div class="container">
        <span
          v-for="item in applyInfo.areaList"
          class="item mt30 ellipsis"
          :class="{'act': choosedArea.key === item.key, 'horizontal': applyInfo.examType === 1}"
          @click="select(item)"
          :key="item.key"
        >{{ item.value }}</span>
      </div>
      <button
        class="confirmBtn"
        @click="applyFn"
        :class="!choosedArea.key ? 'disabled' : ''"
      >
        确认报名
      </button>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import { setApply, saveSubscribe } from '@/utils/api'
  import sa from '@/utils/sendors'
  export default {
    props: {
      utmsource: {
        type: String,
        default: '',
      }
    },
    computed: {
      ...mapState(['openid', 'loginInfo', 'choosedSubjectData','qudaoInfo']),
      ...mapState('home', ['areaShow', 'choosedArea', 'applyInfo']),
    },

    methods: {
      toggleShowFn() {
        console.log(this.applyInfo)
        this.toggleShow(false)
        this.setChooseArea({})
      },
      async applyFn() {
        // 点击报名，如果没有选择城市，直接关闭弹窗
        if (!this.choosedArea.key || !this.choosedArea.paperId) {
          this.toggleShow(false)
          return
        }
        let _this = this
        try {
          console.log(this.qudaoInfo)
          wx.requestSubscribeMessage({
            tmplIds: ['JPrPrFd6hhH4Tt1VcNMgcn835XzCQ-3cvVaZ3ND1eI4', 'RX6F0yk89oSz-LcQDAsVaKSoq79UxNrzdz0geDYxs50'],
            async success(res) {
              let typeList = []
              if (res['JPrPrFd6hhH4Tt1VcNMgcn835XzCQ-3cvVaZ3ND1eI4'] === 'accept') {
                typeList.push('START_AVAILABLE')
              }
              if (res['RX6F0yk89oSz-LcQDAsVaKSoq79UxNrzdz0geDYxs50'] === 'accept') {
                typeList.push('REPORT_AVAILABLE')
              }
              try {
                await saveSubscribe({
                  matchId: _this.applyInfo.matchId,
                  paperId: _this.choosedArea.paperId,
                  openId: _this.openid,
                  token: _this.loginInfo.token,
                  typeList,
                })
                _this.setChooseArea({})
              } catch (e) {
                console.log(e)
              }
            },
            fail(err) {
              console.log(err)
            },
          })
          const res = await setApply({
            matchId: this.choosedArea.paperId,
            positionId: this.choosedArea.key,
            promoterInfoId:_this.qudaoInfo,
          })
          if (res.code === 1000000) {
            // 添加确认报名埋点
            let names = this.choosedSubjectData.name.split('-')
            sa.track('HuaTuOnline_MP_Tk_SimulatedSureSignUp', {
              sign_up_city: this.choosedArea.value,
              match_id: String(this.applyInfo.matchId),
              match_title: this.applyInfo.name,
              match_subject: names[1],
              match_class: names[0],
              utm_source:this.utmsource? decodeURIComponent(this.utmsource):undefined
            })
          }
          uni.showToast({
            title: res.data.message,
            mask: true,
            duration: 2000,
            success() {
              _this.toggleShow(false)
              if (_this.applyInfo.positionFlag == 1) {
                _this.setSchoolInfo({})
                uni.navigateTo({
                  url: '/pages/home/jobInfo?type=mock',
                })
              } else {
                _this.$emit('refreshFn')
              }
            },
          })
        } catch (e) {
          console.log(e)

          if (e.message) {
            uni.showToast({
              title: e.message,
              mask: true,
              icon: 'none',
              duration: 2000,
              success() {
                _this.toggleShow(false)
                _this.$emit('refreshFn')
              },
            })
          }
        }
      },
      select(obj) {
        this.setChooseArea(obj)
      },
      ...mapMutations('home', ['toggleShow', 'setChooseArea', 'setSchoolInfo']),
    },
  }
</script>
<style lang="scss" scoped>
  .area {
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
    z-index: 98;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background: rgb(0, 0, 0);
    }
    .areaWrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 30rpx 0 40rpx 0;
      background: rgba(255, 255, 255, 1);
      border-radius: 22rpx 22rpx 0px 0px;
      .titleWrapper {
        position: relative;
        .title {
          text-align: center;
          height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Heavy, PingFang SC;
          font-weight: 800;
          color: rgba(0, 0, 0, 1);
          line-height: 40rpx;
        }
        .desc {
          height: 28rpx;
          font-size: 20rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(151, 151, 151, 1);
          line-height: 28rpx;
          text-align: center;
        }
        .iconbianzu {
          position: absolute;
          font-size: 16rpx;
          right: 30rpx;
          top: 0;
          color: #e2e0e3;
          padding: 10rpx;
        }
      }
      .container {
        padding: 10rpx 20rpx 40rpx 20rpx;
        max-height: 600rpx;
        overflow-y: scroll;
        .item {
          display: inline-block;
          width: 175rpx;
          text-align: center;
          height: 34rpx;
          font-size: 24rpx;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
          line-height: 34rpx;
          &.act {
            color: #fe2f41;
          }
          &.horizontal {
            display: block;
            width: 100%;
          }
        }
      }
    }
    &.show {
      transition: transform 0.05s ease;
      transform: translateY(0%);
      .mask {
        transition: opacity 0.1s ease 0.1s;
        opacity: 0.2;
      }
      .areaWrapper {
        transition: transform 0.2s ease 0.1s;
        transform: translateY(0%);
      }
    }
    &.hide {
      transition: transform 0.1s ease 0.2s;
      transform: translateY(100%);
      .mask {
        transition: opacity 0s ease;
        opacity: 0;
      }
      .areaWrapper {
        transition: transform 0.2s ease;
        transform: translateY(100%);
      }
    }
    .confirmBtn {
      width: 630rpx;
      height: 88rpx;
      background: rgba(255, 63, 71, 1);
      border-radius: 44rpx;
      line-height: 88rpx;
      margin: 30rpx auto 0;
      font-size: 36rpx;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      &.disabled {
        background: rgba(221, 220, 220, 0.5);
        color: #9b9b9b;
      }
    }
  }
</style>
