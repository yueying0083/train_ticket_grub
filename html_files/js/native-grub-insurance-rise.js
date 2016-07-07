$(function(){
	
	document.body.addEventListener('touchstart', function () {}); 
	// 默认保险类型
	window.insurances = [];
						 
	NativeAPI.invoke("getDeviceInfo", {}, function(err, data) {
		// 获取保险类型，如无，设置为默认
		NativeAPI.invoke("storage",{action:"get",key:"gtgj_insurance_rise"},function(err,data){
			var riseable = JSON.parse(data.value);
			window.insurances = riseable.ins;
			window.oid = riseable.oid;
			window.pgs = [];
			window.avs = riseable.avs;
			
			// 处理乘车人
			var psg_index = 0;
			$.each(riseable.pgs.split(";"), function(i, psg){
				psgarr = psg.split(',');
				if(psgarr.length == 6 && '2' != psgarr[1] && '1' == psgarr[2]){
					window.pgs[psg_index++] = psg;
				}
			});
			
			if(window.avs && window.avs.length > 0){
				var avss = window.avs.split(",");
				var avmap = {};
				$.each(avss, function(i, ss){
					var avdetail = ss.split('-');
					if(avdetail && avdetail.length == 2){
						avmap[avdetail[0]] = avdetail[1];
					}
				})
				
				if(avmap['A']){// 获取之前的保险金额
					$("#money_detail").removeClass("type_1");
					$("#money_detail").addClass("type_2");
					$("#refund").removeClass("Hidden");
					$("#refund_br").removeClass("Hidden");
					$("#refund").html("退款 ￥" + avmap['A']);
				}else{
					$("#money_detail").addClass("type_1");
					$("#money_detail").removeClass("type_2");
					$("#refund").addClass("Hidden");
				}
					
			}else{//之前没有保险
				$("#money_detail").addClass("type_1");
				$("#money_detail").removeClass("type_2");
				$("#refund").addClass("Hidden");
			}
			
			// 保险template
			var template = "<div class='item _selected_' name='insurance'><div class='main'><span class='price'>_price_</span>_name_&nbsp;&nbsp;<span class='help' link='_link_'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><font class='Level Green'>_grub_level_</font></div><div class='sub'>_desc_</div><input type='hidden' value='_type_'/></div>";
			// 获取保险区域
			var ia = $("#insurances");
			window.currentSeletedType = 0;
			ia.html('');
			// 填充保险区域
			$.each(window.insurances, function(i, ins){
				if(i == 0){// draw first line
					ia.append("<div class='divide'></div>")
				}
				if(ins.df == "1"){
					window.currentSeletedType = ins.id;
					$("#total_price").html((parseInt(ins.p) * window.pgs.length).toFixed(2));
				}
				var t = template.replace(/_selected_/, (ins.df == "1" ? 'selected' : ''))
								.replace(/_price_/, ins.p == "0" ? "" : ("￥" + ins.p  + " "))
								.replace(/_name_/, ins.title)
								.replace(/_desc_/, ins.des)
								.replace(/_type_/, ins.id)
								.replace(/_grub_level_/, "提升到第" + ins.rise_to + "名")
								.replace(/_link_/, ins.link);
				ia.append(t);
		
				if(i != window.insurances.length - 1){
					ia.append("<div class='divide_1'></div>")
				}else{
					ia.append("<div class='divide'></div>")	
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
				$("#total_price").html((parseInt($($(this).find("span.price")[0]).html().substring(1)) * window.pgs.length).toFixed(2));
				//$("#total_price").html(parseInt($($(this).find("span.price")[0]).html().substring(1)).toFixed(2));
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
			
			$("#submit").bind('click', function(){
				// 获取保险字符串
				var selected = undefined, selectedPsgs = [], price = 0, i = 0;
				$.each(window.insurances, function(i, ins){
			    	if (ins.id == window.currentSeletedType){
				    	selected = ins;
			    	}
		    	});
				$.each(window.pgs, function(ii, p){
					var _ins = [];
					if(selected){
						var id = selected.id;
						var pp = p.split(",")
						_ins[0]=pp[3];
						_ins[1]=pp[1];
						_ins[2] = parseInt(pp[1]) == 2 ? "0" : id;
						_ins[3] = parseInt(pp[1]) == 2 ? "0" : selected.p;
						price += parseInt(selected.p);
					}else{
						_ins[0]=pp[3];
						_ins[1]=pp[1];
						_ins[2]="0";
						_ins[3]="0";
					}
					selectedPsgs[i++] = _ins.join(",");
				});
				
				NativeAPI.invoke("loading", {"show":"1","text":"正在修改套餐..."}, function(err, data) {
					NativeAPI.invoke("getUserInfo", {"appName":"gtgj"}, function(err, data) {		
							var uid = data.uid;
							var userid = data.userid;
							var ua = data.authcode;
						// uuid
						NativeAPI.invoke("getDeviceInfo", {}, function(err, data) {
							var uuid = data.uuid;
							var p = data.p;
							if(uid && uuid){
								var sid_params = [];
								sid_params[0] = uid;
								sid_params[1] = uuid;
								NativeAPI.invoke("getSid", {"params":sid_params}, function(drr, data){
									var sid = data.sid;
									var password = data.password;
									$.ajax({
										url : window.GTGJ.location + (window.avs.indexOf("A") > -1 ? "qpMod/modGrabInsurance.action" : "qpMod/addGrabInsurance.action"),
										type: "POST",
										dataType : "json",
										data : {
											"pid": window.avs.indexOf("A") > -1 ? "2661": "2660",
											"uid":uid,
											"uuid":uuid,
											"userid":userid,
											"ua":ua,
											"sid":sid,
											"p":p,
											"opid": window.oid,
											"insurinfo": selectedPsgs.join(';'),
											"insurprice": price,
											"refmt":"json"
										},
										success: function(data){
											var rtn = data;
											NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
												if(rtn.hd.code == '1' && rtn.bd){
													if(rtn.bd.succ){// 0 成功
														var p1 = rtn.bd.str.split("?");
														var p2 = p1[1].split("&")
														var p3 = {};
														$.each(p2, function(i, p4){
															var p5 = p4.split("=");
															p3[p5[0]] = decodeURIComponent(p5[1]);
														});
														NativeAPI.invoke("startPay", p3, function(err, data) {
															NativeAPI.invoke("storage", {action:"set",key:"gtgj_insurance_rised",value:"1"},function(err,data){});
															NativeAPI.invoke("close");
														});
													}
												}else{
													NativeAPI.invoke("alert", {"title":"提示","message":rtn.hd.desc,"btn_text":"确定"}, function(err, data) {});
												}
											});
										}
									});
								});
							}
						});
					});
				});
			});
			
		});
	});
});