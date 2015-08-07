var cp = require('child_process');

cp.fork(__dirname + '/keepAliveStartup.js');
cp.fork(__dirname + '/answerStartup.js');