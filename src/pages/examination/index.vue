<template>
  <div>
    <NavBar :title="currentModuleName" ref="navBar" @goBack="navBack" @goHome="navHome"/>
    <!-- 做题 -->
    <template v-if="!showAnswerCard">
      <div class="examination-head">
        <div class="countdown">{{ time }}</div>
        <div class="right-content">
          <span @click="switchShowAnswerCard" class="answer-card iconfont icondatika"></span>
          <span class="answer-num"><span class="cur-num">{{currentIndex + 1}}</span>/{{questions ? questions.length : 0}}</span>
        </div>
      </div>
      <div class="question-content" :style="{top: top + 'px'}">
        <swiper skip-hidden-item-layout class="scroll-view_H" :current="currentIndex" @change="handleSwiperChange" scroll-x @scroll="scroll" style="width: 100%; height: 100%;">
          <swiper-item v-for="(item, index) in questions" :key="item.id">
            <QuestionDetail @change="cacheQuestionData" v-if="Math.abs(currentIndex - index) < 2" :questionInfo="item" @nextFuse="handleNextFuse" />
          </swiper-item>
        </swiper>
      </div>
    </template>
    <!-- 答题卡 -->
    <div class="answer-card-content" v-else>
      <div class="examination-head">
        <span class="paper-name">{{paperName}}</span>
      </div>
      <div class="question-content" :style="{top: top + 'px'}">
        <div class="module" v-for="item in modules" :key="item.category">
          <div class="module-name">{{item.name}}</div>
          <div class="question-num">
            <span
              @click="handleNumClick(item.firstIndex + num)"
              class="num-item"
              :class="{
                selected: selected[item.firstIndex + num],
                disabled: questions[item.firstIndex + num].disabled
              }"
              v-for="num in item.qcount"
              :key="num">{{item.firstIndex + num + 1}}<span class="not-support">不可答</span></span>
          </div>
        </div>
      </div>
      <button @click="beforeSubmitPaper" class="submit-paper">交卷并查看结果</button>
    </div>
    <Modal
      v-if="modalShow"
      :title="title"
      :content="content"
      :cancelText="cancelText"
      :confirmText="confirmText"
      @cancelCB="modalCancel"
      @confirmCB="modalConfirm"
    />
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import NavBar from '@/components/navBar'
import Modal from '@/components/modal/index'
import QuestionDetail from './components/questionDetail'
import { createSheet, getSheetData } from '@/utils/api'
import { mapMutations, mapState, mapActions } from 'vuex'

const supportQuestionType = [99, 100, 101, 109]

function padStart(str, maxLength, fillString = ' ') {
  if (Object.prototype.toString.call(fillString) !== '[object String]')
    throw new TypeError('fillString must be String')
  // 返回 String(str) 这里是为了使返回的值是字符串字面量，在控制台中更符合直觉
  if (str.length >= maxLength) return String(str)

  let fillLength = maxLength - str.length
  let times = Math.ceil(fillLength / fillString.length)

  // 这个算法叫啥？
  // SICP 的中文版第 30页 有用到同种算法计算乘幂计算
  while ((times >>= 1)) {
    fillString += fillString
    if (times === 1) {
      fillString += fillString
    }
  }
  return fillString.slice(0, fillLength) + str
}

function transTimeStr(s) {
  return `${padStart(
    String(Math.floor(s / 60)),
    2,
    '0'
  )}:${padStart(String(s % 60), 2, '0')}`
}
export default {
  computed: {
    time () {
      return transTimeStr(Math.floor(this.remainingTime / 1000))
    },
    currentModuleName () {
      const modules = this.modules
      if (!modules || !modules.length) {
        return ''
      }
      const current = this.currentIndex
      let ret = ''
      for (let i = 0; i < modules.length; i++) {
        if (modules[i].firstIndex <= current) {
          ret = modules[i].name
        }
      }
      ret = ret.replace(/第.部分\s*/, '')
      if (ret.length > 7) {
        ret = ret.slice(0, 7) + '...'
      }
      return ret
    },
    ...mapState('examination', [
      'currentIndex', 
      'questions', 
      'answers', 
      'modules', 
      'remainingTime', 
      'paperid',
      'selected',
    ]),
  },
  data () {
    return {
      top: 0,
      idx: 0,
      showAnswerCard: false,
      paperName: '',
      title: '',
      content: '',
      showCancel: false,
      modalShow: false,
      cancelText: '',
      confirmText: '',
    }
  },
  watch: {
    currentIndex () {
      this.pushCacheAnswer()
    }
  },
  onLoad (options) {
    try {
      const navigated = uni.getStorageSync('navigated')
      if (!navigated) {
        uni.redirectTo({
          url: `/pages/examGuide/index?path=${encodeURIComponent(`/pages/examination/index?${Object.entries(options).map(item => item.join('=').join('&'))}`)}`
        })
        return
      }
    } catch (e) {
    }
    this.init(options)
  },
  onUnload () {
    this.fetchAnswer()
  },
  mounted () {
    const navBar = this.$refs.navBar
    this.top =
      navBar.titleBarHeight +
      navBar.statusBarHeight +
      44/* .examination-head */
  },
  methods: {
    pushCacheAnswer () {
      if (this.cacheData) {
        this.setAnswer(this.cacheData)
        this.cacheData = null
      }
    },
    showModal ({
      title = '',
      content = '',
      showCancel = false,
      confirmText = '确定',
      cancelText = '取消',
      success = () => {},
      fail = () => {}
    } = {}) {
      this.title = title
      this.content = content
      this.showCancel = showCancel
      this.confirmText = confirmText
      this.cancelText = cancelText
      this.modalShow = true
      this._successCb = success
      this._failCb = fail
    },
    modalCancel () {
      if (this._failCb) {
        if (this._failCb() === undefined) {
          this.modalShow = false
        }
      }
    },
    modalConfirm () {
      if (this._successCb) {
        if (this._successCb() === undefined) {
          this.modalShow = false
        }
      }
    },
    handleNextFuse () {
      this.pushCacheAnswer()
      this.showAnswerCard = true
    },
    init (options) {
      if (options.paperId) {
        createSheet(options.paperId).then(res => {
          const data = res.data
          this.paperName = data.name
          this.handleSheetData({paperId: options.paperId, ...data})
        }).then(() => this.getQuestions())
      } else if (options.answerId) {
        getSheetData(options.answerId).then(res => {
          const data = res.data
          this.paperName = data.name
          this.handleSheetData({paperId: options.paperid, ...data})
          const answers = this.answers
          if (answers[answers.length - 1] !== '' && !this.showAnswerCard) {
            this.switchShowAnswerCard()
          }
        }).then(() => this.getQuestions())
      } else {
        uni.showModal({
          title: '提示',
          content: '数据有误请后退重试',
          success (res) {
            uni.navigateBack()
          },
          showCancel: false
        })
      }
    },
    cacheQuestionData (data) {
      this.cacheData = data
    },
    handleSwiperChange (e) {
      if (e.detail.source === 'touch') {
        this.setCurrentIndex(e.detail.current)
      }
    },
    handleNumClick (index) {
      if (this.showAnswerCard) {
        this.switchShowAnswerCard()
      }
      this.setCurrentIndex(index)
    },
    switchShowAnswerCard () {
      this.pushCacheAnswer()
      this.showAnswerCard = !this.showAnswerCard
    },
    navBack (stop) {
      this.pushCacheAnswer()
      if (this.showAnswerCard) {
        this.switchShowAnswerCard()
        stop()
      } else {
        this.fetchAnswer()
        stop(new Promise((resolve, reject) => {
          this.showModal({
            title: '是否退出本次考试？',
            content: '退出后未完成的练习会保存在答题记录中',
            showCancel: true,
            confirmText: '退出',
            success: resolve,
          })
        }))
      }
    },
    navHome (stop) {
      this.pushCacheAnswer()
      this.fetchAnswer()
      stop(new Promise((resolve, reject) => {
        this.showModal({
          title: '是否退出本次考试？',
          content: '退出后未完成的练习会保存在答题记录中',
          showCancel: true,
          confirmText: '退出',
          success: resolve,
        })
      }))
    },
    beforeSubmitPaper () {
      let cnt = 0
      const answers = this.answers
      this.questions.forEach(item => {
        if (item.disabled) cnt--
      })

      answers.forEach(item => {
        if (item === '0' || item === '') {
          cnt++
        }
      })
      if (cnt <= 0) {
        this.submitPaper()
          .then(() => {
            uni.redirectTo({
              url: `/pages/grade/index?id=${this.paperid}`
            })
          })
          .catch(e => {
            uni.showToast({
              title: '交卷失败',
              icon: 'none',
              duration: 2000
            })
          })
      } else {
        this.showModal({
          title: `您还有${cnt}题未作答, 确定交卷吗?`,
          success: () => {
            this.submitPaper()
              .then(() => {
                uni.redirectTo({
                  url: `/pages/grade/index?id=${this.paperid}`
                })
              })
              .catch(e => {
                uni.showToast({
                  title: '交卷失败',
                  icon: 'none',
                  duration: 2000
                })
              })
          }
        })
      }
    },
    ...mapMutations('examination', ['setCurrentIndex', 'resetStore']),
    ...mapActions('examination', ['getQuestions', 'handleSheetData', 'submitPaper', 'fetchAnswer', 'setAnswer']),
  },
  beforeDestroy () {
    this.resetStore()
  },
  components: {
    NavBar,
    QuestionDetail,
    Modal,
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
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
.submit-paper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120rpx;
  background:linear-gradient(90deg,rgba(255,228,164,1) 0%,rgba(255,181,39,1) 100%);
  border-radius:16px 16px 0px 0px;
  font-size: 36rpx;
  line-height: 120rpx;
  font-weight:500;
  color:rgba(171,82,20,1);
  text-align: center;
  border: none;
}
.scroll-view_H {
  height: 100%;
}
</style>