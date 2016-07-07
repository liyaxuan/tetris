<style lang="sass" scoped>
	.list {
		width: 320px;
		height: 480px;
		background-color: #ffffff;
		font-size: 14px;
		
		>.item {
			height: 48px;
			line-height: 48px;
			
			&.header {
				background-color: #1da1f2;
				color: #ffffff;
			}

			>.col {
				width: 160px;
				text-align: center;

				&.operation {
					color: #1da1f2;
					text-decoration: underline;
					cursor: pointer;
				}
			}
		}
	}
</style>

<template>
	<div>
		<div class="layer">
			<div class="box hv-center">2333</div>
		</div>
		<div class="list hv-center">
			<div class="item header">
				<div class="col large fl">用户</div>
				<div class="col fl">操作</div>
			</div>
			<div class="item" v-for="item in userList">
				<div class="col fl">{{item}}</div>
				<div class="col operation fl" v-on:click="invite(item)">邀请</div>
			</div>
		</div>		
	</div>
</template>

<script>
	export default {
		props: ['userList', 'isLayer', 'tip'],
		route: {
			data: function (transition) {
				var ws = this.$parent.ws;

				ws.send(JSON.stringify({
					type: 'users'
				}));			
			},
			canReuse: false
		},
		methods: {
			invite: function (target) {
				var username = this.$parent.username;
				var ws = this.$parent.ws;

				if(username == target) {
					alert('不能邀请自己');
					return;
				}
				else {
					ws.send(JSON.stringify({
						type: 'invite',
						body: target
					}));

					this.$parent.isLayer = true;
					this.$parent.tip = '邀请' + target + '加入对战, 正在等待回复......';					
				}
			}
		}
	};
</script>