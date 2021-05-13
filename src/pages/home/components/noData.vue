<template>
  <div class="noData">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props:{
    desc:{
      type:String,
      default:''
    }
  },
}
</script>
<style lang="scss" scoped>
.noData {
  font-size: 37rpx;
  font-weight: 500;
  color: rgba(155, 155, 155, 1);
  line-height: 52rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 65vh;
}
</style>
