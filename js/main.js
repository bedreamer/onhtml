// JavaScript Document
var g_cfg = {
	inited:true,  // 系统已经配置过了
	query_proctol:'http://',
	first_startup_url:'http://127.0.0.1:8080/first/',
	ontom_host:'192.168.1.14:8081',
	ontom_query:'/system/query.json',
	// 查询周期, 根据传来的数据动态调整
	query_period:800,
	// 作业查询接口
	ontom_query_job:'/job/query.json',
	// 作业创建接口
	ontom_create_job:'/job/create.json'
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
// 作业提交参数
var g_commit = {
	// 提交的时间戳
	c_timestamp:'0',
	// 提交的卡片ID
	c_cid: 'N/A',
	// 计费模式[自动|电量|时间|金额]
	b_mode: 'auto',
	// 按电量计费参数
	b_kwh: '0.0',
	// 按时间计费参数
	b_time: '0',
	// 按金额计费参数
	b_money: '0',
	// 充电模式[自动|手动]
	c_mode: 'auto',
	// 手动充电模式[恒压|恒流]
	cm_set_mode: 'BV',
	// 手动充电限压值
	cm_set_V: '0.0',
	// 手动充电限流值
	cm_set_I: '0.0'
};

// JS 初始化调用
function js_init() {
	g_cfg.ontom_query = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_query;
	g_cfg.ontom_query_job = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_query_job;
	g_cfg.ontom_create_job = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_create_job;
	setTimeout(js_main_loop, 800);
}

// 定时执行
function js_main_loop() {
	$.getJSON(g_cfg.ontom_query, '', function (data, status, xhr){
		if ( status == "success" ) {
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
	if ( g_sys.page_id_curr == 'id_mainpage' ) { // 创建充电作业
		page_show_job_create('id_mainpage', sn, remain);
	} else if (g_sys.page_id_curr=='id_job_create') { // 提交作业
		function do_job_commit(sn) {
			var pa = 't=' + Date.parse(new Date()).toString() + '&gun=1';
			$.getJSON(g_cfg.ontom_create_job, pa, function (data, status, xhr) {
				if ( status == 'success' ) {
					if ( data.status == "REJECTED" ) {
						alert('无效的作业');
					} else if ( data.status=='PENDING') {
						page_show_main_page('id_job_create');
					} else if (data.status == 'OK' ) {
						page_show_main_page('id_job_create');
					} else;
					return;	
				}
				});
		}
		do_job_commit(sn);
	} else if (g_sys.page_id_curr=='id_job_working') { // 终止充电作业
	} else { // 无效刷卡
	}
}

function job_commit_startup(sn, remain) {
}

// 充电作业池预览
function page_show_jobs_preview(from) {
	$('#'+from).hide();
	$('#jobs_preview_page').show();
	g_sys.page_id_curr = 'jobs_preview_page';

	$('#jobs_preview').html("<b>没有充电作业!</b>");
	function refresh_jobs_list() {
		if ( g_sys.page_id_curr != 'jobs_preview_page' ) return;
		$.getJSON(g_cfg.ontom_query_job, '', function (data, status, xhr){
				if ( status == 'success' ) {
					$.each(data, function (index, d) {
						if ( index != 'jobs' ) return;
						if ( d.length <= 0 ) {
							$('#jobs_preview').html("<b>没有充电作业!</b>");
							 return;
						}

						var codes='';
						for ( var i = 0; i < d.length; i ++ ) {
							var left = 55 + (i % 5) * 120 + 15 * (i%5);
							var top = 120 * Math.floor(i/5) + 15 + 15 * Math.floor(i/5);
							codes = codes + 
							"<a href=\"javascript:page_show_job_detail('jobs_preview_page','";
							codes = codes + d[i].id + "');\">";
							codes = codes +"<div align=\"center\" class=\"job_preview_box\"";
							codes = codes +" style=\"left:" + left.toString() + "px";
							codes = codes +";top:" + top.toString() + "px\" ";
							codes = codes + "id=\"id_jobpreview_"+i.toString() + "\">";
							codes = codes + "<table align=\"center\">";
							codes = codes + "<tr><td>状态</td><td>等待</td></tr>";
							codes = codes + "<tr><td>端口</td><td>1#枪</td></tr>";
							codes = codes + "<td colspan=\"2\" scope=\"col\">" + d[i].id;											
							codes = codes + "</td><td scope=\"col\">&nbsp;</td>"
    						codes = codes + "<td scope=\"col\">&nbsp;</td>"
							codes = codes + "</table></div></a>";
						}
						$('#jobs_preview').html(codes);
						});
	
				}
		});
		setTimeout(refresh_jobs_list, g_cfg.query_period);
	}
	refresh_jobs_list();
}

// 显示主页
function page_show_main_page(from) {
	$('#'+from).hide();
	$('#id_mainpage').show();
	g_sys.page_id_curr = 'id_mainpage';
}

// 显示作业的详细信息
function page_show_job_detail(from, job) {
	$('#'+from).hide();
	$('#id_job_working').show();
	g_sys.page_id_curr = 'id_job_working';
	$('#id_job_working_jid').html(job);
}

// 显示作业创建页面
function page_show_job_create(from, cid, remain) {
	$('#'+from).hide();
	$('#id_job_create').show();
	g_sys.page_id_curr = 'id_job_create';
	$('#id_job_commit_card_sn').html(cid);
	$('#id_job_commit_acount_remain').html(remain);
}

// 显示按电量充电设置页面
function page_show_bm_set_kwh() {
	$('#id_bm_set_kwh_page').show();
	g_sys.page_id_curr = 'id_bm_set_kwh_page';
	$('#id_keypad').show();
}

// 显示按时间充电设置页面
function page_show_bm_set_time() {
	$('#id_bm_set_time_page').show();
	g_sys.page_id_curr = 'id_bm_set_time_page';
	$('#id_keypad').show();
}

// 显示按金额充电设置页面
function page_show_bm_set_money() {
	$('#id_bm_set_money_page').show();
	g_sys.page_id_curr = 'id_bm_set_money_page';
	$('#id_keypad').show();
}

// 计费方式设置取消
function page_bm_set_cancel(from) {
	$('#'+from).hide();
	$('#id_keypad').hide();
	//$('#id_bm_auto').attr("checked","checked");
	if ( from == 'id_bm_set_kwh_page' ) {
		//$('#id_bm_kwh').removeAttr('checked');
		$("input[type='radio'][name='bm'][value='1']").attr("checked",false);
	} else if ( from == 'id_bm_set_time_page') {
		//$('#id_bm_time').removeAttr('checked');
		$("input[type='radio'][name='bm'][value='2']").attr("checked",false);
	} else if ( from == 'id_bm_set_money_page') {
		//$('#id_bm_money').removeAttr('checked');
		$("input[type='radio'][name='bm'][value='3']").attr("checked",false);
	} else ;
	$("input[type='radio'][name='bm'][value='0']").attr("checked",true);
	//$("input[@type=radio][name=sex][@value=1]").attr("checked",true);  
	g_sys.page_id_curr = 'id_job_create';
}

// 手动充电设置页面取消
function page_cm_set_cancel(from) {
	$('#'+from).hide();
	$('#id_keypad').hide();
	g_sys.page_id_curr = 'id_job_create';
}

// 显示手动充电设置页面
function page_show_cm_set() {
	$('#id_cm_set_page').show();
	g_sys.page_id_curr = 'id_cm_set_page';
	$('#id_keypad').show();
}

// 作业创建取消
function page_job_create_cancel(from) {
	page_show_main_page(from);
}