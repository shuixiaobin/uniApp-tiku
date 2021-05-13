<template>
  <div>
    <div v-for="(item, index) in choices" :key="index" class="choices-wrap">
      <div class="choice-item" v-for="(choice, idx) in item" :key="idx" v-html="choice"></div>
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
  props: ['choices'],
}
</script>

<style scoped lang="scss">
.choices-wrap {
  border-bottom: 1px solid #E0E0E0;
  padding-bottom: 15rpx;
  &:last-child {
    border: none;
  }
}
.choice-item {
  line-height: 1.2em;
  padding: 30rpx 0;
  font-size: 32rpx;
}
</style>