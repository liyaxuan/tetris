var ws = require('nodejs-websocket');
var mongoClient = require('mongodb').MongoClient;

var conTable = {};
var couple = {};

mongoClient.connect('mongodb://127.0.0.1:27017/tetris').then(function (db) {

	/*在8848端口建立WebSocket服务*/
	ws.createServer(function (con) {
		/*每当有新的客户端与服务器建立连接, 该回调函数就会被调用*/
		/*con表示connection, 描述连接的实例对象*/

		/*为该连接注册text回调函数, 当有来自这条连接另一端的客户端的消息时, 被调用*/
		con.on('text', function (msg) {
			/*msg是客户端发送的格式化数据, 是被JSON.stringify方法序列化为字符串后的形式*/
			/*调用JSON.parse方法将其再次格式化为JavaScript对象*/
			msg = JSON.parse(msg);
			var type = msg.type;
			var body = msg.body;

			switch (type) {
				case 'register':
					var username = body.username;
					var password = body.password;

					db.collection('user').insert({
						_id: username,
						password: password
					}).then(function (doc) {
						console.log(doc);
						con.send(JSON.stringify({
							type: 'register',
							body: true
						}));
					}).catch(function (err) {
						console.log(err);
						con.send(JSON.stringify({
							type: 'register',
							body: false
						}));
					});
					break;
				case 'login':
					var username = body;

					db.collection('user').find({
						_id: username
					}).toArray().then(function (array) {
						if(array.length == 0)
							con.send(JSON.stringify({
								type: 'login',
								body: false
							}));
						else {
							conTable[username] = con;
							con.send(JSON.stringify({
								type: 'register',
								body: true
							}));
						}
					}).catch(function (err) {
						console.log(err);
					});
					break;
				case 'users':
					var users = [];
					for(var username in conTable)
						users.push(username);
					con.send(JSON.stringify({
						type: 'users',
						body: users
					}));
					break;
				case 'invite':
					conTable[body.target].send(JSON.stringify({
						type: 'invite',
						body: body.source
					}));
					break;
				case 'cancel_invite':
					conTable[body.target].send(JSON.stringify({
						type: 'cancel_invite',
						body: body.source
					}));
					break;
				case 'accept':
					couple[body.source] = body.target;
					couple[body.target] = body.source;

					conTable[body.source].send(JSON.stringify({
						type: 'accept',
						body: true
					}));
					break;
				case 'reject':
					conTable[body.source].send(JSON.stringify({
						type: 'accept',
						body: false
					}));
					break;
				case 'battle':

					conTable[couple[body.username]].send(JSON.stringify({
						type: 'battle',
						body: {
							matrix: body.matrix,
							score: body.score
						}
					}));
					break;
				case 'pause':
					break;
			}
		});

		/*当这条连接断开时, 被调用*/
		con.on('close', function () {
			for(var username in conTable)
				if(conTable[username] == con)
					break;
			delete conTable[username];
			var another = couple[username];
			delete couple[username];
			delete couple[another];
		});
	}).listen(8848);

});