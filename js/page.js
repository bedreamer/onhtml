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
	"id_page0",
	"id_page1",
	"id_page2",
	"id_page3",
	"id_page4",
	"id_page5",
	"id_page6",
	"id_page7",
	"id_page8",
	"id_page9",
	"id_page10",
	"id_page11",
	"id_page12",
	"id_page13"
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

// 充电任务状态机
var charge_task_stat = "triger_pendding"; // confirm_pendding, settle_pendding
// 充电任务计费方式
var billing_mode="auto";
function js_init() {	
	setTimeout("js_shi_proc()", 2000);
}

// 定时器处理过程
function js_shi_proc() {
	var url, param;
	switch ( billing_mode ) {
	case "auto": // 充电任务触发阻塞
	url = "http://192.168.1.37:8081/querycard.xml?mode=auto";
	ajax_request(url, ajax_querycard_xml);
	break;
	case "asmoney": // 按金额充电任务触发阻塞
	url = "http://192.168.1.37:8081/querycard.xml?mode=asmoney";
	param = document.getElementById('charge_money_value').value;
	if ( param > 0.0 & param < 1000.0 ) {
		url = url + "&money=" + param;
	}
	ajax_request(url, ajax_querycard_xml);
	break;	
	case "astime": // 按时间充电任务触发阻塞
	url = "http://192.168.1.37:8081/querycard.xml?mode=astime";
	param = document.getElementById('charge_time_value').value;
	if ( param > 10 & param < 600 ) {
		url = url + "&time=" + param;
	}	
	ajax_request(url, ajax_querycard_xml);
	break;
	case "ascap": // 按容量充电任务触发阻塞
	url = "http://192.168.1.37:8081/querycard.xml?mode=ascap";
	param = document.getElementById('charge_cap_value').value;
	if ( param > 0 & param <= 10 ) {
		url = url + "&cap=" + param;
	}
	ajax_request(url, ajax_querycard_xml);
	break;
	}
	setTimeout("js_shi_proc()", 2000);
}

// 充电选择界面超时
function page_op_timeout()
{
	var id = "page_" + pages_this + "_ttl_return";
	page_op_ttl --;
	if ( pages_this >= 1 && pages_this <= 4 ) {
		if ( page_op_ttl > 0 ) {
			document.getElementById(id).innerHTML = "返&nbsp;&nbsp;回(" + page_op_ttl + "秒) ";
			page_timer = setTimeout("page_op_timeout()", 1000);
		} else {
			clearTimeout(page_timer);
			page_show(pages_pre);
		}
	}
}

function page_show(page)
{
	var page_id = pages_ids[ page ];
	var page_id_pre = pages_ids[ pages_this ];
	document.getElementById(page_id_pre).style.display = 'none';
	document.getElementById(page_id).style.display = 'block';
	pages_pre = pages_this;
	pages_this = page;
}

// 自动充电
function charge_as_auto()
{
	billing_mode = "auto";
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
