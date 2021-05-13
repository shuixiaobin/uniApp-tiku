<template>
  <div class="blank-item" catchtouchmove="none">
    <span class="blank-num">{{1 + index}}.</span>
    <template v-if="platform === 'ios'">
      <div v-if="!showInput" @click="switchShowState(true)" class="blank-content">
        <div class="blank-line" v-for="(item, index) in splitValue" :key="index">{{item}}</div> 
      </div>
      <textarea 
        v-else
        :style="{height: areaHeight}"
        class="blank-content" 
        :maxlength="100"
        :value="value" 
        @input="inputChange"
        @linechange="lineChange"
        :disable-default-padding="true"
      />
    </template>
    <template v-else>
      <div v-if="!showTextArea" @click="switchShowState(true)" class="blank-content">
        <div class="blank-line" v-for="(item, index) in splitValue" :key="index">{{item}}</div> 
      </div>
      <textarea 
        :style="{height: areaHeight}"
        @blur="switchShowState(false)"
        class="blank-content" 
        :maxlength="100"
        v-else
        :auto-height="true"
        :auto-focus="true"
        :value="value" 
        @input="inputChange"
        :disable-default-padding="true"
      />
    </template>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { mapState } from 'vuex'
export default {
  props: ['index', 'value', 'showInput'],
  computed: {
    ...mapState(['platform']),
    splitValue () {
      if (typeof this.value === 'string') {
        return this.value.split('\n')
      }
      return [this.value]
    },
    areaHeight () {
      if (this.lineHeight === 0) {
        return '1em'
      }
      return this.lineHeight + 'px'
    }
  },
  data () {
    return {
      showTextArea: false,
      lineHeight: 0,
    }
  },
  methods: {
    inputChange (e) {
      this.$emit('change', e.detail.value)
    },
    switchShowState (value) {
      this.showTextArea = value
    },
    lineChange (e) {
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