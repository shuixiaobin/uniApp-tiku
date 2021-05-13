<template>
  <div>
    <div :class="{isCorrect: value == shouldAnswer , isWrong: value != shouldAnswer , isNotDone: value < 0 }">
      <span 
        class="choices-option" 
        :class="{selected: value === i ,standard: shouldAnswer == i  ,user: value == i }" 
        @click="handleChoicesClick(i)" 
        v-for="i in choicesNumber" 
        :key="i"
      >
      {{wordArr[i]}}</span>
    </div>

  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */


/* 
isFirst --A
isFirst --a
*/


export default {
  props: ['wordArr', 'value', 'choicesNumber',"shouldAnswer"],
    computed: {

  },
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

.isCorrect {
  .standard,.user{
      border-color: #49CF9E; 
      background-color: #49CF9E;
      color: #fff;
  }
}

.isWrong {
  .standard{
      border-color: #49CF9E;
      background-color: transparent;
      color: #49CF9E;
  }
  .user{
      border-color: #FF3F47;
      background-color: #FF3F47;
      color: #fff;
  }
}

.isNotDone{
    .standard{
      border-color: #49CF9E; 
      background-color: transparent;
      color: #49CF9E;
  }
}

</style>