<template>
  <div>
    <NavBar :title="title" ref="navBar" />
    <div>
      <div class="folder-pic">
        <img style="width: 100%; height: 100%;" src="@/static/grade/folder.png" alt="">
      </div>
      <div class="folder-desc">
        <div>1、点击按钮复制下载链接{{url}}</div>
        <div>2、打开浏览器访问即可下载文件</div>
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
      title: '下载试卷',
      url: ''
    }
  },
  onLoad (options) {
    this.title = options.title.length <= 7 ? options.title : options.title.slice(0, 7) + '...'
    this.paperId = options.paperId
    this.getDownloadLink()
  },
  methods: {
    setClipboardData () {
      if (!this.url) return
      wx.setClipboardData({data: this.url})
    },
    getDownloadLink () {
      getDonwloadLink({
        exportType: 2,
        paperId: this.paperId,
        paperType: 2
      }).then(res => {
        this.url = res.data.url
      }).catch(e => {
        uni.showToast({
          title: '获取下载链接失败',
          icon: 'none',
          duration: 2000
        })
      })
    }
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