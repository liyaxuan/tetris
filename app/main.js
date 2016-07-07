var Vue = require('vue');
var VueRouter = require('vue-router');
var VueResource = require('vue-resource');
Vue.use(VueRouter);
Vue.use(VueResource);

var router = new VueRouter();

var Login = require('./vue/login.vue');
var Menu = require('./vue/menu.vue');
var Users = require('./vue/users.vue');
var Rank = require('./vue/rank.vue');
var Game = require('./vue/game.vue');

var App = Vue.extend({
	data: function () {
		return {
			ws: new WebSocket('ws://127.0.0.1:8848'),
			username: null,

			userList: [],
			rankList: [],

			isLayer: false,
			tip: '',

			anotherMatrix: null,
			anotherScore: 0,

			isEnd: false,
			isPause: false,
			intruder: null
		};
	},
	ready: function () {
		var _this = this;
		var ws = this.ws;

		ws.addEventListener('message', function (e) {
			var msg = JSON.parse(e.data);
			var type = msg.type;
			var body = msg.body;

			switch (type) {
				case 'login':
					var result = body.result;
					var username = body.username;
					if(result) {
						_this.username = username;
						alert('登录成功');
						router.go('/menu');					
					}
					else
						alert(body.text);
					break;
				case 'register':
					var result = body.result;
					var username = body.username;
					if(result) {
						_this.username = username;
						alert('注册成功');
						router.go('/menu');					
					}
					else
						alert(body.text);					
					break;
				case 'rank':
					var list = body;
					_this.rankList = list;
					break;
				case 'users':
					var list = body;
					_this.userList = list;
					break;
				/*有人邀请该用户*/
				case 'invite':
					var inviter = body;

					if(confirm('用户' + inviter + '邀请你对战, 是否接受?')) {
						ws.send(JSON.stringify({
							type: 'accept',
							body: inviter
						}));
					}
					else {
						ws.send(JSON.stringify({
							type: 'reject',
							body: inviter
						}));						
					}
					break;
				case 'start':
					router.go({ name: 'game', params: { type: 'battle' } });
					break;
				case 'pause':
					_this.isPause = true;
					_this.intruder = body;
					break;
				case 'run':
					console.log('jiu');
					_this.isPause = false;
					_this.intruder = body;
					break;
				case 'end':
					_this.isEnd = true;
					_this.intruder = body;
					break;
				case 'battle':
					_this.anotherMatrix = body.matrix;
					_this.anotherScore = body.score;					
					break;
			}			
		});	
	}
});

router.map({
	'/': {
		component: Login
	},
	'/login': {
		component: Login
	},
	'/menu': {
		component: Menu
	},
	'/users': {
		component: Users
	},
	'/rank': {
		component: Rank
	},
	'/game/:type': {
		name: 'game',
		component: Game
	}
});

router.start(App, 'body');