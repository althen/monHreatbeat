var webUrl = 'http://127.0.0.1:8090/data';

var dtime = 0;

var webio = null;
var ctx = null;
$(document).ready(function(){
	console.log('abc');
	webio = io.connect(webUrl);
	webio.on('connected',function(data){
		console.log(data);
	});
	webio.on('data',function(d){
		console.log(d);
		$('#num').html(d.total);
		
		document.getElementById('ifrm').contentWindow.postMessage(d,'*');
	});
	
	$('#btn_stop').click(stop);

	webio.on('heartbeat',function(data){
		console.log(data);
		showHeartbeat(data);
	});

});

function stop(){
	console.log(webio);
	webio.disconnect();

	//document.getElementById('ifrm').contentWindow.postMessage('abc','*');
}

function showBar(num){
	data.datasets[0].data.shift();
	data.datasets[0].data.push(num);

	data.labels.shift();
	data.labels.push(num);

	new Chart(ctx).Bar(data);
}

function showHeartbeat(data){
	dtime = (new Date()).getTime() - data.timestamp;
	
	var datalist = data.heartbeatList;
	for (var k in datalist){
		var tr = $('#tab_heartbeat tr[key="' + k + '"]');
		if (tr.length <= 0){
			$('#tab_heartbeat').append('<tr key="' + k + '"></tr>');
			tr = $('#tab_heartbeat tr[key="' + k + '"]');
		}else{
			tr.empty();
		}
		tr.append('<td>'+ datalist[k].name +'</td><td>'+ datalist[k].lastTime  +'</td><td></td>');
		//console.log(tr);
	}
}
var data={
	labels :[0,0,0,0,0,0],
	datasets:[
	{
		fileColor: "rgba(100,120,200,0.6)",
		data:[20,2,2,2,2,2]
	}
	]
}

