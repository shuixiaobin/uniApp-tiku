// 传入 Date ，输出 年-月-日 时:分
export function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('-') +
    ' ' +
    [hour, minute].map(formatNumber).join(':')
  )
}

export function formatDate1(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 传入秒  传出对象 对象有时 分 秒 和 字符串 属性
export function getHMSBySecond(allSecond) {
  var hour = Math.floor(allSecond / 3600)
  var minute = Math.floor((allSecond - hour * 3600) / 60)
  var second = allSecond - hour * 3600 - minute * 60
  // 以冒号分隔  00:32:09
  var string =
    formatNumber(hour) + ':' + formatNumber(minute) + ':' + formatNumber(second)

  return {
    hour,
    minute,
    second,
    string
  }
}
//传入 '013'， 返回 ['A','B','D']
export function getABC(str) {
  if (!str) return []
  let arr = str.split('').map(item => {
    return String.fromCharCode('A'.charCodeAt(0) + Number(item) - 1)
  })
  return arr
}

export function formatDate(date) {
  let year = new Date(date).getFullYear()
  let month = new Date(date).getMonth() + 1
  let day = new Date(date).getDate()
  return `${year}/${month}/${day}`
}


export function padStart(str, maxLength, fillString = ' ') {
  if (Object.prototype.toString.call(fillString) !== '[object String]')
    throw new TypeError('fillString must be String')
  // 返回 String(str) 这里是为了使返回的值是字符串字面量，在控制台中更符合直觉
  if (str.length >= maxLength) return String(str)

  let fillLength = maxLength - str.length
  let times = Math.ceil(fillLength / fillString.length)

  // 这个算法叫啥？
  // SICP 的中文版第 30页 有用到同种算法计算乘幂计算
  while ((times >>= 1)) {
    fillString += fillString
    if (times === 1) {
      fillString += fillString
    }
  }
  return fillString.slice(0, fillLength) + str
}

export function transTimeStr(s) {
  return `${padStart(
    String(Math.floor(s / 60)),
    2,
    '0'
  )}:${padStart(String(s % 60), 2, '0')}`
}

export function transTimeStr2 (s) {
  return `${padStart(String(Math.floor(s / 60)), 2, '0')}:${padStart(String(s % 60), 2, '0')}`
}

export function debounce(fn, wait = 500, immediate) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    if(immediate)  {
      if (!timer) {
        fn.apply(this,args)
      }
      timer = setTimeout(() => {
        timer = null
      }, wait)
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, wait)
    }
    
  }
}

export function translateHTML (html) {
  const imgReg = /<img(.*?)(?:\/>|>)/g
  const styleReg = /style="([^"]*)"/
  if(!html)return ''
  return html.replace(imgReg, (str, attrs) => {
    if (styleReg.test(attrs)) {
      return `<img ${attrs.replace(styleReg, `style="max-width: 100%;height: auto;"`)}/>`
    } else {
      return `<img ${attrs} style="max-width: 100%;height:auto;"/>`
    }
  })
}
const Acode = 'A'.charCodeAt(0)
const acode = 'a'.charCodeAt(0)
export const wordArr1 = Array.from(new Array(26)).map((_, index) => String.fromCharCode(Acode + index))
export const wordArr2 = Array.from(new Array(26)).map((_, index) => String.fromCharCode(acode + index))