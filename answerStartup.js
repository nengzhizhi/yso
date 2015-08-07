var seneca = require('seneca')();

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