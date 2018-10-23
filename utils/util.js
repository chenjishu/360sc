var app = getApp()
var timestamp;//判断重复点击的时间戳
function httpRequest(url, data, method) {
	return new Promise(function (resolve, reject) {
		wx.request({
			url: url,
			method: method,
			data: data,
			header: {
				//'Content-Type': 'application/json'
			},
			success: function (res) {
				console.log("success")
				resolve(res)
			},
			fail: function (res) {
				reject(res)
				console.log("failed")
			}
		})
	})
}

//判断是否为重复点击
function isRepeatClick() {
	var currentTime = (new Date()).valueOf();
	if (currentTime - this.timestamp < 500) {//点击时间差小于500毫秒时视为重复点击
		this.timestamp = currentTime;
		return true
	} else {
		this.timestamp = currentTime;
		return false
	}
}
const _ = require('underscore')
const $ = {};

console.log();

/**
 * 日期相关工具
 * @type {{format}}
 */
$.timeUtil = (function ($) {
	"use strict";
	return {
		/**
		 * 格式化日期
		 * @param {Number|Date} time
		 * @param {string} fmt
		 * @return {string}
		 */
		format: function (fmt, time) {
			time = time || new Date();
			time = time instanceof Date ? time : new Date(time);
			const o = {
				"M+": time.getMonth() + 1,                 //月份
				"d+": time.getDate(),                    //日
				"h+": time.getHours(),                   //小时
				"m+": time.getMinutes(),                 //分
				"s+": time.getSeconds(),                 //秒
				"q+": Math.floor((time.getMonth() + 3) / 3), //季度
				"S": time.getMilliseconds()             //毫秒
			};
			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for (const k in o) {
				if (new RegExp("(" + k + ")").test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return fmt;
		},
		/**
		 * 快速格式化日期
		 * @param {Number|Date} [time]
		 * @param {boolean} [isShowSeconds]
		 */
		formatDatetime: function (time, isShowSeconds) {
			isShowSeconds = isShowSeconds || false;
			return this.format("yyyy-MM-dd hh:mm" + (isShowSeconds ? ":ss" : ""), time || new Date());
		},
		/**
		 * 只格式化日期部分
		 * @param {Number|Date} [time]
		 */
		formatDate: function (time) {
			return this.format("yyyy-MM-dd", time || new Date());
		},
		/**
		 * 只格式化时间部分
		 * @param {Number|Date} [time]
		 * @param {boolean} [isShowSeconds]
		 */
		formatTime: function (time, isShowSeconds) {
			isShowSeconds = isShowSeconds || false;
			return this.format("hh:mm" + (isShowSeconds ? ":ss" : ""), time || new Date());
		}
	};
})($);

/**
 * 触发管理器
 * @type {{addEventListener, removeEventListener, fireListener}}
 */
$.listener = (function ($) {
	"use strict";
	//触发器总集合
	const LISTENER_MANAGER = [];
	return {
		/**
		 * 添加监听器
		 * @param {string} name
		 * @param {callback} listener
		 */
		addEventListener: function (name, listener) {
			if (!name || !isNaN(parseInt(name)))
				throw TypeError("监听器名称只能为英文字母以及下划线！");
			if (!_.isFunction(listener))
				throw TypeError("监听器只能为回调函数！");

			//判断当前监听器是否存在，不存在则直接创建一个空数组
			if (LISTENER_MANAGER[name] === undefined)
				LISTENER_MANAGER[name] = [];

			LISTENER_MANAGER[name].push(listener);
		},
		/**
		 * 移除监听器
		 * @param {string} name
		 * @param {callback} listener
		 */
		removeEventListener: function (listener, name) {
			//如果传递的不是一个回调函数，则直接返回
			if (!_.isFunction(listener)) return;

			//处理器
			const handler = function (listeners, listener) {
				const index = _.indexOf(listeners, listener);
				if (index !== -1)
					listeners.splice(index, 1);
			};
			if (!name || !isNaN(parseInt(name))) {
				//所有监听器都移除这个回调函数
				_.each(LISTENER_MANAGER, function (listeners) {
					handler(listeners, listener);
				});
			} else {
				handler(LISTENER_MANAGER[name] || [], listener);
			}
		},
		/**
		 * 触发监听器
		 * @param {string} name
		 * @param {Array} [param]
		 * @param {Object} [obj]
		 */
		fireListener: function (name, param, obj) {
			if (!name || !isNaN(parseInt(name)))
				throw TypeError("监听器名称只能为英文字母以及下划线！");

			const listeners = LISTENER_MANAGER[name] || [];
			for (let i = 0; i < listeners.length; i++)
				if (listeners[i].apply(obj, param) === false)
					return false;
		}
	};
})($);
_.extend($, $.listener);

/**
 * 日志管理
 * @type {{write, read, clear}}
 * @param {root} $
 */
$.log = (function ($) {
	"use strict";
	return {
		/**
		 * 写入一条日志
		 * @param {string} body
		 * @param {boolean} [isError]
		 */
		write: function (body, isError) {
			//调用API从本地缓存中获取数据
			let logs = wx.getStorageSync('logs') || [];

			//创建一条记录
			let item = {
				datetime: $.timeUtil.formatDatetime(new Date(), true),
				content: body,
				isError: isError || false
			};
			logs.unshift(item);

			//只缓存最近1000条记录
			if (logs.length > 1000)
				logs.splice(1000, 1);

			//缓存数据
			wx.setStorageSync('logs', logs);
			//触发事件
			$.listener.fireListener('log.push', [item]);
		},
		/**
		 * 读取日志
		 * @returns {Array}
		 */
		read: function () {
			return (wx.getStorageSync('logs') || []);
		},
		/**
		 * 清除日志
		 */
		clear: function () {
			wx.setStorageSync('logs', []);
		},

	}
})($);

module.exports = $;
module.exports.httpRequest = httpRequest;
module.exports.isRepeatClick = isRepeatClick;





