
<script>
  import { mapActions, mapMutations } from 'vuex'
  export default {
    onLaunch: function() {
      this.getSystemInfo()
      this.getUserOpenId()
      this.getStatus()
      this.getAllSubjects();
      
      if(uni.getStorageSync('version') != '2.1'){//新版本需要先清理本地数据
          uni.setStorageSync('version','2.1');
          uni.setStorageSync('selectSubject', '');
      }

      if (uni.canIUse('getUpdateManager')) {
        const updateManager = uni.getUpdateManager()
        updateManager.onCheckForUpdate(res => {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(() => {
              uni.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: res => {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(() => {
              // 新的版本下载失败
              uni.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
              })
            })
          }
        })
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        uni.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    },
    mounted() {
      if (!!uni.getStorageSync('selectSubject')) {
        let selectSubject = JSON.parse(uni.getStorageSync('selectSubject'))
        selectSubject.forEach(item => {
          if (item.areaId === -9 && item.categoryId === 1 && item.subjectId === 1 && item.name.includes('国考')) {
            item.name = item.name.replace('国考', '全国')
          }
        })
        uni.setStorageSync('selectSubject', JSON.stringify(selectSubject))
      }
    },
    methods: {
      ...mapActions(['getStatus','getAllSubjects', 'getUserOpenId']),
      ...mapMutations(['setPlatform']),
      getSystemInfo () {
        uni.getSystemInfo({
          success: (res) => {
            this.setPlatform(res.platform)
          }
        })
      }
    }
  }
</script>

<style>
  /*每个页面公共css */
  @import './static/common.css';
  @import './static/icon.css';
</style>
