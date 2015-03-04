// JavaScript Document
var g_cfg = {
	inited:true,  // 系统已经配置过了
	query_proctol:'http://',
	first_startup_url:'http://127.0.0.1:8080/first/',
	ontom_host:'192.168.1.85:8081',
	ontom_query:'/system/query.json',
	// 查询周期, 根据传来的数据动态调整
	query_period:800,
	// 作业查询接口
	ontom_query_job:'/job/query.json',
	// 作业创建接口
	ontom_create_job:'/job/create.json',
	// 作业中止接口
	ontom_abort_job:'/job/abort.json',
	// 当前故障查询接口
	ontom_current_error:'/system/error.json'
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
	g_cfg.ontom_abort_job = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_abort_job;
	g_cfg.ontom_current_error = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_current_error;
	setTimeout(js_main_loop, 800);
}

// 定时执行
function js_main_loop() {
	$.getJSON(g_cfg.ontom_query, '', function (data, status, xhr){
		if ( status == "success" ) {
			if ( data.doreset == true ) {
				page_show_main_page(g_sys.page_id_curr);
			}
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
				$('#id_mainpage_bus0_current').html(data.bus0_I);
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
			var pa = 't=' + Date.parse(new Date()).toString();
			pa = pa + '&cid=' + sn;
			pa = pa + '&gun=' + $("input[name='gun']:checked").val();
			if ( g_commit.b_mode == 'kwh' ) {
				pa = pa + '&b_mode=kwh&b_kwh=' + g_commit.b_kwh;
			} else if ( g_commit.b_mode == 'time') {
				pa = pa + '&b_mode=time&b_time=' + g_commit.b_time;
			} else if ( g_commit.b_mode == 'money') {
				pa = pa + '&b_mode=money&b_money=' + g_commit.b_money;
			} else {
				pa = pa + '&b_mode=auto';
			}
			if ( g_commit.c_mode == 'BI' ) {
				pa = pa + '&c_mode=BI&set_I=' + g_commit.cm_set_I;
				pa = pa + '&set_V=' + g_commit.cm_set_V;
			} else if ( g_commit.c_mode == 'BV') {
				pa = pa + '&c_mode=BV&set_V=' + g_commit.cm_set_V;
				pa = pa + '&set_I=' + g_commit.cm_set_I;
			} else {
				pa = pa + '&c_mode=auto';
			}
			$.getJSON(g_cfg.ontom_create_job, pa, function (data, status, xhr) {
				if ( status == 'success' ) {
					if ( data.status == "REJECTED" ) {
						alert('无效的作业');
					} else if ( data.status=='PENDING') {
						page_show_job_detail('id_job_create', data.id);
					} else if (data.status == 'OK' ) {
						page_show_job_detail('id_job_create', data.id);
					} else;
					return;	
				}
			});
		}
		do_job_commit(sn);
	} else if (g_sys.page_id_curr=='id_job_working') { // 终止充电作业
		var pa = 'id=' + $('#id_job_working_jid').html();
		$.getJSON(g_cfg.ontom_abort_job, pa, function (data, status, xhr) {
		if ( status == 'success' ) {
			if ( data.status == "REJECTED" ) {
				alert('无效的作业');
			} else {
				page_show_main_page('id_job_working');
			}
			return;	
		}
		});
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
							codes = codes +" style=\"left:" + left + "px";
							codes = codes +";top:" + top + "px\" ";
							codes = codes + "id=\"id_jobpreview_"+i + "\">";
							codes = codes + "<table align=\"center\" class=\"job_preview_box_table\">";
							codes = codes + "<tr><td>状态</td><td>" + d[i].status + "</td></tr>";
							codes = codes + "<tr><td>端口</td><td>" + d[i].port + "枪</td></tr>";
							codes = codes + "<tr><td>连接</td><td>" + d[i].gun_stat + "</td></tr>";		
							codes = codes + "<tr><td>JID:</td><td>" + d[i].id  + "</td></tr>";											
							codes = codes + "<tr><td>CID:</td><td>" + d[i].cid + "</td></tr>";											
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

// 显示系统查询目录
function page_system_menu(from) {
	$('#'+from).hide();
	$('#id_system_query_page').show();
	g_sys.page_id_curr = 'id_system_query_page';
}

// 显示当前故障
function page_show_current_error(from) {
	$('#'+from).hide();
	$('#id_current_error_page').show();
	g_sys.page_id_curr = 'id_current_error_page';

	$('#current_error_panel').html('<br><br>没有故障');
	function refresh_current_error_list() {
		if ( g_sys.page_id_curr != 'id_current_error_page' ) return;
		$.getJSON(g_cfg.ontom_current_error, '', function (data, status, xhr){
				if ( status == 'success' ) {
					$.each(data, function (index, d) {
						if ( index != 'errors' ) return;
						if ( d.length <= 0 ) {
							$('#current_error_panel').html('<br><br>没有故障');
							 return;
						}

						var codes='<table align="center">';
						codes = codes + '<tr style=\"background-color:rgba(80,80,80,0.3)\">'
						codes = codes + '<td>序号</td><td width=\"60px\">代码</td><td align=\"center\" width=\"380px\">故障</td><td align=\"center\">故障时间</td></tr>';
						for ( var i = 0; i < d.length; i ++ ) {
							if ( i % 2 != 0 ) { 
								codes = codes + "<tr style=\"background-color:rgba(80,80,80,0.3)\">";
							} else {
								codes = codes + "<tr style=\"background-color:rgba(200,200,200,0.3)\">";
							}
							codes = codes + "<td>" + (i + 1).toString() + "</td>";
							codes = codes + "<td>" + d[i].eid + "</td>";
							codes = codes + "<td>" + d[i].estr + "</td>";
							codes = codes + "<td>" + d[i].ebt + "</td>";
							codes = codes + "</tr>";
						}
						codes = codes + "</table>";
						$('#current_error_panel').html(codes);
						});
	
				}
		});
		setTimeout(refresh_current_error_list, 1500);
	}
	refresh_current_error_list();
}

// 显示历史故障
function page_show_history_error(from) {
	$('#'+from).hide();
	$('#id_history_error_page').show();
	g_sys.page_id_curr = 'id_history_error_page';
}

// 显示本机信息
function page_show_self_info(from) {
	$('#'+from).hide();
	$('#id_self_info_page').show();
	g_sys.page_id_curr = 'id_self_info_page';
}

// 显示作业的详细信息
function page_show_job_detail(from, job) {
	$('#'+from).hide();
	$('#id_job_working').show();
	g_sys.page_id_curr = 'id_job_working';

	function refresh_job_detail() {
		if ( g_sys.page_id_curr != 'id_job_working' ) return;
		$.getJSON(g_cfg.ontom_query_job, '', function (data, status, xhr){
			if ( status == 'success' ) {
				var ok = 0;
				$.each(data, function (index, d) {
					if ( index != 'jobs' ) return;
					if ( d.length <= 0 ) {
						 $('#id_job_working_jid').html('<a color="#F00">无效ID</a>');
						 return;
					}
					for ( var i = 0; i < d.length; i ++ ) {
						if ( d[i].id != job ) continue;
						ok = 1;
						$('#id_job_working_jid').html(d[i].id);
						$('#id_job_working_cid').html(d[i].cid);
						$('#id_job_working_I').html(d[i].CI);
						$('#id_job_working_V').html(d[i].CV);
						$('#id_job_working_yichongdianliang').html(d[i].ycdl);
						$('#id_job_working_remain_money').html(d[i].cremain);
						$('#id_job_working_sys_status').html('正常');
						$('#id_job_working_institude_status').html('正常');
						$('#id_job_working_gun_status').html(d[i].gun_stat);
						$('#id_job_working_job_status').html(d[i].status);
					}
					});
				if ( ok == 0 ) {
					$('#id_job_working_jid').html('<a color="#F00">无效ID</a>');
				}
			}
		});
		setTimeout(refresh_job_detail, g_cfg.query_period);
	}
	refresh_job_detail();
}

// 显示作业创建页面
function page_show_job_create(from, cid, remain) {
	$('#'+from).hide();
	$('#id_job_create').show();
	g_sys.page_id_curr = 'id_job_create';

	var $radios = $('input:radio[name=bm]');
    $radios.filter('[value=0]').prop('checked', true);
	g_commit.b_mode='auto';

	var $radios = $('input:radio[name=cm]');
    $radios.filter('[value=cm_auto]').prop('checked', true);
	g_commit.c_mode='auto';

	$('#id_job_commit_card_sn').html(cid);
	$('#id_job_commit_acount_remain').html(remain);
}

// 显示按电量充电设置页面
function page_show_bm_set_kwh() {
	$('#id_bm_set_kwh_page').show();
	g_sys.page_id_curr = 'id_bm_set_kwh_page';
	$('#id_keypad').show();
	$('#id_keypad').css('top', '245px');
	editid = 'id_bm_set_kwh';
}

// 显示按时间充电设置页面
function page_show_bm_set_time() {
	$('#id_bm_set_time_page').show();
	g_sys.page_id_curr = 'id_bm_set_time_page';
	$('#id_keypad').show();
	$('#id_keypad').css('top', '245px');
	editid = 'id_bm_set_time';
}

// 显示按金额充电设置页面
function page_show_bm_set_money() {
	$('#id_bm_set_money_page').show();
	g_sys.page_id_curr = 'id_bm_set_money_page';
	$('#id_keypad').show();
	$('#id_keypad').css('top', '245px');
	editid = 'id_bm_set_money';
}

// 计费方式确定
function page_bm_set_ok(from) {
	$('#'+from).hide();
	$('#id_keypad').hide();
	if ( from == 'id_bm_set_kwh_page' ) {
		g_commit.b_mode = 'kwh';
		g_commit.b_kwh = $('#id_bm_set_kwh').val();
	} else if ( from == 'id_bm_set_time_page') {
		g_commit.b_mode = 'time';
		g_commit.b_time = $('#id_bm_set_time').val();
	} else if ( from == 'id_bm_set_money_page') {
		g_commit.b_mode = 'money';
		g_commit.b_money = $('#id_bm_set_money').val();
	} else ;
	g_sys.page_id_curr = 'id_job_create';
}

// 计费方式设置取消
function page_bm_set_cancel(from) {
	$('#'+from).hide();
	$('#id_keypad').hide();
	if ( from == 'id_bm_set_kwh_page' ) {
		$("input[type='radio'][name='bm'][value='1']").attr("checked",false);
	} else if ( from == 'id_bm_set_time_page') {
		$("input[type='radio'][name='bm'][value='2']").attr("checked",false);
	} else if ( from == 'id_bm_set_money_page') {
		$("input[type='radio'][name='bm'][value='3']").attr("checked",false);
	} else ;

	var $radios = $('input:radio[name=bm]');
    if($radios.is(':checked') === false) {
        $radios.filter('[value=0]').prop('checked', true);
    } 
	g_commit.b_mode = 'auto'; 
	g_sys.page_id_curr = 'id_job_create';
}

// 手动充电设置页面确定
function page_cm_set_ok(from) {
	$('#'+from).hide();
	$('#id_keypad').hide();
	g_commit.c_mode = $("input[name='mc_mode']:checked").val();
	g_commit.cm_set_I = $('#id_cm_set_lI').val();
	g_commit.cm_set_V = $('#id_cm_set_lV').val();
	g_sys.page_id_curr = 'id_job_create';
}

// 手动充电设置页面取消
function page_cm_set_cancel(from) {
	$('#'+from).hide();
	$('#id_keypad').hide();
	g_commit.c_mode = 'auto';
	g_sys.page_id_curr = 'id_job_create';
}

// 显示手动充电设置页面
function page_show_cm_set() {
	$('#id_cm_set_page').show();
	g_sys.page_id_curr = 'id_cm_set_page';
	$('#id_keypad').show();
	$('#id_keypad').css('top', '270px');
}

// 作业创建取消
function page_job_create_cancel(from) {
	page_show_main_page(from);
}