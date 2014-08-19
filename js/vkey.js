// 获得焦点的编辑框ID
var editid = 0;
var value = "";

function vk_show() {
	document.getElementById('id_keypad').style.display = 'block';
	document.getElementById('id_keypad').style.left = '300px';
}

function vk_hide() {
	document.getElementById('id_keypad').style.display = 'none';
}

// 只针对输入编辑框
function vk_on_focurs(id)
{
	if ( id != editid  ) {
		value = document.getElementById(id).value;
		editid = id;
	}
	//document.getElementById('id_keypad').style.display = 'block';
}

// 只针对输入编辑框
function vk_on_blur()
{
	editid = 0;
	value = "";
	//document.getElementById('id_keypad').style.display = 'none';
}

function vk_pushed(vkey)
{
	switch ( vkey ) {
		case 'dot':
			value = value.toString() + ".";
		break;
		case 'del':
			value = "";
		break;
		case 0:case 1:case 2:case 3:case 4:
		case 5:case 6:case 7:case 8:case 9:
			value = value.toString() + vkey.toString();
		break;
	}
	if ( editid != 0 ) {
		document.getElementById(editid).value = value;
	}
}
