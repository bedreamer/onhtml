// JavaScript Document
var ajax_xml;
var ajaxstat = 'idle';

// 处理 querycard.xml 文件回调函数
function ajax_querycard_xml()
{
	if (ajax_xml.readyState==4)
	{// 4 = "loaded"
		if (ajax_xml.status==200)
		{// 200 = "OK"
			var xml_handle;
			var id_triger, valid_triger, remain_triger;
			var id_confirm, valid_confirm, remain_confirm;
			var id_settle, valid_settle, remain_settle, supercard;
			var paramok;
			xml_handle= ajax_xml.responseXML/*.getElementsByTagName(billing_mode)*/;

			//xml_handle = xmlfile.getElementsByTagName('triger');
			id_triger = xml_handle.getElementsByTagName('cardid')[0].childNodes[0].nodeValue;
			valid_triger = xml_handle.getElementsByTagName('valid')[0].childNodes[0].nodeValue;
			remain_triger = xml_handle.getElementsByTagName('remaind')[0].childNodes[0].nodeValue;

			//xml_handle = xmlfile.getElementsByTagName('confirm');
			id_confirm = xml_handle.getElementsByTagName('cardid')[1].childNodes[0].nodeValue;
			valid_confirm = xml_handle.getElementsByTagName('valid')[1].childNodes[0].nodeValue;
			remain_confirm = xml_handle.getElementsByTagName('remaind')[1].childNodes[0].nodeValue;

			//xml_handle = xmlfile.getElementsByTagName('settle');
			id_settle = xml_handle.getElementsByTagName('cardid')[2].childNodes[0].nodeValue;
			valid_settle = xml_handle.getElementsByTagName('valid')[2].childNodes[0].nodeValue;
			remain_settle = xml_handle.getElementsByTagName('remaind')[2].childNodes[0].nodeValue;
		}
		else
		{
			document.getElementById('id_information_version').innerHTML = 
			ajax_xml.status + "<p>版本拉取失败</p>" + ajax_xml.statusText;
		}
	}
}

// 获取xml文件函数
function ajax_request(url, ajax_state_change) {
	ajax_xml = new XMLHttpRequest();
	if ('withCredentials' in ajax_xml ) {
		/* supports cross-domain requests */
	} else {
		return;
	}
	ajax_xml.onreadystatechange=ajax_state_change;
	ajax_xml.open("GET", url, true);
	ajax_xml.send();
}

