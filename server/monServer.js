
//var soio = require('socket.io').listen(8098);
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var server = http.createServer(handler);
var webio = require('socket.io').listen(server);


function fileHandler(req,res){

		fs.readFile('./' + req.url,function(err,data){
				if (err){
					res.writeHead(500);
					res.end();
					return;
				}
				res.writeHead(200);
				res.end(data);
			});

}

var hbArr = {};

function heartbeat(k,n,t){
	if (hbArr[k] == null){
		hbArr[k] = {};
	}	
	hbArr[k].name = n;
	hbArr[k].timeout = t;
	hbArr[k].lastTime = new Date();
	hbArr[k].mt = hbArr[k].lastTime.getTime();

	var hbList = {};
	hbList[k] = hbArr[k];	

	var hbData = {
		timestamp : (new Date()).getTime(),
		heartbeatList : hbList
	};

	webio.of('/data').volatile.emit('heartbeat',hbData);
}

heartbeat('key0','monServer',5);

function heartbeatHandler(req,res){
	var data = '';
	req.setEncoding('utf8');
	req.on('data',function(d){
		data += d;
	});
	req.on('end',function(){

		var j = JSON.parse(data);
		console.log(j);
		heartbeat(j.key,j.name,j.timeout);
		res.writeHead(200);
		res.end('heartbeat ok');
	});
	
}

function handler(req,res){
	console.log(req.url);
	if (req.url == '/'){
		req.url = './index.html';
		fileHandler(req,res);
		return;
	}

	if (req.url.substring(0,5) == '/post'){
		heartbeatHandler(req,res);
		return;
	}
	
	path.exists('./' + req.url,function(exists){
		if (exists){
			fileHandler(req,res);
		}else{

			res.end('ok');
		}
	});
	/*
	if (fs.exists('./' + req.url)){
		
		fileHandler(req,res);
		return;
	}else{
		console.log('not exist');
	}
	if (req.url == '/'){
		req.url = './index.html';
		fileHandler(req,res);
		return;
		}else{

		res.end('ok');
	}*/
}


webio.of('/data').on('connection',function(socket){
	socket.emit('connected',{ok:1});
});

server.listen(8090);
console.log('listen on 8090');

function getDateString(d){
	return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':00'
}

function getData(){
	heartbeat('key0','monServer',5);

	var d1 = new Date();
	var d2 = new Date();
	d1.setMinutes(d1.getMinutes() - 1);
	d2.setMinutes(d1.getMinutes() - 1);
	//d2.setSeconds(d1.getSeconds() - 30);

	var urlobj = {
		/*
		protocol:'http',
		host:'10.63.16.51',
		port:80,*/
		pathname:'/logmonitorweb/LogMonitor/LogFilesFtpMonitorHandler.ashx',
		
		query:{
			rows:1,page:1,	
			sidx:'FTP_TIME',sord:'desc',oriFileName:'',sender:'',bussinessType:'00',
			startTime:getDateString(d2),endTime:getDateString(d1),
			ftpType:'00',sysType:6,ftpFlag:'00'
		}
	};
	
	var ops = {
		hostname:'10.63.16.51',port:80,method:'GET',
		path:url.format(urlobj)
	};
	console.log(url.format(urlobj));
	//http.get(url.format(urlobj),function(res){
	var req = http.request(ops,function(res){
		res.setEncoding('utf8');
		res.on('data',function(d){
			var jdata = JSON.parse(d);
			jdata.datetime = getDateString(d1);
			console.log(jdata.records);

			webio.of('/data').volatile.emit('data',jdata);
			
		});
	}).on('error',function(e){
		console.log(e.message);
	});
	req.end();

}
getData();
var interval = setInterval(getData,60000);


