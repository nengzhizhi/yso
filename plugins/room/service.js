var _ = require('lodash');
var seneca = require('seneca')();
var roomModel = require('./model.js').roomModel;

module.exports = function(options){
	var seneca = this;

	seneca.rooms = {};

	seneca.add({role: 'room', cmd: 'start'}, cmd_start);
	seneca.add({role: 'room', cmd: 'create'}, cmd_create);
	seneca.add({role: 'room', cmd: 'get'}, cmd_get);

	seneca.add({role: 'room', cmd: 'enter_message'}, cmd_enter_message);
	seneca.add({role: 'room', cmd: 'leave_message'}, cmd_leave_message);
	seneca.add({role: 'room', cmd: 'close_message'}, cmd_close_message);
	
	function _addUserToRoom(username, role, token, roomSnap){
		if (_.isEmpty(seneca.rooms[roomSnap._id])) {
			seneca.rooms[roomSnap._id] = {};
		}

		if (_.isEmpty(seneca.rooms[roomSnap._id][token])) {
			seneca.rooms[roomSnap._id][token] = { username: username, role: role };
			return true;
		} else {
			return false;
		}
	}

	function _removeUserFromRoom(roomID, token){
		if (!_.isEmpty(seneca.rooms[roomID][token])) {
			delete seneca.rooms[roomID][token];
		}
	}

	function _removeUser(token){
		for (var roomID in seneca.rooms) {
			if (!_.isEmpty(seneca.rooms[roomID][token])) {
				delete seneca.rooms[roomID][token];
			}
		}
		return true;
	}

	function _getRoomTokens(roomID){
		var tokens = [];
		for (var key in seneca.rooms[roomID]) {
			tokens.push(key);
		}
		return tokens;
	}

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

	function cmd_enter_message(args, callback){
		var roomID = args.data.roomID;
		var token = args.data.token;
		var username = args.data.username;
		var role = args.data.role;


		roomModel
		.findOne({ _id: roomID }, function (err, room) {
			if (!_.isEmpty(room) && _addUserToRoom(username, role, token, room)) {	
				seneca.act({role: 'keepAlive', cmd: 'reply', data: {
					token: token,
					msg: {c: 'room.enter', data: { status: 'success' }}
				}})
			} else {
				seneca.act({role: 'keepAlive', cmd: 'reply', data: {
					token: token,
					msg: {c: 'room.enter', data: { status: 'fail' }}
				}})				
			}
			callback(null, null);		
		});
	}

	function cmd_leave_message(args, callback){
		var roomID = args.data.roomID;
		var token = args.data.token;
		var username = args.data.username;
		_removeUserFromRoom(roomID, token);
		callback(null, null);
	}

	function cmd_close_message(args, callback){
		var token = args.data.token;
		_removeUser(token);
		callback(null, null);
	}
}