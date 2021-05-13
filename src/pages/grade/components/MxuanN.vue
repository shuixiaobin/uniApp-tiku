<template>
  <div class="question-detail">
    <template v-if="hasMaterial">
      <div>
        <span class="question-type-desc">({{ questionInfo.teachType }})</span><span v-html="questionInfo.stem"></span>
      </div>
      <Choices :choices="questionInfo.choices" />
    </template>
    <div>
      <div class="option-wrap" v-for="item in questionInfo.answerNum" :key="item">
        <span style="float: left; width: 40rpx;">{{1+item}}.</span>
        <div style="margin-left: 40rpx">
          <ChoicesList 
            :choicesNumber="questionInfo.choiceNum"
            :value="selected[item]"
            :wordArr="wordArr"
            :shouldAnswer="String(questionInfo.answer).split('')[item] -1"
            @change="handleChoicesClick(item, $event)"
          />
        </div>
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
import Choices from './choices'
import ChoicesList from './choicesList'
import { wordArr1 } from '@/utils/util'
const defaultValue = -1
export default {
  props: ['questionInfo', 'answer'],
  computed: {
    hasMaterial () {
      return !!this.questionInfo.material
    }
  },
  watch: {
    'questionInfo.answerNum': {
      immediate: true,
      handler (val) {
        if (!this.answer) {
          this.selected = Array.from(new Array(val)).fill(defaultValue)
        } else {
          this.selected = this.answer.map(item => Number(item) - 1)
        }
      }
    }
  },
  data () {
    return {
      wordArr: wordArr1.slice(),
      selected: []
    }
  },
  methods: {
    handleChoicesClick (i, ans) {
      this.selected = this.selected.map((item, index) => {
        if (index == i) return ans
        if (item === ans) return defaultValue
        return item
      })
      this.$emit('change', {
        value: this.selected.map(num => String(num + 1)),
        index: this.questionInfo.index
      })
    }
  },
  components: {
    Choices,
    ChoicesList,
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
.option-wrap {
  overflow: hidden;
  line-height: 70rpx;
  padding-top: 30rpx;
  background: #FAFAFA;
  margin-top: 5rpx;
  padding-left: 20rpx;
  font-size: 32rpx;
}
</style>