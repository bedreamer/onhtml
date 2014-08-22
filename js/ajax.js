// JavaScript Document
var ajax_xml;
var ajaxstat = 'idle';

function ajax_deal_state_change()
{
	if (ajax_xml.readyState==4)
	{// 4 = "loaded"
		if (ajax_xml.status==200 || ajax_xml.status==404)
		{// 200 = "OK"
			document.getElementById('id_information_deal').innerHTML = 
			ajax_xml.responseText;
		}
		else
		{
			document.getElementById('id_information_deal').innerHTML = 
			ajax_xml.status + "<p>版本拉取失败</p>" + ajax_xml.statusText;
		}
	}
}

function ajax_chargestatus_state_change()
{
	if (ajax_xml.readyState==4)
	{// 4 = "loaded"
		if (ajax_xml.status==200)
		{// 200 = "OK"
			document.getElementById('id_information_charge').innerHTML = 
			ajax_xml.responseText;
		}
		else
		{
			document.getElementById('id_information_charge').innerHTML = 
			ajax_xml.status + "<p>版本拉取失败</p>" + ajax_xml.statusText;
		}
	}
}

function ajax_batterystatus_state_change()
{
	if (ajax_xml.readyState==4)
	{// 4 = "loaded"
		if (ajax_xml.status==200)
		{// 200 = "OK"
			document.getElementById('id_information_battery').innerHTML = 
			ajax_xml.responseText;
		}
		else
		{
			document.getElementById('id_information_battery').innerHTML = 
			ajax_xml.status + "<p>版本拉取失败</p>" + ajax_xml.statusText;
		}
	}
}

function ajax_alarm_state_change()
{
	if (ajax_xml.readyState==4)
	{// 4 = "loaded"
		if (ajax_xml.status==200)
		{// 200 = "OK"
			document.getElementById('id_information_alarm').innerHTML = 
			ajax_xml.responseText;
		}
		else
		{
			document.getElementById('id_information_alarm').innerHTML = 
			ajax_xml.status + "<p>版本拉取失败</p>" + ajax_xml.statusText;
		}
	}
}

function ajax_version_state_change()
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

function ajax_request(url, ajax_state_change) {
	ajax_xml = new XMLHttpRequest();
	if ('withCredentials' in ajax_xml ) {
		/* supports cross-domain requests */
	} else {
		return;
	}
	ajax_xml.
	onreadystatechange=ajax_state_change;
	ajax_xml.open("GET",url,true);
	ajax_xml.send();
}

