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
				width: 80px;
				text-align: center;
				&.large {
					width: 160px;
				}
			}
		}
	}
</style>

<template>
	<div class="list hv-center">
		<div class="item header">
			<div class="col fl">rank</div>
			<div class="col large fl">user</div>
			<div class="col fl">score</div>
		</div>
		<div class="item" v-for="item in rankList">
			<div class="col fl">{{$index + 1}}</div>
			<div class="col large fl">{{item._id}}</div>
			<div class="col fl">{{item.score}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['rankList'],
		route: {
			data: function (transition) {
				var ws = this.$parent.ws;

				ws.send(JSON.stringify({
					type: 'rank'
				}));			
			},
			canReuse: false
		}
	};
</script>