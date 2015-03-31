// JavaScript Document
var jiaozhun=[
	{n:'V1',p:4000},
	{n:'V1',p:4500},
	{n:'V1',p:5000},
	{n:'V1',p:5500},
	{n:'V1',p:6000},
	{n:'V1',p:6500},
	{n:'V2',p:4000},
	{n:'V2',p:4500},
	{n:'V2',p:5000},
	{n:'V2',p:5500},
	{n:'V2',p:6000},
	{n:'V2',p:6500}
];
var started = false;
var cur =0;
var done = false;

function jiaozhun_proc() {
	if ( jiaozhun[cur].n == 'V1' ) {
		$('#id_name').html('一段母线及电池1电压');
	} else if ( jiaozhun[cur].n == 'V2' ) {
		$('#id_name').html('二段母线及电池2电压');
	}
	$('#id_param').html(jiaozhun[cur].p/10 + 'V');
	$('#id_ps').html( cur / jiaozhun.length + '%');

	if (jiaozhun.length > cur) {
		var p = 'op=' + jiaozhun[cur].n + '&p=' + jiaozhun[cur].p;
		$.getJSON('http://192.168.1.200:8081/system/jiaozhun.json', p, function(data, status, xhr){
			if ( status != 'success' ) return;
			if ( jiaozhun[cur].n == 'V1' ) {
				if ( data.V1 >= jiaozhun[cur].p - 2 &&  data.V1 <= jiaozhun[cur].p + 2 ) {
				} else {
				}
			} else if ( jiaozhun[cur].n == 'V2' ) {
				if ( data.V2 >= jiaozhun[cur].p - 2 &&  data.V2 <= jiaozhun[cur].p + 2 ) {
				} else {
				}
			}
			
			if ( data.SCS == 'ERR' || data.CCS == 'ERR' ) {
				$('#id_status').html('通信故障');
			} else {
				$('#id_status').html('正常');
			} 
		});
	}
	if ( done == false ) {
		setTimeout(jiaozhun_proc, 1500);
	}
}

$(function(){
	$('#id_start').click(function(){
		if ( started == false ) {
			started = true;
			cur = 0;
			done = false;
			$('#id_btn_start').html('停止校准');
			setTimeout(jiaozhun_proc, 1500);
		} else {
			started = false;
			cur = 0;
			done = true;
			$('#id_btn_start').html('开始自动校准');
		}
	})
});

$(function(){
	$('#id_done').click(function(){
		$.getJSON('http://192.168.1.200:8081/system/save.json', 's=work_mode=normal;', function(data, status, xhr){
			if ( status != 'success' ) return;
		});
	})
});
