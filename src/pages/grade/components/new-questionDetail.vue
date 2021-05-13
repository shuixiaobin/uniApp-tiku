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
      <!-- 不带材料的 -->
      <LayerdContent :questionInfo="questionInfo" :questionType="questionType" />
    </div>
    <div style="background: #fff" :style="{top: y + 'px', opacity: moving ? 0.5 : 1}" :class="{ 'question-card': needLayered }">
      <div v-if="needLayered" class="resize-bar">
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="question-info-content" v-if="!top">
        <SingleChoice 
          v-if="questionType === 'single'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @choiceChange="handleSingleChange($event)"
        />
        <MutipleChoice
          v-else-if="questionType === 'mutiple'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @choiceChange="handleMutipleChange($event)"
        />
        <Matching
          ref="matching"
          v-else-if="questionType === 'Matching'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @change="matchingChange"
        />
    
        <FillBlank 
          v-else-if="questionType === 'FillBlank'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @change="fillBlankChange"
        />
 
        <MxuanN 
          v-else-if="questionType === 'MxuanN'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @change="MxuanNChange"
        />

        <MutipleChoice 
          v-else-if="questionType === 'Shuangxuan'"
          :questionInfo="questionInfo"
          :answer="answers[questionInfo.index]"
          @choiceChange="shuangxuanChange"
        />

        <Subjective 
          :questionInfo="questionInfo"
          v-else
        />
        <baseInfo :qi="questionInfo">
        
        </baseInfo>
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
import LayerdContent from './layerdContent'
import Subjective from './subjective'
import FillBlank from './fillBlank'
import MxuanN from './MxuanN'
import Matching from './matching'
//import Shuangxuan from './shuangxuan'
import { handleIndex } from './mixins'
import { mapState, mapMutations } from 'vuex'
import { questionTypes } from '@/utils/questionFormater'
import baseInfo from './baseInfo'


export default {
  mixins: [ handleIndex ],
  props: ['questionInfo'],
  computed: {
    questionType () {
      const type = this.questionInfo.type
      if (type in questionTypes) return questionTypes[type]
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
    needLayered () {
      if (this.questionInfo.layered) {
        return true
      }
      return this.questionInfo.material && !!this.questionInfo.material.trim()
    },
    ...mapState('analysis', ['answers']),
      ...mapState('analysis', ['y'])
  },
  data () {
    return {
      top: null,
      start: null,
      moving: false,
    }
  },
  mounted(){
    //console.log(this.questionInfo)
  },
  methods: {
    handleMovalbeTouchEnd (e) {
      if (!this.start) return
      const current = e.changedTouches[0]
      let y = this.y + current.pageY - this.start.pageY;
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
      this.moving = true
      this.start = e.touches[0]
    },

    handleSingleChange ({oldVal, newVal, index}) {

    },
    handleMutipleChange ({oldVal, newVal, index}) {

    },
    MxuanNChange ({value, index}) {

    },
    fillBlankChange ({value, index}) {

    },
    matchingChange ({value, index}) {

    },
    shuangxuanChange (data) {
    },
    ...mapMutations('analysis', ['setY']),
  },
  components: {
    SingleChoice,
    MutipleChoice,
    Subjective,
    baseInfo,
    FillBlank,
    MxuanN,
  /*   Shuangxuan, */
    Matching,
    LayerdContent
  }
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
  padding-top: 50rpx;
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