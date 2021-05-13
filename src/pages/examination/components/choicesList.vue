<template>
  <div>
    <span 
      class="choices-option" 
      :class="{selected: value === i}" 
      @click="handleChoicesClick(i)" 
      v-for="i in choicesNumber" 
      :key="i"
    >{{wordArr[i]}}</span>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
export default {
  props: ['wordArr', 'value', 'choicesNumber'],
  methods: {
    handleChoicesClick (index) {
      this.$emit('change', index)
    }
  },
}
</script>

<style scoped lang="scss">
.choices-option {
  min-width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  border:1rpx solid rgba(74,74,74,1);
  text-align: center;
  display: inline-block;
  margin: 0 10rpx 30rpx;
  background: #F6F6F6;
  color: rgba(74,74,74,1);
  &.selected {
    border-color: #F6F6F6;
    background-color:#FF85B2;
    color: #fff;
  }
}
</style>