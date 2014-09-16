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
			document.getElementById('id_information_version').innerHTML = 
			ajax_xml.responseText;
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
	onreadystatechange=ajax_state_change;
	ajax_xml.open("GET", url, true);
	ajax_xml.send();
}

