"undefined" === typeof teacher && (teacher = {});
(function(t){
	var enterRoom = function(data){
		console.log('response enter room!');
		// var roomID = data.roomID;

		// //根据data.roomID跳转到房间页面
		// //进入页面后发送enter消息，收到回复后渲染页面
		// connect.register('room.enter', function (data) {
		// 	if (data.status == 'success') {
		// 		redirect.url = 'http://xxx/room?id=xxxx-xxxx';
		// 	}
		// })
		// //TODO send cookie？
		// connect.send({c: 'room.enter', data: {roomID: roomID, username: username, role: role}});
	}

	t.queue = function(){
		connect.send({c: 'answer.queue', data: { username: 'teacher', role: 'teacher' }});		
	}

	connect.register('answer.match', enterRoom);
})(teacher);