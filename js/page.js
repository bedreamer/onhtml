// JavaScript Document
var notifys = [
	"丽丽的妈妈",
	"不能这样",
	"今天天气不错",
	"今天跟疯了一样",
	"JS code",
];
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
function js_init() {
	setTimeout("js_timer_proc()", 3000);
	setTimeout("js_shi_proc()", 1500);
}

function js_shi_proc() {
	shiindex ++;
	if ( shiindex >= shenqu.length ) shiindex = 0;
	document.getElementById('txtshi').innerHTML = shenqu[shiindex];
	setTimeout("js_shi_proc()", 1500);
}

function js_timer_proc() {
	index ++;
	if ( index >= notifys.length ) index = 0;
	document.getElementById('below_comment_notify').innerHTML = notifys[index];
	setTimeout("js_timer_proc()", 3000);
}

function navigate(entry) {
	switch ( entry ) {
	case 'auto':
	document.getElementById('id_manual_setting').style.display = 'none';
	document.getElementById('id_info_query').style.display = 'none';
	document.getElementById('id_system_settings').style.display = 'none';
	break;
	case 'manual':
	document.getElementById('id_manual_setting').style.display = 'block';
	document.getElementById('id_info_query').style.display = 'none';
	document.getElementById('id_system_settings').style.display = 'none';
	break;
	case 'query':
	document.getElementById('id_manual_setting').style.display = 'none';
	document.getElementById('id_info_query').style.display = 'block';
	document.getElementById('id_system_settings').style.display = 'none';
	break;
	case 'settings':
	document.getElementById('id_manual_setting').style.display = 'none';
	document.getElementById('id_info_query').style.display = 'none';
	document.getElementById('id_system_settings').style.display = 'block';
	break;
	}
}