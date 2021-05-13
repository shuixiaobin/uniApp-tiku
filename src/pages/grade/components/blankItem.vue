<template>

  <div class="blank-item"  :class="{right: value && answer.includes(value),error: !value || !answer.includes(value) }">
    <span class="blank-num">{{1 + index}}.</span>
    <div @click="switchShowState(true)" class="blank-content">
      <div class="blank-line" 
      v-for="(item, i) in splitValue" :key="i"
      >{{item}}</div> 
    </div> 

<!--     <textarea 
      :style="{height: areaHeight}"
      @blur="switchShowState(false)"
      class="blank-content" 
      v-else
      :auto-height="true"
      :auto-focus="true"
      :value="value" 
      @input="inputChange"
      @linechange="lineChange"
      :disable-default-padding="true"
    /> -->
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { mapState} from 'vuex'
export default {
  props: ['index', 'value'],
  computed: {
    ...mapState('analysis', ['qtList','currentIndex']),
    uAnswer(){  
      return String(this.qtList[this.currentIndex].uAnswer)
    },
    answer(){
      return String(this.qtList[this.currentIndex].answer[this.index])
    },
    splitValue () {
      if (typeof this.value === 'string') {
        return this.value.split('\n')
      }
      return [this.value]
    },
    areaHeight () {
      if (this.lineHeight === 0) {
        return 'initial'
      }
      return this.lineHeight + 'px'
    }
  },
  data () {
    return {
      showTextArea: false,
      lineHeight: 0,
      initital: false
    }
  },
  methods: {
    inputChange (e) {
      this.$emit('change', e.detail.value)
    },
    switchShowState (value) {
      if (!this.initital && value) {
        setTimeout(() => {
          this.initital = true
        }, 1000)
      } 
      this.showTextArea = value
    },
    lineChange (e) {
      if (!this.initital) return
      this.lineHeight = e.detail.height
    }
  }
}
</script>

<style scoped lang="scss">
.blank-item {
  margin: 20rpx 0;
  padding: 30rpx 10rpx;
  box-sizing: border-box;
  border-bottom: 1px solid #E0E0E0;
  &.error{
      color:#FF6D73;
      border-color: #FF6D73;
  }

  &.right{
      color:#00C792;  
      border-color:#00C792; 
  }
  .blank-num {
    float: left;
  }
  .blank-content {
    padding-left: 2em;
    width: 100%;
    height: initial;
    min-height: 1em;
    box-sizing: border-box;
    overflow: visible;
    .blank-line {
      min-height: 1em;
    }

  }
}
</style>