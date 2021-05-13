<template>
  <div @click="pageClick">
    <NavBar title="精准估分" ref="navBar" />
    <div class="examination-head">
      <div class="countdown">110:59</div>
      <div class="right-content">
        <span class="answer-card iconfont icondatika"></span>
        <span class="answer-num"><span class="cur-num">1</span>/110</span>
      </div>
    </div>
    <div class="question-content" :style="{top: top + 'px'}">
      <QuestionDetail ref="questionDetail" :questionInfo="questionInfo" disabled />
    </div>
    <div class="mask">
      <div v-if="step === 1" class="guide-card step1" :style="{top: guide1Top + 'px', left: guide1Left + 'px'}">
        <div>这里是答题卡</div> 
        <div>可以快速跳转对应题目</div>
      </div>
      <div v-if="step === 2" class="guide-card step2" :style="{top: guide2Top + 'px', left: guide2Left + 'px'}">
        <div>可以上下拖动哦～</div> 
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import NavBar from '@/components/navBar'
import QuestionDetail from '../examination/components/questionDetail'

const questionInfo1 = {"stem":"<p>“863计划”出台过程表明，在我国重大决策合法化的机关有（）。</p>","choices":["<p>中央政治局扩大会议</p>","<p>中央政治局会议</p>","<p>中央政治局会议</p>","<p>国务院科技领导小组</p>"],"material":"","id":30005903,"type":99,"index":0,"disabled":false,"teachType":"单选题","answer":2}
const questionInfo2 = {"stem":"<p>按区域划分，下列哪个区域耕地面积最少？（）</p>","choices":["<p>珠江三角洲平原地区</p>","<p>粤西北山区</p>","<p>粤东沿海区</p>","<p>粤西沿海区</p>"],"material":"<p>       根据下列文字、表格或图形回答问题。你应根据资料提供的信息进行分析、比较、计算、处理。<br/>       材料一、<br/>       根据广东省第二次土地调查，全省耕地分布与质量状况如下：<br/>       珠江三角洲平原地区的耕地面积为60.72万公顷（910.79万亩）,占全省耕地总量的23.98%。粤西北山区耕地面积有87.56万公顷（1313.45万亩）,占全省耕地总量的34.58%。粤东沿海区耕地面积为24.71万公顷（370.70万亩）,占全省耕地总量的9.76%。粤西沿海区耕地面积80.23万公顷（1203.39万亩）,占全省耕地总量的31.68%。<br/>       全省耕地按坡度划分,2度以下耕地150.95万公顷（2264.27万亩）,占59.61%;2-6度耕地40.59万公顷（608.88万亩）,占16.03%;6-15度耕地40.44万公顷（606.60万亩）,占15.97%;15-25度耕地9.41万公顷（141.18万亩）,占3.72%;25度以上耕地11.83万公顷（177.40万亩）,占4.67%。<br/>       全省耕地中,有灌溉设施的耕地179.29万公顷（2689.42万亩）,比重为70.80%,无灌溉设施的耕地73.93万公顷（1108.91万亩）,比重为29.20%。</p>","id":69809,"type":99,"index":90,"disabled":false,"teachType":"单选题","answer":3}
export default {
  data () {
    return {
      top: 0,
      questionInfo: questionInfo1,
      guide1Top: 0,
      guide1Left: 0,
      step: 1,
      guide2Top: 0,
      guide2Left: 0,
      clipPath: 'none',
    }
  },
  onLoad ({path}) {
    this.redirectPath = decodeURIComponent(path)
  },
  mounted () {
    const navBar = this.$refs.navBar
    this.top = 
      navBar.titleBarHeight + 
      navBar.statusBarHeight + 
      44/* .examination-head */

    uni.createSelectorQuery()
      .in(this)
      .select('.answer-card')
      .boundingClientRect((rect) => {
        this.guide1Top = Math.floor(rect.top + rect.height / 2) + 40
        this.guide1Left = Math.floor(rect.left + rect.width / 2) - 143
      })
      .exec()
  },
  methods: {
    pageClick () {
      this.step++
    },
    getPosition () {
      this.$nextTick(() => {
        const pms = this.$refs.questionDetail.getMovableBarPos()
        pms.then(res => {
          // this.guide2Top = Math.floor(res.top - 10) - 40
          // this.guide2Left = Math.floor(res.left + res.width / 2) - 80
          this.guide2Top = res.top - 90
          this.guide2Left = res.left + res.width / 2 - 85
          // const x = res.left | 0
          // const y = res.top | 0
          // const w = res.width | 0
          // const h = res.height | 0
          // this.clipPath = `polygon(0% 0%, 0% 100%, ${x}px 100%, ${x}px ${y}px, ${x + w}px ${y}px, ${x + w}px ${y + h}px, ${x}px ${y + h}px, ${x}px 100%, 100% 100%, 100% 0%)`
        })
      })
    },
  },
  watch: {
    step (val) {
      switch (val) {
        case 2: 
          this.questionInfo = questionInfo2
          this.getPosition()
          break
        default:
          this.clipPath = 'none'
          uni.setStorageSync('navigated', '1')
          uni.redirectTo({
            url: this.redirectPath
          })
      }
    }
  },
  components: {
    NavBar,
    QuestionDetail,
  }
}
</script>

<style lang="scss">
.examination-head {
  height: 44px;
  line-height: 14px;
  box-shadow:0px 4px 6px 0px rgba(0,0,0,0.08);
  padding: 10px 20px;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
  .paper-name {
    font-size: 16px;
    line-height: 22px;
  }
}
.countdown {
  display: inline-block;
  min-width: 50px;
  height: 24px;
  font-size: 14px;
  border-radius: 4px;
  border:1rpx solid rgba(74,74,74,1);
  padding: 0 5px;
  line-height: 24px;
  text-align: center;
}
.right-content {
  float: right;
  .answer-card {
    margin-right: 10px;
    font-size: 20px;
    color: #9B9B9B;
  }
  .answer-num {
    font-size: 14px;
    color: #9B9B9B;
    .cur-num {
      color: #FF6D73;
      min-width: 20px;
      display: inline-block;
      text-align: right;
    }
  }
}
.mask {
  position: fixed; 
  top: 0;
  bottom: 0;
  left: 0; 
  right: 0; 
  background: rgba(0,0,0,.75); 
  z-index: 30;
}
.step1 {
  padding: 21px 18px;
  background: #FE2F41;
  color: #fff;
  font-size: 13px;
  position: absolute;
  border-radius: 8px;
  &:after {
    content: '';
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #FE2F41;
    position: absolute;
    top: -40px;
    left: 140px;
  }
  &:before {
    content: '';
    width: 2px;
    height: 40px;
    background: #FE2F41;
    position: absolute;
    top: -40px;
    left: 143px;
  }
}
.step2 {
  width: 166px;
  height: 78px;
  line-height: 78px;
  text-align: center;
  background: #FE2F41;
  color: #fff;
  font-size: 13px;
  position: absolute;
  border-radius: 8px;
  &:after {
    content: '';
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #FE2F41;
    position: absolute;
    bottom: -40px;
    left: 82px;
  }
  &:before {
    content: '';
    width: 2px;
    height: 40px;
    background: #FE2F41;
    position: absolute;
    bottom: -40px;
    left: 85px;
  }
}
.answer-card-content .question-content {
  overflow: auto;
  padding: 40rpx 0rpx 200rpx;
  background: #fff;
}
.question-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFF;
  // z-index: -1;
  .module-name {
    font-size: 32rpx;
    font-weight:600;
    color:rgba(74,74,74,1);
    padding: 0 30rpx;
    margin-bottom: 40rpx;
  }
  .question-num {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding-top: 10rpx;
    .num-item {
      width: 80rpx;
      height: 80rpx;
      min-width: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border: 1rpx solid rgba(74,74,74,1);
      border-radius: 50%;
      margin: 0 20rpx 60rpx;
      position: relative;
      &.selected {
        border-color: #FF85B2;
        background-color:#FF85B2;
        color: #fff;
      }
      .not-support {
        display: none;
      }
      &.disabled {
        border-color: #F0F0F0;
        background-color:#F0F0F0;
        color: #9B9B9B;
        .not-support {
          display: block;
          position: absolute;
          top: 90rpx;
          width: 100rpx;
          height: 36rpx;
          border-radius: 18rpx;
          border-color: #F0F0F0;
          background-color:#F0F0F0;
          color: #9B9B9B;
          font-size: 20rpx;
          text-align: center;
          left: 50%;
          margin-left: -50rpx;
          line-height: 36rpx;
          &:after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-left: 12rpx solid transparent;
            border-top: 6rpx solid transparent;
            border-right: 12rpx solid transparent;
            border-bottom: 6rpx solid #F0F0F0;
            position: absolute;
            top: -10rpx;
            left: 50%;
            margin-left: -12rpx;
          }
        }
      }
    }
  }
}
</style>