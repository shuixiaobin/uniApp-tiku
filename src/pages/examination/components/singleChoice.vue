<template>
  <div class="question-detail">
    <div>
      <span class="question-type-desc">({{ questionInfo.teachType }})</span><span v-html="questionInfo.stem"></span>
    </div>
    <div>
      <div 
        class="choices" 
        v-for="(item, index) in questionInfo.choices" 
        :key="index"
        @click="handleChoicesClick(String(index + 1))"
        :class="{selected: currentAnswer == String(index + 1)}" 
      >
        <div class="choices-option">{{translate(index)}}</div>
        <div class="choices-detail" v-html="item"></div>
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
export default {
  props: ['questionInfo', 'answer', 'disabled'],
  watch: {
    answer: {
      immediate: true,
      handler () {
        if (typeof this.answer === 'Object') {
          this.currentAnswer = this.answer[0]
        } else {
          this.currentAnswer = this.answer
        }
      }
    }
  },
  data () {
    return {
      currentAnswer: ''
    }
  },
  methods: {
    translate (num)  {
      return String.fromCharCode('A'.charCodeAt(0) + num)
    },
    handleChoicesClick (answer) {
      if (this.disabled) return 
      if (answer == this.currentAnswer) return
      this.$emit('choiceChange', {
        newVal: answer, 
        selected: !!answer,
        index: this.questionInfo.index,
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.question-detail {
  padding: 20rpx;
  font-size: 36rpx;
  font-weight:400;
  color:rgba(74,74,74,1);
  line-height: 50rpx;
  word-break: break-all;
  img {
    max-width: 100%;
  }
}
.question-type-desc {
  float: left;
  margin-right: 20rpx;
  font-weight:500;
  color:rgba(236,116,160,1);
}
.choices {
  display: flex;
  min-height: 88rpx;
  padding: 20rpx 0;
  align-items: center;
}
.choices-option {
  flex-basis: 80rpx;
  min-width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border:1rpx solid rgba(74,74,74,1);
  text-align: center;
  line-height: 80rpx;
  display: block;
}
.selected {
  background: #FAFAFA;
}
.selected .choices-option {
  border-color: #FF85B2;
  background-color:#FF85B2;
  color: #fff;
}
.choices-detail {
  display: block;
  flex-grow: 1;
  padding-left: 20rpx;
}
</style>