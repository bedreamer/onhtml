// JavaScript Document
var g_cfg = {
	inited:true,  // 系统已经配置过了
	query_proctol:'http://',
	first_startup_url:'http://127.0.0.1:8080/first/',
	history_per_page:11, // 每页显示的历史故障条数
	current_err_per_page:7, // 每页显示的当前故障条数
	current_err_max_page:15, // 当前故障最多显示10页
	ontom_host:'192.168.1.93:8081',
//	ontom_host:'127.0.0.1:8081',
	ontom_query:'/system/query.json',
	// 查询周期, 根据传来的数据动态调整
	query_period:800,
	// 作业查询接口
	ontom_query_job:'/job/query.json',
	// 作业创建接口
	ontom_create_job:'/job/create.json',
	// 作业中止接口
	ontom_abort_job:'/job/abort.json',
	// 作业暂停接口
	ontom_pause_job:'/job/manpause.json',
	// 作业恢复接口
	ontom_resume_job:'/job/resume.json',
	// 当前故障查询接口
	ontom_current_error:'/system/error.json',
	// 历史故障查询接口
	ontom_history_error:'/system/history.json',
	// 模块信息查询接口
	ontom_module_detail:'/system/modules.json',
	// 本机信息查询接口
	ontom_about:'/system/about.json',
	// 操作认证接口
	ontom_auth:'/system/auth.json',
	// 热重启
	ontom_hot_restart:'/system/hotrestart.json'
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
	job_working_count:0,
	// 当前显示的作业ID
	job_id_curr:'N/A',
	
	// 当前显示的历史页面号
	history_page_num:0,
	// 到了最后一页
	history_last_page:0,
	
	// 当前故障显示页
	current_error_page:0,
	// 当前模块信息显示页
	current_module_detail_page:0,
	
	// 获取/system/query.json连续失败的次数
	error_query_nr:0,
	
	// 当前卡片余额
	card_money_remain:0,
	// 当前卡片密码
	card_passwd:'',
	
	// 背景图片名称
	back_img_name:'1D2D.png'
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
function js_init(re_new) {
	var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
	if ( isWin ) {
		//alert('Fuck windows!!!');
	} else {
	}
	g_cfg.ontom_host = '127.0.0.1:8081';
	var host = document.location.host;
	g_cfg.ontom_host = host.replace('8080', '8081');
	g_cfg.ontom_query = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_query;
	g_cfg.ontom_query_job = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_query_job;
	g_cfg.ontom_create_job = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_create_job;
	g_cfg.ontom_abort_job = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_abort_job;
	g_cfg.ontom_pause_job = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_pause_job;
	g_cfg.ontom_resume_job = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_resume_job;
	g_cfg.ontom_current_error = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_current_error;
	g_cfg.ontom_history_error = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_history_error;
	g_cfg.ontom_module_detail = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_module_detail;
	g_cfg.ontom_about = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_about;
	g_cfg.ontom_auth = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_auth;
	g_cfg.ontom_hot_restart = g_cfg.query_proctol + g_cfg.ontom_host + g_cfg.ontom_hot_restart;
	setTimeout(js_main_loop, 800);
}

// 定时执行
function js_main_loop() {
	var date = new Date();
	var currentdate = date.getFullYear() + '年' + (date.getMonth() + 1).toString() + '月' + date.getDate() + '日';

	$('#system_date_time').html(currentdate + ' ' + date.getHours() + ':' + date.getMinutes() );

	$.getJSON(g_cfg.ontom_query, 'p=' + g_sys.page_id_curr + '&j=' + g_sys.job_id_curr, function (data, status, xhr){
		if ( status == "success" ) {
			g_sys.error_query_nr = 0;
			if ( data.doreset == true ) {
				page_show_main_page(g_sys.page_id_curr);
			}
			if ( data.version ) {
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
				$('#id_a_volatage').html(data.Va);
				$('#id_b_volatage').html(data.Vb);
				$('#id_c_volatage').html(data.Vc);
				$('#id_version').html(data.version);

				var img = '';
				var vol = data.bus0_V, I = data.bus0_I;
				if ( data.gun1 == '未连接' ) {
					img = img + '2D';
				} else if ( data.gun1 == "已连接" ) {
					img = img + '2J';
					vol = data.bus1_V;
					I = data.bus1_I;
				} else if ( data.gun1 == "在充" ) {
					img = img + '2C';
					vol = data.bus1_V;
					I = data.bus1_I;
				}

				if ( data.gun0 == '未连接' ) {
					img = '1D' + img;
				} else if ( data.gun0 == "已连接" ) {
					img = '1J' + img;					
					vol = data.bus0_V;
					I = data.bus0_I;
				} else if ( data.gun0 == "在充" ) {
					img = '1C' + img;
					vol = data.bus0_V;
					I = data.bus0_I;
				}

				$('#id_mainpage_bus0_voltage').html(vol);
				$('#id_mainpage_bus0_current').html(I);

				if ( img.length == 0 ) {
					img = '1D2D'
				}
				if ( img != g_sys.back_img_name ) {
					g_sys.back_img_name = img;
					img = 'url(imgs/' + img + '.png)';
					$('#id_system_preview').css('background-image', img);
				}
				
				$('#id_dcrd_zt').html(data.zdcrd);
				$('#id_dc_kg').html(data.zdctrip);
				$('#id_dc1_kg').html(data.dc1trip);
				$('#id_dc2_kg').html(data.dc2trip);
				$('#id_ac_kg').html(data.actrip);
				$('#id_ac_zt').html(data.aczt);
				$('#id_halt_zt').html(data.halt);
				$('#id_flq_zt').html(data.flq);
				
				$('#id_bat1_ohm_P').html(data.bat1_R_P);
				$('#id_bat1_ohm_N').html(data.bat1_R_N);
				$('#id_bat2_ohm_P').html(data.bat2_R_P);
				$('#id_bat2_ohm_N').html(data.bat2_R_N);

				if ( data.query_period > 0 ) {
					g_cfg.query_period = data.query_period;
				}
				
				g_sys.gun0_work_status = data.gun0_work_status;
				g_sys.gun1_work_status = data.gun1_work_status;
				g_sys.gun2_work_status = data.gun2_work_status;
				g_sys.gun3_work_status = data.gun3_work_status;

				if ( data.card_sn != 'N/A' ) {
					card_sn_valid(data.card_sn, data.card_remain, data.card_passwd);
				}
			}
		}
	}).fail(function (){
		g_sys.error_query_nr ++;
		if ( g_sys.error_query_nr >= 1 ) {
			var default_host = '127.0.0.1:8081';
			g_cfg.ontom_query = g_cfg.ontom_query.replace(g_cfg.ontom_host, default_host);
			g_cfg.ontom_query_job = g_cfg.ontom_query_job.replace(g_cfg.ontom_host, default_host);
			g_cfg.ontom_create_job = g_cfg.ontom_create_job.replace(g_cfg.ontom_host, default_host);
			g_cfg.ontom_abort_job = g_cfg.ontom_abort_job.replace(g_cfg.ontom_host, default_host);
			g_cfg.ontom_current_error = g_cfg.ontom_current_error.replace(g_cfg.ontom_host, default_host);
			g_cfg.ontom_history_error = g_cfg.ontom_history_error.replace(g_cfg.ontom_host, default_host);
			g_cfg.ontom_module_detail = g_cfg.ontom_module_detail.replace(g_cfg.ontom_host, default_host);
			g_cfg.ontom_about = g_cfg.ontom_about.replace(g_cfg.ontom_host, default_host);
			g_cfg.ontom_host = '127.0.0.1:8081';
		}
	});
	setTimeout(js_main_loop, 400);
}

// 显示密码验证页面并进行验证
function show_card_passwd_input_page(sn, remain, passwd) {
	g_sys.card_passwd = '';
	$('#id_card_passwd').val('');
	value = ''; // 清空按键缓冲区
	$('#id_card_passwd_input_page').show();
	g_sys.page_id_curr = 'id_card_passwd_input_page';
	$('#id_passwd_card_sn').html(sn);
	$('#id_card_passwd_notify').html("&nbsp;");
	$('#id_keypad').show();
	$('#id_keypad').css('top', '205px');
	editid = 'id_card_passwd';
	value = "";
	g_sys.card_money_remain = remain;
	g_sys.card_passwd = passwd;
}

// 显示作业创建页面
function do_show_job_create_page() {
	//alert($('#id_card_passwd').val() + ':' + g_sys.card_passwd);
	if ( $('#id_card_passwd').val() == g_sys.card_passwd && g_sys.card_passwd != '' ) {
		$('#id_mainpage').hide();
		$('#id_keypad').hide();
		$('#id_card_passwd_notify').html("&nbsp;");
		page_show_job_create(
			'id_card_passwd_input_page', 
			$('#id_passwd_card_sn').html(), 
			g_sys.card_money_remain);
	} else {
		$('#id_card_passwd_notify').html("密码输入错误!");
	}
}

// 处理刷卡事件
function card_sn_valid(sn, remain, passwd) {
	// 创建作业
	if ( g_sys.page_id_curr == 'id_mainpage' ) { // 创建充电作业
		show_card_passwd_input_page(sn, remain, passwd);
		//page_show_job_create('id_mainpage', sn, remain);
	} else if (g_sys.page_id_curr=='id_job_create') { // 提交作业
		function do_job_commit(sn, remain, passwd) {
			var pa = 't=' + Date.parse(new Date()).toString();
			pa = pa + '&remain=' + remain;
			pa = pa + '&passwd=' + passwd;
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
		do_job_commit(sn, remain, passwd);
	} else if (g_sys.page_id_curr=='id_job_working') { // 终止充电作业
		if ( $('#id_job_working_cid').html() == 'N/A' ) return;
		if ( sn != $('#id_job_working_cid').html() ) {
			alert('无效的卡片');
			return;
		}
		
		do_show_job_billing('id_job_working', $('#id_job_working_jid').html());

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
	g_sys.job_id_curr = 'N/A';

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
						codes = codes + "<button class=\"job_preview_box ";
						switch ( d[i].status ) {
							case '在充':
								codes = codes + " job_preview_box_stat1\"";
							break;
							case '就绪':
							case '因故暂停':
							case '人工暂停':
								codes = codes + " job_preview_box_stat2\"";
							break;
							case '等待':
								codes = codes + " job_preview_box_stat3\"";
							break;
							default:
								codes = codes + " job_preview_box_stat4\"";
							break;
						}	
						codes = codes +" style=\"left:" + left + "px";
						codes = codes +";top:" + top + "px\" ";						
						codes = codes + "onclick=\"javascript:page_show_job_detail('jobs_preview_page','";
						codes = codes + d[i].id + "'); \">";
						codes = codes +"<div align=\"center\" ";
						codes = codes + " id=\"id_jobpreview_"+i + "\">";
						codes = codes + "<table align=\"center\" class=\"job_preview_box_table\">";
						codes = codes + "<tr><td>状态</td><td>" + d[i].status + "</td></tr>";
						codes = codes + "<tr><td>端口</td><td>" + d[i].port + "</td></tr>";
						codes = codes + "<tr><td>连接</td><td>" + d[i].gun_stat + "</td></tr>";		
						codes = codes + "<tr><td>序号</td><td>" + d[i].id  + "</td></tr>";											
						codes = codes + "<tr><td>卡号</td><td>" + d[i].cid + "</td></tr>";											
						codes = codes + "</table></div></button>";
					}
					$('#jobs_preview').html(codes);
				});
			}
		});
		setTimeout(refresh_jobs_list, g_cfg.query_period);
	}
	refresh_jobs_list();
}

// 显示作业详细信息
function page_show_jobs_detail(from) {
}

// 显示主页
function page_show_main_page(from) {
	$('#'+from).hide();
	$('#id_mainpage').show();
	$('#id_keypad').hide();
	g_sys.page_id_curr = 'id_mainpage';
	g_sys.job_id_curr = 'N/A';
}

// 显示系统查询目录
function page_system_menu(from) {
	$('#'+from).hide();
	$('#id_system_query_page').show();
	g_sys.page_id_curr = 'id_system_query_page';
}

function page_system_operate_menu(from) {
	$('#'+from).hide();
	$('#id_system_operate_page').show();
	g_sys.page_id_curr = 'id_system_operate_page';
}

// 刷新模块详细信息
function refresh_module_detail(once) {
	if ( g_sys.page_id_curr != 'id_module_detail_page' ) return;
	$.getJSON(g_cfg.ontom_module_detail, '', function (data, status, xhr){
		if ( status == 'success' ) {
			$.each(data, function (index, d) {
				if ( index != 'modules' ) return;
				if ( d.length <= 0 ) {
					$('#module_detail_panel').html('<br><br>无模块');
					 return;
				}

				var codes='<table align="center">';
				codes = codes + '<tr style=\"background-color:rgba(60,60,60,0.3)\">'
				codes = codes + '<td>序号</td><td width=\"80px\">输出电压</td>';
				codes = codes + '<td width=\"80px\">输出电流</td><td width=\"80px\">模块温度</td>';
				codes = codes + '<td width=\"160px\">模块编号</td><td width=\"100px\">模块状态</td></tr>';
				while (　g_sys.current_error_page * g_cfg.current_err_per_page > d.length &&
						 g_sys.current_error_page > 0 ) {
					g_sys.current_error_page = g_sys.current_error_page - 1;
				}

				for ( var i = 0; i < d.length; i ++) {
					if ( i % 2 != 0 ) { 
						codes = codes + "<tr style=\"background-color:rgba(80,80,80,0.3)\">";
					} else {
						codes = codes + "<tr style=\"background-color:rgba(200,200,200,0.3)\">";
					}
					codes = codes + "<td>" + (i + 1).toString() + "</td>";
					codes = codes + "<td>" + d[i].V + "</td>";
					codes = codes + "<td>" + d[i].I + "</td>";
					codes = codes + "<td>" + d[i].T + "</td>";
					codes = codes + "<td>" + d[i].N + "</td>";
					codes = codes + "<td>" + d[i].S + "/"  + d[i].OF + "</td>";
					codes = codes + "</tr>";
				}
				codes = codes + "</table>";
				$('#module_detail_panel').html(codes);
			});
		}
	});
	if ( once != true ) {
		setTimeout(refresh_module_detail, 3000);
	}
}

// 显示前一页模块信息
function show_pre_page_module_detail() {
	refresh_module_detail(true);
}

// 显示下一页模块信息
function show_next_page_module_detail() {
	refresh_module_detail(true);
}

// 显示模块详细信息
function show_module_detail_page(from) {
	$('#'+from).hide();
	$('#id_module_detail_page').show();
	g_sys.page_id_curr = 'id_module_detail_page';
	
	refresh_module_detail(false);
}

// 刷新当前故障
function refresh_current_error_list(once) {
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
				codes = codes + '<tr style=\"background-color:rgba(60,60,60,0.3)\">'
				codes = codes + '<td>序号</td><td width=\"60px\">代码</td>';
				codes = codes + '<td align=\"center\" width=\"320px\">故障</td>';
				codes = codes + '<td align=\"center\">故障时间</td></tr>';
				while (　g_sys.current_error_page * g_cfg.current_err_per_page > d.length &&
						 g_sys.current_error_page > 0 ) {
					g_sys.current_error_page = g_sys.current_error_page - 1;
				}
				var n = 0;
				for ( var i = g_sys.current_error_page * g_cfg.current_err_per_page; 
				i < d.length && n < g_cfg.current_err_per_page; i ++, n ++ ) {
					if ( i % 2 != 0 ) { 
						codes = codes + "<tr style=\"background-color:rgba(80,80,80,0.3)\">";
					} else {
						codes = codes + "<tr style=\"background-color:rgba(200,200,200,0.3)\">";
					}
					codes = codes + "<td>" + (i + 1).toString() + "</td>";
					codes = codes + "<td>" + d[i].eid + "</td>";
					codes = codes + "<td>" + d[i].estr + "</td>";
					codes = codes + "<td>&nbsp;" + d[i].ebt + "&nbsp;</td>";
					codes = codes + "</tr>";
				}
				codes = codes + "</table>";
				$('#current_error_panel').html(codes);
			});
		}
	});
	if ( once != true ) {
		setTimeout(refresh_current_error_list, 1500);
	}
}

// 显示前一页的故障信息
function show_pre_page_error() {
	if (　g_sys.current_error_page　> 0 )
		g_sys.current_error_page = g_sys.current_error_page - 1;
	refresh_current_error_list(true);
}

// 显示后一页的故障信息
function show_next_page_error() {
	if ( g_sys.current_error_page < g_cfg.current_err_max_page ) 
		g_sys.current_error_page = g_sys.current_error_page + 1;
	refresh_current_error_list(true);
}

// 显示当前故障
function page_show_current_error(from) {
	$('#'+from).hide();
	$('#id_current_error_page').show();
	g_sys.page_id_curr = 'id_current_error_page';

	g_sys.current_error_page = 0;
	$('#current_error_panel').html('<br><br>没有故障');

	refresh_current_error_list(false);
}

// 显示上一页历史故障
function show_pre_page_history() {
	if ( g_sys.history_page_num > 0 ) {
		g_sys.history_page_num = g_sys.history_page_num - 1;
	}
	refresh_history_panel( g_sys.history_page_num * g_cfg.history_per_page, g_cfg.history_per_page);
}

// 显示下一页历史故障
function show_next_page_history() {
	if ( g_sys.history_last_page ) return;
	g_sys.history_page_num = g_sys.history_page_num + 1;
	refresh_history_panel( g_sys.history_page_num * g_cfg.history_per_page, g_cfg.history_per_page);
}

// 刷新历史故障
function refresh_history_panel(start, nr) {
	var pa = 'p=' + start + '&n=' + nr;
	if ( g_sys.page_id_curr != 'id_history_error_page' ) return;
	$.getJSON(g_cfg.ontom_history_error, pa, function (data, status, xhr){
		if ( status == 'success' ) {
			$.each(data, function (index, d) {
				if ( index != 'history' ) return;
				if ( d.length <= 0 ) {
					$('#id_historyt_error_panel').html('<br><br>没有历史故障');
					 g_sys.history_last_page = 1;
					 return;
				} 
				g_sys.history_last_page = 0;
				if ( d.length < g_cfg.history_per_page ) {
					g_sys.history_last_page = 1;
				}

				var codes='<table>';
				codes = codes + '<tr style=\"background-color:rgba(30,30,60,0.3)\">'
				codes = codes + '<td>序号</td><td>故障代码</td>';
				codes = codes + '<td align=\"center\" width=\"240px\">故障内容</td>';
				codes = codes + '<td align=\"center\">故障时间</td>';
				codes = codes + '<td align=\"center\">恢复时间</td></tr>';

				for ( var i = 0; i < d.length; i ++ ) {
					if ( i % 2 != 0 ) { 
						codes = codes + "<tr style=\"background-color:rgba(150,150,150,0.3)\">";
					} else {
						codes = codes + "<tr style=\"background-color:rgba(200,200,200,0.3)\">";
					}
					codes = codes + "<td>" + d[i].hid + "</td>";
					codes = codes + "<td>" + d[i].eid + "</td>";
					codes = codes + "<td>" + d[i].estr + "</td>";
					codes = codes + "<td>&nbsp;" + d[i].ebt + "&nbsp;</td>";
					codes = codes + "<td>&nbsp;" + d[i].rbt + "&nbsp;</td>";
					codes = codes + "</tr>";
				}
				codes = codes + "</table>";
				$('#id_historyt_error_panel').html(codes);
			});
		}
	});
}

// 显示历史故障
function page_show_history_error(from) {
	$('#'+from).hide();
	$('#id_history_error_page').show();
	g_sys.page_id_curr = 'id_history_error_page';
	g_sys.history_page_num = 0;
	refresh_history_panel(0, g_cfg.history_per_page);
}

function do_about_refresh_page() {
	$.getJSON(g_cfg.ontom_about, '', function (data, status, xhr){
		if ( status == "success" ) {
			var codes = '<table align=center class="self_info_t">';
			var r = 0;
			for ( var i = 0; i < data.about.length; i ++ ) {
				codes = codes + "<tr><td>" + data.about[i].k + "</td><td>" + data.about[i].v + "</td>"
				if ( i + 1 >= data.about.length ) {
					codes = codes + "<td>&nbsp;</td><td>&nbsp;</td><tr>"
					break;
				} else {
					i ++;
					codes = codes + "<td>" + data.about[i].k + "</td><td>" + data.about[i].v + "</td></tr>"
				}
			}	
			codes = codes + "</table>"
			$('#id_self_info_page_panel').html(codes);
		}
	});
	if ( g_sys.page_id_curr =='id_self_info_page' ) {
		setTimeout(do_about_refresh_page, 3000);
	}
}

// 显示本机信息
function page_show_self_info(from) {
	$('#'+from).hide();
	$('#id_self_info_page').show();
	g_sys.page_id_curr = 'id_self_info_page';
	setTimeout(do_about_refresh_page, 3000);
}

function job_resume(jid) {
	$.getJSON(g_cfg.ontom_resume_job, 'id='+jid, function (data, status, xhr){
		if ( status == 'success' ) {
		}
	});
}

function job_pause(jid) {
	$.getJSON(g_cfg.ontom_pause_job, 'id='+jid, function (data, status, xhr){
		if ( status == 'success' ) {
		}
	});
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
					g_sys.job_id_curr = job;
					for ( var i = 0; i < d.length; i ++ ) {
						if ( d[i].id != job ) continue;
						ok = 1;
						$('#id_job_working_jid').html(d[i].id);
						$('#id_job_working_cid').html(d[i].cid);
						$('#id_job_working_IV').html(d[i].CI + '/' + d[i].CV);
						$('#id_job_working_yichongdianliang').html(d[i].ycdl);
						//$('#id_job_working_remain_money').html(d[i].cremain);
						$('#id_job_working_sys_status').html('正常');
						$('#id_job_working_institude_status').html('正常');
						$('#id_job_working_gun_status').html(d[i].gun_stat);
						$('#id_job_working_job_status').html(d[i].status);
						$('#id_job_working_kwh_used').html(d[i].used_kwh + '度');
						$('#id_job_working_time_used').html(d[i].used_time + '分钟');
						$('#id_job_working_money_used').html(d[i].used_money + '元');
						$('#id_job_working_kwh_price').html(d[i].kwh_price + '元/度')
						if ( d[i].status == '人工暂停' ) {
							$('#id_job_op_btn').html("恢复充电");
							$('#id_job_op_href').attr("href","javascript:job_resume('" + d[i].id + "')"); 
						} else {
							$('#id_job_op_btn').html("暂停充电");
							$('#id_job_op_href').attr("href","javascript:job_pause('" + d[i].id + "')"); 
						}
					}
					});
				if ( ok == 0 ) {
					$('#id_job_op_href').attr('href','#'); 
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

// 显示开关状态页面
function page_show_kgzt(from) {
	$('#'+from).hide();
	$('#id_kgzt_page').show();
	g_sys.page_id_curr = 'id_kgzt_page';
}

// 显示按电量充电设置页面
function page_show_bm_set_kwh() {
	$('#id_bm_set_kwh_page').show();
	g_sys.page_id_curr = 'id_bm_set_kwh_page';
	$('#id_keypad').show();
	$('#id_keypad').css('top', '215px');
	editid = 'id_bm_set_kwh';
	value = "";
}

// 显示按时间充电设置页面
function page_show_bm_set_time() {
	$('#id_bm_set_time_page').show();
	g_sys.page_id_curr = 'id_bm_set_time_page';
	$('#id_keypad').show();
	$('#id_keypad').css('top', '215px');
	editid = 'id_bm_set_time';
	value = "";
}

// 显示按金额充电设置页面
function page_show_bm_set_money() {
	$('#id_bm_set_money_page').show();
	g_sys.page_id_curr = 'id_bm_set_money_page';
	$('#id_keypad').show();
	$('#id_keypad').css('top', '215px');
	editid = 'id_bm_set_money';
	value = "";
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
	$('#id_keypad').css('top', '215px');
}

// 作业创建取消
function page_job_create_cancel(from) {
	page_show_main_page(from);
}

// 清除历史故障
function clean_history_error_show(from) {
	$('#id_operate_confirm_page').show();
	$('#id_confirm_notify_text').html('确认清除全部历史故障?');
	g_sys.page_id_curr = 'id_operate_confirm_page';
}

// 清除操作功能
function clean_history_error(sure) {
	if ( sure != true ) {
		$('#id_operate_confirm_page').hide();
		$('#id_system_operate_page').show();
		g_sys.page_id_curr = 'id_system_operate_page';
	} else {
		$.getJSON(g_cfg.ontom_history_error, 'clean=true', function (data, status, xhr){
			if ( status == 'success' ) {
				$.each(data, function (index, d) {
					if ( index != 'history' ) return;
					if ( d.length <= 0 ) {
						$('#id_historyt_error_panel').html('错误的操作!');
						 return;
					}
					if ( d[0].result == 'ok' ) {
						$('#id_confirm_notify_text').html('历史故障清除成功!');
						$('#id_operate_confirm_page').hide();
						$('#id_system_operate_page').show();
						g_sys.page_id_curr = 'id_system_operate_page';
					} else {
						$('#id_confirm_notify_text').html('历史故障清除失败!');
					}
				});
			}
		});
	}
}

function do_module_op_refresh(p) {
	if ( g_sys.page_id_curr != 'id_modules_op_page' ) return;
	$.getJSON(g_cfg.ontom_module_detail, p, function (data, status, xhr){
		if ( status == 'success' ) {
			$.each(data, function (index, d) {
				if ( index != 'modules' ) return;
				if ( d.length <= 0 ) {
					$('#id_modules_op_page_panel').html('<br><br>无模块');
					 return;
				}
				var codes = '';
				var x = 0, y = 0;
				for ( var i = 0; i < d.length; i ++) {
					if ( d[i].OF == '已开机' ) {
						codes = codes + '<a href=\"javascript:module_op_refresh(\'OFF\',\'' + i + '\')\">';
					} else {
						codes = codes + '<a href=\"javascript:module_op_refresh(\'ON\',\'' + i + '\')\">';
					}
					codes = codes + "<div class=\"zeus main_tool_box moudle_tool_box\" style=\"";
					codes = codes + "top:" + (20 + 90 * y) + "px;left:" + (150 * x + 22) + "px;"
/*					codes = codes + "<td>" + d[i].I + "</td>";
					codes = codes + "<td>" + d[i].T + "</td>";
					codes = codes + "<td>" + d[i].N + "</td>";
					codes = codes + "<td>" + d[i].S + "/"  + d[i].OF + "</td>";
					codes = codes + "</tr>";
					
	*/				if ( d[i].S != '正常' ) {
						codes = codes + "background-color:#700;"
					}
					codes = codes + "\">" + (i + 1) + "# " + d[i].S ;
					codes = codes + "<div class=\"moudle_tool_box_onoff\">";
					codes = codes + d[i].OF + "</div>" + "</div></a>";
					x ++;
					if ( x == 5 ) {
						x = 0;
						y ++;
					}
				}
				$('#id_modules_op_page_panel').html(codes);
			});
		}
	});
	setTimeout(do_module_op_refresh, 2000);
}

// 刷新模块操作页面
function module_op_refresh(op, num) {
	var p = '';
	if ( g_sys.page_id_curr != 'id_modules_op_page' ) return;
	
	if ( (op == 'ON' || op == 'OFF') && num >= 0 ) {
		p = 'op=' + op + '&sn=' + num;
	}
	do_module_op_refresh(p);
}

// 显示模块操作页面
function module_op_page_show(from) {
	$('#'+from).hide();
	$('#id_modules_op_page').show();
	g_sys.page_id_curr = 'id_modules_op_page';

	module_op_refresh('N/A', -1);
}

// 显示作业账单
function do_show_job_billing(from, jid) {
	$('#'+from).hide();
	$('#id_job_billing_detail').show();
	g_sys.page_id_curr = 'id_job_billing_detail';
	
	$('#id_billing_jid').html(jid);
	function refresh_job_detail() {
		if ( g_sys.page_id_curr != 'id_job_billing_detail' ) return;
		$.getJSON(g_cfg.ontom_query_job, '', function (data, status, xhr){
			if ( status == 'success' ) {
				var ok = 0;
				$.each(data, function (index, d) {
					if ( index != 'jobs' ) return;
					if ( d.length <= 0 ) {
						 $('#id_job_working_jid').html('<a color="#F00">无效ID</a>');
						 return;
					}
					g_sys.job_id_curr = 'N/A';
					for ( var i = 0; i < d.length; i ++ ) {
						if ( d[i].id != jid ) continue;
						ok = 1;
						$('#id_billing_jid').html(d[i].id);
						$('#id_billing_cid').html(d[i].cid);
						$('#id_billing_remain').html(d[i].cremain);
						$('#id_billing_cost').html(d[i].money);
						$('#id_billing_kwh').html(d[i].kwh);
						$('#id_billing_long').html(d[i].time);
					}
				});
			}
		});
	}
	refresh_job_detail();
}

// 作业完成
function do_job_done() {
	var jid = $('#id_job_working_jid').html();
	var pa = 'id=' + jid;
	$.getJSON(g_cfg.ontom_abort_job, pa, function (data, status, xhr) {
	if ( status == 'success' ) {
		if ( data.status == "REJECTED" ) {
			//alert('无效的作业');
		} else {
		}
		return;	
	}
	});
	page_show_main_page('id_job_billing_detail');
}

// 操作认证
function do_op_auth_cancel(to) {
	$('#'+to).show();
	g_sys.page_id_curr = to;
	$('#id_feed_passwd_input_page').hide();
	$('#id_keypad').hide();
	editid = '';
	value = "";
}

// 操作认证
function do_op_auth_query(from, to, kind) {
	var jid = $('#id_job_working_jid').html();
	var pa = 'k=' + kind + '&p=' + $('#id_feed_passwd').val();
	value = "";

	if ( $('#id_feed_passwd').val().length <= 0 ) {
		$('#id_feed_passwd_notify').html('请输入正确的密码!');
		return;
	}
	$('#id_feed_passwd_notify').html('&nbsp;');
	$.getJSON(g_cfg.ontom_auth, pa, function (data, status, xhr) {
	if ( status == 'success' ) {
		if ( data.status == "REJECTED" ) {
			//alert('无效的作业');
			$('#id_feed_passwd_notify').html('认证失败');
		} else if ( data.status == "CONFIRMED" ) {
			$('#'+from).hide();
			$('#'+to).show();
			g_sys.page_id_curr = to;
			$('#id_feed_passwd_input_page').hide();
			$('#id_keypad').hide();
			editid = '';
		} else {
		}
		return;	
	}
	});
}

// 操作授权页面
function do_op_auth(from, to, kind) {
	$('#id_feed_passwd_notify').html('&nbsp;');
	$('#id_feed_passwd_input_page').show();
	g_sys.page_id_curr = 'id_feed_passwd_input_page';
	$('#id_keypad').show();
	$('#id_keypad').css('top', '205px');
	editid = 'id_feed_passwd';
	value = "";
	$('#id_feed_passwd').val("");
	$('#id_auth_cancel').attr("onclick", "javascript:do_op_auth_cancel('" + from + "')" );
	$('#id_auth_ok').attr("onclick", "javascript:do_op_auth_query('" + from + "','" + to + "','" + kind +  "')" );
}

// 重启
function page_show_hot_restart_confirm_page(from) {
	$('#'+from).hide();
	$('#id_hot_restart_confirm_page').show();
	g_sys.page_id_curr = 'id_hot_restart_confirm_page';
}

function system_hot_restart(op) {
	if ( op == true ) {
		$.getJSON(g_cfg.ontom_hot_restart, '', function (data, status, xhr) {});
	} else {
		$('#id_hot_restart_confirm_page').hide();
		$('#id_system_operate_page').show();
		g_sys.page_id_curr = 'id_system_operate_page';
	}
}









