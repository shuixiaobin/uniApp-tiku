<template>
  <div class="job-info">
    <navBar />
    <div
      class="jump"
      @click="jump"
    >{{JSON.stringify(schoolInfo) === '{}'?'跳过':'取消'}}</div>
    <h3 class="title">填写报考职位信息</h3>
    <p class="tips">填写信息可获得更精准的{{type==='mock'?'模考':'估分'}}报告</p>
    <div class="job-info-wrapper">
      <template v-for="(item, i) in form">
        <JobSelect
          :key="i"
          :value="item.title"
          :selectData="item.selectData"
          :placeholderStr="item.placeholderStr"
          v-if="item.title || item.selectData.length > 0"
          :isOpen="openIndex===i"
          @getNextSelect="getNextSelect($event, i)"
          @close="handleClose"
          @open="handleOpen(i)"
        ></JobSelect>
      </template>
    </div>
    <button
      class="submit-btn"
      :class="{'disabled-act': btnDisabled}"
      :disabled="btnDisabled"
      @click="handleFinish"
    >完成填写</button>
  </div>
</template>

<script>
  import { getJobSelect, getExamJobSelect, jobApply, examJobApply } from '@/utils/api'
  import { mapState } from 'vuex'
  import JobSelect from './components/JobSelect'
  import navBar from '@/components/navBar'
  export default {
    components: { JobSelect, navBar },
    data() {
      return {
        type: null,
        btnDisabled: true,
        openIndex: -1,
        answerId: null,
        form: [
          {
            value: '', //机构性质
            title: '',
            placeholderStr: '请选择机构性质',
            pCode: 100,
            selectData: [],
            key: 'jgxz',
          },
          {
            value: '', //报考省份
            title: '',
            placeholderStr: '请选择报考省份',
            pCode: 1,
            selectData: [],
            key: 'bksf',
          },
          {
            value: '', //市州
            title: '',
            placeholderStr: '请选择报考市州',
            pCode: 10,
            selectData: [],
            key: 'bksz',
          },
          {
            value: '', // 区县
            title: '',
            placeholderStr: '请选择报考区县',
            pCode: 20,
            selectData: [],
            key: 'bkqx',
          },
          {
            value: '', //部门
            title: '',
            placeholderStr: '请选择报考部门',
            pCode: 30,
            selectData: [],
            key: 'bkbm',
          },
          {
            value: '', //司局
            title: '',
            placeholderStr: '请选择报考司局',
            pCode: 40,
            selectData: [],
            key: 'bksj',
          },
          {
            value: '', //报考职位
            title: '',
            placeholderStr: '请选择报考职位',
            pCode: 50,
            selectData: [],
            key: 'bkzw',
          },
          {
            value: '', //职位代码
            title: '',
            placeholderStr: '请选择职位代码',
            pCode: 60,
            selectData: [],
            key: 'zwdm',
          },
        ],
      }
    },
    onLoad(options) {
      this.type = options.type
      if (options.answerId) {
        this.answerId = options.answerId
      }
    },

    computed: {
      ...mapState('home', ['applyInfo', 'choosedArea', 'schoolInfo', 'examInfo']),
      name() {
        return this.form.map(item => item.title).join(',')
      },
    },
    mounted() {
      if (this.type === 'mock') {
        if (this.applyInfo.examType !== 1) {
          this.form.shift()
        }
      } else {
        if (this.examInfo.examType !== 1) {
          this.form.shift()
        }
      }

      if (JSON.stringify(this.schoolInfo) === '{}') {
        if (this.type === 'mock') {
          this.getJobSelect(0, this.choosedArea.value).then(i => {
            if (this.form[i].selectData.find(item => item.selected)) {
              this.form[i].value = this.form[i].selectData.find(item => item.selected).value
              this.form[i].title = this.form[i].selectData.find(item => item.selected).title
            } else {
              return
            }
            return this.getJobSelect(i + 1, this.name)
          })
        } else {
          this.getJobSelect(0, '')
        }
      } else {
        this.btnDisabled = false
        for (const key in this.schoolInfo) {
          if (this.schoolInfo.hasOwnProperty(key)) {
            this.form.forEach(item => {
              if (item.key === key) {
                item.title = this.schoolInfo[key]
              }
            })
          }
        }
      }
    },

    methods: {
      handleClose() {
        this.openIndex = -1
      },
      handleOpen(i) {
        if (this.schoolInfo) {
          this.getJobSelect(i, this.name)
        }
        this.openIndex = i
      },
      getNextSelect({ title, value }, index) {
        this.openIndex = -1
        if (this.form[index].title && this.form[index].title !== title) {
          for (let i = index + 1; i < this.form.length; i++) {
            const item = this.form[i]
            item.value = ''
            item.title = ''
            item.selectData = []
          }
          this.btnDisabled = true
        }
        this.form[index].title = title
        this.form[index].value = value
        this.getJobSelect(index + 1, this.name)
      },
      jump() {
        this.answerId
          ? uni.redirectTo({
              url: `/pages/examination/index?answerId=${this.answerId}`,
            })
          : uni.navigateBack()
      },
      // 填写完成
      async handleFinish() {
        const schoolNameArr = []
        let _this = this
        const body = {}
        this.form.forEach(item => {
          if (item.title) {
            schoolNameArr.push(item.title)
          }
          body[item.key] = item.title
        })
        const schoolName = schoolNameArr.join('-')
        try {
          let ret
          if (this.type === 'mock') {
            ret = await jobApply({
              matchId: this.applyInfo.matchId,
              schoolName,
              body,
            })
          } else {
            ret = await examJobApply({
              paperId: this.examInfo.id,
              schoolName,
              body,
            })
          }
          console.log(ret)
          if (ret.code === 1000000) {
            uni.showToast({
              title: ret.message || ret.data.message,
              mask: true,
              duration: 2000,
              success() {
                _this.answerId
                  ? uni.redirectTo({
                      url: `/pages/examination/index?answerId=${_this.answerId}`,
                    })
                  : uni.navigateBack()
              },
            })
          }
        } catch (err) {
          console.log(err)
        }
      },
      async getJobSelect(idx, name) {
        let i = idx
        if (i === this.form.length) {
          this.btnDisabled = false
          return
        }
        try {
          let ret
          if (this.type === 'mock') {
            ret = await getJobSelect({
              matchId: this.applyInfo.matchId,
              pCode: this.form[idx].pCode,
              name,
            })
          } else {
            ret = await getExamJobSelect({
              paperId: this.examInfo.id,
              pCode: this.form[idx].pCode,
              name,
            })
          }

          if (ret.data.length === 0 && i <= this.form.length - 1) {
            i++
            if (this.form[idx].pCode === 60 && ret.data.length === 0) {
              this.btnDisabled = false
            }
            this.getJobSelect(i, this.name)
          } else {
            this.form[idx].selectData = ret.data
          }
          return i
        } catch (err) {
          console.log(err)
        }
      },
    },
  }
</script>
<style lang='scss' scoped>
  .job-info {
    padding: 0 40rpx;
    .jump {
      height: 42rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #909090;
      line-height: 42rpx;
      text-align: right;
      margin-top: 10px;
    }
    .title {
      height: 50rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      text-align: center;
      line-height: 50rpx;
      margin-top: 24rpx;
    }
    .tips {
      height: 32rpx;
      font-size: 22rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9b9b9b;
      line-height: 32rpx;
      text-align: center;
      margin-top: 12rpx;
      margin-bottom: 60rpx;
    }
    .job-info-wrapper {
      padding-bottom: 160rpx;
    }
    .submit-btn {
      width: 630rpx;
      height: 88rpx;
      transform: translateX(-50%);
      left: 50%;
      background: #ff6d73;
      border-radius: 44rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 88rpx;
      position: fixed;
      bottom: 60rpx;
      z-index: 13;
      &.disabled-act {
        color: #909090;
        background: #f3f3f3;
      }
    }
  }
</style>