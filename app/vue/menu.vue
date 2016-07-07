<style lang="sass" scoped>
	.menu {
		width: 256px;
		height: 176px;
		padding: 32px;
		background-color: #ffffff;

		>.item {
			height: 48px;
			line-height: 48px;
			margin-bottom: 16px;
			background-color: #1da1f2;
			border-radius: 4px;
			font-size: 14px;
			text-align: center;
			text-decoration: none;
			color: #ffffff;
			display: block;
		}
	}
</style>

<template>
	<div class="menu hv-center">
		<a class="item" v-link="{ name: 'game', params: { type: 'single' } }">单人模式</a>
		<a class="item" v-link="{ path: '/users' }">对战模式</a>
		<a class="item" v-link="{ path: '/rank' }">排行榜</a>
	</div>
</template>

<script>
	export default {
		data: function () {
			return {

			};
		}
	}
</script>