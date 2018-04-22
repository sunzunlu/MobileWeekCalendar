/**
 * 作者: 孙尊路
 * 创建时间: 2017-07-14 13:26:47
 * 版本: [1.0, 2017/7/14]
 * 版权: 江苏国泰新点软件有限公司
 * 描述：周历组件
 * 说明： （可以使用，有时间去完善文档，如果有需求可以参考使用）
 */

(function() {
	"use strict";

	/**
	 * 全局生效默认设置
	 * 默认设置可以最大程度的减小调用时的代码
	 */
	var noop = function() {};
	var defaultOptions = {
		// 默认周历组件容器
		container: ".em-journal-pad",
		// 上一周元素
		pre: ".pre",
		// 下一周元素
		next: ".next",
		// 业务模板
		template: noop,
		// 业务数据绑定
		dataRequest: function(cb) {
			return cb([]);
		},
		// 开启滑动时间，切换周历
		isSwipe: false,
		// 开启调试
		isDebug: true
	};

	function CalendarWeek(options) {
		options = mui.extend({}, defaultOptions, options);
		this._initData(options);
		//绑定监听
		this._bindEvent();
	}

	CalendarWeek.prototype = {
		_initData: function(options) {
			var _self = this;
			_self.options = options;
			_self._initVar();
			_self.setDate(new Date());
		},

		/**
		 * 初始化参数
		 */
		_initVar: function() {
			var _self = this;
			_self.currentFirstDate = null;
			var dObj = new Date();
			var m = dObj.getMonth() + 1;
			var d = dObj.getDate();
			_self.currentDate = dObj.getFullYear() + "-" + (_self.tom(m)) + "-" + (_self.tod(d))
		},
		/**
		 * 将1,2,3,4,5格式化01,02,03,04,05
		 * @param {Object} m 月份转换
		 */
		tom: function(m) {
			if(parseInt(m) > 9) {
				m = "" + parseInt(m);
			} else {
				m = "0" + parseInt(m);
			}
			return m;
		},
		/**
		 * 将1,2,3,4,5格式化01,02,03,04,05
		 * @param {Object} 日转换
		 */
		tod: function(d) {
			if(parseInt(d) > 9) {
				d = "" + parseInt(d);
			} else {
				d = "0" + parseInt(d);
			}
			return d;
		},
		/**
		 * 日期计算
		 * @param {Object} date 日期
		 * @param {Object} n=7天
		 */
		addDate: function(date, n) {
			date.setDate(date.getDate() + n);
			return date;
		},
		/**
		 * 刷新日期
		 * @param {Object} date
		 */
		setDate: function(date) {
			var _self = this;
			var week = date.getDay();
			date = _self.addDate(date, week * -1);
			_self.currentFirstDate = new Date(date); //console.log(currentFirstDate);
			// console.log("注释：Date 对象自动使用当前的日期和时间作为其初始值。" + currentFirstDate);
			var tmpInfo = [];
			var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
			if(_self.options.isDebug) {
				console.log("计算周：" + (date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + date.getDate());
			}
			//_self.currnetMonth = (date.getFullYear()) + "-" + (_self.tom(date.getMonth() + 1) + "-" + _self.tom(date.getDate()));
			_self.currnetMonth = (date.getFullYear()) + "年" + (_self.tom(date.getMonth() + 1) + "月");
			document.querySelector('.mid span').innerText = _self.currnetMonth;
			// 初始化成功执行一次
			_self.options.success && _self.options.success(_self.currnetMonth);
			for(var i = 0; i < 7; i++) {
				i == 0 ? date : _self.addDate(date, 1);
				tmpInfo.push({
					week: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()],
					month: _self.tom(date.getMonth() + 1),
					day: _self.tod(date.getDate()),
					date: date.getFullYear() + "-" + (_self.tom(date.getMonth() + 1)) + "-" + (_self.tod(date.getDate())),
				});
			}
			//渲染模板
			_self.render(tmpInfo);
		},
		render: function(tmpInfo) {
			var _self = this;
			_self.options.dataRequest(function(data) {
				var res = data || [];
				//和业务绑定
				if(_self.options.isDebug) {
					console.log("*********业务数据：********:\n" + JSON.stringify(res) + "\n");
				}
				for(var j = 0; j < res.length; j++) {
					for(var i = 0; i < tmpInfo.length; i++) {
						if(res[j].date == tmpInfo[i].date) {
							tmpInfo[i].isSelected = "1";
						}
					}
				}
				var html = '';
					var template = "";
				// 头部
				html += '<div class="em-calendar-content week">';
				mui.each(tmpInfo, function(key, value) {
					var templData = _self.options.template(value, _self.currentDate, key);
					if(!templData) {
						if(value.date == _self.currentDate) {
							template = '<li class="mui-table-view-cell em-active"date="{{date}}"><a class="mui-navigate-right"><span class="week">{{week}}</span><span class="day">{{month}}月{{day}}日</span><span class="status mui-hidden">零</span></a></li>';
						} else {
							template = '<li class="mui-table-view-cell"date="{{date}}"><a class="mui-navigate-right"><span class="week">{{week}}</span><span class="day">{{month}}月{{day}}日</span><span class="status mui-hidden">零</span></a></li>';

						}
					} else {
						console.log("=======自定义传入=======");
					}
					html += Mustache.render(template, value);
				});
				html += '</div>';
				document.querySelector(_self.options.container).innerHTML = html;

			}, _self);
		},
		/**
		 * 绑监听
		 */
		_bindEvent: function() {
			var _self = this;
			var preEvent = _self.options.preEvent;
			var nextEvent = _self.options.nextEvent;
			var onItemClick = _self.options.onItemClick;

			// 上一周
			document.querySelector(_self.options.pre).addEventListener('tap', function() {
				_self.setDate(_self.addDate(_self.currentFirstDate, -7));
				preEvent && preEvent(_self.currnetMonth);
			});

			// 下一周
			document.querySelector(_self.options.next).addEventListener('tap', function() {
				_self.setDate(_self.addDate(_self.currentFirstDate, 7));
				preEvent && preEvent(_self.currnetMonth);
			});

			// 开启是否滑动
			if(_self.options.isSwipe) {
				// 开启日历组件右滑(上一周)
				document.querySelector(_self.options.container).addEventListener('swiperight', function() {
					_self.setDate(_self.addDate(_self.currentFirstDate, -7));
					preEvent && preEvent(_self.currnetMonth);

				});
				// 开启日历组件左滑(下一周)
				document.querySelector(_self.options.container).addEventListener('swipeleft', function() {
					_self.setDate(_self.addDate(_self.currentFirstDate, 7));
					preEvent && preEvent(_self.currnetMonth);

				});
			}

			// 每项点击事件
			mui(".em-journal-pad").on('tap', 'li', function() {
				var week = this.querySelector(".week").innerText.trim();
				var date = this.getAttribute("date");
				onItemClick && onItemClick.call(this, {
					week: week,
					date: date
				});
			});

		},
		/**
		 * 刷新周历方法，方便给外部引用
		 */
		refresh: function() {
			var _this = this;
			_this.setDate(new Date());
		}

	}

	window.CalendarWeek = CalendarWeek;
})();