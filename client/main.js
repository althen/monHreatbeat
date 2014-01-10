var webUrl = 'http://127.0.0.1:8090/data';


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
		//showBar(d.total);
		
		document.getElementById('ifrm').contentWindow.postMessage(d,'*');
	});
	
	$('#btn_stop').click(stop);

	//ctx = document.getElementById("chart").getContext("2d");
	//showBar(0);
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
var data={
	labels :[0,0,0,0,0,0],
	datasets:[
	{
		fileColor: "rgba(100,120,200,0.6)",
		data:[20,2,2,2,2,2]
	}
	]
}

