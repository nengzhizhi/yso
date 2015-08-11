var ejs = require('ejs');
var express = require('express');
var seneca = require('seneca')();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
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
api.engine('.html', ejs.__express) // for app
api.set('view engine', 'html') //for app
api
.use(express.static(__dirname + '/public'))
.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json())
//TODO change key
.use(cookieParser('key'))
.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})
.use(expressValidator({
	customValidators : {
		isObjectId : function(value){
			return _.isString(value) && value.match(/^[a-z0-9]{20,30}$/g);
		},
        isTimeStamp : function(value){
            return _.isString(value) && value.match(/^[0-9]{10,20}$/g);
        }
	}
}))
.use(seneca.export('web'))
.listen(2003);