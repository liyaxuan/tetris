<style lang="sass" scoped>
	.login {
		width: 416px;
		height: 244px;
		padding: 32px;
		background-color: #ffffff;
		box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.08);
	}

	.line {
		height: 48px;
		line-height: 48px;
		border: 1px solid #dddddd;
		border-radius: 4px;
		>.fixed {
			box-sizing: border-box;
			width: 80px;
			height: 48px;
			line-height: 48px;
			padding-left: 16px;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.54);
		}

		>.auto {
			height: 48px;
			line-height: 48px;
			margin-left: 80px;
			>input {
				height: 48px;
				line-height: 48px;
				padding: 0;
				border: none;
				display: block;
				outline: none;
			}
		}
	}

	.btn {
		height: 48px;
		line-height: 48px;
		margin-top: 16px;
		background-color: #1da1f2;
		border-radius: 4px;
		text-align: center;
		color: #ffffff;
	}
</style>

<template>
	<div class="login hv-center">
		<div class="line" style="margin-bottom: 16px;">
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
		<div class="btn" v-on:click="auth('login')">登录</div>
		<div class="btn" v-on:click="auth('register')">注册</div>
	</div>	
</template>

<script>
	export default {
		data: function () {
			return {
				username: 'lilei',
				password: '123456'
			};
		},
		methods: {
			auth: function (type) {
				var ws = this.$parent.ws;
				var username = this.username;
				var password = this.password;

				if(!username || !password) {
					alert('请填写用户明名和密码');
					return;
				}
					
				if(ws.readyState != 1){
					alert('服务器还没有准备好');
					console.log(ws.readyState);
				}
					
				else
					ws.send(JSON.stringify({
						type: type,
						body: {
							username: username,
							password: password
						}
					}));	
			}
		}
	};
</script>