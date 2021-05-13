<template>
  <div class="question-detail">
    <div v-if="showQuestion">
      <span class="question-type-desc">({{ questionInfo.teachType }})</span><span v-html="questionInfo.stem"></span>
    </div>
    <div v-for="(item, index) in vacancyArray" :key="index" >
      <BlankItem :index="index" :value="vacancyArray[index]" @change="handleChange(index, $event)"/>
    </div>
  <!--
    <div class="blank"></div>
      <div class="bottom-btn-wrapper" v-if="showCoverView">
        <button class="next-question" @click="nextQuestion">下一题</button>
      </div> 
  -->
    </div>

</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import BlankItem from './blankItem'
import { mapState } from 'vuex'
export default {
  props: ['questionInfo', 'answer'],
  data () {
    return {
      vacancyArray: [],
      showCoverView: false,
    }
  },
  computed: {
    ...mapState('examination', ['currentIndex']),
    haveMaterial () {
      return !!this.questionInfo.material
    },
    showQuestion () {
      if (!this.haveMaterial) {
        return !this.questionInfo.layered
      }
      return true
    }
  },
  watch: {
    questionInfo: {
      immediate: true,
      handler (val) {
        if (this.answer) {
          this.vacancyArray = this.answer.slice()
        } else {
          this.vacancyArray = new Array(val.blankNum).fill('')
        }
      }
    },
    currentIndex: {
      immediate: true,
      handler (val) {
        if (val === this.questionInfo.index) {
          setTimeout(() => {
            if (this.currentIndex === this.questionInfo.index) {
              this.showCoverView = true
            }else {
              this.showCoverView = false
            }
          }, 1000)
        } else {
          this.showCoverView = false
        }
      }
    },
  },
  methods: {
    handleChange (index, value) {
      this.$set(this.vacancyArray, index, value)
      this.$emit('change', {
        value: this.vacancyArray.slice(), 
        index: this.questionInfo.index
      })
    },
    nextQuestion () {
      this.$emit('next')
    }
  },
  components: {
    BlankItem,
  }
}
</script>

<style scoped lang="scss">
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
  line-height: 1.2em;
  font-weight:500;
  color:rgba(236,116,160,1);
}
.next-question {
  font-size: 40rpx;
  padding: 24rpx auto;
  background: #FE2F41;
  color: #fff;
  line-height: 88rpx;
  border-radius: 44rpx;
}
.blank {
  height: 210px;
}
.bottom-btn-wrapper {
  position: fixed;
  z-index: 1000000;
  bottom: 0;
  height: 210rpx;
  background: #fff;
  left: 0;
  right: 0;
  padding: 0 50rpx;
}
</style>