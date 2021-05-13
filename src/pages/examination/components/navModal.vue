<template>
  <div class="nav-mask">
    <div class="nav-modal">
      <div class="desc1">
        <div>免费看模考解析课，或参加</div>
        <div>申论模考大赛请下载华图在线APP</div>
      </div>
      <div class="desc2">在客服会话中回复数字“1”下载</div>
      <button
        class="download_btn"
        :session-from="zhichi"
        open-type="contact"
      >前往下载：回复 1</button>
      <div class="desc3" @click="hide">我知道了</div>
    </div>
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
  computed: {
    ...mapState(['userInfo', 'zhichiParams', 'transferAction'])
  },
  data () {
    return {

    }
  },
  methods: {
    zhizhi () {
      return `sobot|${this.userInfo.nickName}|${this.userInfo.avatarUrl}|${this.zhichiParams}|transferAction=${this.transferAction}`
    },
    hide () {
      this.$emit('hide')
    }
  }
}
</script>

<style scoped>
.nav-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 9999;
  text-align: center;
}
.nav-mask .nav-modal {
  position: absolute;
  width: 560rpx;
  height: 470rpx;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  background: #fff;
  border-radius: 16px;
  padding: 56rpx 40rpx 30rpx;
  box-sizing: border-box;
}
.nav-mask .desc1 {
  font-size: 32rpx;
  color: #4A4A4A;
  font-weight:600;
}
.nav-mask .desc2 {
  font-size: 32rpx;
  font-weight:400;
  color:rgba(74,74,74,1);
  margin-top: 30rpx;
}
.nav-mask .download_btn {
  width: 360rpx;
  height: 88rpx;
  background: linear-gradient(90deg,rgba(255,228,164,1) 0%,rgba(255,181,39,1) 100%);
  color: #AB5214;
  font-size: 32rpx;
  border-radius:44rpx;
  line-height: 88rpx;
  margin: 60rpx auto 30rpx;
}
.nav-mask .desc3 {
  font-size:32rpx;
  font-weight:400;
  color:rgba(155,155,155,1);
}
</style>