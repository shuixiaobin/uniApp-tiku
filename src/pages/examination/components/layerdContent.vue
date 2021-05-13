<template>
  <div>
    <div class="material-box">
      <span class="material-desc">({{ materialName }})</span>
      <span v-html="material"></span>
    </div>
    <template v-if="!hasMaterial">
      <Choices v-if="questionType === 'MxuanN'" :choices="questionInfo.choices" />
      <MatchingChoices v-else-if="questionType === 'Matching'" :choices="questionInfo.choices" />
    </template>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import Choices from './choices'
import MatchingChoices from './matchingChoices'
export default {
  props: ['questionInfo', 'questionType'],
  computed: {
    hasMaterial () {
      return !!this.questionInfo.material
    },
    material () {
      if (this.hasMaterial) return this.questionInfo.material
      return this.questionInfo.stem
    },
    materialName () {
      if (this.hasMaterial) return '材料'
      return this.questionInfo.teachType
    }
  },
  components: {
    Choices,
    MatchingChoices,
  }
}
</script>

<style scoped>
.material-box {
  overflow: hidden;
  margin-bottom: 20rpx;
}
.material-desc {
  float: left;
  margin-right: 20rpx;
  font-weight:500;
  color:rgba(236,116,160,1);
}
.choices {
  display: flex;
  min-height: 88rpx;
  padding: 10rpx 0;
  align-items: center;
}
.choices-option {
  flex-basis: 30rpx;
  min-width: 30rpx;
  height: 80rpx;
  border-radius: 50%;
  text-align: center;
  line-height: 80rpx;
  display: block;
}
.choices-detail {
  display: block;
  flex-grow: 1;
  padding-left: 20rpx;
}
</style>