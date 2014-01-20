
var cluster = require('cluster');
var http = require('http');

if (cluster.isMaster){

	cluster.fork();
	cluster.on('exit',function(w,c,s){
		console.log('worker ' + w.process.pid + ' died');
		cluster.fork();
	});
}else{

	var w = require('./cluWorker.js');
	w.server();
}
