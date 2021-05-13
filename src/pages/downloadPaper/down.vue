<template>
  <div>
    <NavBar :title="title" ref="navBar" />
    <div>
      <div class="folder-pic">
        <img style="width: 100%; height: 100%;" src="@/static/grade/folder.png" alt="">
      </div>
      <div class="folder-desc">
        <div>1、点击按钮复制下载链接{{url}}</div>
        <div>2、打开浏览器访问即可下载</div>
      </div>

      <button @click="setClipboardData" class="folder-btn">复制下载链接</button>
    </div>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import NavBar from '@/components/navBar'
import { getDonwloadLink } from '@/utils/mockExamApi'
export default {
  data () {
    return {
      title: '华图在线APP',
      url: 'https://ns.huatu.com/h5/index.html?type=2'
    }
  },
  onLoad (options) {
  },
  methods: {
    setClipboardData () {
      if (!this.url) return
      wx.setClipboardData({data: this.url})
    },
  },
  components: {
    NavBar,
  }
}
</script>

<style scoped>
.folder-pic {
  width: 480rpx;
  height: 480rpx;
  margin: 136rpx auto;
}
.folder-desc {
  margin: 0 auto;
  width: 480rpx;
  font-size: 24rpx;
  color: #7E7E7E;
  line-height: 34rpx;
}
.folder-btn {
  width:650rpx;
  height:100rpx;
  background:linear-gradient(90deg,rgba(255,228,164,1) 0%,rgba(255,181,39,1) 100%);
  border-radius:50rpx;
  margin: 0 auto;
  color: #AB5214;
  font-size: 36rpx;
  line-height: 100rpx;
  margin-top: 120rpx;
}
</style>