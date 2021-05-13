<template>
  <div class="question-detail">
    <div>
      <span class="question-type-desc">({{ questionInfo.teachType }})</span><span v-html="questionInfo.stem"></span>
    </div>
    <div class="not-support-tips">本题暂不支持作答，可在交卷后查看答案及解析</div>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
export default {
  props: ['questionInfo', 'answer']
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
.not-support-tips {
  font-size: 28rpx;
  font-weight:500;
  color:rgba(155,155,155,1);
  text-align: center;
  margin: 40rpx 0;
  padding: 38rpx 0;
  border-top: 1px solid #E7E7E7;
}
</style>