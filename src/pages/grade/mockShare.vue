<template>
  <view>
    <navBar
      title="成绩统计"
      :hasBack="false"
      :colorObj="headConfig"
    ></navBar>
    <div
      class="grade"
      v-if="paper"
    >
      <div class="head_info">
        <div class="user_head">
          <img
            src="http://p.htwx.net/wxtk/header_bd.png"
            class="head_border"
            alt=""
          >
          <img
            class="user_hd"
            :src="userInfo.avatar"
            alt=""
          >
        </div>
        <div class="title">
          {{userInfo.nick}} 参加了 <br>
          <div class="hh">
            "{{paper.name}}"，荣誉获得:
          </div>
        </div>
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
        <!--<div class="gift" v-if="card.hasGift" @tap="goToGift"></div>-->
        <!--<div class="share"></div>-->
        <div class="time">交卷时间：{{submitTime}}</div>
      </div>
      <div class="other_info" v-if="card.matchMeta && card.cardUserMeta">
        <div class="other"><span class="num"> {{card.matchMeta.positionRank}} <span class="small">/{{card.matchMeta.positionCount}}</span></span><span class="other_title">同地区排名</span></div>
        <div class="other"><span class="num">{{card.cardUserMeta.rank}}<span class="small">/{{card.cardUserMeta.total}}</span></span><span class="other_title">全站排名</span></div>
        <div class="other"><span class="num">{{card.cardUserMeta.maxStr}}</span><span class="other_title">全站最高分</span></div>
      </div>
      <!--<div class="download">-->
      <!--<button open-type="contact"></button>-->
      <!--<img src="http://p.htwx.net/wxtk/download.png" alt="">-->
      <!--</div>-->
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
      <div
        class="join_btn"
        @tap="join"
      >
        <div class="button_con">
          我也要参加
        </div>
      </div>
    </div>
  </view>
</template>

<script>
  import navBar from '@/components/navBar.vue'
  import { getReport, getMockShareCard } from '../../utils/api'
  import { formatTime, getHMSBySecond } from '../../utils/util'
  import { mapActions, mapMutations } from 'vuex'

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
        joinParam: {}, //参与估分的参数
        userInfo: {},
        src: ''
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
      }
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

        ctx.setFontSize(32*this.coe);
        left -= ((ctx.measureText('分').width + 20) / 2) | 0 

        ctx.setFontSize(80 * this.coe)
        ctx.fillText(this.grade, left * this.coe, 160 * this.coe)

        const fl = ctx.measureText(this.grade+'').width
        ctx.setFontSize(32*this.coe);
        ctx.fillText('分', ((left + 20) * this.coe + (fl / 2)) | 0, 150 * this.coe)

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
        getMockShareCard(param)
          .then(res => {
            res = res.data
            console.log(res)
            this.userInfo = res.share.wechatInfo
            this.paper = res.answerCard.paper
            this.card = res.answerCard
            this.points = res.answerCard.points
            this.joinParam = {
              categoryId: this.paper.categoryId,
              subjectId: this.paper.catgory, //后端命名有问题  catgory就是subjectId
              areaId: this.paper.area,
              name: this.userInfo.showName
            }
            //分数
            this.grade = res.answerCard.score
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
      //我要参加
      join() {
        // if (this.joinParam.name && this.joinParam.name.includes('公务员')) {
        //   this.joinParam.name = this.joinParam.name.replace('全国', '国考')
        // }
        var first=`/pages/home/index?categoryId=${this.joinParam.categoryId}&subjectId=${this.joinParam.subjectId}&areaId=${
            this.joinParam.areaId
          }&name=${encodeURIComponent(this.joinParam.name)}&tabType=mock`;

        console.log(first)
          uni.redirectTo({
            url: first
          })
      },
      ...mapActions('analysis', ['getReport'])
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
    mounted() {
      this.getCoe()
      this.getReportData(this.id)
    }
  }
</script>

<style scoped lang="scss">
  @import './index.scss';
  .head_info {
    .user_head {
      text-align: center;
      position: relative;
      &:before {
        content: '';
        display: inline-block;
        width: 436rpx;
        height: 2rpx;
        background: #e66393;
        position: absolute;
        top: 100rpx;
        left: 157rpx;
      }
      .head_border {
        width: 160rpx;
        height: 160rpx;
        position: relative;
        z-index: 2;
        padding: 18rpx;
        background: #ff85b2;
      }
      .user_hd {
        width: 84rpx;
        height: 84rpx;
        border-radius: 50%;
        position: absolute;
        top: 56rpx;
        left: 50%;
        transform: translate(-42rpx, 0);
        z-index: 3;
      }
    }
    .title {
      .hh {
        font-weight: 400;
        font-size: 28rpx;
        text-align: center;
        padding: 30rpx;
      }
    }
  }
  .knowledge {
    padding-bottom: 170rpx;
    margin-top: 20rpx;
  }
  .join_btn {
    position: fixed;
    z-index: 3;
    width: 750rpx;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px -8px 12px 0px rgba(0, 0, 0, 0.08);
    .button_con {
      width: 670rpx;
      height: 100rpx;
      margin: 40rpx auto;
      background: linear-gradient(155deg, rgba(255, 225, 136, 1) 0%, rgba(254, 68, 51, 1) 100%);
      box-shadow: -4rpx 0rpx 8rpx 0rpx rgba(233, 175, 125, 1), 0rpx 2rpx 6rpx 0rpx rgba(255, 255, 255, 0.5);
      border-radius: 50rpx;
      font-size: 800;
      color: #fff;
      text-shadow: 0rpx 4rpx 8rpx rgba(254, 47, 65, 1);
      text-align: center;
      line-height: 100rpx;
    }
  }
</style>