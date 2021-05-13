<template>
  <div class="mockTest">
    <div class="mockTop">
      <div
        class="changeSubject"
        v-if="selectSubjectVal.name"
      >
        <span class="label">切换科目</span>
        <HtPicker
          ref="picker"
          :list="subjectList"
          :select-name="selectSubjectVal.name"
          label_key="name"
          value_key="value"
          @hangleSelect="bindPickerChange"
        >
          <div
            class="picker"
            @click="handleToggle"
          >
            <span class="name">{{selectSubjectVal.name}}</span>
            <img
              src="http://p.htwx.net/wxtk/downToSet.png"
              alt=""
            />
          </div>
        </HtPicker>
      </div>
      <button
        class="history"
        @getuserinfo="bindGetUserInfo($event)"
        open-type="getUserInfo"
      >
        <div class="wrapper">
          <div class="title">
            我的模考历史
          </div>
          <img
            src="http://p.htwx.net/wxtk/rightToSet.png"
            alt=""
          >
        </div>
      </button>
    </div>

    <div v-if="mockTestData.length > 0">
      <div
        class="tips mt30"
        v-if="choosedSubjectData.categoryId == 1"
      >
        申论模考大赛,请下载华图在线APP报名参与
        <button
          class="downBtn"
          @click="toDown()"
        >
          立即下载
        </button>
      </div>
      <div class="mt30">
        <div
          class="itemWrapper mb20"
          v-for="item in mockTestData"
          :key="item.matchId"
        >
          <span class="num">{{ item.enrollCount }}人已报名</span>
          <h3 class="title">{{ item.name }}</h3>
          <p class="testTime mt30">{{ item.timeInfo }}</p>
          <div
            class="everyTimeWrapper"
            @click="showMore(item.areaGroupList)"
            v-if="item.areaGroupList.length > 0 && ((loginInfo.token && item.positionId === -10 && item.splitProvince) || (!loginInfo.token && item.splitProvince))"
          >
            <div
              class="everyTime"
              v-for="(every, j) in item.areaGroupList"
              :key="j"
            >
              <div class="content">
                <span class="name ellipsis">{{every.areaList | formateAreaStr}}</span>：
                <span class="time ellipsis">{{every.timeInfo.slice(5)}}</span>
              </div>
            </div>
            <div class="more">
              <i class="iconfont icongengduo"></i>
            </div>
          </div>
          <div
            class="area mt40"
            @click="applyFn(item)"
            v-show="item.status !== 1 && item.positionId !== undefined && item.positionId !== -10"
          >
            <template v-if="item.positionFlag === 1">
              <p
                @click.prevent.stop="handleFill(item)"
                class="fz26"
                :class="{'gray':item.status>4}"
              >{{item.status>4?`${item.examType===1?'机构性质：':'报考地区：'}`:''}}{{ item.schoolName ? `${item.schoolName} ${item.status>4?'':'>>'}` : item.positionName }}<span v-if="!item.schoolName && item.status<5">-去完善职位信息 ></span></p>
            </template>
            <template v-else>
              <span class="gray">{{item.examType === 1 ? '机构性质' : '报考地区'}}：</span><span :class="{'gray': item.status > 4}">{{ item.positionName }}</span>
              <span
                class="iconfont iconxiajiantou"
                v-show="item.areaList.length > 1 && item.status < 5"
              ></span>
            </template>

          </div>

          <button
            class="signUpBtn"
            @getuserinfo="bindGetUserInfo($event)"
            open-type="getUserInfo"
            v-if="item.status === 1 && !loginInfo.token"
          >
            我要报名
          </button>
          <button
            class="signUpBtn"
            @click="handleApply(item)"
            v-if="item.status === 1 && loginInfo.token"
          >
            我要报名
          </button>
          <button
            class="signUpBtn successBtn"
            v-if="item.status === 2"
          >
            报名成功
          </button>
          <button
            class="signUpBtn disabled"
            v-if="item.status === 3"
            @click="showToast"
          >
            开始考试
          </button>
          <button
            class="signUpBtn disabled"
            @click="showTips"
            v-if="item.status === 5"
          >
            开始考试
          </button>
          <button
            class="signUpBtn solidBtn"
            v-if="item.status === 4"
            @click="goExam(item,true)"
          >
            开始考试
          </button>
          <button
            class="signUpBtn solidBtn"
            v-if="item.status === 6"
            @click="goReport(item.paperId)"
          >
            查看报告
          </button>
          <button
            class="signUpBtn disabled"
            v-if="item.status === 7"
            @click="reportTip"
          >
            查看报告
          </button>
          <button
            class="signUpBtn solidBtn"
            v-if="item.status === 8"
            @click="goExam(item)"
          >
            继续考试
          </button>
          <button
            class="signUpBtn disabled"
            v-if="item.status === 9"
          >
            停止报名
          </button>
        </div>
      </div>
      <div
        class="desc"
        v-html="formateDesc"
      ></div>
    </div>
    <noData v-if="!isFirstForM && mockTestData.length === 0">
      暂无模考大赛
    </noData>
    <div
      class="noMoreData"
      v-if="!loadMoreForM"
    >~~ 我是有底线的 ~~</div>
    <img
      src="http://p.htwx.net/wxtk/asysins.png"
      v-if="checkStatus"
      @click="showNavModal"
      class="analysis_btn"
    />
    <NavModal
      v-if="navModalShow"
      @hide="hideNavModal"
    />
    <modal
      :showCancel="false"
      confirmText="知道啦"
      v-if="modalShow"
      :title="[
        '模考结束30分钟后方可查看报告，',
        '届时请在“模考大赛-我的模考历史”中查看。'
      ]"
      confirmStyle="background:linear-gradient(90deg,rgba(255,228,164,1) 0%,rgba(255,181,39,1) 100%);color:#AB5214"
      @confirmCB="confirmCB"
    ></modal>
    <areaGroup
      :areaGroupData="areaGroupData"
      :areaGroupFlag="areaGroupFlag"
      :closeMore.sync="areaGroupFlag"
    />
  </div>
</template>

<script>
  import sa from '@/utils/sendors'
  import Modal from '../../../components/modal'
  import NavModal from '../../examination/components/navModal'
  import HtPicker from '@/components/HtPicker'
  import areaGroup from './areaGroup'
  import noData from './noData'
  import { setApply, saveSubscribe } from '@/utils/api'
  import { mapState, mapMutations } from 'vuex'

  export default {
    props: {
      loadMoreForM: {
        type: Boolean,
        default: true,
      },
      isFirstForM: {
        type: Boolean,
        default: true,
      },
      utmsource: {
        type: String,
        default: '',
      },
      mockTestData: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      noData,
      NavModal,
      Modal,
      areaGroup,
      HtPicker,
    },
    data() {
      return {
        navModalShow: false,
        modalShow: false,
        areaGroupFlag: false,
        areaGroupData: [],
        subIndex: 0,
        selectSubjectVal: {},
      }
    },
    computed: {
      ...mapState(['loginInfo', 'openid', 'checkStatus', 'choosedSubjectData', 'qudaoInfo', 'subjectInfo', 'selectSubjectData', 'currentIndex']),
      ...mapState('home', ['choosedArea', 'applyInfo']),
      formateDesc() {
        if (this.mockTestData.length > 0) {
          let str = this.mockTestData[0].instruction
          return str.replace(/\n/g, '<br />')
        }
      },
      subjectList() {
        //获取科目列表,设置默认科目
        {
          var chossedObj = [...this.subjectInfo[this.choosedSubjectData.categoryId]]
          chossedObj.map(it => {
            if (it.value == this.choosedSubjectData.subjectId) {
              this.selectSubjectVal = { ...it }
            }
          })
          return this.subjectInfo[this.choosedSubjectData.categoryId]
        }
      },
    },
    filters: {
      formateAreaStr(arr) {
        let str = arr.reduce((prev, item) => (prev += `${item.value}/`), '')
        return str.substr(0, str.length - 1)
      },
    },
    methods: {
      handleToggle() {
        this.$refs.picker.toggle()
      },
      handleFill({ status, matchId, areaList, positionId, positionName, paperId, name, examType, schoolInfo }) {
        if (status === 1 || status === 2 || status === 3 || status === 4) {
          this.setChooseArea({
            key: positionId,
            value: positionName,
          })
          this.setApplyInfo({
            matchId,
            areaList,
            name,
            positionId,
            paperId,
            examType,
          })
          this.setSchoolInfo({
            ...schoolInfo,
          })
          uni.navigateTo({
            url: '/pages/home/jobInfo?type=mock',
          })
        }
      },
      // 展示更多省份
      showMore(arr) {
        this.areaGroupFlag = true
        this.areaGroupData = arr
      },
      bindPickerChange({item, i}) {
        this.selectSubjectVal = { ...this.subjectList[i] }
        var obj = { ...this.selectSubjectData[this.currentIndex] }
        obj.subjectId = item.value
        this.setSelectSubject(obj)
        this.setChoosedSubject({ ...this.choosedSubjectData, subjectId: item.value })
        this.$emit('refreshFn')
      },
      toDown() {
        uni.navigateTo({
          url: `/pages/downloadPaper/down`,
        })
      },
      reportTip() {
        this.modalShow = true
      },
      confirmCB() {
        this.modalShow = false
      },
      showNavModal() {
        if (!this.checkStatus) {
          this.hideNavModal()
          return
        }
        this.navModalShow = true
      },
      hideNavModal() {
        this.navModalShow = false
      },
      showToast() {
        uni.showToast({
          icon: 'none',
          duration: 3000,
          title: '未到入场时间，请耐心等待',
        })
      },
      showTips() {
        uni.showToast({
          icon: 'none',
          duration: 3000,
          title: '抱歉，您已错过本次模考，可在模考历史查看，或稍后报考参加下次模考',
        })
      },
      bindGetUserInfo(e, num, obj) {
        if (e.detail.userInfo) {
          if (uni.getStorageSync('userInfo') === '') {
            this.setUserInfo(e.detail.userInfo)
            uni.navigateTo({
              url: '/pages/mine/login',
            })
          } else {
            if (this.loginInfo.token) {
              uni.navigateTo({
                url: '/pages/home/mockHistory',
              })
            } else {
              uni.navigateTo({
                url: '/pages/mine/login',
              })
            }
          }
        }
      },
      handleApply(obj) {
        let _this = this
        let names = this.choosedSubjectData.name.split('-')
        sa.track('HuaTuOnline_MP_Tk_SimulatedSignUp', {
          match_id: String(obj.matchId),
          match_title: obj.name,
          match_subject: names[1],
          match_class: names[0],
          utm_source: this.utmsource ? decodeURIComponent(this.utmsource) : undefined,
        })
        this.setApplyInfo({
          matchId: obj.matchId,
          areaList: obj.areaList,
          name: obj.name,
          positionId: obj.positionId,
          paperId: obj.paperId,
          examType: obj.examType,
          positionFlag: obj.positionFlag,
        })
        if (obj.areaList.length === 1) {
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
                  paperId: obj.paperId,
                  matchId: obj.matchId,
                  openId: _this.openid,
                  token: _this.loginInfo.token,
                  typeList,
                })
              } catch (e) {
                console.log(e)
              }
            },
            fail(err) {
              console.log(err)
            },
          })
          this.setChooseArea({
            key: obj.areaList[0].key,
            value: obj.areaList[0].value,
          })
          this.oneAreaApply(obj.areaList[0].paperId, obj.areaList[0].key)
        } else {
          this.toggleShow(true)
        }
      },
      async oneAreaApply(paperId, positionId) {
        let _this = this
        try {
          const res = await setApply({
            matchId: paperId,
            positionId,
            promoterInfoId: _this.qudaoInfo,
          })

          // 添加确认报名埋点
          let names = this.choosedSubjectData.name.split('-')
          sa.track('HuaTuOnline_MP_Tk_SimulatedSureSignUp', {
            sign_up_city: this.choosedArea.value,
            match_id: String(this.applyInfo.matchId),
            match_title: this.applyInfo.name,
            match_subject: names[1],
            match_class: names[0],
            utm_source: this.utmsource ? decodeURIComponent(this.utmsource) : undefined,
          })
          uni.showToast({
            title: res.data.message,
            mask: true,
            duration: 2000,
            success() {
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
        }
      },
      applyFn({ status, matchId, areaList, positionId, positionName, paperId, name, examType, positionFlag }) {
        if ((status === 1 || status === 2 || status === 3 || status === 4) && areaList.length > 1) {
          this.setChooseArea({
            key: positionId,
            value: positionName,
          })
          this.setApplyInfo({
            matchId,
            areaList,
            name,
            positionId,
            paperId,
            examType,
            positionFlag,
          })
          this.toggleShow(true)
        }
      },
      goReport(id) {
        uni.navigateTo({
          url: `/pages/grade/mock?id=${id}`,
        })
      },
      /*      updateView(){
                this.selectSubjectVal = this.subjectInfo[this.choosedSubjectData.categoryId][0];
              }, */
      goExam({ matchId, name, paperId }, flag) {
        if (flag) {
          // 添加开始考试埋点
          let names = this.choosedSubjectData.name.split('-')
          sa.track('HuaTuOnline_MP_Tk_SimulatedStartAnswer', {
            match_subject: names[1],
            match_class: names[0],
            match_id: String(matchId),
            match_title: name,
          })
        }
        uni.navigateTo({
          url: `/pages/examination/mock?paperId=${paperId}`,
        })
      },
      ...mapMutations(['setUserInfo', 'setChoosedSubject', 'setSelectSubject']),
      ...mapMutations('home', ['toggleShow', 'setApplyInfo', 'setChooseArea', 'setSchoolInfo']),
    },
  }
</script>
<style lang="scss" scoped>
  .fz26 {
    font-size: 26rpx;
    padding: 0 30rpx;
    &.gray {
      color: #666;
    }
  }
  .mockTest {
    background: #fafafa;
    padding: 30rpx;
    .mockTop {
      display: flex;
      position: relative;
      .changeSubject {
        line-height: 74rpx;
        display: flex;
        align-items: center;
        font-size: 0;
        .label {
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 40rpx;
          margin-right: 8rpx;
        }
        .picker {
          display: inline-block;
          .name {
            display: inline-block;
            font-size: 28rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #994425;
            line-height: 40rpx;
            max-width: 240rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
          }
          img {
            margin-left: 16rpx;
            width: 20rpx;
            height: 20rpx;
            vertical-align: middle;
          }
        }
      }
      .history {
        position: absolute;
        right: -30rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Heavy, PingFang SC;
        font-weight: 800;
        color: #6f788c;
        line-height: 72rpx;
        width: 262rpx;
        height: 72rpx;
        background: #f3f4f7;
        border-radius: 36rpx 0px 0px 36rpx;

        .wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 16rpx;
          img {
            width: 36rpx;
            height: 36rpx;
            vertical-align: middle;
            margin-left: 8rpx;
          }
        }

        .title {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
    /*     .history {
              font-size: 32rpx;
              font-weight: 800;
              color: rgba(111, 120, 140, 1);
              line-height: 74rpx;
              background: transparent;

              .wrapper {
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
         
              .title {
                display: flex;
                align-items: center;
                justify-content: flex-end;
              }
            } */

    .downBtn {
      display: inline-block;
      vertical-align: middle;
      font-size: 28rpx;
      background-color: red;
      color: #fff;
      padding: 0 10rpx;
      margin-left: 25rpx;
      height: 70%;
      line-height: 60rpx;
    }
    .tips {
      width: 100%;
      height: 84rpx;
      background: rgba(254, 207, 47, 0.3);
      border-radius: 16rpx;
      font-size: 25rpx;
      text-align: center;
      font-family: PingFangSC-Heavy, PingFang SC;
      font-weight: 800;
      color: rgba(193, 84, 0, 1);
      line-height: 84rpx;
      letter-spacing: 2rpx;
    }
    .itemWrapper {
      width: 100%;
      position: relative;
      text-align: center;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(225, 182, 182, 0.3);
      border-radius: 16rpx;
      box-sizing: border-box;
      padding: 58rpx 0 40rpx 0;
      .num {
        position: absolute;
        top: 0;
        right: 0;
        width: 224rpx;
        height: 40rpx;
        background: rgba(254, 207, 47, 1);
        border-radius: 0px 12rpx 0px 12rpx;
        font-size: 26rpx;
        font-weight: 800;
        color: rgba(193, 84, 0, 1);
        line-height: 40rpx;
      }
      .title {
        width: 600rpx;
        font-size: 36rpx;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        line-height: 50rpx;
        text-align: center;
        margin: 0 auto;
      }
      .testTime {
        height: 40rpx;
        font-size: 28rpx;
        font-weight: 600;
        color: rgba(74, 74, 74, 1);
        line-height: 40rpx;
      }
      .everyTimeWrapper {
        margin: 20rpx auto 0;
        width: 630rpx;
        max-height: 128rpx;
        background: rgba(245, 245, 245, 1);
        border-radius: 8rpx;
        box-sizing: border-box;
        padding: 20rpx;
        overflow: hidden;
        position: relative;
        .everyTime {
          display: flex;
          justify-content: center;
          width: 552rpx;
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(105, 105, 105, 1);
          line-height: 34rpx;
          margin-top: 20rpx;
          &:first-child {
            margin-top: 0;
          }
          /* margin-bottom: 20rpx; */
          .content {
            display: flex;
            align-items: center;
            width: 552rpx;
          }
          .name {
            max-width: 135rpx;
            text-align: left;
            display: inline-block;
          }
          .time {
            flex: 1;
            display: inline-block;
          }
        }
        .more {
          color: #696969;
          font-size: 20rpx;
          position: absolute;
          transform: translateY(-50%);
          top: 50%;
          right: 10rpx;
        }
      }
      .area {
        font-size: 32rpx;
        font-weight: 600;
        color: rgba(255, 109, 115, 1);
        line-height: 44rpx;
        text-align: center;
        .gray {
          color: #666;
        }
        .iconxiajiantou {
          font-size: 12rpx;
          margin-left: 10rpx;
        }
      }
      .signUpBtn {
        width: 630rpx;
        height: 88rpx;
        background: rgba(255, 63, 71, 1);
        border-radius: 44rpx;
        font-size: 36rpx;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 88rpx;
        margin: 60rpx auto 0;
        &.successBtn {
          border: 2rpx solid rgba(255, 63, 71, 1);
          background: #ffffff;
          color: #fe2f41;
        }
        &.disabled {
          background: rgba(221, 220, 220, 0.5);
          color: #9b9b9b;
        }
        &.solidBtn {
          background: rgba(255, 63, 71, 1);
          color: #fff;
        }
      }
    }
    .descTit {
      height: 40rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
      line-height: 40rpx;
      margin: 40rpx 0 20rpx 0;
    }
    .desc {
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(109, 113, 114, 1);
      line-height: 2;
      padding-bottom: 130rpx;
    }
    .analysis_btn {
      width: 182rpx;
      height: 178rpx;
      position: fixed;
      right: 0;
      bottom: 350rpx;
    }
  }
</style>
