// JavaScript Document
var index = 0;
var shiindex = 0;
// 主显示区域的互斥元素ID
var mainbody_ids = [
	"id_autocharge_body",
	"id_manualcharge_body",
	"id_information_body",
	"id_system_body"
];

// 页面ID
var pages_ids = [
	"id_page0", // 首页
	"id_page1", // 按金额充电设定页面
	"id_page2", // 按时间充电设定页面
	"id_page3", // 按容量充电设定页面
	"id_page4", // 充电确认页面
	"id_page5", // 充电限压，限流手动设置页面
	"id_page6", // 密码输入页面
	"id_page7", // 充电实时信息页面
	"id_page8",
	"id_page9",
	"id_page10",
	"id_page11",
	"id_page12",
	"id_page13"
];
// 页面是否需要键盘
var page_need_keypad = [
	"no",  // 首页
	"yes", // 按金额充电设定页面
	"yes", // 按时间充电设定页面
	"yes", // 按容量充电设定页面
	"no",  // 充电确认页面
	"yes", // 充电限压，限流手动设置页面
	"yes", // 密码输入页面
	"no",  // 充电实时信息页面
	"no",
	"no",
	"no",
	"no",
	"no",
	"no"
];

// 页面所需要键盘垂直位置
var page_need_keypad_top = [
	"245px", // 首页
	"245px", // 按金额充电设定页面
	"245px", // 按时间充电设定页面
	"245px", // 按容量充电设定页面
	"245px", // 充电确认页面
	"285px", // 充电限压，限流手动设置页面
	"245px", // 密码输入页面
	"245px", // 充电实时信息页面
	"245px",
	"245px",
	"245px",
	"245px",
	"245px",
	"245px"
];

// 页面默认输入框ID
var page_default_input_id = [
	"N/A",  // 首页
	"charge_money_value", // 按金额充电设定页面
	"charge_time_value", // 按时间充电设定页面
	"charge_cap_value", // 按容量充电设定页面
	"N/A",       // 充电确认页面
	"MANUAL_SET_LIMIT_V", // 充电限压，限流手动设置页面
	"PASSWS_ID", // 密码输入页面
	"N/A",  // 充电实时信息页面
	"N/A",
	"N/A",
	"N/A",
	"N/A",
	"N/A",
	"N/A"
];

// 前一个页面ID
var pages_pre = 0;
// 当前页面序号
var pages_this = 0;
// 密码输入信息取消跳转
var page_on_cancel = 0;
// 密码输入验证成功
var page_on_ok = 0;
// 超时计时
var page_op_ttl = 60;
// 超时
var page_timer;
// 奇偶判定
var ev_or_ol = 0;

// querycard.xml 返回信息
var id_triger = "N/A", valid_triger = "N/A", remain_triger = "N/A";
var id_confirm = "N/A", valid_confirm = "N/A", remain_confirm = "N/A";
var id_settle = "N/A", valid_settle = "N/A", remain_settle = "N/A", supercard = "N/A";
var paramok = "N/A";
// 刷卡有效记录，处理可能会有的时间延迟，重复发送相同的url
var card_valid = "no";

// 充电任务状态机
var charge_task_stat = "triger_pendding"; // confirm_pendding, settle_pendding
// 充电任务计费方式
var billing_mode="auto";
function js_init() {	
	setTimeout("js_shi_proc()", 800);
}

function gen_card_valid_or_not(url)
{
	switch ( charge_task_stat ) {
		case 'triger_pendding':
			// 触发条件只需要保证，ID有效，非空，不为非法值即可
			if ( valid_triger == "yes" && id_triger != "N/A" && 
				 id_triger != null && paramok != "no" ) {
				charge_task_stat = 'confirm_pendding';
				card_valid = "yes";
				url = url + "&triger=valid";
				document.getElementById('CARD_ID').innerHTML = id_triger;
				document.getElementById('CARD_REMAIND').innerHTML = remain_triger;
				switch (billing_mode) {
					case 'auto':
					document.getElementById('CHARGE_MODE').innerHTML = "自动模式";
					break;
					case 'asmoney':
					document.getElementById('CHARGE_MODE').innerHTML = "定额模式";
					break;
					case 'astime':
					document.getElementById('CHARGE_MODE').innerHTML = "定时模式";
					break;
					case 'ascap':
					document.getElementById('CHARGE_MODE').innerHTML = "定量模式";
					break;
				}
				page_show(4); // 跳转到充电确认界面
			} else if ( valid_triger == "no") {
				card_valid = "no";
				url = url + "&triger=invalid";
			} else {
				card_valid = "N/A";
			}
		break;
		case 'confirm_pendding':
			// 确认条件，必须满足触发条件，并且满足，传入参数被接受，触发ID和确认ID相同条件
			if ( valid_confirm == "yes" && id_confirm != "N/A" && id_confirm != null &&
			     id_confirm == id_triger && paramok != "no" ) {
				charge_task_stat = 'settle_pendding';
				card_valid = "yes";
				url = url + "&confirm=valid";
				page_show(0); // 跳转到充电界面
			} else if ( valid_triger == "no" || (id_confirm != id_triger && id_confirm != "N/A") ) {
				card_valid = "no";
				url = url + "&confirm=invalid";
			} else {
				card_valid = "N/A";
			}
		break;
		case 'settle_pendding':
			// 结账条件必须满足，和触发一样的条件外，卡是超级卡也可以
			if ( valid_settle == "yes" && id_settle != "N/A" && id_settle != null && 
				 (id_settle == id_confirm || (supercard=="yes") ) ) {
				charge_task_stat = 'exit_pendding';
				card_valid = "yes";
				url = url + "&settle=valid";
				page_show(0); // 跳转到账单界面
			} else if ( valid_triger == "no") {
				card_valid = "no";
				url = url + "&settle=invalid";
			} else {
				card_valid = "N/A";
			}
		break;
		case 'exit_pendding': // 退出充电任务
			charge_task_stat = 'triger_pendding';
			charge_as_auto();
		break;
	}
	return url;
}

// 定时器处理过程
function js_shi_proc() {
	var url, param;
	switch ( billing_mode ) {
	case "auto": // 充电任务触发阻塞
	url = "http://192.168.1.37:8081/querycard.xml?mode=auto";
	url = gen_card_valid_or_not(url);
	ajax_card_request(url, ajax_querycard_xml);
	break;
	case "asmoney": // 按金额充电任务触发阻塞
	url = "http://192.168.1.37:8081/querycard.xml?mode=asmoney";
	param = document.getElementById('charge_money_value').value;
	if ( param > 0.0 & param < 1000.0 ) {
		url = url + "&money=" + param;
	}
	url = gen_card_valid_or_not(url);
	ajax_card_request(url, ajax_querycard_xml);
	break;	
	case "astime": // 按时间充电任务触发阻塞
	url = "http://192.168.1.37:8081/querycard.xml?mode=astime";
	param = document.getElementById('charge_time_value').value;
	if ( param > 10 & param < 600 ) {
		url = url + "&time=" + param;
	}	
	url = gen_card_valid_or_not(url);
	ajax_card_request(url, ajax_querycard_xml);
	break;
	case "ascap": // 按容量充电任务触发阻塞
	url = "http://192.168.1.37:8081/querycard.xml?mode=ascap";
	param = document.getElementById('charge_cap_value').value;
	if ( param > 0 & param <= 100 ) {
		url = url + "&cap=" + param;
	}
	url = gen_card_valid_or_not(url);
	ajax_card_request(url, ajax_querycard_xml);
	break;
	}
	
	if ( ev_or_ol == 0 ) {
		document.getElementById('blink_0').style.color = "#FFF";
		document.getElementById('blink_1').style.color = "#FFF";
		document.getElementById('blink_2').style.color = "#FFF";
		document.getElementById('blink_3').style.color = "#FFF";
		document.getElementById('blink_4').style.color = "#FFF";
		ev_or_ol = 1;
	} else if ( ev_or_ol == 1 ) {
		document.getElementById('blink_0').style.color = "#69E20c";
		document.getElementById('blink_1').style.color = "#69E20c";
		document.getElementById('blink_2').style.color = "#69E20c";
		document.getElementById('blink_3').style.color = "#69E20c";
		document.getElementById('blink_4').style.color = "#69E20c";
		ev_or_ol = 0;
	}
	
	setTimeout("js_shi_proc()", 500);
}

function page_show(page)
{
	var page_id = pages_ids[ page ];
	var page_id_pre = pages_ids[ pages_this ];
	document.getElementById(page_id_pre).style.display = 'none';
	document.getElementById(page_id).style.display = 'block';
	pages_pre = pages_this;
	pages_this = page;
	
	// 清除密码内容
	document.getElementById('PASSWS_ID').value = null;
	
	// 虚拟键盘显示和隐藏处理
	if ( page_need_keypad[page] == "yes" ) {
		if ( page_default_input_id[page] != "N/A" ) {
			vk_focurs(page_default_input_id[page]);
			document.getElementById('id_keypad').style.display = 'block';
			document.getElementById('id_keypad').style.top = page_need_keypad_top[page];
		} 
	} else {
		document.getElementById('id_keypad').style.display = 'none';
		vk_focurs(null);
	}
}

// 自动充电
function charge_as_auto()
{
	billing_mode = "auto";
	charge_task_stat = "triger_pendding";
	page_show(0);
}

// 按金额充电
function charge_as_money()
{
	billing_mode = "asmoney";
	page_show(1);
}

// 按时间充电
function charge_as_time()
{
	billing_mode = "astime";
	page_show(2);
}

// 按容量充电
function charge_as_cap()
{
	billing_mode = "ascap";
	page_show(3);
}

/*返回指定页面，并执行相关动作*/
function return_page(page)
{
}

function page_show_with_passwd(page, onok, oncancel)
{
}

function showsize(id)
{
	var edit = document.getElementById(id);
	var str = "位置top:" + edit.style.top + "left:" + edit.style.left;
	edit.value = str;
}

/*这是主显示区的标题*/
function body_settitle(title) {
	document.getElementById('id_title_body').innerHTML = title;
}

// 显示认证页面
var auth_pre_page = 0;
function show_auth_page(from, reason)
{
	auth_pre_page = from;
	page_show(6);
}

/*进行认证*/
function do_autheticate(reason) {
	ajax_auth_request(reason);
}

/*取消认证*/
function do_cancel_autheticate() {
	page_show(auth_pre_page);
}

/*手动设定充电限流值，充电限压值, 设置成功返回充电确认页面，失败停留在该页面.*/
function do_manual_setting() {
}

/*充电进度条*/
var percent = 0;
function style_of_charge_process_bar() {
	//var wd = document.getElementById('processbar_border').style.width;
	if ( percent <= 100 ) {
		document.getElementById('PROCESS_BAR_ID').style.width = percent * 600.0 / 100.0 + "px";
		document.getElementById('PROCESS_BAR_RATE').innerHTML = percent + "%&nbsp;";
	}
	setTimeout("style_of_charge_process_bar()", 500 + 430 * Math.sin(percent * 5.0) );
	if ( percent < 115 ) {
		percent = percent + 0.5;
	}
	if ( percent >= 115 ) {
		percent = 0;
	}
}