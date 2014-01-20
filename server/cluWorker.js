
var http = require('http');


exports.server = function(){
	console.log('v2');
	var s = http.createServer(function(req,res){
		console.log(req.url);
		res.writeHead(200);
		res.end('v2');
		if (req.url == '/kill'){
			s.close();
		}
	});
	s.listen(8000);
}
