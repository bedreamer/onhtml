// JavaScript Document
// 前一次选中的列表ID 
var pre_li_id = 'id_li_welcom';
var li_unselect_color = 'rgba(105,105,105,0.5)'
var li_selected_color = 'rgba(0,144,255,0.5)'

function setting_main_loop() {
	$.getJSON('http://192.168.1.57:8081/system/config.json', '', function (data, status, xhr) {
		if ( status == 'success' ) {
			$.each(data, function (index, d) {
				if ( index != 'configs' ) return;
				var codes_system = '';
				var codes_comm = '';
				var codes_charger = '';
				for ( var i = 0; i < d.length; i ++ ) {
					var html = '';
					if ( d[i].type == 'radio' ) {
						if ( i == 0 ) {
							html = "<div class=\"option first_option\">";
						} else {
							html = "<div class=\"option\">";
						}
            			html = html + "<div class=\"option_name\">" + d[i].name + "</div>";
                		html = html + "<div class=\"option_input_panel\">";
						if ( d[i].default_value == d[i].rv_1_value ) {
							var id_first = "id_r_first_" + i.toString();
							var id_second = "id_r_second_" + i.toString();
							html = html + "<a href=\"javascript:on_radio_click('" + id_first;
							html = html + "');\"><div id=\"" + id_first;
							html = html + "\" class=\"option_radio option_radio_head\">&nbsp;" + d[i].rv_1_name + "&nbsp;</div></a>";
							html = html + "<a href=\"javascript:on_radio_click('" + id_second;
							html = html + "');\"><div id=\"" + id_second;
							html = html + "\" class=\"option_radio option_radio_tail\">&nbsp;" + d[i].rv_2_name + "&nbsp;</div></a>";
						} else if ( d[i].default_value == d[i].rv_2_value ) {
							var id_first = "id_r_first_" + i.toString();
							var id_second = "id_r_second_" + i.toString();
							html = html + "<a href=\"javascript:on_radio_click('" + id_first;
							html = html + "');\"><div id=\"" + id_first;
							html = html + "\" class=\"option_radio option_radio_head\">&nbsp;" + d[i].rv_2_name + "&nbsp;</div></a>";
							html = html + "<a href=\"javascript:on_radio_click('" + id_second;
							html = html + "');\"><div id=\"" + id_second;
							html = html + "\" class=\"option_radio option_radio_tail\">&nbsp;" + d[i].rv_1_name + "&nbsp;</div></a>";
						} else ;
                		html = html + "</div></div>";
					} else if ( d[i].type == 'text' ) {
					} else ;
					
					if ( d[i].cat == 'system' ) {
						codes_system = codes_system + html;
					} else if ( d[i].cat == 'comm' ) {
						codes_comm = codes_comm + html;
					} else if ( d[i].cat == 'charger' ) {
						codes_charger = codes_charger + html;
					}
				}
				$('#id_content_system').html(codes_system);
				$('#id_content_comm').html(codes_comm);
				$('#id_content_charger').html(codes_charger);
			});
		}
	});
}

function on_radio_click(idd) {
	var newid_f = '#' + idd;
	if ( idd.indexOf('id_r_first_') >= 0 ) {
		var newid_s = '#' + idd.replace('id_r_first_', 'id_r_second_');
		$( newid_f ).css('background-color','rgb(0,144,255)');
		$( newid_s ).css('background-color','#555');
	} else if ( idd.indexOf('id_r_second_') >= 0 ){
		var newid_s = '#' + idd.replace('id_r_second_', 'id_r_first_');
		$( newid_f ).css('background-color','rgb(0,144,255)');
		$( newid_s ).css('background-color','#555');
	} else ;
}

$(function(){
	$('#id_li_welcom').click(function(){
		if ( pre_li_id != 'id_li_welcom' ) {
			$('#id_li_welcom').css('background-color', li_selected_color);
			$('#' + pre_li_id).css('background-color', li_unselect_color);

			$(pre_li_id.replace('id_li_', '#id_content_')).hide();
			$('#id_content_welcom').show();
			$('#id_right').hide();
			$('#id_footer').hide();
			$('#id_content').css('width', '75%');
			pre_li_id = 'id_li_welcom';
		}
	})
});

$(function(){
	$('#id_li_about').click(function(){
		if ( pre_li_id != 'id_li_about' ) {
			$('#id_li_about').css('background-color', li_selected_color);
			$('#' + pre_li_id).css('background-color', li_unselect_color);
			
			$(pre_li_id.replace('id_li_', '#id_content_')).hide();
			$('#id_content_about').show();
			$('#id_right').hide();
			$('#id_footer').hide();
			$('#id_content').css('width', '75%');
			pre_li_id = 'id_li_about';
		}
	})
});


$(function(){
	$('#id_li_system').click(function(){
		if ( pre_li_id != 'id_li_system' ) {
			$('#id_li_system').css('background-color', li_selected_color);
			$('#' + pre_li_id).css('background-color', li_unselect_color);
			
			$(pre_li_id.replace('id_li_', '#id_content_')).hide();
			$('#id_content_system').show();
			$('#id_right').show();
			$('#id_footer').show();
			$('#id_content').css('width', '50%');
			pre_li_id = 'id_li_system';
		}
	})
});

$(function(){
	$('#id_li_comm').click(function(){
		if ( pre_li_id != 'id_li_comm' ) {
			$('#id_li_comm').css('background-color', li_selected_color);
			$('#' + pre_li_id).css('background-color', li_unselect_color);

			$(pre_li_id.replace('id_li_', '#id_content_')).hide();
			$('#id_content_comm').show();
			$('#id_right').show();
			$('#id_footer').show();
			$('#id_content').css('width', '50%');
			pre_li_id = 'id_li_comm';
		}
	})
});

$(function(){
	$('#id_li_charger').click(function(){
		if ( pre_li_id != 'id_li_charger' ) {
			$('#id_li_charger').css('background-color', li_selected_color);
			$('#' + pre_li_id).css('background-color', li_unselect_color);
			
			$(pre_li_id.replace('id_li_', '#id_content_')).hide();
			$('#id_content_charger').show();
			$('#id_right').show();
			$('#id_footer').show();
			$('#id_content').css('width', '50%');
			pre_li_id = 'id_li_charger';
		}
	})
});
