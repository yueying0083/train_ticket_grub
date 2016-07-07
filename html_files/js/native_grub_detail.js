function GetRequest() { 
	var url = location.search;
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) { 
			theRequest[strs[i].split("=")[0]]=decodeURIComponent(strs[i].split("=")[1]); 
		} 
	}
	return theRequest; 
}
Date.prototype.pattern=function(fmt) {
    var o = {
	    "M+" : this.getMonth()+1, //月份
	    "d+" : this.getDate(), //日
	    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
	    "H+" : this.getHours(), //小时
	    "m+" : this.getMinutes(), //分
	    "s+" : this.getSeconds(), //秒
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度
	    "S" : this.getMilliseconds() //毫秒
    };
    var week = {"1":"一","2":"二","3":"三","4":"四","5":"五","6":"六","0":"日"};
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}
$(function() {
    NativeAPI.registerHandler("back", function(err, data) {
    	if(GD.FromBuild){
	    	NativeAPI.invoke("closeAll");
    	}else{
			if(GD.StatusChanged){
				NativeAPI.invoke("setResultForActivity", {"refresh":"1"});
			}
	    	NativeAPI.invoke("close");	    	
    	}
    });
    
	var GD = window.GD || {};
	window.GD = GD;
	GD.FromBuild=GetRequest().from_build;
	GD.StatusChanged=false;
	GD.LineGrub = false;
	GD.init=function(){
		GD.pt_c2n = {"1":"成人票", "2":"儿童票", "3":"学生票", "4":"残军票"};
		GD.st_c2n = {"11":"商务座","12":"特等座","1":"一等座","2":"二等座","14":"高级软卧","9":"软卧","7":"硬卧","4":"软座","3":"硬座","0":"无座"};
		document.body.addEventListener('touchstart', function () {});
		if(GD.FromBuild){
			GD.Params = $.parseJSON(GetRequest().params);
		}else{
			GD.Params = GetRequest();
		}
		if(GD.Params.oid.indexOf("4-") == 0){
			GD.Params.oid = GD.Params.oid.substring(2, GD.Params.oid.length);
		}
		GD.Id = GD.Params.oid;
		
/*
		if(GD.Params.dn && GD.Params.dt && GD.Params.an && GD.Params.at){
			GD.Page.init();
			GD.Passenger.init();
			GD.Button.init();
			GD.Process.Refresh();
		}else{
*/
			GD.GetDetail(GD.Id);
// 		}
	}
	GD.Page={};
	GD.Order={};//12306订单相关
	GD.MultiTrain=false;
	GD.Page.init=function(){
		$("#depart_city").html(GD.Params.dn);
		$("#arrive_city").html(GD.Params.an);
		
		if(GD.LineGrub){// 线路抢票
			$("#line_grub_train_info").css('display', '');
			if(GD.Params.se){
				var seats = GD.Params.se.split("|");
				if(seats && seats.length > 1){
					var seat_types = [];
					$.each(seats[1].split(","), function(i, m){
						seat_types[seat_types.length] = GD.st_c2n[m];
					});
					var sts = seat_types.join("、");
					$("#seat_types").html(sts.length > 8 ? (sts.substring(0, 7) + "...") : sts);
				}
			}
			
			$("#depart_times").html(GD.Params.lts ? GD.Params.lts.split(",").join(" ~ ") : "");
			$("#train_no").html(GD.Params.tn.length > 14 ? (GD.Params.tn.substring(0, 13) + "...") : GD.Params.tn);
		}else{
			$("#depart_time").html(GD.Params.dt);
			$("#arrive_time").html(GD.Params.at);
			if(GD.Params.tn.indexOf(",") > -1){
				var odd_train = GD.Params.tn.split(",")[0];
				$("#train_no").html(odd_train);
				$("#grub_multi_train").show();
				$("#avs_divide").removeClass('hidden_area');
				$("#txt_grub_multi_train").html(GD.Params.tn.substring(odd_train.length + 1, GD.Params.tn.length));
				GD.MultiTrain=true;
			}else{
				$("#train_no").html(GD.Params.tn);
			}
		}
		
		
		$("#train_date").html(GD.Params.td);
		$("#grub_succ_count").html(GD.Params.qsn);
		
		// 增加保险
		if(GD.Params.bx){
			var bxs = GD.Params.bx.split(";");
			var insur = bxs[0].split("--");
			if(insur.length > 1){
				if(bxs.length == 1){// 可以增加
					$("#txt_grub_insurance_add").html("本套餐已将排队提升为最高级<br/>当前动态总排名约" + insur[1] + "位");
					$("#grub_insurance_add").removeClass("hidden_area");
					$("#txt_grub_insurance_add").removeClass("rise_up_img");
					$("#grub_insurance_add_top").removeClass("hidden_area");
				}else{
					var i = 1, l = bxs.length, j = 0;
					for(; i < l; i++){
						GD.Params.riseable = GD.Params.riseable || [];
						var iii = bxs[i].split("--");
						if(iii && iii.length == 2){
							GD.Params.riseable[j] = {};
							GD.Params.riseable[j].id = iii[0];
							GD.Params.riseable[j++].rise_to = iii[1];
						}
					}
					$("#txt_grub_insurance_add").html("购买套餐可以提高优先级<br/>当前动态总排名约" + insur[1] + "位");
					$("#grub_insurance_add").removeClass("hidden_area");
					$("#txt_grub_insurance_add").addClass("rise_up_img");
					$("#grub_insurance_add_top").removeClass("hidden_area");
					$("#txt_grub_insurance_add").bind('click', GD.InsurRiseUp);
				}
			}else{
				$("#grub_insurance_add_top").addClass("hidden_area");
			}
		}
	}
	GD.GetDetail=function(oid){
		NativeAPI.invoke("loading", {"show":"1","text":"正在获取信息..."}, function(err, data) {
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
						sid_params[2] = GD.Id;
						NativeAPI.invoke("getSid", {"params":sid_params}, function(drr, data){
							var sid = data.sid;
							var password = data.password;
							$.ajax({
								url : window.GTGJ.location + "qporder/queryQpOrderDetail.action",
								type: "POST",
								dataType : "json",
								data : {
									"pid": "2614",
									"uid":uid,
									"uuid":uuid,
									"userid":userid,
									"ua":ua,
									"sid":sid,
									"p":p,
									"oid": GD.Id,
									"refmt":"json"
								},
								success: function(data){
									var rtn = data;
									NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
										if(rtn.hd.code == '1' && rtn.bd){
											GD.LineGrub = rtn.bd.sty == '1';
											GD.Params = rtn.bd;
											GD.Page.init();
											GD.Passenger.init();
											GD.Button.init();
											GD.Process.Refresh();
											GD.Order.init();
			
											if(GD.Params.avs){
												GD.Avs.GetInfo();
											}
										}else{
											NativeAPI.invoke("alert", {"title":"提示","message":rtn.hd.desc,"btn_text":"确定"}, function(err, data) {});
										}
									});
								},
								error: function(xhr, type, exception){
									NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
										NativeAPI.invoke("alert", {"title":"提示","message":"网络请求出现问题","btn_text":"确定"}, function(err, data) {});
										return;
									});
								},
								waitTime: 30000
							});
						});
					}
				});
			});
		});
	}
	GD.Passenger={};
	GD.Passenger.init=function(){
		var passengers = GD.Params.pgs.split(";");
		$("#passengers").html("");
		$.each(passengers, function(i, p){
			var passenger = p.split(",");
			var passenger_template = $("#template_passenger").html();
			passenger_template = passenger_template.replace(/_passenger_name_/, passenger[0]);
			passenger_template = passenger_template.replace(/_passenger_type_/, GD.pt_c2n[passenger[1]]);
			
			if(passenger[1] != '1'){
				passenger_template = passenger_template.replace(/_child_/, "not_adult_type");
			}
			passenger_template = passenger_template.replace(/_passenger_id_/, passenger[3]);
			passenger_template = passenger_template.replace(/_seat_type_/, GD.LineGrub ? "" : GD.st_c2n[passenger[4]]);
			passenger_template = passenger_template.replace(/_seat_price_/, "￥" + parseFloat(passenger[5]).toFixed(2) + (GD.MultiTrain ? " (预估)" : ""));
			$("#passengers").append(passenger_template);
		});
	}
	GD.Button={}
	GD.Button.init=function(){
		if("0" == GD.Params.sn){//正在监控
			$("#submit_box").addClass("hidden");
			if(GD.Params.exp){
				var i_stopDay = Date.parse(GD.Params.exp.substring(0, 10)) - 8 * 60 * 60 * 1000 - Date.parse('1970-01-01');
				var str = ""
				if(GD.Params.exp.substring(11, 16) == '00:00'){
					str += (new Date(i_stopDay - 1).pattern("M月d日 24:00"));
				}else{
					str += (new Date(i_stopDay).pattern("M月d日 ") + GD.Params.exp.substring(11, 16));
				}
				var i_day = parseInt((i_stopDay - new Date().getTime())/(24 * 60 * 60 *1000)) + 1;
				if(i_day > 0){
					str += ("（抢" + i_day + "天）");					
				}
				$("#txt_grub_remain").html(str);
				$("#grub_remain").removeClass('hidden_area');
				$("#avs_divide").removeClass('hidden_area');
			}
			NativeAPI.invoke("updateHeaderRightBtn", {"text":"取消订单", "action":"show", "data":""}, function(err, data){});
		}else if("1" == GD.Params.sn){//已经取消
			$("#submit_box").addClass("hidden");
			$("#grub_remain").addClass('hidden_area');
			NativeAPI.invoke("updateHeaderRightBtn", {"text":"删除", "action":"show", "data":""}, function(err, data){});
		}else if("2" == GD.Params.sn){//已经删除
			$("#submit_box").addClass("hidden");
			$("#grub_remain").addClass('hidden_area');
			NativeAPI.invoke("updateHeaderRightBtn", {"action":"hide", "data":""}, function(err, data){});
		}else if("3" == GD.Params.sn){//待支付
			$("#submit_box").removeClass("hidden");
			$("#submit_box").removeClass("blue");
			$("#submit_box").addClass("yellow");
			$("#submit_box").html("立即支付");
			if("1" == GD.Params.pending){
				$("#txt_grub_remain").html("付款确认中...");
				$("grub_remain").removeClass('hidden_area');
			}else{
				$("#grub_remain").addClass('hidden_area');
			}
			NativeAPI.invoke("updateHeaderRightBtn", {"text":"取消订单", "action":"show", "data":""}, function(err, data){});
		}else if("4" == GD.Params.sn){//无效订单
			$("#submit_box").addClass("hidden");
			$("#grub_remain").addClass('hidden_area');
			NativeAPI.invoke("updateHeaderRightBtn", {"text":"删除", "action":"show", "data":""}, function(err, data){});
		}else if("5" == GD.Params.sn){//抢票成功
			if(1){
				$("#share").removeClass("hidden");
				$("#share").bind('click', function(){
					NativeAPI.invoke("createWebView", {"url":'https://jt.rsscc.com/gtgjwap/app/grub/share.html?oid=' + GD.Id}, function(e, d){});
				});
			}else{
				$("#submit_box").removeClass("hidden");
				$("#submit_box").removeClass("yellow");
				$("#submit_box").addClass("blue");
				$("#submit_box").html("查看车票");
				$("#grub_remain").addClass('hidden_area');
			}
			NativeAPI.invoke("updateHeaderRightBtn", {"text":"删除", "action":"show", "data":""}, function(err, data){});
		}else if("6" == GD.Params.sn){//抢票超时
			$("#submit_box").addClass("hidden");
			$("#grub_remain").addClass('hidden_area');
			NativeAPI.invoke("updateHeaderRightBtn", {"text":"删除", "action":"show", "data":""}, function(err, data){});
		}else if("7" == GD.Params.sn){//抢票失败
			$("#submit_box").addClass("hidden");
			$("#grub_remain").addClass('hidden_area');
			NativeAPI.invoke("updateHeaderRightBtn", {"text":"删除", "action":"show", "data":""}, function(err, data){});
		}else{
			NativeAPI.invoke("updateHeaderRightBtn", {"action":"hide", "data":""}, function(err, data){});
		}
	}
	GD.Button.click=function(t){
		if("3" == t){
			GD.ContinuePay();
		}else if("0" == t){
			GD.Dialog.ShowCancelConfirm();
		}else if("5" == t){
			window.location.href="gtgj://start?type=gtticketorderlist";
		}
	}
	GD.ContinuePay=function(){
		NativeAPI.invoke("loading", {"show":"1","text":"正在准备支付..."}, function(err, data) {
			if(data.value){
				// 获取uid, 
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
							sid_params[2] = GD.Id;
							NativeAPI.invoke("getSid", {"params":sid_params}, function(drr, data){
								var sid = data.sid;
								var password = data.password;
								$.ajax({
									url : window.GTGJ.location + "qporder/queryQpPayUrl.action",
									type: "POST",
									dataType : "json",
									data : {
										"pid": "2612",
										"uid":uid,
										"uuid":uuid,
										"userid":userid,
										"ua":ua,
										"sid":sid,
										"p":p,
										"oid": GD.Id,
										"refmt":"json"
									},
									success: function(data){
										var rtn = data;
										NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
											if(rtn.hd.code == '1' && rtn.bd){
												if(rtn.bd.url){// 0 成功
													var p1 = rtn.bd.url.split("?");
													var p2 = p1[1].split("&")
													var p3 = {};
													$.each(p2, function(i, p4){
														var p5 = p4.split("=");
														p3[p5[0]] = decodeURIComponent(p5[1]);
													});
													NativeAPI.invoke("startPay", p3, function(err, data) {
														GD.Process.Refresh();
													});
												}else{//获取支付链接失败
													NativeAPI.invoke("alert", {"title":"提示","message":"获取支付链接失败","btn_text":"确定"}, function(err, data) {});
												}
											}else{
												NativeAPI.invoke("alert", {"title":"提示","message":rtn.hd.desc,"btn_text":"确定"}, function(err, data) {});
											}
										});
									},
									error: function(xhr, type, exception){
										NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
											NativeAPI.invoke("alert", {"title":"提示","message":"网络请求出现问题","btn_text":"确定"}, function(err, data) {});
											return;
										});
									},
									waitTime: 30000
								});
							});
						}
					});
				});
			}
		});
	}
	GD.CancelOrder=function(){
		GD.Dialog.Dismiss();
		if(!GD.Id){
			NativeAPI.invoke("alert", {"title":"提示","message":"订单号为空，请返回列表查看","btn_text":"确定"}, function(err, data) {
			});
			return;
		}
		NativeAPI.invoke("loading", {"show":"1","text":"正在取消订单..."}, function(err, data) {
			if(data.value){
				// 获取uid, 
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
							sid_params[2] = GD.Id;
							NativeAPI.invoke("getSid", {"params":sid_params}, function(drr, data){
								var sid = data.sid;
								var password = data.password;
								$.ajax({
									url : window.GTGJ.location + "qporder/cancelQpOrder.action",
									type: "POST",
									dataType : "json",
									data : {
										"pid": "2615",
										"uid":uid,
										"uuid":uuid,
										"userid":userid,
										"ua":ua,
										"sid":sid,
										"p":p,
										"oid": GD.Id,
										"refmt":"json"
									},
									success: function(data){
										var rtn = data;
										NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
											if(rtn.hd.code == '1'){
												GD.Dialog.ShowCancelSucc();
												GD.Process.Refresh();
											}else{
												NativeAPI.invoke("alert", {"title":"提示","message":rtn.hd.desc,"btn_text":"确定"}, function(err, data) {});
											}
										});
									},
									error: function(xhr, type, exception){
										NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
											NativeAPI.invoke("alert", {"title":"提示","message":"网络请求出现问题","btn_text":"确定"}, function(err, data) {});
											return;
										});
									},
									waitTime: 30000
								});
							});
						}
					});
				});
			}
		});
	}
	GD.DeleteOrder=function(){
		GD.Dialog.Dismiss();
		if(!GD.Id){
			NativeAPI.invoke("alert", {"title":"提示","message":"订单号为空，请返回列表查看","btn_text":"确定"}, function(err, data) {
			});
			return;
		}
		NativeAPI.invoke("loading", {"show":"1","text":"正在删除订单..."}, function(err, data) {
			if(data.value){
				// 获取uid, 
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
							sid_params[2] = '4-' + GD.Id;
							NativeAPI.invoke("getSid", {"params":sid_params}, function(drr, data){
								var sid = data.sid;
								var password = data.password;
								$.ajax({
									url : window.GTGJ.location + "assistant/ypMonitor.action",
									type: "POST",
									dataType : "json",
									data : {
										"pid": "2604",
										"uid":uid,
										"uuid":uuid,
										"userid":userid,
										"ua":ua,
										"sid":sid,
										"p":p,
										"id": sid_params[2],
										"type":'4',
										"refmt":"json"
									},
									success: function(data){
										var rtn = data;
										NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
											if(rtn.hd.code == '1'){
												NativeAPI.invoke("alert", {"title":"提示","message":'删除成功',"btn_text":"确定"}, function(err, data) {
													NativeAPI.invoke("setResultForActivity", {"data": {"refresh": "1"}});
													NativeAPI.invoke("close");
												});
											}
										});
									},
									error: function(xhr, type, exception){
										NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
											NativeAPI.invoke("alert", {"title":"提示","message":"网络请求出现问题","btn_text":"确定"}, function(err, data) {});
											return;
										});
									},
									waitTime: 30000
								});
							});
						}
					});
				});
			}
		});
	}
	GD.Process={};
	GD.Process.StatusCode=undefined;
	GD.Process.Refresh=function(){
		if(!GD.Id){
			NativeAPI.invoke("alert", {"title":"提示","message":"订单号为空，请返回列表查看","btn_text":"确定"}, function(err, data) {
			});
			return;
		}
		NativeAPI.invoke("getUserInfo", {"appName":"gtgj"}, function(err, data) {
			var uid = data.uid;
			var userid = data.userid;
			var ua = data.authcode;		
			NativeAPI.invoke("getDeviceInfo", {}, function(err, data) {
				var uuid = data.uuid;
				var p = data.p;
				if(uid && uuid){
					var sid_params = [];
					sid_params[0] = uid;
					sid_params[1] = uuid;
					sid_params[2] = GD.Id;
					NativeAPI.invoke("getSid", {"params":sid_params}, function(drr, data){
						var sid = data.sid;
						var password = data.password;
						$.ajax({
							url : window.GTGJ.location + "qporder/queryOrderProcess.action",
							type: "POST",
							dataType : "json",
							data : {
								"pid": "2617",
								"uid":uid,
								"uuid":uuid,
								"userid":userid,
								"ua":ua,
								"sid":sid,
								"p":p,
								"oid": GD.Id,
								"refmt":"json"
							},
							success: function(data){
								if(data.hd.code == '1'){
									if(data.bd && data.bd.ps){
										GD.Process.StatusCode=data.bd.sa;
										GD.Orderid=data.bd.tse;
										$("#status").html("");
										window.fork_proccessor = false;
										if(data.bd.ps.length > 0){
											if('0' == GD.Process.StatusCode){
												GD.Process.BuildFirstLine(data.bd.ps);
											}else{
												GD.Process.BuildFrame(data.bd.ps);
											}
										}
										if("0" == GD.Params.sn || GD.Process.StatusCode != GD.Params.sn){
											if(data.bd && data.bd.exp && data.bd.exp.length > 16){
												GD.Params.exp = data.bd.exp;
											}
											GD.Params.sn = GD.Process.StatusCode;
											if(GD.Process.StatusCode != GD.Params.sn){
												GD.StatusChanged = true;
											}
											GD.Button.init();
										}
									}
								}else{
									NativeAPI.invoke("alert", {"title":"提示","message":"网络请求出现问题","btn_text":"确定"}, function(err, data) {});
								}
							},
							error: function(xhr, type, exception){
								NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
									NativeAPI.invoke("alert", {"title":"提示","message":"网络请求出现问题","btn_text":"确定"}, function(err, data) {});
									return;
								});
							},
							waitTime: 30000
						});
					});
				}
			});
		});
	}
	GD.Process.BuildFirstLine=function(processors){
		NativeAPI.invoke("getUserInfo", {"appName":"gtgj"}, function(err, data) {
			var uid = data.uid;
			var userid = data.userid;
			var ua = data.authcode;		
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
							url : window.GTGJ.location + "qporder/queryTaskQueue.action",
							type: "POST",
							dataType : "json",
							data : {
								"pid": "2620",
								"uid":uid,
								"uuid":uuid,
								"userid":userid,
								"ua":ua,
								"sid":sid,
								"p":p,
								"oid": GD.Id,
								"refmt":"json"
							},
							success: function(data){
								if(data.bd && data.bd.str){
									var counts = data.bd.str.split('-');
									if(counts && counts.length > 1){
										var s = '';
										if(parseInt(counts[1]) > 0){
											s = '查询了' + counts[0] + '次，尝试下单' + counts[1] + '次';
										}else{
											s = '查询了' + counts[0] + '次，暂时没有查询到余票';
										}
										var html = $("#template_status").html();
										html = html.replace(/_status_date_/, new Date().pattern('yyyy-MM-dd'));
										html = html.replace(/_status_time_/, new Date().pattern('HH:mm:ss'));
										html = html.replace(/_status_desc_plus_/, '，' + s);
										html = html.replace(/_status_desc_/, '继续监控中');
										html = html.replace(/_status_style_/, "check_green");
										html = html.replace(/_hidden_/, "status_img_upper");
										html = html.replace(/txt_gray/, "");
										html = html.replace(/txt_gray/, "");
										window.fork_proccessor = true;
										$("#status").append(html);
									}
								}
									
								GD.Process.BuildFrame(processors);
								if("0" == GD.Params.sn || GD.Process.StatusCode != GD.Params.sn){
									if(data.bd && data.bd.exp && data.bd.exp.length > 16){
										GD.Params.exp = data.bd.exp;
									}
									GD.Params.sn = GD.Process.StatusCode;
									if(GD.Process.StatusCode != GD.Params.sn){
										GD.StatusChanged = true;												
									}
									GD.Button.init();
								}
							},
							error: function(xhr, type, exception){
								NativeAPI.invoke("loading", {"show":"0","text":""}, function(err, data) {
									NativeAPI.invoke("alert", {"title":"提示","message":"网络请求出现问题","btn_text":"确定"}, function(err, data) {});
									return;
								});
							},
							waitTime: 30000
						});
					});
				}
			});
		});
	}
	GD.Process.BuildFrame=function(processors){
		$.each(processors, function(i, p){
			var html = $("#template_status").html();
			if(this.ti){
				var time = this.ti.split(" ");
				html = html.replace(/_status_date_/, time[0]);
				html = html.replace(/_status_time_/, time[1]);
			}
			if(this.am && this.am.length > 1){
				if(!window.has_fake_tips && this.am.substring(0, 1) == "退"){
					window.has_fake_tips = 1;
					html = html.replace(/_status_desc_plus_/, " <a href='#' style='color:blue'>约1-7个工作日到账</a>");
				}
			}
			if(this.am && this.am == '取消订单'){
				if(processors.length != 2){
					html = html.replace(/_status_desc_plus_/, "，等待退款中...");	
				}else{
					html = html.replace(/_status_desc_plus_/, "");
				}
			}
			if(this.bc){
				html = html.replace(/_status_desc_plus_/, '，'+this.bc);
			}else{
				html = html.replace(/_status_desc_plus_/, '');
			}
			html = html.replace(/_status_desc_/, this.am);
			if(i == 0){
				if(this.ic){
					if(window.fork_proccessor){
						html = html.replace(/_status_style_/, "check_gray");
					}else{
						html = html.replace(/_status_style_/, "check_green");
						html = html.replace(/_hidden_/, "status_img_upper");
						html = html.replace(/txt_gray/, "");
						html = html.replace(/txt_gray/, "");
					}
				}else{
					html = html.replace(/_status_style_/, "error_green");	
					html = html.replace(/_hidden_/, "status_img_upper");
					html = html.replace(/txt_gray/, "");
					html = html.replace(/txt_gray/, "");
				}
			}else if(i == processors.length - 1){// 最后一个
				if(this.ic){
					html = html.replace(/_status_style_/, "check_gray");
				}else{
					html = html.replace(/_status_style_/, "error_gray");												
				}
				html = html.replace(/_hidden_/, "status_img_down");
			}else{
				if(this.ic){
					html = html.replace(/_status_style_/, "check_gray");
				}else{
					html = html.replace(/_status_style_/, "error_gray");
				}
			}
			$("#status").append(html);
		});
	}
	$("#submit_box").bind('click', function(){
		if(GD.Process.StatusCode == undefined){
			GD.Button.click(GD.Params.sn);
		}else{
			GD.Button.click(GD.Process.StatusCode);
		}
	});
	GD.Avs={}
	GD.Avs.GetInfo=function(){
		if(!GD.Id){
			return;
		}
		NativeAPI.invoke("getUserInfo", {"appName":"gtgj"}, function(err, data) {		
			var uid = data.uid;
			var userid = data.userid;
			var ua = data.authcode;		
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
							url : window.GTGJ.location + "qporder/queryAddValue.action",
							type: "POST",
							dataType : "json",
							data : {
								"pid": "2619",
								"uid":uid,
								"uuid":uuid,
								"userid":userid,
								"ua":ua,
								"sid":sid,
								"p":p,
								"oid": GD.Id,
								"avts": GD.Params.avs,
								"refmt":"json"
							},
							success: function(data){
								if(data.hd.code == '1'){
									if(data.bd.avs && data.bd.avs.length > 0){
										$.each(data.bd.avs, function(i, av){
											if(av && av.type == "A" && av.contents){//保险
												var str = av.contents[0].title + "<font style='color: #ff7200'>￥" + parseInt(av.contents[0].price) + " x " + av.contents.length + "</font>";
												if(av.contents.length > 0){
													$("#txt_grub_insurance").html(str);
													$("#grub_insurance").removeClass('hidden_area');
													$("#avs_divide").removeClass('hidden_area');
												}else{
													$("#grub_insurance").addClass('hidden_area');
													$("#avs_divide").addClass('hidden_area');
												}
											}
											if(av && av.type == "R" && av.contents){//红包
												if(av.contents.length > 0 && av.contents[0].id){
													if(GD.Params.sn != '0' && GD.Params.sn != '5'){
														$("#coupon_txt").removeClass('coupon_txt');
														$("#coupon_txt").addClass('coupon_txt_grey');
													}
													$("#coupon_area").removeClass('hidden_area');
													$("#coupon_txt").bind('click', function(){
														var url = "gtgj://start?type=gthongbaodetail&hongbaoid=" + av.contents[0].id + "&hbid=" + av.contents[0].id;
														window.location.href=url;
													});
												}else{
													$("#coupon_area").addClass('hidden_area');
												}
											}
										});
									}
								}
							},
							waitTime: 30000
						});
					});
				}
			});
		});
	}
	GD.init();
	$("#status").delegate("a", "click", function(){
		var location_url = window.location.href;
		var end_index = location_url.indexOf('gtgjwap');
		var url = location_url.substring(0, end_index) + "gtgjwap/app/grub/refund_note.html";
		NativeAPI.invoke("createWebView", {"url":url}, function(e, d){});
	});
	GD.Dialog={};
	GD.Dialog.Init=function(){
        $('.dialog-wrap').on("touchmove",function(e){e.preventDefault();});
        $('#cancel_confirm').on("touchmove",function(e){e.preventDefault();});
        $('#cancel_succ').on("touchmove",function(e){e.preventDefault();});
	}
	GD.Dialog.ShowCancelConfirm=function(){
        $('.dialog-wrap').css({'opacity':0.5,'display':'block'}); 
        $('.dialog-wrap').on("click", GD.Dialog.Dismiss);
        $('#cancel_confirm').show();
        $('#cancel_confirm .options .left').on('click', GD.CancelOrder);
        $('#cancel_confirm .options .right').on('click', GD.Dialog.Dismiss);
	}
	GD.Dialog.ShowCancelSucc=function(){
        $('.dialog-wrap').css({'opacity':0.5,'display':'block'});
        $('.dialog-wrap').on("click", GD.Dialog.Dismiss);
        $('#cancel_succ').show();
        $('#cancel_succ .options .single').on('click', GD.Dialog.Dismiss);
	}
	GD.Dialog.Dismiss=function(){
		$('.dialog, .dialog-wrap').hide();
	}
	GD.Dialog.Init();
	NativeAPI.registerHandler("headerRightBtnClick", function(){
		if("3" == GD.Params.sn){// 取消订单
			NativeAPI.invoke("confirm", {"title":"提示","message":"是否取消抢票？","yes_btn_text":"确定","no_btn_text":"取消"}, function(err, data){
				if(!data.value || data.value!=data.YES){
					return;
				}
				GD.CancelOrder();
			});
		}else if("0" == GD.Params.sn){
			if(GD.Process.StatusCode == undefined){
				GD.Button.click(GD.Params.sn);
			}else{
				GD.Button.click(GD.Process.StatusCode);
			}
		}else if("1" == GD.Params.sn || "4" == GD.Params.sn || "5" == GD.Params.sn || "6" == GD.Params.sn || "7" == GD.Params.sn){// 删除订单
			NativeAPI.invoke("confirm", {"title":"提示","message":"是否删除抢票订单？","yes_btn_text":"确定","no_btn_text":"取消"}, function(err, data){
				if(!data.value || data.value!=data.YES){
					return;
				}
				GD.DeleteOrder();
			});
		}
	});
	GD.InsurRiseUp = function(){
		NativeAPI.invoke("loading", {"show":"1","text":"正在查询可选套餐..."}, function(err, data) {
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
								url : window.GTGJ.location + "offline/insuranceList.action",
								type: "POST",
								dataType : "json",
								data : {
									"pid": "2178",
									"uid":uid,
									"uuid":uuid,
									"userid":userid,
									"ua":ua,
									"sid":sid,
									"p":p,
									"source": "3",
									"refmt":"json"
								},
								success: function(data){
									if(data && data.bd && data.bd.ins){
										window.insurances = [];
										var i = 0;
										$.each(data.bd.ins, function(i, m){
											if(m && GD.Params.bx.indexOf(m.id + '--') > -1){
												var j = 0; l = GD.Params.riseable.length;
												for(; j < l; j++){
													if(GD.Params.riseable[j].id == m.id){
														m.rise_to = GD.Params.riseable[j].rise_to;
														break;
													}
												}
												window.insurances[i++] = m;
											}
										});
										var riseable = {};
										riseable.ins = window.insurances;
										riseable.avs = GD.Params.avs;
										riseable.oid = GD.Params.oid;
										riseable.pgs = GD.Params.pgs;
										
										NativeAPI.invoke("storage", {action:"set",key:"gtgj_insurance_rise",value:JSON.stringify(riseable)},function(err,data){});
										NativeAPI.invoke("loading", {"show":"0","text":""}, function(){
											var location_url = window.location.href;
											var end_index = location_url.indexOf('gtgjwap');
											var url = window.location.href.substring(0, end_index) + "gtgjwap/app/grub/insurance_rise.html";
											NativeAPI.invoke("createWebView", {"url":url}, function(e, d){});
										});
										
									}
								}
							});
						});
					}
				});
			});
		});
	}
	NativeAPI.registerHandler("resume", function(err, data){
		NativeAPI.invoke("storage",{action:"get",key:"gtgj_insurance_rised"},function(err,data){
			if(data && data.value && data.value.length > 0){
				NativeAPI.invoke("storage", {action:"set",key:"gtgj_insurance_rised",value:""},function(err,data){});
				
				GD.GetDetail(GD.Id);
			}
		});
	});
	GD.Order.init = function(){
		if(GetRequest().from == 'tt12306orderdetail'){
			return;
		}
		NativeAPI.invoke("getDeviceInfo", {}, function(err, data) {
			if(data && data.p && data.p.split(',')[3] != 'gtgj'){
				return;
			}
			if(data && data.p && GD.Params.sqn && (data.p.split(',')[1] == 'ios' || (data.p.split(',')[1] == 'android' && data.p.split(',')[4] == '4.6'))){
				$("#view_12306_ticket").removeClass('hidden');
				$("#view_12306_ticket").bind('click', function(){
					var url = "gtgj://start?type=orderdetail&t=12306&acc=" + encodeURIComponent(GD.Params.acc) + "&oid=" + encodeURIComponent(GD.Params.sqn);
					window.location.href=url;
				});
			}else if(data && data.p && data.p.split(',')[1] == 'android' && GD.Params.sqn){
				NativeAPI.invoke("get12306UserInfo", {}, function(err, data) {
					if(GD.Params.acc == data.account){
						$("#view_12306_ticket").removeClass('hidden');
						$("#view_12306_ticket").bind('click', function(){
							var url = "gtgj://start?type=gtgjtrainorderdetail&t=12306&username=" + encodeURIComponent(GD.Params.acc) + "&orderid=" + encodeURIComponent(GD.Params.sqn);
							window.location.href=url;
						});
					}
				});
			}
		});
	}
});