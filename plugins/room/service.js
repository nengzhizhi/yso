module.exports = function(options){
	var seneca = this;

	seneca.rooms = {};
	seneca.client({host: 'localhost', port: 7001, pin: {role:'keepAlive',cmd:'*'}});

	seneca.add({role: 'room', cmd: 'start'}, cmd_start);
	seneca.add({role: 'room', cmd: 'create'}, cmd_create);
	seneca.add({roke: 'room', cmd: 'get'}, cmd_get);

	seneca.add({role: 'room', cmd: 'enter_message'}, cmd_enter_message);
	seneca.add({role: 'room', cmd: 'leave_message'}, cmd_leave_message);
	seneca.add({role: 'room', cmd: 'close_message'}, cmd_close_message);
	
	function _couldEnterRoom(username, role, roomSnap){
		return true;
	}

	function cmd_start(args, callback){
		seneca.act({role: 'keepAlive', cmd: 'register', data: {
			role: 'room', cmd: 'enter_message', type: 'message', c: 'enter'
		}})
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

		if (_.isEmpty(seneca.rooms[roomID])) {
			seneca.rooms[roomID] = {};
		}

		var user = { username: username, role: role };
		var tokens = [];
		for (var key in seneca.rooms[roomID]) {
			tokens.push(key);
		}
		seneca.rooms[roomID][token] = user;

		seneca.act({role: 'keepAlive', cmd: 'broadcast', data: {
			tokens: tokens, 
			msg: {c: 'enter_push', data: user }
		}})
		callback(null, null);
	}

	function cmd_leave_message(args, callback){
		var roomID = args.data.roomID;
		var token = args.data.token;
		var username = args.data.username;
		var role = args.data.role;

		var tokens = [];
		for (var key in seneca.rooms[roomID]) {
			tokens.push(key);
		}

		seneca.act({role: 'keepAlive', cmd: 'broadcast', data: {
			tokens: tokens,
			msg: {c: 'leave_push', data: user }
		}})
		callback(null, null);
	}

	function cmd_close_message(args, callback){
		callback(null, null);
	}

}