var _ = require('lodash');
var seneca = require('seneca')();
var Room = require('./room.js')
var roomModel = require('./model.js').roomModel;

module.exports = function(options){
	var seneca = this;

	seneca.rooms = {};

	seneca.add({role: 'room', cmd: 'start'}, cmd_start);
	seneca.add({role: 'room', cmd: 'create'}, cmd_create);
	seneca.add({role: 'room', cmd: 'get'}, cmd_get);

	seneca.add({role: 'room', cmd: 'schedule'}, cmd_schedule);

	seneca.add({role: 'room', cmd: 'enter_message'}, cmd_enter_message);
	seneca.add({role: 'room', cmd: 'leave_message'}, cmd_leave_message);
	seneca.add({role: 'room', cmd: 'close_message'}, cmd_close_message);

	function cmd_start(args, callback){
		seneca.act({role: 'keepAlive', cmd: 'register', data: {
			role: 'room', cmd: 'enter_message', type: 'message', c: 'room.enter'
		}})
		seneca.act({role: 'keepAlive', cmd: 'register', data: {
			role: 'room', cmd: 'leave_message', type: 'message', c: 'room.leave'
		}})
		seneca.act({role: 'keepAlive', cmd: 'register', data: {
			role: 'room', cmd: 'close_message', type: 'close'
		}})
		callback(null, null);
	}

	function cmd_create(args, callback){
		var username = args.data.username;
		var status = args.data.status;
		var type = args.data.type;

		var room = roomModel();
		room.owner = username;
		room.status = status;
		room.type = type;
		room.save(function (err) {
			if (_.isEmpty(err))
				callback(null, { status: 'success' });
			else
				callback(null, { status: 'fail' });
		})
	}

	function cmd_get(args, callback){
		var roomID = args.data.roomID;
		var username = args.data.username;
		var role = args.data.role;

		//判断用户是否已经进入房间

		roomModel
		.findOne({ _id: roomID }, function (err, room) {
			if (_.isEmpty(err) && !_.isEmpty(room)) {
				callback(null, { status: 'success', data: room });
			} else {
				callback(null, { status: 'fail' });
			}
		})
	}


	function cmd_schedule(args, callback){
		var answerID = args.data.answerID;
		var teacher = args.data.teacher;
		var student = args.data.student;

		var roomID = Date.now();
		seneca.rooms[roomID] = new Room(roomID, teacher, student);

		callback(null, { status: 'success', data: { roomID: roomID }});
	}

	function cmd_enter_message(args, callback){
		var username = args.data.username;
		var role = args.data.role;
		var token = args.data.token;
		var roomID = args.data.roomID;

		var user = { username: username, role: role, token: token };

		if (!_.isEmpty(seneca.rooms[roomID]) && seneca.rooms[roomID].addUser(user)) {
			var status = 'success';
		} else {
			var status = 'fail';
		}

		seneca.act({role: 'keepAlive', cmd: 'reply', data: {
			token: token,
			msg: {c: 'room.enter', data: { status: status }}
		}})
		callback(null, { status: status })

		// roomModel
		// .findOne({ _id: roomID }, function (err, room) {
		// 	if (!_.isEmpty(room)) {	
		// 		if (_.isEmpty(seneca.rooms[roomID])) {
		// 			seneca.rooms[roomID] = new Room(roomID);
		// 		}
		// 		seneca.act({role: 'keepAlive', cmd: 'reply', data: {
		// 			token: token,
		// 			msg: {c: 'room.enter', data: { status: 'success' }}
		// 		}})
		// 	} else {
		// 		seneca.act({role: 'keepAlive', cmd: 'reply', data: {
		// 			token: token,
		// 			msg: {c: 'room.enter', data: { status: 'fail' }}
		// 		}})				
		// 	}
		// 	callback(null, null);		
		// });
	}

	function cmd_leave_message(args, callback){
		var username = args.data.username;
		var role = args.data.role;
		var token = args.data.token;
		var roomID = args.data.roomID;

		var user = { username: username, role: role, token: token };

		if (!_.isEmpty(seneca.rooms[roomID]) && seneca.rooms[roomID].removeUser(user)) {
			var status = 'success';
		} else {
			var status = 'fail';
		}

		seneca.act({role: 'keepAlive', cmd: 'reply', data: {
			token: token,
			msg: {c: 'room.enter', data: { status: status }}
		}})
		callback(null, { status: status })
	}

	function cmd_close_message(args, callback){
		var roomID = args.data.roomID;
		var token = args.data.token;

		// if (!_.isEmpty(seneca.rooms[roomID]) && seneca.rooms[roomID].interrupt(token)) {
		// 	callback(null, { status: 'success' });
		// } else {
		// 	callback(null, { status: 'fail' })
		// }
		callback(null, null);
	}
}