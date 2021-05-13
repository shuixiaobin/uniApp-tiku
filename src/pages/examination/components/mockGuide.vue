<template>
  <div @click="handleClose" v-show="showGuide" :style="{left: left + 'px', top: top + 'px'}" class="mock-guide">
    <div style="margin-top: 10px; height: 32px;">
      <div style="height: 32px; line-height: 32px; display: inline-block">
        <span class="close-guide iconfont iconbianzu"></span>
      </div>
      <span class="guide-desc">有急事？用<span class="guide-white">“浮窗”</span>可稍后继续</span>
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
  data () {
    return {
      showGuide: false,
      left: 0,
      top: 0,
    }
  },
  methods: {
    show () {
      const pos = wx.getMenuButtonBoundingClientRect()
      this.top = pos.top + pos.height;
      this.left = Math.floor(pos.left - 191)
      this.showGuide = true
    },
    handleClose () {
      this.showGuide = false
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.mock-guide {
  position: fixed;
  width: 243px;
  height: 42px;
  background-image: url('../../../static/grade/mock-guide.png');
  background-size: 100%;
  font-size: 13px;
  line-height: 32px;
  color: #102784;
  z-index: 10001;
}
.guide-desc {
  letter-spacing: 2rpx;
  display: inline-block;
}
.close-guide {
  vertical-align: middle;
  display: inline-block;
  color: #fff;
  font-size: 8px;
  padding-left: 10px;
  padding-right: 20px;
}
.guide-white {
  color: #fff;
}
</style>