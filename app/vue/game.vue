<style lang="sass" scoped>
	.container {
		width: 816px;
		height: 480px;
		background-color: #ffffff;
		padding: 24px;
		overflow: hidden;
	}

	.game {
		width: 384px;
		height: 480px;

		>.main {
			width: 264px;
			height: 480px;
		}

		>.side {
			width: 96px;
			margin-left: 24px;

			>.next {
				width: 96px;
				height: 96px;
			}
		}
	}

	.blank {
		width: 384px;
		height: 480px;
		line-height: 480px;
		background-color: #f1f1f1;
		font-size: 24px;
		text-align: center;
		color: rgba(0, 0, 0, 0.54);
	}

	canvas {
		background-color: #f1f1f1;
		display: block;	
	}

	.text-line {
		height: 48px;
		line-height: 48px;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.54);
	}

	.btn {
		height: 48px;
		line-height: 48px;
		background-color: #1da1f2;
		border-radius: 4px;
		font-size: 14px;
		text-align: center;
		color: #ffffff;
	}
</style>

<template>
	<div class="container hv-center">
		<div class="game fl">
			<canvas class="main main-1 fl"></canvas>
			<div class="side fl">
				<div class="text-line">下一个</div>
				<canvas class="next next-1"></canvas>
				<div class="text-line">
					<div class="tag fl">分数</div>
					<div class="score score-1 fr">0</div>
					<div class="cf"></div>				
				</div>
				<div class="btn" v-on:click="toggle()">{{toggleText}}</div>
				<div class="btn" style="margin-top: 24px;" v-on:click="end()">结束</div>
			</div>
			<div class="cf"></div>			
		</div>
		<div class="blank fr" v-show="!isBattle">没有玩家</div>
		<div class="game fr" v-show="isBattle">
			<canvas class="main main-2 fl"></canvas>
			<div class="side fl">
				<div class="text-line">
					<div class="tag fl">分数</div>
					<div class="score score-2 fr">0</div>
					<div class="cf"></div>				
				</div>
			</div>
			<div class="cf"></div>			
		</div>
		<div class="cf"></div>
	</div>	
</template>

<script>
	export default {
		props: ['anotherMatrix', 'anotherScore', 'isPause', 'isEnd', 'intruder'],
		route: {
			data: function (transition) {
				transition.next({
					isBattle: this.$route.params.type == 'battle'
				});
			},
			canReuse: false
		},
		data: function () {
			return {
				isBattle: false,
				game: null,
				toggleText: '暂停'
			};
		},
		ready: function () {
			/*获取游戏类*/
			var Game = require('../js/game.js');
			var Paint = require('../js/paint.js');
			var canvas_config = require('../js/canvas-config.js');

			/*获取游戏画布的实例对象canvas*/
			[document.querySelector('.main-1'), document.querySelector('.main-2')].forEach(function (item) {
				item.setAttribute('width', canvas_config.main_width);
				item.setAttribute('height', canvas_config.main_height);				
			});

			[document.querySelector('.next-1')].forEach(function (item) {
				item.setAttribute('width', canvas_config.next_width);
				item.setAttribute('height', canvas_config.next_height);			
			});

			var type = this.$route.params.type;
			var ws = this.$parent.ws;
			var router = this.$route.router;

			if(type == 'single')
				var game = new Game();
			else if(type == 'battle') {
				var painter = new Paint(document.querySelector('.main-2').getContext('2d'), {
					canvas_width: canvas_config.main_width,
					canvas_height: canvas_config.main_height,
					block_width: canvas_config.block_width
				});

				var game = new Game(ws);
			}

			this.game = game;
			this.game.run(true);

			this.$watch('anotherMatrix', function (newVal, oldVal) {
				if(newVal)
					painter.paintMatrix(newVal);
			});

			this.$watch('anotherScore', function (newVal, oldVal) {
				document.querySelector('.score-2').innerHTML = newVal;
			});

			this.$watch('isPause', function (newVal, oldVal) {
				if(newVal) {
					this.game.pause(true);
					this.toggleText = '继续';
				}
							
				else {
					this.game.run(true);
					this.toggleText = '暂停';
				}
												
			});

			this.$watch('isEnd', function (newVal, oldVal) {
				if(newVal) {
					this.game.end(true);
					alert('游戏结束');
					router.go({ path: '/menu' });
					this.$parent.isEnd = false;
				}								
			});

			document.onkeydown = function (e) {
				game.ctrl(e.keyCode);
			};			
		},
		methods: {
			toggle: function () {
				if(this.toggleText == '暂停') {
					if(this.isBattle)
						this.game.pause();
					else {
						this.game.pause(true);
						alert('游戏暂停');
					}
						
					this.toggleText = '继续';
				}
				else if(this.toggleText == '继续') {
					if(this.isBattle)
						this.game.run();
					else {
						this.game.run(true);
						alert('游戏继续');
					}
						
					this.toggleText = '暂停';
				}	
			},
			end: function () {
				if(confirm('确定结束游戏吗?')) {
					if(this.isBattle) {
						this.game.end();
					}												
					else {
						this.game.end(true);
						alert('游戏结束, 得分' + this.game.score + ', 单人模式得分不会计入排行榜');
						this.$route.router.go({ path: '/menu' });
					}
				}
			}
		}
	}
</script>