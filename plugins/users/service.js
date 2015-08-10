var crypto = require('crypto');
var usersModel = require('./model.js').usersModel;
var error = require('./error.js')();

module.exports = function(options) {
	var seneca = this;
	var key = 'qwxxxx1_xxx_wsx';

	seneca.options({strict:{result:false}})

	seneca.add({role:'users', cmd:'create'}, cmd_create);
	seneca.add({role:'users', cmd:'getUser'}, cmd_getUser);
	// seneca.add({role:'users', cmd:'checkLogin'}, cmd_checkLogin);
	// seneca.add({role:'users', cmd:'sign'}, cmd_sign);


	function cmd_create(args, callback){
		var user = usersModel();
		user.username = args.data.username;
		user.password = args.data.password;
		user.role = args.data.role;

		user.save(function (err) {
			callback(err, user);
		})
	}

	function cmd_getUser(args, callback){
		usersModel
		.findOne(args.data)
		.exec(function (err, result) {
			callback(err, result);
		});
	}
}