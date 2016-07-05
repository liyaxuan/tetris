<style lang="sass" scoped>
	.line {
		height: 100%;
		line-height: 100%;

		>.fixed {

		}

		>.auto {
			height: 100%;
			line-height: 100%;
			margin-left: 96px;
			>input {
				height: 100%;
				line-height: 100%;
				padding: 0;
				border: 1px solid #dddddd;
			}
		}
	}	
</style>

<template>
	<div class="scene">
		<div class="line">
			<div class="fixed fl">用户名</div>
			<div class="auto">
				<input type="text" v-model="username">
			</div>				
		</div>
		<div class="line">
			<div class="fixed fl">密码</div>
			<div class="auto">
				<input type="text" v-model="password">
			</div>				
		</div>
	</div>	
</template>

<script>
	export default {
		data: function () {
			return {
				username: '',
				password: ''
			};
		}
	};
</script>