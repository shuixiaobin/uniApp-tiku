<template>
  <div class="wait-countdown">
    <div style="margin-right: 52rpx;">{{time}}</div>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { mapState } from 'vuex'
import { transTimeStr2 } from '@/utils/util'
export default {
  computed: {
    ...mapState('mock', ['waitTime']),
    time () {
      return transTimeStr2(Math.floor(this.waitTime / 1000))
    }
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
.wait-countdown {
  width: 290rpx;
  height: 118rpx;
  background: url('../../../static/grade/countdown.png');
  position: fixed;
  bottom: 30rpx;
  left: 50%;
  margin-left: -144rpx;
  background-size: 100%;
  background-repeat: no-repeat;
  line-height: 118rpx;
  text-align: right;
  color: #AB5214;
  font-size: 32rpx;
  font-weight: bold;
  font-style:italic;
}
</style>