// JavaScript Document
// 用于querycard.xml
var ajax_card;
// 用于autheticate.xml
var ajax_auth;

// 处理 query.xml 文件回调函数
function ajax_querycard_xml()
{
	if (ajax_card.readyState==4)
	{// 4 = "loaded"
		if (ajax_card.status==200)
		{// 200 = "OK"
			var xml_handle;
			xml_handle= ajax_card.responseXML/*.getElementsByTagName(billing_mode)*/;

			//xml_handle = xmlfile.getElementsByTagName('triger');
			id_triger = xml_handle.getElementsByTagName('cardid')[0].childNodes[0].nodeValue;
			valid_triger = 
				xml_handle.getElementsByTagName('valid')[0].childNodes[0].nodeValue;
			remain_triger = 
				xml_handle.getElementsByTagName('remaind')[0].childNodes[0].nodeValue;

			//xml_handle = xmlfile.getElementsByTagName('confirm');
			id_confirm = 
				xml_handle.getElementsByTagName('cardid')[1].childNodes[0].nodeValue;
			valid_confirm = 
				xml_handle.getElementsByTagName('valid')[1].childNodes[0].nodeValue;
			remain_confirm = 
				xml_handle.getElementsByTagName('remaind')[1].childNodes[0].nodeValue;

			//xml_handle = xmlfile.getElementsByTagName('settle');
			id_settle = xml_handle.getElementsByTagName('cardid')[2].childNodes[0].nodeValue;
			valid_settle = 
				xml_handle.getElementsByTagName('valid')[2].childNodes[0].nodeValue;
			remain_settle = 
				xml_handle.getElementsByTagName('remaind')[2].childNodes[0].nodeValue;
			if ( billing_mode != "auto" ) {
				paramok = 
				xml_handle.getElementsByTagName('param_accept')[0].childNodes[0].nodeValue;
			} else {
				paramok = "N/A";
			}
			// 状态转移时该字段为copy
			confirm_echo = xml_handle.getElementsByTagName('echo')[0].childNodes[0].nodeValue;
			if ( charge_task_stat == "settle_pendding" ) {
				supercard = 
					xml_handle.getElementsByTagName('super')[0].childNodes[0].nodeValue;
			}
		}
		else
		{
			document.getElementById('id_information_version').innerHTML = 
			ajax_card.status + "<p>版本拉取失败</p>" + ajax_card.statusText;
		}
	}
}

// 获取query.xml文件函数
function ajax_card_request(url, ajax_state_change) {
	ajax_card = new XMLHttpRequest();
	if ('withCredentials' in ajax_card ) {
		/* supports cross-domain requests */
	} else {
		return;
	}
	ajax_card.onreadystatechange=ajax_state_change;
	ajax_card.open("GET", url, true);
	ajax_card.send();
}

var auth_reason = "user";
var passwdwrong_magic = 0;
// 处理 autheticate.xml 文件回调函数
function ajax_autheticate_xml()
{
	if (ajax_card.readyState==4)
	{// 4 = "loaded"
		if (ajax_card.status==200)
		{// 200 = "OK"
			var xml_handle;
			xml_handle= ajax_card.responseXML;
			var kitty = xml_handle.getElementsByTagName('ok')[0].childNodes[0].nodeValue;
			if ( kitty == "permit" ) {
				// 认证成功， 跳转到预先设定的页面
				switch ( auth_reason ) {
				case 'user': // 跳转至用户手动设置充电电压，充电电流页面
				page_show(5);
				break;
				case 'system': // 跳转到系统设置页面
				page_show(5);
				break;
				case 'manufacturer': // 跳转到工厂配置页面
				page_show(5);
				break;
				}
			} else if ( kitty == "reject" ) {
				passwdwrong_magic = 8;
				show_passwd_wrong();
			} else { // unexpected.
			}
		}
		else
		{
			document.getElementById('id_information_version').innerHTML = 
			ajax_card.status + "<p>版本拉取失败</p>" + ajax_card.statusText;
		}
	} else {
	}
}

function show_passwd_wrong() {
	if ( passwdwrong_magic % 2 ) {
		document.getElementById('PASSWS_ID').style.backgroundColor = "#F00";
	} else {
		document.getElementById('PASSWS_ID').style.backgroundColor = "#FFF";
	}
	passwdwrong_magic = passwdwrong_magic - 1;
	if ( passwdwrong_magic > 0 ) {
		setTimeout("show_passwd_wrong()", 50);
	} else {
		document.getElementById('PASSWS_ID').style.backgroundColor = "#FFF";
	}
}

// 获取autheticate.xml文件函数
function ajax_auth_request(reason) {
	var passwd = document.getElementById('PASSWS_ID').value;

	auth_reason = reason;

	if ( passwd == null || passwd.length < 4 || passwd.length > 16 ) {
		passwdwrong_magic = 8;
		setTimeout("show_passwd_wrong()", 50);
		return;
	}
	ajax_card = new XMLHttpRequest();
	if ('withCredentials' in ajax_card ) {
		/* supports cross-domain requests */
	} else {
		return;
	}
	url = "http://" + serveip + ":8081/autheticate.xml?passwd=PzsWmAPT3G" + 
		passwd + "a7BY5tzfdX&reason=" + reason;
	ajax_card.onreadystatechange=ajax_autheticate_xml;
	ajax_card.open("GET", url, true);
	ajax_card.send();
}

