<template>
  <div class="question-detail">
    <div>
      <span class="question-type-desc">{{ questionInfo.teachType }}</span><span v-html="questionInfo.stem"></span>
    </div>
    <div :class="{isCorrect: questionInfo.answer.toString() === questionInfo.uAnswer.toString() , isWrong: questionInfo.answer.toString() !== questionInfo.uAnswer.toString() }">
      <div 
        class="choices" 
        v-for="(item, index) in questionInfo.choices" 
        :key="index"
        @click="handleChoicesClick(String(index + 1))"
        :class="{
          standard: questionInfo.answer.toString() == String(index+1),
          user: questionInfo.uAnswer.toString() == String(index + 1)
        }"
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
  methods: {
    translate (num)  {
      return String.fromCharCode('A'.charCodeAt(0) + num)
    },
    handleChoicesClick (answer) {
      this.$emit('choiceChange', {oldVal: this.answer, newVal: answer, index: this.questionInfo.index})
    }
  },
  mounted () {
   // console.log(this.questionInfo)
   // console.log(this.answer) // this.answer正确答案

/*
    一.用户答错的情况下：
    
      1.用户答案是红色实心的；
      2.正确答案是绿色，空心

    二.用户答对的情况下：
      选项是绿色实心
*/
    
  },
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
  font-size: 28rpx;
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
  color: #4A4A4A;
  font-weight: 600;
}

.choices-detail {
  display: block;
  flex-grow: 1;
  padding-left: 20rpx;
}

/*
.wrong{
  .choices-option {
    border-color: #FF3F47;
    background-color: #FF3F47;
    color: #fff;
  }
}
.right{
  .choices-option {
    border-color: #49CF9E;
    background-color: #fff;
    color: #49CF9E;
  }
}
*/

.isCorrect {
  .standard,.user{
    .choices-option {
      border-color: #49CF9E; 
      background-color: #49CF9E;
      color: #fff;
    }
  }
}


.isWrong {
  .standard{
    .choices-option {
      border-color: #49CF9E;
      color: #49CF9E;
    }
  }
  .user{
    .choices-option {
      border-color: #FF3F47;
      background-color: #FF3F47;
      color: #fff;
    }
  }
}
</style>