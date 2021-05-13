<template>
  <view>
    <navBar
      title="模考大赛报告"
      :colorObj="headConfig"
    ></navBar>
    <div
      class="grade"
      v-if="paper"
    >
      <div class="head_info">
        <div class="base_info">
          <span class="base base_type">类型：模考大赛</span><br>
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
        <button
          class="analysis_btn"
          @click="showNavModal"
          v-show="checkStatus"
        ></button>

        <button
          open-type="share"
          class="share"
        ></button>
        <div class="time">交卷时间：{{submitTime}}</div>
        <div class="grade-job p30" v-if="card.matchMeta && card.matchMeta.schoolCount > 0">{{card.matchMeta && card.matchMeta.schoolName}}</div>
      </div>
      <div class="other_info" v-if="card.matchMeta && card.cardUserMeta">
          <div class="other"><span class="num"> {{card.matchMeta.positionRank}} <span class="small">/{{card.matchMeta.positionCount}}</span></span><span class="other_title">同地区排名</span></div>
          <div class="other"><span class="num">{{card.splitProvince ? card.matchMeta.positionAverageStr : card.cardUserMeta.rank}}<span class="small" v-show="!card.splitProvince">/{{card.cardUserMeta.total}}</span></span><span class="other_title">{{card.splitProvince ? '同地区平均分' : '全站排名'}}</span></div>
          <div class="other"><span class="num">{{card.splitProvince ? card.matchMeta.positionMaxStr : card.cardUserMeta.maxStr}}</span><span class="other_title">{{card.splitProvince ? '同地区最高分' : '全站最高分'}}</span></div>
          <div class="other" v-if="card.matchMeta && card.matchMeta.schoolCount > 0"><span class="num"> {{card.matchMeta.schoolRank}} <span class="small">/{{card.matchMeta.schoolCount}}</span></span><span class="other_title">同职位排名</span></div>
          <div class="other" v-if="card.matchMeta && card.matchMeta.schoolAverage"><span class="num">{{card.matchMeta.schoolAverage}}</span><span class="other_title">同职位平均分</span></div>
          <div class="other" v-if="card.matchMeta && card.matchMeta.schoolMax"><span class="num">{{card.matchMeta.schoolMax}}</span><span class="other_title">同职位最高分</span></div>
        </div>
      <view
        class="download"
        v-if="status > 1"
      >
        <button
          class="download_btn"
          @click="showNavModal"
          v-show="checkStatus"
        ></button>

        <img
          v-if="imgSrc"
          :src= "imgSrc"
          alt=""
        >
      </view>
      <div>
        <canvas canvas-id="lineCanvas" class="lineCanvas"  v-if="!lineSrc" ></canvas>
        <img v-if="lineSrc" class="line_img" :src="lineSrc" alt="">
      </div>
      <div class="knowledge">
        <div class="kl_title">考试情况</div>
        <p v-if="card != null && card.answers" class="total">共{{card.answers.length}}道，答对{{card.rcount}}道，未答{{card.ucount}}道，共计用时{{parseInt(card.expendTime/60)}}分{{parseInt(card.expendTime%60)}}秒</p >
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
              <div class="module_info">共{{item.qnum}}道，答对{{item.rnum}}道，正确率{{item.accuracy}}%，用时{{parseInt(item.times/60)}}分钟{{parseInt(item.times%60)}}秒</div>
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
                <div class="module_info">共{{i.qnum}}道，答对{{i.rnum}}道，正确率{{i.accuracy}}%，用时{{parseInt(i.times/60)}}分钟{{parseInt(item.times%60)}}秒</div>
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
       <NavModal v-if="navModalShow" @hide="hideNavModal" />
    </div>
  </view>
</template>

<script>
  import navBar from '@/components/navBar.vue'
  import NavModal from '../examination/components/navModal'
  import uCharts from '../../static/u-charts.min'
  import sa from '@/utils/sendors';
  import { getMockDetail, getMockQuestions, share, getStatus } from '../../utils/api'
  import { formatTime, getHMSBySecond } from '../../utils/util'
  import { mapActions, mapMutations, mapState } from 'vuex'
  var _self;

  export default {
    name: 'index',
    components: {
      navBar,
      NavModal
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
        cWidth: '',
        cHeight: '',
        pixelRatio: 1,
        navModalShow: false,
        lineSrc:'',
      }
    },
    mounted(){
        _self = this;
        this.cWidth = uni.upx2px(750)
        this.cHeight = uni.upx2px(500)
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
      imgSrc(){
        if(this.card){
           return  this.card.subject ==1? "http://p.htwx.net/wxtk/gwyDown.png" :"http://p.htwx.net/wxtk/download.png"
        }else{
            return ''
        }
      },
      ...mapState(['userInfo', 'zhichiParams', 'transferAction','checkStatus']),
      ...mapState(['choosedSubjectData'])
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
        getMockDetail(param)
          .then(res => {
            console.log(res)
            this.paper = res.paper
            this.shareName = this.paper.paperName
            // if (this.shareName && this.shareName.includes('公务员')) {
            //   this.shareName = this.shareName.replace('全国', '国考')
            // }
            this.card = res
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
            this.getQt(res)
            this.share()
            this.initBrokenline();
            let names = this.choosedSubjectData.name.split('-')
            sa.track('HuaTuOnline_MP_Tk_SimulatedViewReport',{
              match_subject:names[1],
              match_class:names[0],
              match_id: id,
              match_title:this.paper.name,
              match_score: this.grade,
              match_correct_number: this.card.rcount,
              match_answer_duration: this.card.expendTime
            })
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

      getQt(res) {
        const supportQuestionType = [99, 100, 101, 109]
        //getMockQuestions({id:this.id}).then(res => {})
         this.qtList = res.corrects.map((item, index) => {
            let correct = ''
            if (item === 0) {
              correct = 'unanswered'
            } else if (item === 2) {
              correct = 'error'
            } else if (item === 4) {
              correct = 'halfError'
            }
            return {
              correct, //答题状态类
              disabled: '' //是否可答
            }
          });

          res.paper.questions.map((item, index) => {
              this.qtList[index].id =item;
          })
          console.log(this.qtList)

      },

      //前往解析页  flag: 是否全部题目  index: 当前题序
      goToAnalysis(flag, index = 0) {
        this.getReport({
          cardId: this.id,
          isAll: flag,
          type:true
        })
        if (this.qtList.some(item => item.correct === 'error') || flag) {
          uni.navigateTo({
            url: `/pages/grade/analysis?cardId=${this.id}&index=${index}&isAll=${flag}&type=true`
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
      //分享时 记录用户信息
      share() {
        let param = {
          avatar: this.userInfo.avatarUrl,
          nick: this.userInfo.nickName,
          practiceId: this.card.idStr,
          type:2
        }
        return share(param).then(res => {
          this.shareId = res.data.id
        })
      },
      initBrokenline(){
        //显示最近六条
        var result =this.card.matchMeta && this.card.matchMeta.scoreLine && this.card.matchMeta.scoreLine.series;
        if(result.length >6){
          result = result.slice(result.length-6,result.length);
        }

        var xName=[];
        var myData=[
            {
              name: '全站正确率',
              data: [],
              color: '#50B674'
            },
            {
              name: '模考正确率',
              data: [],
              color: '#EC74A0'
            }
        ];
        [...result].map(res=>{
          xName.push(res.name)
          myData[0].data.push(res.data[0])
          myData[1].data.push(res.data[1])
        })

        var canvaLineA = new uCharts({
            $this: _self,
            canvasId: 'lineCanvas',
            type: 'line',
            fontSize: 12,
            colors: ['#EC74A0', '#50B674'],
            legend: { show: true },
            dataLabel: false,
            dataPointShape: true,
            dataLabel: true,
            background: '#FFFFFF',
            pixelRatio: _self.pixelRatio,
            categories: xName,
            series: myData,
            animation: false,
            xAxis: {
              disableGrid: true
            },
            yAxis: {
              data: [
                {
                  min: 0,
                  max: 100,
                  title: '正确率'
                }
              ],
              showTitle: true
            },
            width: _self.cWidth * _self.pixelRatio,
            height: _self.cHeight * _self.pixelRatio
        })
        let _this = this
        canvaLineA.addEventListener('renderComplete', () => {
                const ctx = uni.createCanvasContext('lineCanvas')
                setTimeout(() => {
                        uni.canvasToTempFilePath({
                          canvasId: 'lineCanvas',
                        success(res) {
                          _this.lineSrc = res.tempFilePath;
                          console.log(res.tempFilePath)
                        },
                        fail(err) {
                          alert(err)
                        }
                    })
                }, 500)
        });

      },
    showNavModal () {
      if (!this.checkStatus) {
        this.hideNavModal()
        return
      }
      this.navModalShow = true
    },
    hideNavModal () {
      this.navModalShow = false
    },
      ...mapActions('analysis', ['getReport']),
      ...mapMutations(['customer'])
    },
    onLoad(val) {
      if (val && val.id) {
        this.id = val.id
        console.log(this.id)
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
        title: `这样做题更直观！今日模考击败${this.card.cardUserMeta.beatRate}%考生，等你来战！`,
        //title: `我已冲上${card.cardUserMeta.beatRate}分，敢PK否？${desc}模考，邀你来战` ,
        path: `/pages/grade/mockShare?id=${this.shareId}`
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
