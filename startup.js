var cp = require('child_process');

cp.fork(__dirname + '/keepAliveStartup.js');
cp.fork(__dirname + '/answerStartup.js');
cp.fork(__dirname + '/roomStartup.js');
cp.fork(__dirname + '/usersStartup.js');