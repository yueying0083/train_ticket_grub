$(function(){
	
	document.body.addEventListener('touchstart', function () {}); 
	// 默认保险类型
	window.insurances = [{"des":"推荐选择，安全出行，最高保额120万","df":"1","icon":"","id":"102","link":"http://www.baidu.com/","p":"20","title":"交通意外险"},
						 {"des":"出票较慢，有时排队（有机会获赠保险）","df":"0","icon":"","id":"0","link":"http://www.sohu.com/","p":"0","title":"不购买套餐"}];
						 
	Ins = {};
	Ins.back = function(){
    	var rtn = [];
    	$.each(window.insurances, function(i, ins){
	    	ins.df = (ins.id == window.currentSeletedType) ? "1" : "0";
			if(window.TCL_PRE_INSTALL && (ins.id == 502 || ins.id == '502')){
				ins.p = 0;
				ins.title = 'TCL乐玩特权';
				ins.des = '免费获得等价10元的提升排名套餐(不含保险)';
			}
	    	rtn[i] = ins;
    	});
    	NativeAPI.invoke("storage",{action:"set",key:"gtgj_insurance", value:JSON.stringify(rtn)},function(err,data){
	    	NativeAPI.invoke("close");
		});
	}
						 
	NativeAPI.invoke("getDeviceInfo", {}, function(err, data) {
		if(data && data.p && data.p.indexOf('BCTCL') > -1){
			window.TCL_PRE_INSTALL = 1;
		}
		// 获取保险类型，如无，设置为默认
		NativeAPI.invoke("storage",{action:"get",key:"gtgj_insurance"},function(err,data){
			if(data && data.value && data.value.length > 0){
				window.insurances = JSON.parse(data.value);
			}
			// 保险template
			var template = "<div class='item _selected_' name='insurance'><div class='main'><span class='price'>_price_</span>_name_&nbsp;&nbsp;<span class='help' link='_link_'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><font id='grub_level__id_' class='Level Green Hidden'></font></div><div class='sub'>_desc_</div><input type='hidden' value='_type_'/></div>";
			// 获取保险区域
			var ia = $("#insurances");
			window.currentSeletedType = 0;
			ia.html('');
			// 填充保险区域
			$.each(window.insurances, function(i, ins){
				if(i == 0){// draw first line
					ia.append("<div class='divide'></div>")
				}
				if(ins.selected){
					window.currentSeletedType = ins.id;
				}
				if(ins.id == 502 || ins.id == '502'){
					if(window.TCL_PRE_INSTALL){
						var t = template.replace(/_selected_/, (ins.df == "1" ? 'selected' : ''))
										.replace(/_price_/, "￥0")
										.replace(/_name_/, 'TCL乐玩特权')
										.replace(/_desc_/, '免费获得等价10元的提升排名套餐(不含保险)')
										.replace(/_type_/, ins.id)
										.replace(/_id_/, ins.id)
										.replace(/_link_/, ins.link);
						ia.append(t);
				
						if(i != window.insurances.length - 1){
							ia.append("<div class='divide_1'></div>")	
						}else{
							ia.append("<div class='divide'></div>")	
						}
					}else{
						var t = template.replace(/_selected_/, (ins.df == "1" ? 'selected' : ''))
										.replace(/_price_/, ins.p == "0" ? "" : ("￥" + ins.p  + " "))
										.replace(/_name_/, ins.title)
										.replace(/_desc_/, ins.des)
										.replace(/_type_/, ins.id)
										.replace(/_id_/, ins.id)
										.replace(/_link_/, ins.link);
						ia.append(t);
				
						if(i != window.insurances.length - 1){
							ia.append("<div class='divide_1'></div>")	
						}else{
							ia.append("<div class='divide'></div>")	
						}
					}
				}else{			
					var t = template.replace(/_selected_/, (ins.df == "1" ? 'selected' : ''))
									.replace(/_price_/, ins.p == "0" ? "" : ("￥" + ins.p  + " "))
									.replace(/_name_/, ins.title)
									.replace(/_desc_/, ins.des)
									.replace(/_type_/, ins.id)
									.replace(/_id_/, ins.id)
									.replace(/_link_/, ins.link);
					ia.append(t);
			
					if(i != window.insurances.length - 1){
						ia.append("<div class='divide_1'></div>")	
					}else{
						ia.append("<div class='divide'></div>")	
					}
				}
			});
			
			// 绑定点击事件
			var iss = ia.find("div[name='insurance']");
			$("#insurances").delegate("div[name='insurance']", "click", function(){			
				$.each(iss, function(i, is){
					$(is).removeClass('selected');
				});
				$(this).addClass('selected');
				var input = ($($(this).find("input")[0]));
				window.currentSeletedType = $($(this).find("input")[0]).val();
				Ins.back();
			});
			
			var spans = $("span[class='help']");
			$.each(spans, function(i, span){
				if('' == $(span).attr('link')){
					$(span).hide();
				}else{
					$(span).on('click', function(){
						var url = $(this).attr('link');
						NativeAPI.invoke("createWebView", {"url":url}, function(e, d){});
					});
				}
			});
			
			//version 1.0 只会返回[总数，20元，10元]
			NativeAPI.invoke("storage",{action:"get",key:"gtgj_insurance_count"},function(err,data){						 
				var ins_counts = JSON.parse(data.value);
				if(ins_counts && ins_counts.length == 3){
					window.ins_counts = ins_counts;
					$("#grub_total_count").html(ins_counts[2]);
				}
				
				if(window.insurances.length == 3){
					$("#grub_level_501").html("提升到" + ins_counts[0] + "名");
					$("#grub_level_501").show();
					$("#grub_level_502").html("提升到" + parseInt(ins_counts[1]) + "名");
					$("#grub_level_502").show();
				}
				
			});
		});
		
		$("#bill").on("click", function(){
			var location_url = window.location.href;
			var end_index = location_url.indexOf('gtgjwap');
			var url = window.location.href.substring(0, end_index) + "gtgjwap/app/grub/billing.html";
			NativeAPI.invoke("createWebView", {"url":url}, function(e, d){});
		});
		
		NativeAPI.invoke("updateHeaderRightBtn", {"text":"确定", "action":"show", "data":""}, function(err, data){});
		NativeAPI.registerHandler("headerRightBtnClick", function(err, data){
			Ins.back();
		});
	});
});