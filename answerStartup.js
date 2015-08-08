var seneca = require('seneca')();

var mongoose = require('mongoose');
mongoose.connect('mongodb://yousi:password@112.124.117.146:27017/yousi');

seneca.client({host: '127.0.0.1', port: 7001, pin: {role:'keepAlive',cmd:'*'}});
seneca.use('/plugins/answer/service');
seneca.listen({
	host : '127.0.0.1',
	port : '7002'
}).ready(function(){
	seneca.act({role: 'answer', cmd: 'start'}, function (err, result) {
		console.log('Start answer service!');
	})
})