// JavaScript Document
var g_cfg = {
	inited:true,  // 系统已经配置过了
	first_startup_url:'http://127.0.0.1:8080/first/',
	ontom_host:'http://127.0.0.1:8081',
	ontom_query:'http://192.168.1.14:8081/system/query.json'
};

// JS 初始化调用
function js_init() {
	setTimeout(js_main_loop, 800);
}

// 定时执行
function js_main_loop() {
	$.getJSON(g_cfg.ontom_query, '', function (data, status, xhr){
		if ( status == "success" ) {
			//var ontom = $.parseJSON(data);
			if ( data.version == 'V1.0' ) {
				switch ( data.system_status ) {
				case 'N/A':
					$('#id_mainpage_sys_status').css('color', '#0F0');
					$('#id_mainpage_sys_status').html(data.system_status);
				break;
				case '故障':
					$('#id_mainpage_sys_status').html(data.system_status);
				break;
				case '正常':
					$('#id_mainpage_sys_status').html(data.system_status);
				break;
				}
				$('#id_mainpage_chargers_status').html(data.charger_status);
				$('#id_mainpage_bus0_institude').html(data.bus0_institude);
				$('#id_mainpage_bus0_voltage').html(data.bus0_V);
			}
		}
	});
	setTimeout(js_main_loop, 800);
}
