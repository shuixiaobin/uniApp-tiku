<template>
  <movable-area class="question-info" :id="`info-${questionInfo.index}`">
    <movable-view 
      v-if="haveMaterial"
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
    <div class="material" :style="{height: y + 'px'}" v-if="haveMaterial">
      <span class="material-desc">(材料)</span>
      <span v-html="questionInfo.material"></span>
    </div>
    <div style="background: #fff;" :style="{top: y + 'px', opacity: moving ? 0.5 : 1}" :class="{ 'question-card': haveMaterial }">
      <img 
        v-if="haveMaterial"
        src="@/static/grade/resize-bar.png" 
        class="resize-bar" 
        alt=""
      >
      <div class="question-info-content" v-if="!top">
        <SingleChoice 
          v-if="questionType === 'single'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @choiceChange="handleSingleChange($event)"
          :disabled="questionDisabled"
        />
        <MutipleChoice 
          v-else-if="questionType === 'mutiple'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @choiceChange="handleMutipleChange($event)"
          :disabled="questionDisabled"
        />
        <Subjective 
          :questionInfo="questionInfo"
          v-else
        />
        <div style="height: 350rpx;"></div>
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
import Subjective from './subjective'
import { handleIndex } from './mixins'
import { mapState, mapMutations, mapActions } from 'vuex'
// import Parser from '@/components/parser/jyf-parser'
export default {
  mixins: [ handleIndex('mock') ],
  props: ['questionInfo'],
  computed: {
    questionType () {
      switch (this.questionInfo.type) {
        case 99:
        case 109:
          return 'single'
        case 100:
        case 101:
          return 'mutiple'
        // case 111:
        // case 106:
        //   return 'subjective'
      }
      return false
    },
    haveMaterial () {
      return !!this.questionInfo.material.trim()
    },
    questionDisabled () {
      return this.waitTime !== null
    },
    ...mapState('mock', ['answers', 'y', 'waitTime'])
  },
  data () {
    return {
      top: null,
      start: null,
      moving: false,
    }
  },
  methods: {
    handleSingleChange ({oldVal, newVal, index, correct}) {
      if (oldVal !== newVal) {
        this.setAnswer({answer: newVal, index, correct})
      }
      setTimeout(() => this.next(), 100)
    },
    handleMutipleChange ({oldVal, newVal, index, correct}) {
      this.setAnswer({answer: newVal, index, correct})
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
    ...mapMutations('mock', ['setY']),
    ...mapActions('mock', ['setAnswer']),
  },
  components: {
    SingleChoice,
    MutipleChoice,
    Subjective,
    // Parser,
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
  word-break: break-all;
  padding: 30rpx 30rpx 60rpx;
  box-sizing: border-box;
}
.material .material-desc {
  float: left;
  margin-right: 20rpx;
  font-size: 28rpx;
  font-weight:500;
  color:rgba(236,116,160,1);
  line-height: 1.5em;
}
.question-card {
  position: absolute;
  border-radius: 16rpx 16rpx 0px 0px;
  background: #fff;
  left: 0;
  right: 0;
  bottom: 0;
  top: 50%;
  padding-top: 50rpx;
  box-shadow: 0px -5px 5px 0px rgba(0,0,0,0.15);
  .resize-bar {
    width: 150rpx;
    height: 120rpx;
    position: absolute;
    left: 50%;
    margin-left: -75rpx;
    top: -70rpx;
    z-index: 10;
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
  // border: 1px solid #000;
  .moveable-content {
    position: absolute;
    height: 50rpx;
    width: 750rpx;
    left: -300rpx;
    top: 75rpx;
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