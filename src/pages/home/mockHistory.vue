<template>
  <div class="estimateHistory">
    <navBar :title="'我的模考历史'" />
    <div class="mockWrapper" @click="selectShow" v-if="mockTags.length > 0">
      <div class="selectMock">
        {{ choosedTag.name }}
        <div class="triangle ml10" :class="isShow ? 'deg180' : 'deg0'"></div>
      </div>
    </div>
    <div class="selectWrapper" :class="isShow ? 'show' : 'hide'">
      <div class="mockList">
        <div
          class="mockItem ml30 mt30"
          :class="choosedTag.id === item.id ? 'selected' : ''"
          v-for="item in mockTags"
          :key="item.id"
          @click="selectFn(item)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="mask" @click="isShow = false"></div>
    </div>
    <div
      class="report"
      v-if="isFirst && mockReport.line && mockReport.list.length > 0"
    >
      <div class="lineWrapper">
        <canvas
          canvas-id="canvasColumn"
          id="canvasColumn"
          v-show="!lineSrc"
          class="charts"
        />
        <img v-if="lineSrc" class="imgCanvas" :src="lineSrc" alt="" />
      </div>
      <div class="mockResultList mt20">
        <div
          class="resultItem"
          v-for="(item, index) in mockReport.list"
          :key="index"
        >
          <div class="content">
            <div class="title">{{ item.name }}</div>
            <div class="desc">
              {{ item.startTime | formatTime }}
              <span class="num">共{{ item.total }}人参加</span>
            </div>
          </div>
          <button @click="goReport(item.paperId)">查看报告</button>
        </div>
      </div>
    </div>
    <noData v-if="!isFirst && !mockReport.line && mockReport.list.length === 0">
      <p>
        还没参加过模考？<br />
        快去报名吧！
      </p>
      <div class="apply" @click="goHome">去报名</div>
    </noData>
  </div>
</template>

<script>
import uCharts from '../../static/u-charts.min'
import noData from './components/noData'
import navBar from '@/components/navBar'
import { getMockTags, getMockReport } from '@/utils/api'
import { mapState } from 'vuex'
let _self
let canvaLineA = null
export default {
  components: {
    navBar,
    noData
  },
  data() {
    return {
      isShow: false,
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      isFirst: true,
      mockTags: [],
      choosedTag: {},
      mockReport: {}, //模考报告
      lineSrc: ''
    }
  },

  async mounted() {
    _self = this
    try {
      const res = await getMockTags(this.choosedSubjectData.subjectId)
      this.mockTags = res.data
      this.choosedTag = this.mockTags[0]
      this.getMockReportFn()
    } catch (e) {
      console.log(e)
    }
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)
  },
  computed: {
    ...mapState(['choosedSubjectData'])
  },

  filters: {
    formatTime(val) {
      let time = new Date(val)
      let y = time.getFullYear()
      let m =
        time.getMonth() + 1 > 9
          ? time.getMonth() + 1
          : `0${time.getMonth() + 1}`
      let d = time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`
      return `${y}-${m}-${d}`
    }
  },

  onPullDownRefresh() {
    this.getMockReportFn()
  },

  methods: {
    // 查看报告
    goReport(id) {
      uni.navigateTo({
        url: `/pages/grade/mock?id=${id}`
      })
    },
    // 切换模考标签
    selectFn(obj) {
      if (obj.subject === 14) {
        uni.showToast({
          title: '请在华图在线APP中查看',
          icon: 'none'
        })
        return
      }
      this.choosedTag = obj
      this.isShow = false
      this.isFirst = true
      this.getMockReportFn()
    },
    async getMockReportFn() {
      try {
        uni.showLoading({
          title: '加载中',
          mask: true
        })
        const reportRes = await getMockReport(this.choosedTag.id)
        if (reportRes.data.line&&reportRes.data.line.series.length > 6) {
          reportRes.data.line.series.splice(
            0,
            reportRes.data.line.series.length - 6
          )
          // reportRes.data.list.splice(0, reportRes.data.list.length - 6)
        }

        console.log(reportRes.data)
        this.mockReport = reportRes.data
        if (!this.mockReport.line && this.mockReport.list.length === 0) {
          this.isFirst = false
          uni.hideLoading()
        } else {
          let chartData = {
            categories: [],
            series: []
          }
          this.mockReport.line.series.forEach((item, i) => {
            chartData.categories.push(item.name)
          })
          this.mockReport.line.categories.forEach((item, i) => {
            chartData.series.push({
              data: [],
              name: this.mockReport.line.categories[i]
            })
            this.mockReport.line.series.forEach((each, j) => {
              chartData.series[i].data.push(each.data[i])
            })
          })

          console.log(chartData)

          this.showLineA('canvasColumn', chartData)
        }
        uni.stopPullDownRefresh()
      } catch (e) {
        console.log(e)
        uni.hideLoading()
      }
    },

    showLineA(canvasId, chartData) {
      canvaLineA = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'line',
        fontSize: 12,
        colors: ['#EC74A0', '#50B674'],
        legend: { show: true },
        dataLabel: true,
        dataPointShape: true,
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        animation: true,
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          data: [
            {
              min: 0,
              max: 100,
              title: '正确率'
            }
          ],
          showTitle: true
        },
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio
      })
      var _this = this
      canvaLineA.addEventListener('renderComplete', () => {
            const ctx = uni.createCanvasContext('canvasColumn')
            setTimeout(()=>{
              wx.canvasToTempFilePath({
                canvasId: 'canvasColumn',
                success(res) {
                  _this.lineSrc = res.tempFilePath
                  uni.hideLoading()
                },
                fail(err) {
                  uni.hideLoading()
                  console.log(err)
                }
              })
            },500) 
          })
        uni.hideLoading()
    },
    selectShow() {
      this.isShow = true
    },
    goHome() {
      uni.reLaunch({
        url: '/pages/home/index?tabType=mock'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.estimateHistory {
  background: #f3f3f3;
  min-height: 98.5vh;
  padding-bottom: 20rpx;
  .noData {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    p {
      font-size: 37rpx;
      font-weight: 500;
      color: rgba(155, 155, 155, 1);
      line-height: 52rpx;
      text-align: center;
    }
    .apply {
      margin-top: 100rpx;
      width: 650rpx;
      height: 100rpx;
      background: linear-gradient(
        90deg,
        rgba(255, 228, 164, 1) 0%,
        rgba(255, 181, 39, 1) 100%
      );
      border-radius: 50rpx;
      font-size: 36rpx;
      font-weight: 500;
      color: rgba(171, 82, 20, 1);
      line-height: 100rpx;
      text-align: center;
    }
  }

  .mockWrapper {
    .selectMock {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 72rpx;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 4rpx 8rpx 0px rgba(0, 0, 0, 0.07);
      color: #fe2f41;
      position: relative;
      z-index: 99;
      .triangle {
        position: relative;
        &::after {
          position: absolute;
          left: 0;
          top: -7rpx;
          content: '';
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-left: 15rpx solid transparent;
          border-right: 15rpx solid transparent;
          border-bottom: 15rpx solid #fe2f41;
        }
        &.deg180 {
          transition: transform 0.3s;
          transform: rotateX(180deg);
        }
        &.deg0 {
          transition: transform 0.3s;
          transform: rotateX(0deg);
        }
      }
    }
  }
  .selectWrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 98;
    .mockList {
      width: 100%;
      padding-bottom: 30rpx;
      max-height: 214rpx;
      overflow-y: scroll;
      background: rgba(255, 255, 255, 1);
      display: flex;
      flex-wrap: wrap;
      .mockItem {
        padding: 0 20rpx;
        height: 62rpx;
        background: #f3f3f3;
        border-radius: 8rpx;
        line-height: 62rpx;
        color: #3c3e43;
        font-size: 24rpx;
        &.selected {
          border: 2rpx solid rgba(254, 47, 65, 1);
          color: #fe2f41;
          background: rgba(254, 47, 65, 0.12);
        }
      }
    }
    .mask {
      flex: 1;
      width: 100%;
      background: rgba(0, 0, 0, 1);
      opacity: 0.2;
    }
    &.show {
      transition: transform 0.05s ease;
      transform: translateY(0%);
      .mask {
        transition: opacity 0.1s ease 0.1s;
        opacity: 0.2;
      }
      .mockList {
        transition: transform 0.2s ease 0.1s;
        transform: translateY(0%);
      }
    }
    &.hide {
      transition: transform 0.1s ease 0.2s;
      transform: translateY(-110%);
      .mask {
        transition: opacity 0s ease;
        opacity: 0;
      }
      .mockList {
        transition: transform 0.2s ease;
        transform: translateY(-110%);
      }
    }
  }
  .mockResultList {
    background: #f3f3f3;
    .resultItem {
      width: 100%;
      box-sizing: border-box;
      padding: 30rpx 20rpx 30rpx 30rpx;
      background: rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20rpx;
      .title {
        width: 520rpx;
        font-size: 28rpx;
        font-weight: 600;
        color: rgba(74, 74, 74, 1);
        line-height: 40rpx;
        margin-bottom: 14rpx;
      }
      .desc {
        height: 34rpx;
        font-size: 24rpx;
        font-weight: 600;
        color: rgba(155, 155, 155, 1);
        line-height: 34rpx;
        .num {
          margin-left: 26rpx;
        }
      }
      button {
        width: 164rpx;
        height: 56rpx;
        background: rgba(254, 47, 65, 1);
        border-radius: 28rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 56rpx;
      }
    }
  }
  .lineWrapper {
    width: 750rpx;
    height: 550rpx;
    background-color: #ffffff;
    padding-top: 20rpx;
    box-sizing: border-box;
  }
  .charts {
    width: 750rpx;
    height: 500rpx;
    background-color: #ffffff;
  }
  .imgCanvas {
    display: block;
    width: 750rpx;
    height: 500rpx;
  }
}
</style>
