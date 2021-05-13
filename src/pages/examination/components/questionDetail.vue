<template>
  <movable-area class="question-info" :id="`info-${questionInfo.index}`">
    <movable-view
      v-if="needLayered"
      class="moveable-bar"
      :class="{moving: moving}"
      :y="y" 
      direction="vertical"
      :animation="false"
      @touchstart="handleMovalbeTouchStart"
      @touchend="handleMovalbeTouchEnd"
    >
      <div class="moveable-content"></div>
    </movable-view>
    <div class="material" :style="{height: y + 'px'}" v-if="needLayered">
      <LayerdContent :questionInfo="questionInfo" :questionType="questionType" />
    </div>
    <div style="background: #fff;" :style="{top: y + 'px', opacity: moving ? 0.5 : 1}" :class="{ 'question-card': needLayered }">
      <div v-if="needLayered" class="resize-bar">
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="question-info-content" v-if="!top">
        <div class="head-tip">
          <div 
            class="reset-btn" 
            @click="resetMatchQuestion" 
            v-if="questionType === 'Matching'"
          >重置</div>
          <div v-if="hasMaterial" class="matiral-tip">根据以上材料回答问题</div>
        </div> 
        <SingleChoice v-if="questionType === 'single'" 
          :questionInfo="questionInfo" 
          :answer="answers[questionInfo.index]" 
          @choiceChange="singleChange" />
        <MutipleChoice v-else-if="questionType === 'mutiple'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @choiceChange="mutipleChange"
        />
        <FillBlank 
          v-else-if="questionType === 'FillBlank'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @next="next"
          @change="fillBlankChange"
        />
        <MxuanN 
          v-else-if="questionType === 'MxuanN'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @change="MxuanNChange"
        />
        <Matching
          ref="matching"
          v-else-if="questionType === 'Matching'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @change="matchingChange"
        />
        <Shuangxuan 
          v-else-if="questionType === 'Shuangxuan'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @choiceChange="shuangxuanChange"
        />
        <Subjective 
          :questionInfo="questionInfo"
          v-else
        />
      </div>
    </div>
  </movable-area>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import SingleChoice from './singleChoice'
import MutipleChoice from './mutipleChoice'
import FillBlank from './fillBlank'
import Subjective from './subjective'
import LayerdContent from './layerdContent'
import MxuanN from './MxuanN'
import Matching from './matching'
import Shuangxuan from './shuangxuan'
import { handleIndex } from './mixins'
import { mapState, mapMutations, mapActions } from 'vuex'
import { questionTypes } from '@/utils/questionFormater'

export default {
  mixins: [ handleIndex('examination') ],
  props: ['questionInfo', 'disabled'],
  computed: {
    hasMaterial () {
      return !!this.questionInfo.material
    },
    questionType () {
      const type = this.questionInfo.type
      if (type in questionTypes) return questionTypes[type]
      switch (type) {
        case 99:
        case 109:
          return 'single'
        case 100:
        case 101:
          return 'mutiple'
      }
      return ''
    },
    needLayered () {
      if (this.questionInfo.layered) {
        return true
      }
      return this.questionInfo.material && !!this.questionInfo.material.trim()
    },
    ...mapState('examination', ['answers', 'y'])
  },
  data () {
    return {
      top: null,
      start: null,
      moving: false,
    }
  },
  methods: {
    resetMatchQuestion () {
      this.$refs.matching.reset()
    },
    shuangxuanChange (data) {
      this.mutipleChange(data)
      if (data.newVal.length === 2) {
        setTimeout(() => this.next(), 100)
      }
    },
    singleChange ({newVal, index, selected}) {
      // this.setAnswer({answer: newVal, index})
      this.$emit('change', {answer: newVal, index, selected})
      setTimeout(() => this.next(), 100)
    },
    mutipleChange ({newVal, index, selected}) {
      this.$emit('change', {answer: newVal, index, selected})
    },
    MxuanNChange ({value, index, selected}) {
      // this.setAnswer({answer: value, index})
      this.$emit('change', {answer: value, index, selected})
      if (value.every(item => item !== '0')) {
        setTimeout(() => this.next(), 100)
      }
    },
    fillBlankChange ({value, index, selected}) {
      //  this.setAnswer({answer: value, index})
       this.$emit('change', {answer: value, index, selected})
    },
    matchingChange ({value, index, selected, next}) {
      this.$emit('change', { answer: value, index, selected })
      if (next) {
        setTimeout(() => this.next(), 100)
      }
      // this.setAnswer({ answer: value, index })
    },
    handleMovalbeTouchEnd (e) {
      if (!this.start || this.disabled) return
      const current = e.changedTouches[0]
      let y = this.y + current.pageY - this.start.pageY
      

      uni.createSelectorQuery()
        .in(this)
        .select(`#info-${this.questionInfo.index}`)
        .boundingClientRect((rect) => {
          this.setY(Math.min(rect.height - 60, Math.max(60, y)))
        }).exec()

      setTimeout(() => {
        this.moving = false
      }, 50)
      this.start = null
    },
    handleMovalbeTouchStart (e) {
      if (this.disabled) return 
      this.moving = true
      this.start = e.touches[0]
    },
    getMovableBarPos () {
      return new Promise((resolve) => uni.createSelectorQuery().in(this).select('.moveable-bar').boundingClientRect(resolve).exec())
    },
    ...mapMutations('examination', ['setY']),
    ...mapActions('examination', ['setAnswer', 'setSelected']),
  },
  components: {
    SingleChoice,
    MutipleChoice,
    Subjective,
    FillBlank,
    LayerdContent,
    MxuanN,
    Matching,
    Shuangxuan,
  },
}
</script>

<style lang="scss">
.question-info {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  position: relative;
}
.material {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  overflow: auto;
  padding: 30rpx 30rpx 60rpx;
  box-sizing: border-box;
  word-break: break-all;
}
.question-card {
  position: absolute;
  border-radius: 16rpx 16rpx 0px 0px;
  background: #fff;
  left: 0;
  right: 0;
  bottom: 0;
  top: 50%;
  box-shadow: 0px -5px 5px 0px rgba(0,0,0,0.15);
  .resize-bar {
    width: 86rpx;
    height: 24rpx;
    border-radius:8rpx 8rpx 0px 0px;
    position: absolute;
    left: 50%;
    margin-left: -43rpx;
    top: -24rpx;
    z-index: 10;
    background: rgba(238,238,238,1);
    background: linear-gradient(180deg,rgba(238,238,238,1) 0%,rgba(208,208,208,1) 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .line {
      width: 30rpx;
      height: 1px;
      background: #000;
      margin: 2rpx
    }
  }
  .head-tip {
    overflow: hidden;
    .reset-btn {
      float: right;
      color: #FE2F41;
      padding: 20rpx;
    }
    .matiral-tip {
      padding: 20rpx 30rpx;
      border-bottom: 1px solid #E0E0E0;
      font-weight: bold;
    }
  }
  .question-info-content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
.material, .question-card {
  transition: 0.3s all ease;
}
.moveable-bar {
  width: 150rpx;
  height: 120rpx;
  position: absolute;
  left: 50%;
  margin-left: -75rpx;
  margin-top: -75rpx;
  z-index: 20;
  .moveable-content {
    position: absolute;
    height: 50rpx;
    width: 750rpx;
    left: -300rpx;
    top: 26rpx;
  }
  .pic {
    width: 100%;
    height: 100%;
  }
  &.moving::after {
    content: '';
    position: absolute;
    height: 2px;
    width: 700rpx;
    left: -275rpx;
    top: 75rpx;
    z-index: -1;
    background: #005DFF;
    opacity: .34;
    filter: blur(1px);
    border-radius: 16rpx 16rpx 0px 0px;
  }
}
</style>