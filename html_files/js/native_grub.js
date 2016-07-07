function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

Date.prototype.pattern = function (fmt) {
    var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
		"H+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
    };
    var week = { "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六", "0": "日" };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function proccessYpInfo(ypinfo) {
	var seats = { "0": "棚车", "1": "硬座", "2": "软座", "3": "硬卧", "4": "软卧", "5": "包厢硬卧", "6": "高级软卧", "7": "一等软座", "8": "二等软座", "9": "商务座", "A": "高级动卧", "B": "混编硬座", "C": "混编硬卧", "D": "包厢软座", "E": "特等软座", "F": "动卧", "G": "二人软包", "H": "一人软包", "I": "一等双软", "J": "二等双软", "K": "混编软座", "L": "混编软卧", "M": "一等座", "O": "二等座", "P": "特等座", "Q": "观光座", "S": "一等包座" };
	var arrayLength = ypinfo.length / 10;
	var qt = 0;
	var list = [];
	var i = 0, m = 6, n = 10, x = 0, y = 1
	var dw = undefined;//动卧
	for (; i < arrayLength; i++ , m = m + 10, n = n + 10, x = x + 10, y = y + 10) {
		var model = {};
		model.code = ypinfo.substring(x, y);
		if (parseInt(ypinfo.substring(m, m + 1), 10) >= 3) {
			model.name = "无座";
			model.remain = parseInt(ypinfo.substring(m + 1, n), 10);
			model.price = parseInt(ypinfo.substring(y, m), 10) / 10;
		} else {
			model.name = seats[model.code];
			model.remain = parseInt(ypinfo.substring(m, n), 10);
			model.price = parseInt(ypinfo.substring(y, m), 10) / 10;
			if (model.code == '4' || model.code == 'F') {
				dw = {};
				dw.code = model.code;
				dw.remain = model.remain;
				dw.price = model.price;
				dw.name = "动卧";
			}
		}
		list[i] = model;
	}
	if (dw) {
		list[list.length] = dw;
	}
	return list;
}
function proccessYpInfo2(ypinfo) {
	var seats = { "0": "棚车", "1": "硬座", "2": "软座", "3": "硬卧", "4": "软卧", "5": "包厢硬卧", "6": "高级软卧", "7": "一等软座", "8": "二等软座", "9": "商务座", "A": "高级动卧", "B": "混编硬座", "C": "混编硬卧", "D": "包厢软座", "E": "特等软座", "F": "动卧", "G": "二人软包", "H": "一人软包", "I": "一等双软", "J": "二等双软", "K": "混编软座", "L": "混编软卧", "M": "一等座", "O": "二等座", "P": "特等座", "Q": "观光座", "S": "一等包座" };
	var arrayLength = ypinfo.length / 10;
	var qt = 0;
	var list = [];
	var i = 0, m = 6, n = 10, x = 0, y = 1
	var dw = undefined;//动卧
	for (; i < arrayLength; i++ , m = m + 10, n = n + 10, x = x + 10, y = y + 10) {
		var model = {};
		model.code = ypinfo.substring(x, y);
		if (parseInt(ypinfo.substring(m, m + 1), 10) >= 3) {
			model.name = "无座";
			model.remain = parseInt(ypinfo.substring(m + 1, n), 10);
			model.price = parseInt(ypinfo.substring(y, m), 10) / 10;
		} else {
			model.name = seats[model.code];
			model.remain = parseInt(ypinfo.substring(m, n), 10);
			model.price = parseInt(ypinfo.substring(y, m), 10) / 10;
			model.price = model.name.indexOf('卧') != -1 ? parseInt(model.price * 1.2) : model.price;
			if (model.code == '4' || model.code == 'F') {
				dw = {};
				dw.code = model.code;
				dw.remain = model.remain;
				dw.price = model.price;
				dw.name = "动卧";
			}
		}
		list[i] = model;
	}
	if (dw) {
		list[list.length] = dw;
	}
	return list;
}

$(function () {
	document.body.addEventListener('touchstart', function () { });
	var GTGJ = window.GTGJ || {};
	window.GTGJ = GTGJ;
	GTGJ.Native = window.GTGJ.Native || {};
	GTGJ.Native.Grub = {};
	GNG = GTGJ.Native.Grub;
	GNG.ReqParam = GetRequest();
	GNG.ReqParam['train_no'] = GNG.ReqParam['train_no'].replace('+', '');
	GNG.Const = {};
	GNG.Coupon = {};
	GNG.multiTrain = false;
	GNG.Const.Init = function () {
		GNG.Const.coupon_ids = "1,1001";// 1,1001
		GNG.Const.pt_c2n = { "1": "成人票", "2": "儿童票", "3": "学生票", "4": "残军票" };
		GNG.Const.pt_n2c = { "成人票": "1", "儿童票": "2", "学生票": "3", "残军票": "4" };
		GNG.Const.native_n2c = { "商务座": "11", "特等座": "12", "一等座": "1", "二等座": "2", "高级软卧": "14", "软卧": "9", "硬卧": "7", "软座": "4", "硬座": "3", "无座": "0", "动卧": "15", "高级动卧": "16", "一等软座": "17", "二等软座": "18", "包厢硬卧": "19" };
		GNG.Const.current_seat_name = GNG.ReqParam['cu'];

		if (GNG.Const.current_seat_name == '' || GNG.Const.current_seat_name == undefined) {
			NativeAPI.invoke('gtgjGetCurrentTicket', {}, function (err, data) {
				if (data && data.ticket && data.ticket.cu) {
					GNG.Const.current_seat_name = data.ticket.cu;
					GNG.Const.seat_n2c_map = {};
					GNG.Const.seat_n2p_map = {};
					GNG.Const.seats = proccessYpInfo(GNG.ReqParam.yp_info);
					GNG.Const.yp_info = GNG.ReqParam.yp_info;

					$.each(GNG.Const.seats, function (i, model) {
						GNG.Const.seat_n2c_map[model.name] = (model.code);
						GNG.Const.seat_n2p_map[model.name] = (model.price);
					});
					if (GNG.Const.seat_n2p_map[GNG.Const.current_seat_name] == 0) {
						NativeAPI.invoke('alert', { 'title': '错误', 'message': '当前车次价格信息错误，请重新刷新车票列表', 'btn_text': '确定' }, function (err, data) { });
						window.hasError = '当前车次价格信息错误，请重新刷新车票列表';
					}
					GNG.Const.phoneStatus = undefined;
				}
			});
		} else {
			GNG.Const.seat_n2c_map = {};
			GNG.Const.seat_n2p_map = {};
			GNG.Const.seats = proccessYpInfo(GNG.ReqParam.yp_info);
			GNG.Const.yp_info = GNG.ReqParam.yp_info;

			$.each(GNG.Const.seats, function (i, model) {
				GNG.Const.seat_n2c_map[model.name] = (model.code);
				GNG.Const.seat_n2p_map[model.name] = (model.price);
			});
			if (GNG.Const.seat_n2p_map[GNG.Const.current_seat_name] == 0) {
				NativeAPI.invoke('alert', { 'title': '错误', 'message': '当前车次价格信息错误，请重新刷新车票列表', 'btn_text': '确定' }, function (err, data) { });
				window.hasError = '当前车次价格信息错误，请重新刷新车票列表';
			}
			GNG.Const.phoneStatus = undefined;
		}

		var depart_date = parseFloat(new Date(Date.parse(GNG.ReqParam.train_date)).pattern("MM.dd"));
		GNG.Const.student_enable = (depart_date >= 6.01 && depart_date <= 9.30) || (depart_date >= 12.01 || depart_date <= 3.31);
	};
	GNG.Const.Init();
	GNG.calc_price = function () {
		GNG.Insurance.Setup();
		var ins_price = GNG.Insurance.GetAmount();

		var total_price = 0;
		$("#passengers_hidden").find("div[class='clickable_passenger']").each(function () {
			total_price += parseFloat($($(this).find("font[class='passenger_seat_price']")[0]).html().replace(/￥/, ""));
		});
		var single_price = total_price;

		if (GNG.MultiTrain.Enable && GNG.MultiTrain.Data) {
			// 多车次抢票
			GNG.MultiTrain.Trains = [];
			var codes = [];
			$("#passengers_hidden").find("div[class='clickable_passenger']").each(function () {
				codes[codes.length] = $($(this).find("font[class='passenger_seat_type']")[0]).html();
			});

			$.each(GNG.MultiTrain.Data, function (i, m) {
				if (!m.check) {
					return true;
				}
				var c_price = 0;
				var found = true;
				$.each(codes, function (q, code) {
					if (m.seat_c2p_map['s_' + code] && m.seat_c2p_map['s_' + code] > 0) {
						c_price += m.seat_c2p_map['s_' + code];
					} else {
						found = false;
						return true;
					}
				})
				if (found) {
					GNG.MultiTrain.Trains[GNG.MultiTrain.Trains.length] = m.trainno;
					if (c_price > total_price) {
						GNG.MultiTrain.MaxPriceTrain = m.trainno;
						total_price = c_price;
					}
				}
			});
		}

		if (total_price == single_price) {
			$("#ticket_price").html("￥" + total_price);
		} else {
			$("#ticket_price").html("￥" + total_price + " [多车次时按最高(" + GNG.MultiTrain.MaxPriceTrain + ")预收] ");
		}
		$("#ins_price").html("￥" + ins_price);
		total_price += parseInt(ins_price);
		$("#total_price").html(total_price);

		if (GNG.MultiTrain.Enable && GNG.MultiTrain.Trains && GNG.MultiTrain.Trains.length > 0) {
			$("#allow_trains").html(GNG.MultiTrain.Trains.join(", "));
			$("#allow_trains").show();
		} else {
			$("#allow_trains").hide();
		}
	}
	GNG.init = function () {
		$("#train_no").html(GNG.ReqParam["train_no"]);
		$("#train_date").html(new Date(Date.parse(GNG.ReqParam.train_date)).pattern('M月d日 EEE'));
		$("#depart_city").html(GNG.ReqParam["depart_city"]);
		$("#depart_time").html(GNG.ReqParam["depart_time"]);
		$("#arrive_city").html(GNG.ReqParam["arrive_city"]);
		$("#arrive_time").html(GNG.ReqParam["arrive_time"]);
		GNG.Time.Init();
		GNG.AnaGrub();
		GNG.Notify.Init();

		if ('硬座' == GNG.Const.current_seat_name || '二等座' == GNG.Const.current_seat_name) {
			$('#no_seat_area').css('display', '');
		} else {
			$('#no_seat_area').css('display', 'none');
		}
		GNG.MultiTrain.Init();
	};
	GNG.Passenger = {};
	GNG.Passenger.Select = function () {
		var expiredate = $("#stop_date").html();
		expiredate = expiredate.substring(0, expiredate.length - 3);
		var expiretime = expiredate + $("#stop_time").html();
	};
	GNG.Time = {};
	GNG.Time.MAX_DEPART_EXP = 1;
	GNG.Time.Options = [];
	GNG.Time.Init = function () {
		var depart_date = Date.parse(GNG.ReqParam.train_date);
		var today = Date.parse(new Date().pattern('yyyy-MM-dd'));
		var nowHour = new Date().getHours();
		var depart_hour = GNG.ReqParam.depart_time.split(':')[0];
		if (depart_date == today) {// 今天开车，显示不一样哦 
			var i = depart_hour - nowHour, j = 0;
			for (; i > GNG.Time.MAX_DEPART_EXP - 1; i--) {
				GNG.Time.Options[0] = GNG.Time.Options[0] || {};
				GNG.Time.Options[0]['开车前'] = GNG.Time.Options[0]['开车前'] || [];
				GNG.Time.Options[0]['开车前'][j++] = i + "小时";
			}
			var exp = depart_hour - nowHour + 1;
			if (exp < 4) {
				NativeAPI.invoke("alert", { "title": "提示", "message": "现在距离开车时间不足" + exp + "小时，请预留足够时间以赶往车站。", "btn_text": "确定" }, function (err, data) { });
			}
			GNG.Time.DepartToday = true;
			GNG.Time.SetUp({ 'left': '开车前', 'right': '1小时' });
			/*
						$("#backup_trainno_divide").hide();
						$("#backup_trainno").hide();
			*/
		} else {
			GNG.Time.GrubCount = {};
			var today = Date.parse(new Date().pattern('yyyy-MM-dd'));
			var d_today = new Date(today);
			var s_today = d_today.pattern('MM月dd日');
			GNG.Time.GrubCount[s_today] = '抢1天';
			var i = nowHour, j = 0;
			for (; i < 24;) {
				var value = ++i + "";
				value = ("00" + value).substring(value.length);
				value += ":00";
				GNG.Time.Options[0] = GNG.Time.Options[0] || {};
				GNG.Time.Options[0][s_today] = GNG.Time.Options[0][s_today] || [];
				GNG.Time.Options[0][s_today][j++] = value;
			}

			var day_from_now = 1;
			while (true) {
				var tomorrow = today + (day_from_now * 24 * 60 * 60 * 1000);
				var d_tomorrow = new Date(tomorrow);
				var s_tomorrow = d_tomorrow.pattern('MM月dd日');
				var tomorrow_0 = Date.parse(d_tomorrow.pattern('yyyy-MM-dd'));
				i = -1; j = 0;
				var l = tomorrow_0 == depart_date ? (depart_hour - GNG.Time.MAX_DEPART_EXP) : 24;
				for (; i < l;) {
					var value = ++i + "";
					value = ("00" + value).substring(value.length);
					value += ":00";
					GNG.Time.Options[day_from_now] = GNG.Time.Options[day_from_now] || {};
					GNG.Time.Options[day_from_now][s_tomorrow] = GNG.Time.Options[day_from_now][s_tomorrow] || [];
					GNG.Time.Options[day_from_now][s_tomorrow][j++] = value;
				}
				day_from_now++;
				GNG.Time.GrubCount[s_tomorrow] = '抢' + day_from_now + '天';
				if (l != 24) {
					break;
				}
			}
			var yestoday = depart_date - 24 * 60 * 60 * 1000;

			GNG.Time.SetUp({ 'left': new Date(yestoday).pattern('MM月dd日'), 'right': '23:00' });
		}
	}
	GNG.Time.SetUp = function (d) {
		$("#stop_date").html(d.left);
		$("#stop_time").html(d.right);
		if (GNG.Time.GrubCount && GNG.Time.GrubCount[d.left]) {
			$("#grub_day_count").html(GNG.Time.GrubCount[d.left]);
		}
	}
	GNG.Time.Select = function () {
		var date = $("#stop_date").html();
		var time = $("#stop_time").html();
		NativeAPI.invoke("gtgjHandleBusiness", { "obj": "grub", "command": "time_select", "input": { "data": GNG.Time.Options, "left": date, "right": time } }, function (err, data) {
			GNG.Time.SetUp(data);
		});
	};
	GNG.Time.GetTimeStr = function () {
		var expiredate = $("#stop_date").html();
		var expiretime = $("#stop_time").html();
		if ('开车前' == expiredate) {
			var depart_hour = GNG.ReqParam.depart_time.split(':')[0];
			expiretime = expiretime.substring(0, expiretime.length - 2);
			expiretime = depart_hour - expiretime;
			expiretime += "";
			expiretime = ("00" + expiretime).substring(expiretime.length);
			return new Date(Date.parse(GNG.ReqParam.train_date)).pattern("M月d日") + " " + expiretime + ":" + GNG.ReqParam.depart_time.split(':')[1];
		}
		expiretime = expiredate + " " + expiretime;
		return expiretime;
	};
	GNG.Passenger = {};
	GNG.Passenger.val = [];
	GNG.Passenger.hide = function () {
		if ($("#passenger_place_holder").hasClass("hidden")) {
			$("#passenger_place_holder").removeClass("hidden");
		}
		if (!$("#passengers_hidden").hasClass("hidden")) {
			$("#passengers_hidden").addClass("hidden");
		}
	}
	GNG.Passenger.removeAll = function () {
		$("#passengers").html("");
		GNG.Passenger.val = [];
	}
	GNG.Passenger.display = function () {
		if (!$("#passenger_place_holder").hasClass("hidden")) {
			$("#passenger_place_holder").addClass("hidden");
		}
		if ($("#passengers_hidden").hasClass("hidden")) {
			$("#passengers_hidden").removeClass("hidden");
		}
	}
	GNG.Passenger.add = function (p) {
		var html = $("#passenger_template").html();
		p.seat_type_name = p.seat_type_name == undefined ? GNG.Const.current_seat_name : p.seat_type_name;
		html = html.replace(/_user_name_/, p.passenger_name);
		html = html.replace(/_ticket_type_/, GNG.Const.pt_c2n[p.passenger_type]);
		html = html.replace(/_seat_type_/, p.seat_type_name);
		html = html.replace(/_id_no/, p.passenger_id_no);
		html = html.replace(/_price_/, GNG.Const.seat_n2p_map[p.seat_type_name]);
		html = html.replace(/_passengerkey_/, p.passengerkey);
		if ("儿童票" == GNG.Const.pt_c2n[p.passenger_type]) {
			html = html.replace(/_child_/, "not_adult_type")
		}
		$("#passengers").append(html);
		GNG.Passenger.val[GNG.Passenger.val.length] = p.passengerkey;
	}
	GNG.Passenger.addAll = function (list) {
		$.each(list, function (i, m) {
			GNG.Passenger.add(m);
		});
	}
	GNG.Passenger.Select = function () {
		var param = {};
		if (GNG.Passenger.val != undefined && GNG.Passenger.val.length > 0) {
			param["keys"] = GNG.Passenger.val;
		}
		param["force_login_tt"] = '1';
		param["show_verify_status"] = '1';
		param["disable_unverify"] = '1';
		param["source"] = '12306';
		NativeAPI.invoke("gtgjHandleBusiness", { "obj": "grub", "command": "passenger_select", "input": param }, function (err, data) {
			if (data.selected.length > 0) {
				if (data.selected.length > 1) {
					$("#multi_psg_notice").removeClass("hidden");
				} else {
					$("#multi_psg_notice").addClass("hidden");
				}
				GNG.Passenger.display();
				GNG.Passenger.removeAll();
				GNG.Passenger.addAll(data.selected);
			} else {
				GNG.Passenger.hide();
				GNG.Passenger.removeAll();
			}
			GNG.calc_price();
		});
	}
	GNG.Passenger.GetPassengersForBook = function () {
		var i = 0;
		var str = [];
		$("#passengers_hidden").find("div[class='clickable_passenger']").each(function () {
			var p = [];
			p[0] = $($(this).find("input[name='passengerkey']")[0]).val();
			p[1] = GNG.Const.native_n2c[$($(this).find("font[class='passenger_seat_type']")[0]).html()];
			p[2] = $($(this).find("font[class='passenger_seat_price']")[0]).html().replace(/￥/, '');
			str[i++] = p.join(",");
		});
		return str;
	}
	GNG.AnaGrub = function () {// 分析抢票难度
		NativeAPI.invoke("getUserInfo", { "appName": "gtgj" }, function (err, data) {
			var uid = data.uid;
			var userid = data.userid;
			var ua = data.authcode;
			// uuid
			NativeAPI.invoke("getDeviceInfo", {}, function (err, data) {
				var uuid = data.uuid;
				var p = data.p;
				var trainid = GNG.ReqParam['train_no'];
				if (uid && uuid) {
					var sid_params = [];
					sid_params[0] = uid;
					sid_params[1] = uuid;
					NativeAPI.invoke("getSid", { "params": sid_params }, function (drr, data) {
						var sid = data.sid;
						NativeAPI.invoke("get12306UserInfo", {}, function (err, data) {
							var passengers = GNG.Passenger.GetPassengersForBook();
							var username = data.username;
							var password = data.password;
							$.ajax({
								url: window.GTGJ.location + "assistant/trainMonitorInfo.action",
								//url : "http://192.168.0.151:8080/trainnet/assistant/trainMonitorInfo.action",
								type: "POST",
								dataType: "json",
								data: {
									"pid": "2605",
									"uid": uid,
									"uuid": uuid,
									"userid": userid,
									"ua": ua,
									"sid": sid,
									"p": p,
									"trainno": trainid,
									"departdate": GNG.ReqParam["train_date"],
									"fcode": GNG.ReqParam["depart_code"],
									"tcode": GNG.ReqParam["arrive_code"],
									"refmt": "json"
								},
								success: function (data) {
									var rtn = data;
									NativeAPI.invoke("loading", { "show": "0", "text": "" }, function (err, data) {
										if (rtn.hd.code == '1' && rtn.bd) {
											NativeAPI.invoke("gtgjExecuteTask", {
												"server": "tt", "action": "query_tickets", "waitenable": false, "input": {
													"queryFromStationCode": rtn.bd.scode,
													"queryToStationCode": rtn.bd.ecode,
													"queryTrainDate": rtn.bd.tdate
												}
											}, function (err, data) {
												if (data.ticketArray) {
													var yp = "";
													$.each(data.ticketArray, function (i, m) {
														if (trainid == m.trainno) {
															yp = m.yp_info;
														}
													});
													$.ajax({
														url: window.GTGJ.location + "qporder/queryInsQueue.action",
														type: "POST",
														dataType: "json",
														data: {
															"uid": uid,
															"uuid": uuid,
															"sid": sid,
															"ua": ua,
															"refmt": "json"
														},
														success: function (data) {

															GNG.AnaGrub.SetUp(rtn.bd, yp, data.bd.str);
														}
													});
												}
											});
										} else {
											$("#ana_grub_loading").html("<font class='Level Nightmare'>综合抢票难度：困难</font>");
										}
									});
								},
								error: function (xhr, type, exception) {
									$("#ana_grub_loading").html("<font class='Level Nightmare'>综合抢票难度：困难</font>");
								}
							});
						});

					});
				}
			});
		});
	};
	GNG.AnaGrub.SetUp = function (model, yp_info, ins) {
		var level = 0;
		$("#grub_train_start").html(model.sname);
		$("#grub_train_end").html(model.ename);
		//$("#grub_count").html(model.num);
		if (parseInt(model.num) > 50) {
			level++;
		}
		var seatCount = 0;
		var seats = proccessYpInfo(yp_info);
		$.each(seats, function (i, m) {
			if (m.name == GNG.ReqParam["cu"]) {
				seatCount = m.remain;
			}
		});
		if (seatCount > 50) {
			$("#grub_total_train_desc").css('display', '');
		}
		$("#grub_train_remain").html(GNG.ReqParam["cu"] + " " + seatCount + " ");
		if (seatCount < 20) {
			level++;
		}
		var depart_date = Date.parse(GNG.ReqParam.train_date);
		var today = Date.parse(new Date().pattern('yyyy-MM-dd'));
		var tmp = depart_date - today;
		tmp /= (24 * 60 * 60 * 1000);
		if (tmp < 2) {
			level++;
		}
		$("#grub_remaim_time_count").html(tmp);
		$("#grub_remaim_time_unit").html("天");
		if (level == 0) {
			$("#grub_level").addClass('Normal');
			$("#grub_level").html("综合抢票难度：普通");
		} else if (level == 1) {
			$("#grub_level").addClass('Nightmare');
			$("#grub_level").html("综合抢票难度：困难");
		} else if (level == 2) {
			$("#grub_level").addClass('Hell');
			$("#grub_level").html("综合抢票难度：非常困难");
		} else if (level == 3) {
			$("#grub_level").addClass('Inferno');
			$("#grub_level").html("综合抢票难度：机会渺茫");
		}
		$("#ana_grub_loading").css("display", "none");
		$("#ana_grub_result").css("display", "");
		if (ins) {
			var ins_counts = ins.split("-");
			if (ins_counts.length == 3) {
				$("#grub_total_count").html(ins_counts[2]);
				NativeAPI.invoke("storage", { action: "set", key: "gtgj_insurance_count", value: JSON.stringify(ins_counts) }, function (err, data) { });
			}
		}
	}
	GNG.Order = {}
	GNG.Order.SubmitCurrent = function () {

		// 红包使用判断
		if (window.coupons && window.couponid) {
			var illegal = false;
			$.each(window.coupons, function (i, m) {
				if (m.id == window.couponid) {
					if (m.type == '1001') {// 套餐抵用专用红包
						var ins = GNG.Insurance.getSelected();
						if (ins == undefined || ins.id == undefined || ins.id == '0') {
							NativeAPI.invoke("alert", { "title": "提示", "message": "当前红包只能用作套餐抵减，您没有选择套餐，无法使用该红包。", "btn_text": "确定" }, function (err, data) { });
							illegal = true;
							return true;
						}
					}
				}
			});
			if (illegal) {
				return;
			}
		}

		if (GNG.Const.seat_n2p_map[GNG.Const.current_seat_name] == 0) {
			NativeAPI.invoke('alert', { 'title': '错误', 'message': '当前车次价格信息错误，请重新刷新车票列表', 'btn_text': '确定' }, function (err, data) { });
			window.hasError = '当前车次价格信息错误，请重新刷新车票列表';
			return;
		}

		var passenger = $("#passengers_hidden").find("div[class='clickable_passenger']");
		var succ = passenger.length;
		if (!succ) {
			NativeAPI.invoke("alert", { "title": "提示", "message": "请选择乘车人", "btn_text": "确定" }, function (err, data) {
			});
			return;
		}
		if (succ > 5) {
			NativeAPI.invoke("alert", { "title": "提示", "message": "最多选择5个乘车人", "btn_text": "确定" }, function (err, data) { });
			return;
		}
		var found = 0;
		var found_student = 0;
		$.each(passenger, function (i, m) {
			var s = $($(m).find("input[name='passengerkey']")[0]).val().split(",");
			if (s[1] != "2") {
				found = 1;
			}
			if (s[1] == "3") {
				found_student = 1;
			}
		});
		if (found == 0) {
			NativeAPI.invoke("alert", { "title": "提示", "message": "儿童不能单独旅行", "btn_text": "确定" }, function (err, data) {
			});
			return;
		}
		if (found_student && !GNG.Const.student_enable) {
			NativeAPI.invoke("confirm", { "title": "提示", "message": "学生票的乘车时间为每年的暑假6月1日至9月30日、寒假12月1日至3月31日，是否直接购买成人票？", "yes_btn_text": "买全票", "no_btn_text": "取消" }, function (err, data) {
				if (data.value == data.YES) {
					var psgs = $("#passengers_hidden").find("div[class='clickable_passenger']");
					$.each(psgs, function (i, m) {
						var psg_key = $($(m).find("input[name='passengerkey']")[0]);
						var s = psg_key.val().split(",");
						if (s[1] == "3") {
							s[1] = "1";
							psg_key.val(s.join(","));
							$($(m).find("font[name='passenger_type']")[0]).html('成人票');
							$($(m).find("font[name='passenger_type']")[0]).removeClass('not_adult_type');
						}
					});
					GNG.Order.SubmitCurrent();
				}
			});
			return;
		}
		NativeAPI.invoke("loading", { "show": "1", "text": "正在生成抢票订单..." }, function (err, data) {
			if (data.value) {
				// 获取uid, 
				NativeAPI.invoke("getUserInfo", { "appName": "gtgj" }, function (err, data) {
					var uid = data.uid;
					var userid = data.userid;
					var ua = data.authcode;
					// uuid
					NativeAPI.invoke("getDeviceInfo", {}, function (err, data) {
						var uuid = data.uuid;
						var p = data.p;
						var trainid = GNG.ReqParam['train_no'];
						//多车次抢票
						if (GNG.MultiTrain.Enable && GNG.MultiTrain.Trains && GNG.MultiTrain.Trains.length > 0) {
							trainid = trainid + "," + GNG.MultiTrain.Trains.join(",");
						}

						if (uid && uuid) {
							var sid_params = [];
							sid_params[0] = uid;
							sid_params[1] = uuid;
							sid_params[2] = trainid;
							NativeAPI.invoke("getSid", { "params": sid_params }, function (drr, data) {
								var sid = data.sid;
								NativeAPI.invoke("get12306UserInfo", {}, function (err, data) {
									var passengers = GNG.Passenger.GetPassengersForBook();
									var username = data.account;
									var password = data.password;
									var phoneStatus = data.phonestatus;
									var isLogin = data.login;
									if (!username) {
										NativeAPI.invoke("loading", { "show": "0", "text": "" }, function (err, data) {
											NativeAPI.invoke("login12306", {}, function (drr, data) {
												if (data.value == data.SUCC) {
													GNG.Order.SubmitCurrent();
												}
											});
										});
										return;
									}
									if (GNG.Const.phoneStatus != 1 && "未通过核验" == phoneStatus) {
										NativeAPI.invoke("loading", { "show": "0", "text": "" }, function (err, data) {
											NativeAPI.invoke("confirm", { "title": "提示", "message": "您的手机号未通过核验，可能无法抢票，建议您先核验手机号。", "yes_btn_text": "去核验", "no_btn_text": "直接抢" }, function (err, data) {
												if (data.value == data.YES) {
													GNG.VerifyPhone(isLogin);
												} else {
													GNG.Const.phoneStatus = 1;
													GNG.Order.SubmitCurrent();
												}
											});
										});
										return;
									}
									var total_price = $("#total_price").html();
									if (total_price.indexOf("+") != -1) {
										var tt = total_price.split("+");
										total_price = 0;
										$.each(tt, function (iii, tt) {
											total_price += parseFloat(tt);
										});
									}
									$.ajax({
										url: window.GTGJ.location + "qporder/createQpOrder.action",
										type: "POST",
										dataType: "json",
										data: {
											"pid": "2611",
											"uid": uid,
											"uuid": uuid,
											"userid": userid,
											"ua": ua,
											"sid": sid,
											"p": p,
											"trains": trainid,
											"account": username,
											"password": password,
											"departdate": GNG.ReqParam["train_date"],
											"fcode": GNG.ReqParam["depart_code"],
											"departtime": GNG.ReqParam["depart_time"],
											"tcode": GNG.ReqParam["arrive_code"],
											"arrivetime": GNG.ReqParam["arrive_time"],
											"ticketprice": total_price,
											"allownoseat": GNG.no_seat ? "1" : "0",
											"ticketcount": passengers.length,
											"ticketinfo": passengers.join(";"),
											"warnphone": $("#contact").html(),
											"expiretime": GNG.Time.GetTimeStr(),
											"redpack": window.couponid ? window.couponid : '',
											"refmt": "json",
											"insurinfo": GNG.Insurance.GetForBook().join(";")
										},
										success: function (data) {
											var rtn = data;
											NativeAPI.invoke("loading", { "show": "0", "text": "" }, function (err, data) {
												if (rtn.hd.code == '1' && rtn.bd) {
													var oid = rtn.bd.oid;
													if ('0' == rtn.bd.sf) {// 0 成功
														var p1 = rtn.bd.url.split("?");
														var p2 = p1[1].split("&")
														var p3 = {};
														$.each(p2, function (i, p4) {
															var p5 = p4.split("=");
															p3[p5[0]] = decodeURIComponent(p5[1]);
														});
														NativeAPI.invoke("startPay", p3, function (err, data) {
															if (data.PENDING == data.value || data.SUCC == data.value) {
																GNG.PENDING = 1;
															}
															GNG.Order.GoDetail(oid);
														});
													} else if ('1' == rtn.bd.sf) {// 1. 存在未完成订单
														NativeAPI.invoke("confirm", { "title": "提示", "message": "您当前还有未完成订单", "yes_btn_text": "查看订单", "no_btn_text": "直接取消" }, function (err, data) {
															if (data.value == data.YES) {
																GNG.Order.GoDetail(oid);
															} else if (data.value == data.NO) {
																GNG.Order.Cancel(oid);
															}
														});
													}
												} else {
													NativeAPI.invoke("alert", { "title": "提示", "message": rtn.hd.desc, "btn_text": "确定" }, function (err, data) { });
												}
											});
										},
										error: function (xhr, type, exception) {
											NativeAPI.invoke("loading", { "show": "0", "text": "" }, function (err, data) {
												NativeAPI.invoke("alert", { "title": "提示", "message": "网络请求出现问题", "btn_text": "确定" }, function (err, data) { });
												return;
											});
										},
										waitTime: 30000
									});
								});

							});
						}
					});
				});
			}
		});
	}
	GNG.Order.GoDetail = function (orderid) {
		if (!orderid) {
			NativeAPI.invoke("alert", { "title": "提示", "message": "订单号为空，请返回列表查看", "btn_text": "确定" }, function (err, data) {
			});
			return;
		}
		NativeAPI.invoke("loading", { "show": "1", "text": "正在查询抢票订单..." }, function (err, data) {
			if (data.value) {
				// 获取uid, 
				NativeAPI.invoke("getUserInfo", { "appName": "gtgj" }, function (err, data) {
					var uid = data.uid;
					var userid = data.userid;
					var ua = data.authcode;
					// uuid
					NativeAPI.invoke("getDeviceInfo", {}, function (err, data) {
						var uuid = data.uuid;
						var p = data.p;
						if (uid && uuid) {
							var sid_params = [];
							sid_params[0] = uid;
							sid_params[1] = uuid;
							sid_params[2] = orderid;
							NativeAPI.invoke("getSid", { "params": sid_params }, function (drr, data) {
								var sid = data.sid;
								var password = data.password;
								$.ajax({
									url: window.GTGJ.location + "qporder/queryQpOrderDetail.action",
									type: "POST",
									dataType: "json",
									data: {
										"pid": "2614",
										"uid": uid,
										"uuid": uuid,
										"userid": userid,
										"ua": ua,
										"sid": sid,
										"p": p,
										"oid": orderid,
										"refmt": "json"
									},
									success: function (data) {
										var rtn = data;
										NativeAPI.invoke("loading", { "show": "0", "text": "" }, function (err, data) {
											if (rtn.hd.code == '1' && rtn.bd) {
												var str = encodeURIComponent(JSON.stringify(rtn.bd));
												orderid = encodeURIComponent(orderid);
												var location_url = window.location.href;
												var end_index = location_url.indexOf('gtgjwap');
												var url = window.location.href.substring(0, end_index) + "gtgjwap/app/grub/detail.html?from_build=1&params=" + str + "&orderid=" + orderid + (GNG.PENDING ? ("&pending=" + GNG.PENDING) : "");
												NativeAPI.invoke("createWebView", { "url": url }, function (e, d) { });
											} else {
												NativeAPI.invoke("alert", { "title": "提示", "message": rtn.hd.desc, "btn_text": "确定" }, function (err, data) { });
											}
										});
									},
									error: function (xhr, type, exception) {
										NativeAPI.invoke("loading", { "show": "0", "text": "" }, function (err, data) {
											NativeAPI.invoke("alert", { "title": "提示", "message": "网络请求出现问题", "btn_text": "确定" }, function (err, data) { });
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
	GNG.Order.Cancel = function (orderid) {
		if (!orderid) {
			NativeAPI.invoke("alert", { "title": "提示", "message": "订单号为空，请返回列表查看", "btn_text": "确定" }, function (err, data) {
			});
			return;
		}
		NativeAPI.invoke("loading", { "show": "1", "text": "正在取消..." }, function (err, data) {
			if (data.value) {
				// 获取uid, 
				NativeAPI.invoke("getUserInfo", { "appName": "gtgj" }, function (err, data) {
					var uid = data.uid;
					var userid = data.userid;
					var ua = data.authcode;
					// uuid
					NativeAPI.invoke("getDeviceInfo", {}, function (err, data) {
						var uuid = data.uuid;
						var p = data.p;
						if (uid && uuid) {
							var sid_params = [];
							sid_params[0] = uid;
							sid_params[1] = uuid;
							sid_params[2] = orderid;
							NativeAPI.invoke("getSid", { "params": sid_params }, function (drr, data) {
								var sid = data.sid;
								var password = data.password;
								$.ajax({
									url: window.GTGJ.location + "qporder/cancelQpOrder.action",
									type: "POST",
									dataType: "json",
									data: {
										"pid": "2615",
										"uid": uid,
										"uuid": uuid,
										"userid": userid,
										"ua": ua,
										"sid": sid,
										"p": p,
										"oid": orderid,
										"refmt": "json"
									},
									success: function (data) {
										var rtn = data;
										NativeAPI.invoke("loading", { "show": "0", "text": "" }, function (err, data) {
											if (rtn.hd.code == '1') {
												NativeAPI.invoke("alert", { "title": "提示", "message": "取消成功", "btn_text": "确定" }, function (err, data) { });
											} else {
												NativeAPI.invoke("alert", { "title": "提示", "message": rtn.hd.desc, "btn_text": "确定" }, function (err, data) { });
											}
										});
									},
									error: function (xhr, type, exception) {
										NativeAPI.invoke("loading", { "show": "0", "text": "" }, function (err, data) {
											NativeAPI.invoke("alert", { "title": "提示", "message": "网络请求出现问题", "btn_text": "确定" }, function (err, data) { });
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
	GNG.Notify = {}
	GNG.Notify.Init = function () {
		NativeAPI.invoke("getUserInfo", { "appName": "gtgj" }, function (err, data) {
			if (data && data.phone) {
				$("#contact").html(data.phone);
			} else {
				NativeAPI.invoke("get12306UserInfo", { "appName": "gtgj" }, function (err, data) {
					if (data && data.phone) {
						$("#contact").html(data.phone);
					} else {
						$('#contact_select').addClass('clickable');
						$('#contact_select').bind('click', function () {
							NativeAPI.invoke("gtgjHandleBusiness", { "obj": "grub", "command": "contact_select", "input": { "phone": $("#contact").html() } }, function (err, data) {
								$("#contact").html(data.value);
							});
						});
					}
				});
			}
		});
	}
	$("#passengers_hidden").delegate("div[class='clickable_passenger']", "click", function () {
		var passenger_type_name = $(this).find("font[name='passenger_type']")[0];
		var seat_type_name = $(this).find("font[class='passenger_seat_type']")[0];
		var seat_price = $(this).find("font[class='passenger_seat_price']")[0];
		var passengerkey = $(this).find("input[name='passengerkey']")[0];
		var params = {};
		params['passenger_type_name'] = $(passenger_type_name).html();
		params['seat_type_name'] = $(seat_type_name).html();
		params['passengerkey'] = $(passengerkey).val();
		params['yp_info'] = GNG.Const.yp_info;
		NativeAPI.invoke("gtgjHandleBusiness", { "obj": "grub", "command": "passenger_modify", "input": params }, function (err, data) {
			$(passenger_type_name).html(data.passenger_type_name);
			$(seat_price).html("￥" + GNG.Const.seat_n2p_map[data.seat_type_name]);
			$(seat_type_name).html(data.seat_type_name);
			if (data.passenger_type_name == "成人票") {
				$(passenger_type_name).removeClass("not_adult_type");
			} else {
				$(passenger_type_name).addClass("not_adult_type");
			}
			var key = data.passengerkey.split(",");
			if (key.length == 4) {
				key[1] = GNG.Const.pt_n2c[data.passenger_type_name];
				$(passengerkey).val(key.join(","));
			}
			GNG.calc_price();
		});

	});
	$('#submit').bind('click', GNG.Order.SubmitCurrent);

	$('#add_passenger').bind('click', GNG.Passenger.Select);
	$("#add_modify_passenger").bind('click', GNG.Passenger.Select);
	$('#stoptime_select').bind('click', GNG.Time.Select);
	$('#add_child_passenger').bind('click', function () {
		var ps = $("#passengers_hidden").find("div[class='clickable_passenger']");
		if (ps.length == 0) {
			alert("儿童不能单独旅行");
		} else if (ps.length == 1) {
			var pk = $($(ps[0]).find("input[name='passengerkey']")[0]).val().split(",");
			pk[1] = "2";
			var child = {};
			child.passenger_name = pk[0];
			child.passenger_type = "2";
			child.passenger_id_no = pk[3];
			child.passengerkey = pk.join(",");
			child.seat_type_name = $($(ps[0]).find("font[class='passenger_seat_type']")[0]).html();
			GNG.Passenger.add(child);
			GNG.calc_price();
		} else if (ps.length >= 5) {
			NativeAPI.invoke("alert", { "title": "提示", "message": "最多选择5个乘车人", "btn_text": "确定" }, function (err, data) { });
		} else {
			var selections = [];
			var seats = [];
			var positions = [];
			var j = 0;
			$.each(ps, function (i, p) {
				var key = $($(p).find("input[name='passengerkey']")[0]).val().split(",");
				if (key[1] != 2) {
					selections[j] = "使用[" + key[0] + "]的证件";
					seats[j] = $($(p).find("font[class='passenger_seat_type']")[0]).html();
					positions[j++] = i;
				}
			});
			NativeAPI.invoke("select", { "title": "使用成人证件一起买儿童票，请选择", "selections": selections }, function (err, data) {
				if (data.value > -1) {
					var pk = $($(ps[positions[data.value]]).find("input[name='passengerkey']")[0]).val().split(",");
					pk[1] = "2";
					var child = {};
					child.passenger_name = pk[0];
					child.passenger_type = "2";
					child.passenger_id_no = pk[3];
					child.passengerkey = pk.join(",");
					child.seat_type_name = $($(ps[positions[data.value]]).find("font[class='passenger_seat_type']")[0]).html();
					GNG.Passenger.add(child);
					GNG.calc_price();
				}
			});
		}
	});
	GNG.no_seat = false;
	$("#no_seat").bind('click', function () {
		if (GNG.no_seat) {
			$("#no_seat").removeClass('item_selected');
			$("#no_seat").addClass('item_unselected');
			GNG.no_seat = false;
		} else {
			$("#no_seat").removeClass('item_unselected');
			$("#no_seat").addClass('item_selected');
			GNG.no_seat = true;
		}
	});
	GNG.MultiTrain = {};
	GNG.MultiTrain.Enable = false;
	GNG.MultiTrain.Data = undefined;
	GNG.MultiTrain.Init = function () {
		$("#multi_train_date").html(new Date(Date.parse(GNG.ReqParam.train_date)).pattern('M月d日 EEE'));
		$("#single_train").bind('click', function () { GNG.MultiTrain.ChangeMode(false) });
		$("#multi_train").bind('click', function () { GNG.MultiTrain.ChangeMode(true) });
	}
	GNG.MultiTrain.ChangeMode = function (multi) {
		if (multi) {
			GNG.MultiTrain.BuildData();
			GNG.MultiTrain.Enable = true;
		} else {
			GNG.MultiTrain.Enable = false;
		}
	}
	GNG.IsGDC = function (trainno) {
		var head = trainno.substring(0, 1);
		return ('G' == head || 'D' == head || 'C' == head || 'g' == head || 'd' == head || 'c' == head) ? 1 : 0;
	}
	GNG.MultiTrain.BuildData = function () {
		if (GNG.MultiTrain.Data) {
			//NativeAPI.invoke("storage",{action:"set",key:"gtgj_grub_trains",value:JSON.stringify(GNG.MultiTrain.Data)},function(err,data){});
			NativeAPI.invoke('createWebView', { url: window.location.href.substring(0, window.location.href.indexOf('gtgjwap')) + "gtgjwap/app/grub/train_selector.html" });
			return;
		}
		NativeAPI.invoke("loading", { "show": "1", "text": "正在搜索同区间车次..." }, function (err, data) {
			NativeAPI.invoke("gtgjExecuteTask", { "action": "query_tickets", "server": "tt", "waitenable": false, "input": { "queryTrainDate": GNG.ReqParam.train_date, "queryFromStationCode": GNG.ReqParam.depart_code, "queryToStationCode": GNG.ReqParam.arrive_code } }, function (err, data) {

				$.each(data.ticketArray, function (i, m) {
					if (GNG.ReqParam.depart_code != m.departstcode || GNG.ReqParam.arrive_code != m.arrivestcode) {
						// 出发到达不等 continue
						return true;
					}
					if (GNG.ReqParam.train_no == m.trainno || GNG.IsGDC(GNG.ReqParam.train_no) != GNG.IsGDC(m.trainno)) {
						// 车类型不等 continue
						return true;
					}
					if (m.traveltime == "99:59") {
						return true;
					}

					var train = {};
					train.trainno = m.trainno;
					train.departtime = m.departtime;
					train.arrivetime = m.arrivetime;
					train.departname = m.departstation;
					train.arrivename = m.arrivestation;
					train.departimage = m.departimage;
					train.arriveimage = m.arriveimage;
					train.traveltime = m.traveltime;
					train.check = false;
					train.ypinfo = proccessYpInfo2(m.yp_info);
					var found = false;
					$.each(train.ypinfo, function (q, model) {
						train.seat_c2p_map = train.seat_c2p_map || {};
						train.seat_c2p_map['s_' + model.name] = (model.price);
						if (model.name == GNG.ReqParam["cu"]) {
							train.name = model.name;
							train.price = model.price;
							train.remain = model.remain;
							found = true;
						}
					});

					if (found) {
						GNG.MultiTrain.Data = GNG.MultiTrain.Data || [];
						GNG.MultiTrain.Data[GNG.MultiTrain.Data.length] = train;
					}
				});
				NativeAPI.invoke("storage", { action: "set", key: "gtgj_grub_trains", value: JSON.stringify(GNG.MultiTrain.Data) }, function (err, data) { });
				NativeAPI.invoke("loading", { "show": "0", "text": "" }, function (err, data) { });
				NativeAPI.invoke('createWebView', { url: window.location.href.substring(0, window.location.href.indexOf('gtgjwap')) + "gtgjwap/app/grub/train_selector.html" });
			});
		});
	}
	GNG.init();
	GNG.VerifyPhone = function (isLogin) {
		if (isLogin != "1") {
			NativeAPI.invoke("login12306", {}, function (err, data) {
				if (data.value == data.SUCC) {
					GNG.VerifyPhone("1");
				}
			});
			return;
		}
		NativeAPI.invoke("gtgjCheckConfig", {
			name: "verify_phone",
			waitenable: true,
			waitdesc: "初始化，请稍后..."
		}, function (err, data) {
			if (err != null) {
				AlertMessage(err.message);
				return;
			}
			NativeAPI.invoke('createWebView', { url: "http://jt.rsscc.com/gtgjwap/app/phoneVerify/index.html" });
		}
		);
	}
	// 	初始化保险
	GNG.Insurance = {};
	GNG.Insurance.Init = function () {
		NativeAPI.invoke("getUserInfo", { "appName": "gtgj" }, function (err, data) {
			var uid = data.uid;
			var userid = data.userid;
			var ua = data.authcode;
			// uuid
			NativeAPI.invoke("getDeviceInfo", {}, function (err, data) {
				var uuid = data.uuid;
				var p = data.p;
				if (uid && uuid) {
					var sid_params = [];
					sid_params[0] = uid;
					sid_params[1] = uuid;
					NativeAPI.invoke("getSid", { "params": sid_params }, function (drr, data) {
						var sid = data.sid;
						var password = data.password;
						$.ajax({
							url: window.GTGJ.location + "offline/insuranceList.action",
							type: "POST",
							dataType: "json",
							data: {
								"pid": "2178",
								"uid": uid,
								"uuid": uuid,
								"userid": userid,
								"ua": ua,
								"sid": sid,
								"p": p,
								"source": "3",
								"ypinfo": GNG.ReqParam.yp_info,
								"refmt": "json"
							},
							success: function (data) {
								if (data && data.bd && data.bd.ins) {
									window.insurances = data.bd.ins;
									// 金额100一下默认不购买保险
									/*
																		if(parseFloat(GNG.Const.seat_n2p_map[GNG.Const.current_seat_name]) < 100){
																			var __ins = [];
																			$.each(window.insurances, function(i, _ins){
																				if(_ins.id == 0){
																					_ins.df=1;
																				}else{
																					_ins.df=0;
																				}
																				__ins[i] = _ins;
																			});
																			window.insurances = __ins;
																		}
									*/

									NativeAPI.invoke("storage", { action: "set", key: "gtgj_insurance", value: JSON.stringify(window.insurances) }, function (err, data) { });
									//GNG.Insurance.Setup();
									$("#insurance_area").bind("click", function () {
										var location_url = window.location.href;
										var end_index = location_url.indexOf('gtgjwap');
										var url = window.location.href.substring(0, end_index) + "gtgjwap/app/grub/insurance.html";
										NativeAPI.invoke("createWebView", { "url": url }, function (e, d) { });
									});
								}
							}
						});
					});
				}
			});
		});
	}
	// 设置/更新页面上保险信息
	GNG.Insurance.Setup = function () {
		var selected = GNG.Insurance.getSelected();
		if (selected) {
			if (parseFloat(selected.p) > 0) {
				var ps = GNG.Passenger.GetPassengersForBook();
				if (ps && ps.length > 0) {
					// 儿童票不卖保险
					var count = 0;
					$.each(ps, function (ii, p) {
						var pp = p.split(",")
						if (pp && pp[1] && parseInt(pp[1]) != 2 && pp[2] == '1') {
							count++;
						}
					});
					$("#ins_detail").html(selected.title + " <span style='color: #FF9000'> ￥" + selected.p + " x " + count + "</span>");
				} else {
					var s = selected.title + " <span style='color: #FF9000'> ￥" + selected.p + "</span>";
					$("#ins_detail").html(s);
				}
			} else {
				$("#ins_detail").html(selected.title);
			}
			$("#ins_area").css("display", "");
		} else {
			$("#ins_area").css("display", "none");
		}
	}
	// 获取保险总价
	GNG.Insurance.GetAmount = function () {
		var ins_price = 0;
		var selected = GNG.Insurance.getSelected();
		if (selected && parseFloat(selected.p) > 0) {
			var ps = GNG.Passenger.GetPassengersForBook();
			// 儿童票不卖保险
			var count = 0;
			$.each(ps, function (ii, p) {
				var pp = p.split(",")
				if (pp && pp[1] && parseInt(pp[1]) != 2 && pp[2] == '1') {
					count++;
				}
			});
			ins_price = count * parseFloat(selected.p);
		}
		return ins_price;
	}
	// 获取选择的保险
	GNG.Insurance.getSelected = function () {
		var selected = undefined;
		if (window.insurances && window.insurances.length > 0) {
			$.each(window.insurances, function (i, ins) {
				if (ins && ins.df == "1") {
					selected = ins;
					return false;
				}
			});
		}
		return selected;
	}
	// 获取保险字符串
	GNG.Insurance.GetForBook = function () {
		var rtn = [];
		var selected = GNG.Insurance.getSelected();
		var ps = GNG.Passenger.GetPassengersForBook();
		// 儿童票不卖保险
		var i = 0;
		$.each(ps, function (ii, p) {
			var _ins = [];
			if (selected) {
				var id = selected.id;
				NativeAPI.invoke("getDeviceInfo", {}, function (err, data) {
					if (data && data.p && data.p.indexOf('BCTCL') > -1) {
						id = '0';
					}
				});
				var pp = p.split(",")
				_ins[0] = parseInt(pp[1]) == 2 || pp[2] != '1' ? "0" : id;
				_ins[1] = parseInt(pp[1]) == 2 || pp[2] != '1' ? "0" : selected.p;
			} else {
				_ins[0] = "0";
				_ins[1] = "0";
			}
			rtn[i++] = _ins.join(",");
		});
		return rtn;
	}
	GNG.Insurance.Init();
	$("#money_detail").on("click", function () {
		if (window.hasMask) {
			window.hasMask = undefined;
			$(".Mask").hide();
			$("#detail_box").hide();
			$("#money_detail").addClass("arrow_up");
			$("#money_detail").removeClass("arrow_down");
		} else {
			window.hasMask = 1;
			$(".Mask").show();
			$("#detail_box").show();
			$("#money_detail").addClass("arrow_down");
			$("#money_detail").removeClass("arrow_up");
		}

	});
	GNG.Coupon.init = function () {
		NativeAPI.invoke("getUserInfo", { "appName": "gtgj" }, function (err, data) {
			var uid = data.uid;
			var userid = data.userid;
			var ua = data.authcode;
			NativeAPI.invoke("getDeviceInfo", {}, function (err, data) {
				var uuid = data.uuid;
				var p = data.p;
				if (uid && uuid) {
					var sid_params = [];
					sid_params[0] = uid;
					sid_params[1] = uuid;
					sid_params[2] = GNG.Const.coupon_ids;
					NativeAPI.invoke("getSid", { "params": sid_params }, function (drr, data) {
						var sid = data.sid;
						var password = data.password;
						$.ajax({
							url: window.GTGJ.location_1 + "coupon/queryReturnCouponsByMultyType.action",
							type: "POST",
							dataType: "json",
							data: {
								"pid": "2452",
								"uid": uid,
								"uuid": uuid,
								"userid": userid,
								"ua": ua,
								"sid": sid,
								"p": p,
								"type": GNG.Const.coupon_ids,
								"refmt": "json"
							},
							success: function (data) {
								if (data && data.bd && data.bd.cps && data.bd.cps.length > 0) {
									window.coupons = data.bd.cps;
									$("#coupon_use").html("您有" + data.bd.cps.length + "个红包");
									$("#coupon_area").removeClass('hidden');
									$("#coupon_area_clicker").bind('click', function () {
										NativeAPI.invoke("storage", { action: "set", key: "gtgj_coupons", value: JSON.stringify(data.bd.cps) }, function (err, data) {
											var location_url = window.location.href;
											var end_index = location_url.indexOf('gtgjwap');
											var url = window.location.href.substring(0, end_index) + "gtgjwap/app/grub/coupon.html";
											NativeAPI.invoke("createWebView", { "url": url }, function (e, d) { });
										});
									});
								}
							},
							waitTime: 30000
						});
					});
				}
			});
		});
	}
	GNG.Coupon.init();
	NativeAPI.registerHandler("back", function (err, data) {
		if (window.hasMask) {
			window.hasMask = undefined;
			$(".Mask").hide();
			$("#detail_box").hide();
			$("#money_detail").addClass("arrow_up");
			$("#money_detail").removeClass("arrow_down");
			data(null, { "preventDefault": "true" });
		} else {
			data(null, { "preventDefault": "false" });
		}
	});
	$(".Mask").on("click", function () {
		if (window.hasMask) {
			window.hasMask = undefined;
			$(".Mask").hide();
			$("#detail_box").hide();
			$("#money_detail").addClass("arrow_up");
			$("#money_detail").removeClass("arrow_down");
		}
	});
	NativeAPI.registerHandler("resume", function (err, data) {
		NativeAPI.invoke("storage", { action: "get", key: "gtgj_insurance" }, function (err, data) {
			if (data && data.value && data.value.length > 0) {
				window.insurances = JSON.parse(data.value);
				GNG.calc_price();
			}
		});
		NativeAPI.invoke("storage", { action: "get", key: "gtgj_grub_trains" }, function (err, data) {
			if (data && data.value && data.value.length > 0) {
				GNG.MultiTrain.Data = JSON.parse(data.value);
				GNG.calc_price();
			}
		});
		NativeAPI.invoke("storage", { action: "get", key: "gtgj_coupon_id" }, function (err, data) {
			if (window.coupons && data) {
				if (data.value) {
					var i = 0, l = window.coupons.length;
					for (; i < l; i++) {
						var model = window.coupons[i];
						if (model.id == data.value) {
							found = "1";
							window.couponid = data.value;
							$("#coupon_use").html("已使用红包");
						}
					}
				} else {// 取消使用了
					window.couponid = data.value;
					$("#coupon_use").html("您有" + window.coupons.length + "个红包");
				}
			}
		});
	});
});