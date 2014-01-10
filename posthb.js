
var http = require('http');

//console.log(process.argv[2]);
var server = process.argv[2].split(':');
var k = process.argv[3];
var n = process.argv[4];
var t = process.argv[5];
var ip = server[0];
var port = server[1];

if (isNaN(port)){
	port = 80;
}else{
	port = parseInt(port);
}

console.log(ip);
console.log(port);

var opt ={
	host : ip,
	port : port,
	path : '/post',
	method : 'POST'
}

var req = http.request(opt,function(res){
	res.setEncoding('utf8');
	res.on('data',function(d){
		console.log(d);
	});
});

req.write(JSON.stringify({key:k,name:n,timeout:t}));

//req.on('error',function(e){
req.end();
