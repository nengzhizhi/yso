var seneca =require('seneca')();

var mongoose = require('mongoose');
mongoose.connect('mongodb://yousi:password@112.124.117.146:27017/yousi');

seneca.client({host: '127.0.0.1', port: 7001, pin: {role:'keepAlive',cmd:'*'}});
seneca.use('/plugins/room/service');
seneca.listen({
	host : '127.0.0.1',
	port : '7003'
}).ready(function(){
	seneca.act({role: 'room', cmd: 'start'}, function (err, result) {
		console.log('Start room service!');
	})
})

seneca.use('/plugins/room/api');
var api = require('express')();
api
.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
})
.use(seneca.export('web'))
.listen(2003);