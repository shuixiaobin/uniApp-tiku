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
        :class="{selected: currentAnswer.search(String(index + 1)) !== -1}" 
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
  props: ['questionInfo', 'answer'],
  watch: {
    answer: {
      immediate: true,
      handler () {
       if (typeof this.answer === 'object') {
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
    handleChoicesClick (curAnswer) {
      const answer = this.currentAnswer.split('').sort()
      if (answer.some(item => item === curAnswer)) {
        // 删除
        const newVal = answer.filter(item => item !== curAnswer).join('')
        this.$emit('choiceChange', {
          newVal,
          index: this.questionInfo.index,
          selected: !!newVal,
        })
        this.currentAnswer = newVal
      } else {
        if (answer.length === 2) {
          uni.showToast({
            icon: 'none',
            title: '只能选两个哦'
          })
          return
        }
        // 添加
        const newVal = answer.concat([curAnswer]).sort().join('')
        this.$emit('choiceChange', {
          newVal: newVal, 
          index: this.questionInfo.index,
          selected: true,
        })
        this.currentAnswer = newVal
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.question-detail {
  padding: 20rpx;
  padding-bottom: 0;
  font-size: 36rpx;
  font-weight:400;
  color:rgba(74,74,74,1);
  line-height: 50rpx;
  overflow: auto;
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
  border:1rpx solid rgba(74,74,74,1);
  text-align: center;
  line-height: 80rpx;
  display: block;
  border-radius: 8rpx;
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
