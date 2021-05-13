<template>
  <view>
    <navBar title="客服" />
    <view>
      <web-view src="https://www.sobot.com/chat/pc/index.html?sysNum=e48eeecb16584fed8b8aedf3b0072b18&robotFlag=2" />
    </view>
  </view>
</template>



<script>
  import navBar from '@/components/navBar.vue'
  export default {
    components: {
      navBar
    },
    data() {
      return {

      }
    },
    onLoad: function(options) {

    },
    mounted() {

    },

    methods: {}
  }
</script>
<style scoped>
  .home {
  }
</style>