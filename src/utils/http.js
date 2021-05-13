import flyio from 'flyio/dist/npm/wx'
import { baseURL } from './common'
import store from '../store'

const OK_C0DE = 1000000
const stack = []

function createDelayLoading(delay = 500) {
  const timer = setTimeout(() => {
    stack.push(timer)
    uni.showLoading({
      title: '加载中',
      mask: true
    })
  }, delay)

  function closeLoading() {
    clearTimeout(timer)
    if (stack.includes(timer)) {
      const index = stack.indexOf(timer)
      stack.splice(index, 1)
      if (stack.length === 0) {
        uni.hideLoading()
      }
    }
  }
  return closeLoading
}

let flag = false
function handle401() {
  if (flag) return
  flag = true
  uni.showToast({
    title: '登录失效，请重新登录',
    icon: 'none',
    success: () => {
      setTimeout(() => {
        const current = getCurrentPages()
        if (current[current.length - 1].route === 'pages/mine/login') return
        uni.navigateTo({
          url: '/pages/mine/login'
        })
        flag = false
      }, 500)
    }
  })
}

// 判断当前网络状态
uni.getNetworkType({
  success: function(res) {
    if (res.networkType == 'none') {
      console.log(res)
      uni.showToast({
        title: '网络不可用，请检查您的网络',
        duration: 2000,
        icon: 'none'
      })
      return
    }
  }
})

const request = new flyio()
let loginInfo
request.config.baseURL = baseURL
request.interceptors.request.use(config => {
  if (wx.getStorageSync('loginInfo') !== '') {
    loginInfo = JSON.parse(wx.getStorageSync('loginInfo'))
    config.headers['token'] = loginInfo.token
    config.headers['subject'] = store.state.choosedSubjectData.subjectId
  }
  config.headers.terminal = 21
  config.closeLoading = createDelayLoading()
  return config
})

request.interceptors.response.use(
  response => {
    response.request.closeLoading()
    if (response.data.code !== OK_C0DE) {
      console.log(response.data.data.message)
      uni.showToast({
        title: response.data.data.message || '网络错误，请稍候重试',
        icon: 'none',
        duration: 1500
      })
      return Promise.reject(response)
    }
    return Promise.resolve(response.data)
  },
  err => {
    err.request.closeLoading()
    if (err.status === 401) {
      handle401()
    } else {
      console.log(err)

      if (err.response) return Promise.reject(err.response.data)
      return Promise.reject({
        message: err.engine.response.message || '请求错误，请稍候重试'
      })
    }
  }
)

export default request
