var ws = require('nodejs-websocket');
var mongoClient = require('mongodb').MongoClient;

var conTable = {};
var couple = {};

function who(con) {
	var isFinded = false;
	for(var username in conTable)
		if(conTable[username] == con) {
			isFinded = true;
			break;
		}
	if(isFinded)
		return username;
	else
		return undefined;
}

function broadcastUsers(con) {
	var users = [];
	for(var username in conTable)
		users.push(username);

	var data = JSON.stringify({
		type: 'users',
		body: users
	});

	if(con)
		con.send(data);
	else
		for(var username in conTable)
			conTable[username].send(data);
}

function decatenate(a, b) {
	delete couple[a];
	delete couple[b];

	console.log(a + '与' + b + '之间的连接被拆除');
}

function synCouple(couple, data) {
	conTable[couple[0]].send(JSON.stringify(data));
	conTable[couple[1]].send(JSON.stringify(data));
}

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
						password: password,
						score: 0
					}).then(function (doc) {
						console.log(doc);
						con.send(JSON.stringify({
							type: 'register',
							body: {
								username: username,
								result: true
							}
						}));
						broadcastUsers();
					}).catch(function (err) {
						console.log(err);
						con.send(JSON.stringify({
							type: 'register',
							body: {
								result: false,
								text: '该用户已被注册'
							}
						}));
					});
						
					break;
				case 'login':
					var username = body.username;
					var password = body.password;

					for(var x in conTable)
						if(username == x) {
							con.send(JSON.stringify({
								type: 'login',
								body: {
									result: false,
									text: '该用户已经登录'
								}								
							}));
							return;
						}
							

					db.collection('user').find({
						_id: username,
						password: password
					}).toArray().then(function (array) {
						if(array.length == 0)
							con.send(JSON.stringify({
								type: 'login',
								body: {
									result: false,
									text: '用户名或密码错误'
								}
							}));
						else {
							conTable[username] = con;
							con.send(JSON.stringify({
								type: 'login',
								body: {
									username: username,
									result: true
								}
							}));
							broadcastUsers();
						}
													
					}).catch(function (err) {
						console.log(err);
					});
					break;
				case 'users':
					broadcastUsers(con);
					break;
				case 'rank':
					db.collection('user').find({}).sort({ score: -1 }).toArray().then(function (array) {
						array = array.map(function (item) {
							return {
								_id: item._id,
								score: item.score
							};
						});

						con.send(JSON.stringify({
							type: 'rank',
							body: array
						}));
					}).catch(function (err) {
						console.log(err);
					});
					break;
				case 'invite':
					var inviter = who(con);
					var invitee = body;

					console.log(inviter + '邀请' + invitee + '加入对战');

					conTable[invitee].send(JSON.stringify({
						type: 'invite',
						body: inviter
					}));
					break;
				case 'accept':
					var invitee = who(con);				
					var inviter = body;

					console.log(invitee + '接受了' + inviter + '的邀请');

					couple[inviter] = invitee;
					couple[invitee] = inviter;

					synCouple([inviter, invitee], {
						type: 'start'
					});
					break;
				case 'reject':
					var invitee = who(con);				
					var inviter = body;

					console.log(invitee + '拒绝了' + inviter + '的邀请');

					conTable[inviter].send(JSON.stringify({
						type: 'reject',
						body: invitee
					}));
					break;
				case 'battle':
					var sender = who(con);
					var receiver = couple[sender];
					var score = parseInt(body.score);

					if(!sender || !receiver)
						return;

					console.log(sender + '向' + receiver + '更新数据');

					db.collection('user').update({
						_id: sender,
						score: {
							$lt: score
						}
					}, {
						$set: {
							score: score
						}
					}).then(function (doc) {
						console.log(doc.result);
					}).catch(function (err) {
						console.log(err);
					})

					conTable[receiver].send(JSON.stringify({
						type: 'battle',
						body: {
							matrix: body.matrix,
							score: score
						}
					}));
					break;
				case 'pause':
				case 'run':
				case 'end':
					var intruder = who(con);
					var another = couple[intruder];

					console.log(intruder + type + '了游戏');

					synCouple([intruder, another], {
						type: type,
						body: intruder
					});

					if(type == 'end')
						decatenate(intruder, another);
					break;
			}
		});

		/*当这条连接断开时, 被调用*/
		con.on('close', function () {
			var isFinded = false;
			for(var username in conTable)
				if(conTable[username] == con) {
					isFinded = true;
					break;
				}

			if(isFinded) {
				delete conTable[username];
				console.log(username + '离开');				
			}

			var another = couple[username];
			if(another)
				decatenate(username, another);
		});

		con.on('error', function (err) {
			console.log(err);
		});

	}).listen(8848);

}).catch(function (err) {
	console.log(err);
});