<template>
    <div>
        <web-view :src="url"></web-view>
    </div>
</template>

<script>
	export default {
		name: "gift",
        data(){
			return {
				url: ''
            }
        },
        onLoad(){
			this.url = uni.getStorageSync('giftHtmlUrl')
        }
	}
</script>

<style scoped>

</style>