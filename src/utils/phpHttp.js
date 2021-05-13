import flyio from 'flyio/dist/npm/wx'
import { basePhpURL } from './common'

const OK_C0DE = 10000
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
request.config.baseURL = basePhpURL
request.interceptors.request.use(config => {
  if (wx.getStorageSync('loginInfo') !== '') {
    loginInfo = JSON.parse(wx.getStorageSync('loginInfo'))
    config.headers['token'] = loginInfo.token
  }
  config.headers.terminal = 21
  config.closeLoading = createDelayLoading()
  return config
})

request.interceptors.response.use(
  response => {
    response.request.closeLoading()
    if (response.data.code !== OK_C0DE) {
      uni.showToast({
        title: '网络错误，请稍候重试',
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
      uni.showToast({
        title: '登录失效，请重新登录',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/mine/login'
            })
          }, 500)
        }
      })
    } else {
      if (err.response) return Promise.reject(err.response.data)
      return Promise.reject({ message: '请求错误，请稍候重试' })
    }
  }
)

export default request
