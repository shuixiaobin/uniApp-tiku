<template>
  <div>
    <div 
      class="choices" 
      v-for="(item, index) in choices" 
      :key="index"
    >
      <div class="choices-option">{{translate(index)}}.</div>
      <div class="choices-detail" v-html="item"></div>
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
  props: [ 'choices' ],
  methods: {
    translate (num)  {
      return String.fromCharCode('A'.charCodeAt(0) + num)
    },
  },
}
</script>

<style scoped>
.choices {
  display: flex;
  min-height: 88rpx;
  padding: 10rpx 0;
  align-items: center;
  width: 100%;
}
.choices-option {
  white-space: nowrap;
  flex-basis: 1.5em;
  min-width: 1.5em;
  height: 80rpx;
  border-radius: 50%;
  text-align: center;
  line-height: 80rpx;
  display: block;
}
.choices-detail {
  display: block;
  flex-grow: 1;
}
</style>