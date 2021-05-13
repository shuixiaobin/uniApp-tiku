<template>
  <view>
    <navBar
      title="成绩统计"
      :colorObj="headConfig"
    ></navBar>
    <div
      class="grade"
      v-if="paper"
    >
      <div class="head_info">
        <div class="base_info">
          <span class="base base_type">类型：精准估分</span><br>
          <span class="base">用时：{{expandTime}}</span>
        </div>
        <div class="title">{{paper.name}}</div>
        <canvas
          v-show="!src"
          style="width: 300rpx; height: 300rpx; margin: 0 auto"
          canvas-id="firstCanvas"
        ></canvas>
        <img
          class="grade_img"
          :src="src"
          v-if="src"
          alt=""
        >
        <!--<img-->
          <!--v-if="card.hasGift"-->
          <!--class="gift"-->
          <!--@tap="goToGift"-->
          <!--:src="card.rightImgUrl"-->
          <!--alt=""-->
        <!--&gt;-->
        <!-- <div class="gift" v-if="card.hasGift" @tap="goToGift"></div> -->
        <button
          open-type="share"
          class="share"
        ></button>
        <div class="time">交卷时间：{{submitTime}}</div>
        <div class="p30 grade-job" v-if="card.cardUserMeta && card.cardUserMeta.schoolCount > 0">{{card.cardUserMeta && card.cardUserMeta.schoolName}}</div>
      </div>
      <div class="other_info">
        <div class="other"><span class="num"> {{card?card.rcount:0}} <span class="small">/{{paper?paper.qcount:0}}题</span></span><span class="other_title">答对</span></div>
        <div class="other"><span class="num">{{card?card.cardUserMeta.averageStr:0}}</span><span class="other_title">全站平均得分</span></div>
        <div class="other"><span class="num">{{card?card.cardUserMeta.beatRate:0}}%</span><span class="other_title">已击败考生</span></div>
        <div class="other" v-if="card.cardUserMeta && card.cardUserMeta.schoolCount > 0"><span class="num"> {{card.cardUserMeta.schoolRank}} <span class="small">/{{card.cardUserMeta.schoolCount}}</span></span><span class="other_title">同职位排名</span></div>
        <div class="other" v-if="card.cardUserMeta && card.cardUserMeta.schoolAverage"><span class="num">{{card.cardUserMeta.schoolAverage}}</span><span class="other_title">同职位平均分</span></div>
        <div class="other" v-if="card.cardUserMeta && card.cardUserMeta.schoolMax"><span class="num">{{card.cardUserMeta.schoolMax}}</span><span class="other_title">同职位最高分</span></div>
      </div>
      <view class="ad" v-if="card.hasGift">
        <!-- <view class="text">{{card.reportAdvert}}</view> -->
        <view class="content">
      <!--      
          <img class="orcode" :src="card.qrCodeImageUrl" alt="">
          <view class="wx">
            <view class="wx_title">微信号</view>
            <view class="wx_content">{{card.wechat}}</view>
          </view>
          <view class="receive">
            <view class="btn small" v-if="card.hasGetBigGift" @tap="goToGift">已领取<br>查看详情</view>
            <view class="btn" v-else @tap="getGift">领取<br>礼包</view>
          </view> -->
          <img class="orcode" :src="card.afterAddGroupUrl" v-if="card.hasGetBigGift" @tap="goToGift" alt="">
          <img class="orcode" :src="card.beforeAddGroupUrl" v-else @tap="getGift" alt="">
        </view>
     <!--    <view class="tip">截屏保存页面，微信识别二维码打开</view> -->
      </view>
      <view
        class="download"
        v-if="status > 1"
      >
        <button
          class="download_btn"
          :session-from="zhichi"
          open-type="contact"
        ></button>
        <img
          src="http://p.htwx.net/wxtk/download.png"
          alt=""
        >
      </view>
      <div class="knowledge">
        <div class="kl_title">知识点情况</div>
        <div
          v-for="item in points"
          :key="item.id"
        >
          <div
            class="lv1"
            @tap="toggle(item)"
          >
            <span :class="[item.active ? 'hasLine':'']"></span>
            <span
              class="icon_box iconfont"
              :class="[item.active ? 'iconshouqitubiao' : 'iconzhankaitubiao']"
            ></span>
            <div class="module">
              <div class="module_name">{{item.name}}</div>
              <div class="module_info">共{{item.qnum}}道，答对{{item.rnum}}道，正确率{{item.accuracy}}%</div>
            </div>
          </div>
          <div
            v-for="(i,index) in item.children"
            :key="i.id"
            v-if="item.active"
          >
            <div
              class="lv2"
              @tap="toggle(i)"
            >
              <span :class="[ ((index < item.children.length-1)|| i.active) ? 'hasLine':'hasTopLine']"></span>
              <span
                class="icon_box iconfont"
                :class="[i.active ? 'iconshouqitubiao' : 'iconGroup']"
              ></span>
              <div class="module">
                <div class="module_name">{{i.name}}</div>
                <div class="module_info">共{{i.qnum}}道，答对{{i.rnum}}道，正确率{{i.accuracy}}%</div>
              </div>
            </div>
            <div
              v-for="(j,jIndex) in i.children"
              :key="j.id"
              v-if="i.active"
            >
              <div class="lv3">
                <span :class="[ ((jIndex < i.children.length-1)||index<item.children.length-1) ? 'hasLine':'hasTopLine']"></span>
                <span class="icon_box iconfont iconOval"></span>
                <div class="module">
                  <div class="module_name">{{j.name}}</div>
                  <div class="module_info">共{{j.qnum}}道，答对{{j.rnum}}道，正确率{{j.accuracy}}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card_title">答题卡</div>
        <div class="module_box">
          <div
            class="module"
            v-for="item in modules"
            :key="item.category"
          >
            <div class="module_title">{{item.name}}</div>
            <div class="qt_list">
              <span
                class="qt"
                v-for="i in item.qcount"
                :key="i"
                :class="[qtList[item.startIndex+i].correct,qtList[item.startIndex+i].disabled]"
                @click="goToAnalysis(true, item.startIndex+i)"
              >{{item.startIndex + i+1}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="analysis">
        <div class="button_box">
          <span
            class="button"
            @tap="goToAnalysis(false)"
          >错题解析</span>
          <span
            class="button"
            @tap="goToAnalysis(true)"
          >全部解析</span>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
  import navBar from '@/components/navBar.vue'
  import { getReport, getQuestions, share, getStatus, getGift } from '../../utils/api'
  import { formatTime, getHMSBySecond } from '../../utils/util'
  import { mapActions, mapMutations, mapState } from 'vuex'

  export default {
    name: 'index',
    components: {
      navBar
    },
    data() {
      return {
        headConfig: {
          bgColor: '#FF85B2',
          iconBg: 'rgba(0,0,0,.2)',
          iconColor: '#fff'
        },
        total: 0,
        grade: 0,
        coe: 0, //canvas 绘图系数，rpx => px
        paper: null, //试卷数据
        card: null, //整个答题卡数据
        id: '', //答题卡ID
        points: [], //知识点
        qtList: [], //试题列表
        shareId: '', //分享的答题卡ID
        shareName: '', //分享的名字
        src: '',
        status: '',
        courseId: ''
      }
    },
    watch: {
      grade(val) {
        const radius = (val / this.total) * Math.PI * 2 - Math.PI / 2
        this.draw(radius)
      }
    },
    computed: {
      submitTime() {
        if (this.card && this.card.createTime) {
          return formatTime(new Date(this.card.createTime))
        }
        return ''
      },
      expandTime() {
        if (this.card && this.card.expendTime) {
          return getHMSBySecond(this.card.expendTime).string
        }
        return '00:00:00'
      },
      modules() {
        if (this.paper) {
          const modules = this.paper.modules
          let i = 0
          modules.forEach(item => {
            item.startIndex = i
            i += item.qcount
          })
          return modules
        } else {
          return []
        }
      },
      zhichi() {
        return `sobot|${this.userInfo.nickName}|${this.userInfo.avatarUrl}|${this.zhichiParams}|transferAction=${this.transferAction}`
      },
      ...mapState(['userInfo', 'zhichiParams', 'transferAction'])
    },
    methods: {
      draw(radius) {
        const ctx = uni.createCanvasContext('firstCanvas')
        //背景圈
        ctx.beginPath()
        ctx.setStrokeStyle('#DD6692')
        ctx.setLineWidth(20 * this.coe)
        ctx.lineCap = 'round'
        ctx.arc(150 * this.coe, 150 * this.coe, 130 * this.coe, -Math.PI / 2, 2 * Math.PI)
        ctx.stroke()

        if (this.grade > 0) {
          //成绩圈
          ctx.beginPath()
          ctx.setStrokeStyle('#fff')
          ctx.setLineWidth(20 * this.coe)
          ctx.lineCap = 'round'
          ctx.arc(150 * this.coe, 150 * this.coe, 130 * this.coe, -Math.PI / 2, radius)
          ctx.stroke()
        }
        //添加成绩文字
        let left = 150
        // if(String(this.grade).length>3){
        // left = 60;
        // }else if(String(this.grade).length<2){
        // left = 120;
        // }
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'

        ctx.setFontSize(32 * this.coe)
        left -= ((ctx.measureText('分').width + 20) / 2) | 0

        ctx.setFontSize(80 * this.coe)
        ctx.fillText(this.grade, left * this.coe, 160 * this.coe)

        const fl = ctx.measureText(this.grade + '').width
        ctx.setFontSize(32 * this.coe)
        ctx.fillText('分', ((left + 20) * this.coe + fl / 2) | 0, 150 * this.coe)

        ctx.fillStyle = '#D93C76'
        ctx.setFontSize(36 * this.coe)
        ctx.fillText(`共${this.paper.qcount}题`, 150 * this.coe, 220 * this.coe)

        let _this = this
        ctx.draw(false, _ => {
          uni.canvasToTempFilePath({
            canvasId: 'firstCanvas',
            success(res) {
              _this.src = res.tempFilePath
            },
            fail(err) {
              console.log(err)
            }
          })
        })
      },
      //计算 px2rpx 系数
      getCoe() {
        const res = uni.getSystemInfoSync()
        this.coe = res.windowWidth / 750
      },
      //获取页面数据
      getReportData(id = '') {
        // 570975112563946521
        let param = { id }
        getReport(param)
          .then(res => {
            this.paper = res.paper
            this.shareName = this.paper.paperName
            // if (this.shareName && this.shareName.includes('公务员')) {
            //   this.shareName = this.shareName.replace('全国', '国考')
            // }
            this.card = res
            this.courseId = res.courseId;
            this.points = res.points
            //分数
            this.grade = res.score
            this.total = this.paper.score
            const radius = (this.grade / this.total) * Math.PI * 2 - Math.PI / 2
            this.draw(radius)
            //处理 知识点
            if (this.points && this.points.length > 0) {
              this.points.forEach(item => {
                this.$set(item, 'active', false)
                if (item.children)
                  item.children.forEach(i => {
                    this.$set(i, 'active', false)
                  })
              })
            }
            this.getQt(this.paper.questions)
            this.share()
          })
          .catch(e => {
            uni.showToast({
              title: e.message,
              icon: 'none'
            })
          })
      },
      //知识点展开收起
      toggle(item) {
        item.active = !item.active
        //收起第一级时 将第二级也收起
        if (item.active === false && item.level === 0) {
          item.children.forEach(i => {
            i.active = false
          })
        }
      },
      getQt(list) {
        const supportQuestionType = [99, 100, 101, 109,123,125,124,126,98,127]
        getQuestions(this.paper.id, list.join(',')).then(res => {
          this.qtList = res.data.map((item, index) => {
            let correct = ''
            if (this.card.corrects[index] === 0) {
              correct = 'unanswered'
            } else if (this.card.corrects[index] === 2) {
              correct = 'error'
            } else if (this.card.corrects[index] === 4) {
              correct = 'halfError'
            }

            return {
              correct, //答题状态类
              disabled: supportQuestionType.includes(item.type) ? '' : 'disabled', //是否可答
              id: item.id
            }
          })
        })
      },
      //前往解析页  flag: 是否全部题目  index: 当前题序
      goToAnalysis(flag, index = 0) {
        this.getReport({
          cardId: this.id,
          isAll: flag
        })
        if (this.qtList.some(item => item.correct === 'error' || item.correct === 'halfError') || flag) {
          uni.navigateTo({
            url: `/pages/grade/analysis?cardId=${this.id}&index=${index}&isAll=${flag}`
          })
        } else {
          uni.showToast({
            title: '没有错题',
            icon: 'none'
          })
        }
      },
      //前往大礼包
      goToGift() {
        //URL 传递会丢失参数，故采用storage存储
        // let url = 'http://10.1.16.143:8888/fight.html?token=5df0808488d24a889a304c2fb62ca575&hasGetBigGift=0&courseId=97852&paperId=3529200'
        // uni.setStorageSync('giftHtmlUrl', url)
        uni.setStorageSync('giftHtmlUrl', this.card.giftHtmlUrl)
        uni.navigateTo({
          url: `/pages/grade/gift`
        })
      },
      //领取礼包
      getGift(){
      	wx.showLoading({
            mask: true
        })
        getGift({classId: this.courseId}).then(res=>{
        	this.card.hasGetBigGift = 1;
        	this.goToGift()
        }).catch(err=>{
        	if(err.message)wx.showToast({
				title: err.message,
				icon: 'none',
				duration: 2000
            })
        }).finally(_=>{
			wx.hideLoading()
        })
      },
      //分享时 记录用户信息
      share() {
        let param = {
          avatar: this.userInfo.avatarUrl,
          nick: this.userInfo.nickName,
          practiceId: this.id,
          type:1
        }
        return share(param).then(res => {
          this.shareId = res.data.id
        })
      },
      ...mapActions('analysis', ['getReport']),
      ...mapMutations(['customer'])
    },
    onLoad(val) {
      if (val && val.id) {
        this.id = val.id
      } else {
        uni.showToast({
          title: '获取答题卡失败！',
          icon: 'none'
        })
      }
    },
    onShareAppMessage() {
      let desc = ''
      if (this.shareName) {
        let arr = this.shareName.split('-')
        desc = arr[2] + arr[1]
      }
      return {
        // title: `我做了一套${desc}估分试卷，实力获得${this.grade}分，来挑战呀！`,
        title: `我已冲上${this.grade}分，敢PK否？${desc}模考，邀你来战`,
        path: `/pages/grade/share?id=${this.shareId}`
      }
    },
    // 监听页面返回， 以便在领取礼包后使用正确的URL
    onShow() {
      this.getCoe()
      this.getReportData(this.id)
      getStatus().then(res => {
        this.status = res.message
      })
    }
  }
</script>

<style scoped lang="scss">
  @import './index.scss';
</style>
