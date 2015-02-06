// JavaScript Document
var g_cfg = {
	inited:true,  // 系统已经配置过了
	query_proctol:'http://',
	first_startup_url:'http://127.0.0.1:8080/first/',
	ontom_host:'192.168.1.14:8081',
	ontom_query:'/system/query.json',
	// 查询周期, 根据传来的数据动态调整
	query_period:800
};
var g_sys = {
	// 当前显示的页面ID
	page_id_curr:'id_mainpage',
	// 系统状态
	sys_status:'N/A',
	// 充电机状态
	charger_status:'N/A',
	// 一段母线状态
	bus0_institude:'N/A',
	// 二段母线状态
	bus1_institude:'N/A',
	// 1# 充电枪连接状态
	gun0_conn_status:'N/A',
	// 2# 充电枪连接状态
	gun1_conn_status:'N/A',
	// 3# 充电枪连接状态
	gun2_conn_status:'N/A',
	// 4# 充电枪连接状态
	gun3_conn_status:'N/A',

	// 1# 充电枪充电状态
	gun0_work_status:'N/A',
	// 2# 充电枪充电状态
	gun1_work_status:'N/A',
	// 3# 充电枪充电状态
	gun2_work_status:'N/A',
	// 4# 充电枪充电状态
	gun3_work_status:'N/A',
	// 作业总数
	job_count:0,
	// 等待作业数量
	job_wait_count:0,
	// 执行祖业数量
	job_working_count:0
};

// JS 初始化调用
function js_init() {
	g_cfg.ontom_query = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_query;
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
					$('#id_mainpage_sys_status').css('color', '#FF0');
				break;
				case '故障':
					$('#id_mainpage_sys_status').css('color', '#F00');
				break;
				case '正常':
					$('#id_mainpage_sys_status').css('color', '#0F0');
				break;
				}
				switch ( data.charger_status ) {
				case 'N/A':
					$('#id_mainpage_chargers_status').css('color', '#FF0');
				break;
				case '故障':
					$('#id_mainpage_chargers_status').css('color', '#F00');
				break;
				case '正常':
					$('#id_mainpage_chargers_status').css('color', '#0F0');
				break;
				}
				switch ( data.bus0_institude ) {
				case 'N/A':
					$('#id_mainpage_bus0_institude').css('color', '#FF0');
				break;
				case '故障':
					$('#id_mainpage_bus0_institude').css('color', '#F00');
				break;
				case '正常':
					$('#id_mainpage_bus0_institude').css('color', '#0F0');
				break;
				}
				$('#id_mainpage_sys_status').html(data.system_status);
				$('#id_mainpage_chargers_status').html(data.charger_status);
				$('#id_mainpage_bus0_institude').html(data.bus0_institude);
				$('#id_mainpage_bus0_voltage').html(data.bus0_V);
				if ( data.query_period > 0 ) {
					g_cfg.query_period = data.query_period;
				}
				
				g_sys.gun0_work_status = data.gun0_work_status;
				g_sys.gun1_work_status = data.gun1_work_status;
				g_sys.gun2_work_status = data.gun2_work_status;
				g_sys.gun3_work_status = data.gun3_work_status;

				if ( data.card_sn != 'N/A' ) {
					card_sn_valid(data.card_sn, data.card_remain);
				}
			}
		}
	});
	setTimeout(js_main_loop, g_cfg.query_period);
}

// 处理刷卡事件
function card_sn_valid(sn, remain) {
	// 创建作业
	if ( g_sys.job_working_count == 0 ) {
	} else {
	}
}

function job_commit_startup(sn, remain) {
}

function page_show_jobs_preview(from) {
	var codes = '';
	var nr = 10;

	$('#'+from).hide();
	$('#jobs_preview_page').show();
	g_sys.page_id_curr = 'jobs_preview_page';

	for ( var i = 0; i < nr; i ++ ) {
		codes = codes + "<a href=\"javascript:page_show_job_detail('jobs_preview_page', '0');\"><div class=\"job_preview_box\"";
		codes = codes + "id=\"id_jobpreview_" + i.toString() + "\">";
		codes = codes + "<table>";
		codes = codes + "<tr><td>状态</td><td>等待</td></tr>";
		codes = codes + "<tr><td>端口</td><td>1#枪</td></tr>";
		codes = codes + "</table></div></a>";
	}
	$('#jobs_preview').html(codes);
	for ( var i = 0; i < nr; i ++ ) {
		var id = "#id_jobpreview_" + i.toString();
		var left = 55 + (i % 5) * 120 + 15 * (i%5);
		var top = 120 * Math.floor(i/5) + 15 + 15 * Math.floor(i/5);
		$(id).css('left', left);
		$(id).css('top', top);
	}
}

// 显示主页
function page_show_main_page(from) {
	var codes = '';
	var nr = 10;

	$('#'+from).hide();
	$('#id_mainpage').show();
	g_sys.page_id_curr = 'id_mainpage';
}

// 显示作业的详细信息
function page_show_job_detail(from, job) {
	$('#'+from).hide();
	$('#id_job_working').show();
}

