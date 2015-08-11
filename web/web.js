//MVC框架用于渲染html页面

var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var app = express();
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//TODO change key
app.use(cookieParser('key'));
app.use('/room', require('./controller/roomRouter'));
app.use('/users', require('./controller/usersRouter'));
app.use('/answer', require('./controller/answerRouter'));
app.listen(3001);