<template>
  <div class="question-detail">
    <template v-if="hasMaterial">
      <div>
        <span class="question-type-desc">({{ questionInfo.teachType }})</span><span v-html="questionInfo.stem"></span>
      </div>
      <MatchingChoices :choices="questionInfo.choices" />
    </template>
    <div>
      <div class="option-wrap" v-for="item in questionInfo.choiceNum" :key="item">
        <span style="float: left; width: 40rpx;word-break: normal;">{{1+item}}.</span>
        <div style="margin-left: 40rpx">
          <ChoicesList 
            :choicesNumber="questionInfo.choiceNum"
            :value="selected[item][0]"
            :wordArr="wordArr1"
            @change="handleChoicesClick(item, $event, 0)"
          />
          <ChoicesList 
            v-if="questionInfo.groupNum === 2"
            :choicesNumber="questionInfo.choiceNum"
            :value="selected[item][1]"
            :wordArr="wordArr2"
            @change="handleChoicesClick(item, $event, 1)"
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
import MatchingChoices from './matchingChoices'
import ChoicesList from './choicesList'
import { wordArr1, wordArr2 } from '@/utils/util'
const defaultValue = -1
export default {
  props: ['questionInfo', 'answer'],
  computed: {
    hasMaterial () {
      return !!this.questionInfo.material
    }
  },
  watch: {
    questionInfo: {
      immediate: true,
      handler (value) {
        if (this.answer) {
          this.selected = this.answer.map(str => {
            return str.split(',').map(item => Number(item) - 1)
          })
        } else {
          this.reset()
        }
      }
    }
  },
  data () {
    return {
      selected: [],
      wordArr1: wordArr1.slice(),
      wordArr2: wordArr2.slice(),
    }
  },
  methods: {
    reset () {
      const value = this.questionInfo
      this.selected = Array
        .from(new Array(value.choiceNum))
        .map(item => new Array(value.groupNum).fill(defaultValue))
      this.$emit('change', {
        ...this.formateData(), 
        index: this.questionInfo.index,
      })
    },
    handleChoicesClick (i/* 第几题 */, ans, idx/* 第几组 */) {
      this.selected = this.selected.map((arr, index) => {
        const ret = arr.slice()
        if (index === i) {
          if (ret[idx] === ans) {
            ret[idx] = defaultValue
          } else {
            ret[idx] = ans
          }
        } else {
          if (ret[idx] === ans) {
            ret[idx] = defaultValue
          }
        }
        return ret
      })
      this.$emit('change', {
        ...this.formateData(),
        index: this.questionInfo.index,
      })
    },
    formateData () {
      const ret = {}
      let f = false
      let next = true
      ret.value = this.selected.map(item => {
        return item.map(item => {
          if (next && item + 1 === 0) next = false
          if (!f && item + 1 !== 0) f = true
          return String(item + 1)
        }).join(',')
      })
      ret.selected = f
      ret.next = next
      return ret
    }
  },
  components: {
    MatchingChoices,
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
  padding-top: 20rpx;
  background: #FAFAFA;
  margin-top: 5rpx;
  padding-left: 20rpx;
  font-size: 32rpx;
}
.choices-option {
  min-width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  border:1rpx solid rgba(74,74,74,1);
  text-align: center;
  display: inline-block;
  margin: 0 10rpx 10rpx;
  background: #F6F6F6;
  color: rgba(74,74,74,1);
  &.selected {
    border-color: #F6F6F6;
    background-color:#FF85B2;
    color: #fff;
  }
}
</style>