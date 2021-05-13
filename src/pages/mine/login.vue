<template>
  <view class="loginWrapper">
    <navBar :title="'登录注册'"></navBar>
    <tabs></tabs>
  </view>
</template>

<script>
  import navBar from '@/components/navBar.vue'
  import tabs from './components/tabs'
  export default {
    components: { navBar, tabs },
    data() {
      return {}
    },
    methods: {}
  }
</script>
<style lang='scss' scoped>
  .loginWrapper {
  }
</style>