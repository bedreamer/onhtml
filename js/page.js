// JavaScript Document
var shenqu = [
"说到这里，她沉默不语；她那表情令我感到，",
"她是把心思转到其他地方，",
"因为她又开始婆娑起舞，像方才一样。",
"另一个快乐光辉，我已注意到它就像一件珍贵之物，",
"这时则在我眼前闪烁，",
"犹如一颗纯真的红宝石被太阳照射。",
"它在天上获得光辉，因为它享有天福，",
"正如在人间，因幸福而满面笑容；",
"但是，在尘世，外在形影也会面色阴沉，因为它心情悲痛。",
"我说道，“幸福的精灵，上帝看到一切，",
"而你的视线也渗透在他身上，",
"以致任何欲望都不能在你面前躲藏。",
"上天总是用那些虔诚的火光",
"使你的声音变得欢快异常，",
"而这些火光又把六只翅膀变成僧装，",
"那么，你为何不用这样的声音满足我的愿望？",
"倘若我是你，正如我是你一样，",
"我早就不会等待你提出要求再讲。”",
"于是，他开始说出话来，",
"“在那最大的谷地里，环绕陆地",
"的那片海洋的海水流出，四下冲击，",
"这谷地在两带对峙的海滩中间，",
"逆着太阳，向前伸展，",
"在原先形成地平线的地方，构成子午圈。",
"我就是这片谷地的海边生人，",
"就在埃布罗河与马科拉河之间，",
"后一条河有一段短短的流程，使杰诺维塞与托斯卡诺离分。",
"布杰阿与我出生的那片土地",
"几乎处在日落日出同一时辰，",
"而我的那片土地曾用它那鲜红的热血，把海港烘热染红。",
"这带居民称我佛尔科，",
"对他们来说，我的名字是尽人皆知；",
"这重天有我的痕迹，正如我生前也有它的痕迹；",
"因为贝洛斯的女儿也并不比我更加热情似火，",
"——她曾给希凯斯和克罗塞斯塞来辱没，",
"我那似火的热情一直燃烧到适于我的发色的时刻；",
"罗多佩山的女人也不如我，",
"她曾因德莫封特斯而灰心丧气，",
"阿尔西德也不如我，尽管他把伊奥莱紧锁在心里。",
"我们并不因此而在这里后悔不已，而是满面笑意，",
"我们并不后悔所犯罪孽，因为它不再返回我们的记忆，",
"而是欢庆所得的德能，因为它把一切都安排和准备就绪。",
"在这里，我们可以观看那技艺在如此卓有成效地把万物装点，",
"还可以看清那善，",
"正是根据它，上面的世界才使下面的世界运转"
];
var index = 0;
var shiindex = 0;
var pic = [
	"1.png",
	"2.png",
	"3.png"
];
var imgindex = 0;
function js_init() {
	setTimeout("js_shi_proc()", 2000);
}
// 主显示区域的互斥元素ID
var mainbody_ids = [
	"id_autocharge_body",
	"id_manualcharge_body",
	"id_information_body",
	"id_system_body"
];

// 页面ID
var pages_ids = [
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
	"id_page13",
	"id_page14"
];

// 

function js_shi_proc() {
/*	shiindex ++;
	if ( shiindex >= shenqu.length ) shiindex = 0;
	document.getElementById('id_autocharge_body').innerHTML = document.getElementById('id_manualcharge_body').innerHTML
	document.getElementById('id_manualcharge_body').innerHTML = document.getElementById('id_information_body').innerHTML
	document.getElementById('id_information_body').innerHTML = document.getElementById('id_system_body').innerHTML
	document.getElementById('id_system_body').innerHTML = "<p>" + shenqu[shiindex] + "</p>";

	imgindex ++;
	if ( imgindex >= pic.length ) imgindex = 0;
	document.getElementById('demo_img').src = pic[ imgindex ];
*/	
	setTimeout("js_shi_proc()", 2000);
}

/*这是主显示区的标题*/
function body_settitle(title) {
	document.getElementById('id_title_body').innerHTML = title;
}

/*设置前置提示信息*/
function comment_pre_set(str) {
}

/*设置后置提示信息*/
function comment_below_set(str) {
}

function navigate(entry) {
	switch ( entry ) {
	case 'auto':
	vk_hide();
	document.getElementById('id_manual_setting').style.display = 'none';
	document.getElementById('id_info_query').style.display = 'none';
	document.getElementById('id_system_settings').style.display = 'none';
	body_settitle("自动|自动充电模式");
	break;
	case 'manual':
	document.getElementById('id_manual_setting').style.display = 'block';
	document.getElementById('id_info_query').style.display = 'none';
	document.getElementById('id_system_settings').style.display = 'none';
	body_settitle("手动|手动管理模式");
	vk_hide();
	break;
		case 'charge_param_setting':
		body_settitle("手动|设置充电参数");
		vk_show();
		break;
		case 'charge_order':
		body_settitle("手动|预约充电设定");
		vk_show();
		break;
		case 'charge_ontime':
		body_settitle("手动|定时充电设定");
		vk_show();
		break;
	case 'query':
	document.getElementById('id_manual_setting').style.display = 'none';
	document.getElementById('id_info_query').style.display = 'block';
	document.getElementById('id_system_settings').style.display = 'none';
	body_settitle("信息查询");
	vk_hide();
	break;
		case 'query_deal':
		body_settitle("信息查询|交易详情");
		ajax_request('http://192.168.1.3:8081/deal.xml',ajax_deal_state_change);
		break;
		case 'query_status':
		body_settitle("信息查询|当前充电状态");
		ajax_request('http://192.168.1.3:8081/chargestatus.xml',ajax_chargestatus_state_change);
		break;
		case 'query_battery':
		body_settitle("信息查询|电池详细信息");
		ajax_request('http://192.168.1.3:8081/batterystatus.xml',ajax_batterystatus_state_change);
		break;
		case 'query_alarm':
		body_settitle("信息查询|系统故障信息");
		ajax_request('http://192.168.1.3:8081/alarm.xml',ajax_alarm_state_change);
		break;
		case 'query_version':
		body_settitle("信息查询|系统版本信息");
		ajax_request('http://192.168.1.3:8081/version.xml',ajax_version_state_change);
		break;
	case 'settings':
	document.getElementById('id_manual_setting').style.display = 'none';
	document.getElementById('id_info_query').style.display = 'none';
	document.getElementById('id_system_settings').style.display = 'block';
	body_settitle("系统设置");
	vk_hide();
	break;
		case 'system_configure':
		body_settitle("系统设置|配置信息");
		vk_show();
		break;
		case 'system_manufacturer_setting':
		body_settitle("系统设置|工厂设置");
		vk_show();
		break;
		case 'system_update':
		body_settitle("系统设置|系统更新");
		vk_show();
		break;
	}
}