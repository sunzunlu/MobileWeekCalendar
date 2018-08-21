/**
 * 作者: 孙尊路
 * 创建时间: 2017-07-14 13:26:47
 * 版本: [1.0, 2017/7/14]
 * 版权: 江苏国泰新点软件有限公司
 * 说明： 常用工具js
 */
window.innerWeekUtil = window.innerWeekUtil || (function (exports) {

    /**
     * 产生一个 唯一uuid，默认为32位的随机字符串，8-4-4-4-12 格式
     * @param {Object} options 配置参数
     * len 默认为32位，最大不能超过36，最小不能小于4
     * radix 随机的基数，如果小于等于10代表只用纯数字，最大为62，最小为2，默认为62
     * type 类别，默认为default代表 8-4-4-4-12的模式，如果为 noline代表不会有连线
     * @return {String} 返回一个随机性的唯一uuid
     */
    exports.uuid = function (options) {
        options = options || {};

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
            uuid = [],
            i;
        var radix = options.radix || chars.length;
        var len = options.len || 32;
        var type = options.type || 'default';

        len = Math.min(len, 36);
        len = Math.max(len, 4);
        radix = Math.min(radix, 62);
        radix = Math.max(radix, 2);

        if(len) {
            for(i = 0; i < len; i++) {
                uuid[i] = chars[0 | Math.random() * radix];
            }

            if(type === 'default') {
                len > 23 && (uuid[23] = '-');
                len > 18 && (uuid[18] = '-');
                len > 13 && (uuid[13] = '-');
                len > 8 && (uuid[8] = '-');
            }
        }

        return uuid.join('');
    };

    var class2type = {};

    exports.noop = function () {};

    exports.isFunction = function (value) {
        return exports.type(value) === 'function';
    };
    exports.isPlainObject = function (obj) {
        return exports.isObject(obj) && !exports.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
    };
    exports.isArray = Array.isArray ||
        function (object) {
            return object instanceof Array;
        };

    /**
     * isWindow(需考虑obj为undefined的情况)
     * @param {Object} obj 需要判断的对象
     * @return {Boolean} 返回true或false
     */
    exports.isWindow = function (obj) {
        return obj && obj === window;
    };
    exports.isObject = function (obj) {
        return exports.type(obj) === 'object';
    };
    exports.type = function (obj) {
        return(obj === null || obj === undefined) ? String(obj) : class2type[{}.toString.call(obj)] || 'object';
    };
    /**
     * each遍历操作
     * @param {Object} elements 元素
     * @param {Function} callback 回调
     * @param {Function} hasOwnProperty 过滤函数
     * @returns {global} 返回调用的上下文
     */
    exports.each = function (elements, callback, hasOwnProperty) {
        if(!elements) {
            return this;
        }
        if(typeof elements.length === 'number') {
            [].every.call(elements, function (el, idx) {
                return callback.call(el, idx, el) !== false;
            });
        } else {
            for(var key in elements) {
                if(hasOwnProperty) {
                    if(elements.hasOwnProperty(key)) {
                        if(callback.call(elements[key], key, elements[key]) === false) {
                            return elements;
                        }
                    }
                } else {
                    if(callback.call(elements[key], key, elements[key]) === false) {
                        return elements;
                    }
                }
            }
        }

        return this;
    };

    /**
     * extend 合并多个对象，可以递归合并
     * @param {type} deep 是否递归合并
     * @param {type} target 最终返回的就是target
     * @param {type} source 从左到又，优先级依次提高，最右侧的是最后覆盖的
     * @returns {Object} 最终的合并对象
     */
    exports.extend = function () {
        var args = [].slice.call(arguments);

        // 目标
        var target = args[0] || {},
            // 默认source从1开始
            index = 1,
            len = args.length,
            // 默认非深复制
            deep = false;

        if(typeof target === 'boolean') {
            // 如果开启了深复制
            deep = target;
            target = args[index] || {};
            index++;
        }

        if(!exports.isObject(target)) {
            // 确保拓展的一定是object
            target = {};
        }

        for(; index < len; index++) {
            // source的拓展
            var source = args[index];

            if(source && exports.isObject(source)) {
                for(var name in source) {
                    if(!Object.prototype.hasOwnProperty.call(source, name)) {
                        // 防止原型上的数据
                        continue;
                    }

                    var src = target[name];
                    var copy = source[name];
                    var clone,
                        copyIsArray;

                    if(target === copy) {
                        // 防止环形引用
                        continue;
                    }

                    // 这里必须用isPlainObject,只有同样是普通的object才会复制继承，如果是FormData之流的，会走后面的覆盖路线
                    if(deep && copy && (exports.isPlainObject(copy) || (copyIsArray = exports.isArray(copy)))) {
                        if(copyIsArray) {
                            copyIsArray = false;
                            clone = src && exports.isArray(src) ? src : [];
                        } else {
                            clone = src && exports.isPlainObject(src) ? src : {};
                        }

                        target[name] = exports.extend(deep, clone, copy);
                    } else if(copy !== undefined) {
                        // 如果不是普通的object，直接覆盖，例如FormData之类的会覆盖
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    exports.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function (i, name) {
        class2type['[object ' + name + ']'] = name.toLowerCase();
    });

    /**
     * 选择这段代码用到的太多了，因此抽取封装出来
     * @param {Object} element dom元素或者selector
     * @return {HTMLElement} 返回对应的dom
     */
    exports.selector = function (element) {
        if(typeof element === 'string') {
            element = document.querySelector(element);
        }

        return element;
    };

    /**
     * 设置一个Util对象下的命名空间
     * @param {String} namespace 命名空间
     * @param {Object} obj 需要赋值的目标对象
     * @return {Object} 返回目标对象
     */
    exports.namespace = function (namespace, obj) {
        var parent = window.Util;

        if(!namespace) {
            return parent;
        }

        var namespaceArr = namespace.split('.'),
            len = namespaceArr.length;

        for(var i = 0; i < len - 1; i++) {
            var tmp = namespaceArr[i];

            // 不存在的话要重新创建对象
            parent[tmp] = parent[tmp] || {};
            // parent要向下一级
            parent = parent[tmp];
        }
        parent[namespaceArr[len - 1]] = obj;

        return parent[namespaceArr[len - 1]];
    };

    /**
     * 获取这个模块下对应命名空间的对象
     * 如果不存在，则返回null，这个api只要是供内部获取接口数据时调用
     * @param {Object} module 模块
     * @param {Array} namespace 命名空间
     * @return {Object} 返回目标对象
     */
    exports.getNameSpaceObj = function (module, namespace) {
        if(!namespace) {
            return null;
        }
        var namespaceArr = namespace.split('.'),
            len = namespaceArr.length;

        for(var i = 0; i < len; i++) {
            module && (module = module[namespaceArr[i]]);
        }

        return module;
    };

    /**
     * 将string字符串转为html对象,默认创一个div填充
     * 因为很常用，所以单独提取出来了
     * @param {String} strHtml 目标字符串
     * @return {HTMLElement} 返回处理好后的html对象,如果字符串非法,返回null
     */
    exports.parseHtml = function (strHtml) {
        if(!strHtml || typeof (strHtml) !== 'string') {
            return null;
        }
        // 创一个灵活的div
        var i,
            a = document.createElement('div');
        var b = document.createDocumentFragment();

        a.innerHTML = strHtml;
        while((i = a.firstChild)) {
            b.appendChild(i);
        }

        return b;
    };

    /**
     * 图片的base64字符串转Blob
     * @param {String} urlData 完整的base64字符串
     * @return {Blob} 转换后的Blob对象，可用于表单文件上传
     */
    exports.base64ToBlob = function (urlData) {
        var arr = urlData.split(',');
        var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
        // 去掉url的头，并转化为byte
        var bytes = window.atob(arr[1]);
        // 处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
        var ia = new Uint8Array(ab);

        for(var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }

        return new Blob([ab], {
            type: mime
        });
    };

    /**
     * 通过传入key值,得到页面key的初始化传值
     * 实际情况是获取 window.location.href 中的参数的值
     * @param {String} key 键名
     * @return {String} 键值
     */
    exports.getExtraDataByKey = function (key) {
        if(!key) {
            return null;
        }
        // 获取url中的参数值
        var getUrlParamsValue = function (url, paramName) {
            var paraString = url.substring(url.indexOf('?') + 1, url.length).split('&');
            var paraObj = {};
            var i,
                j;

            for(i = 0;
                (j = paraString[i]); i++) {
                paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length);
            }
            var returnValue = paraObj[paramName.toLowerCase()];

            // 需要解码浏览器编码
            returnValue = decodeURIComponent(returnValue);
            if(typeof (returnValue) === 'undefined') {
                return undefined;
            } else {
                return returnValue;
            }
        };
        var value = getUrlParamsValue(window.location.href, key);

        if(value === 'undefined') {
            value = null;
        }

        return value;
    };

    // 避免提示警告
    var Console = console;

    exports.log = function () {
        // 方便后续控制
        Console.log.apply(this, arguments);
    };

    exports.warn = function () {
        Console.warn.apply(this, arguments);
    };

    exports.error = function () {
        Console.error.apply(this, arguments);
    };

    return exports;
})({});
/**
 * 作者: 孙尊路
 * 创建时间: 2017-07-14 13:26:47
 * 版本: [1.0, 2017/7/14]
 * 版权: 江苏国泰新点软件有限公司
 * 描述：周历组件
 * 说明： （可以使用，有时间去完善文档，如果有需求可以参考使用）
 */
(function () {
    "use strict";

    /**
     * 全局生效默认设置
     * 默认设置可以最大程度的减小调用时的代码
     */

    var noop = function () {
        return "";
    };
    var defaultOptions = {
        // 默认周历组件容器
        container: ".em-journal-pad",
        // 上一周元素
        pre: ".pre",
        // 下一周元素
        next: ".next",
        // 业务模板
        // template: noop,
        // 业务数据绑定
        dataRequest: function (cb) {
            return cb([]);
        },
        // 开启滑动时间，切换周历
        isSwipe: false,
        // 开启调试
        isDebug: true
    };

    function CalendarWeek(options) {
        options = innerWeekUtil.extend({}, defaultOptions, options);
        this._initData(options);
        //绑定监听
        this._bindEvent();
    }

    CalendarWeek.prototype = {
        _initData: function (options) {
            var _self = this;
            _self.options = options;
            _self._initVar();
            _self.setDate(new Date());
        },

        /**
         * 初始化参数
         */
        _initVar: function () {
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
        tom: function (m) {
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
        tod: function (d) {
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
        addDate: function (date, n) {
            date.setDate(date.getDate() + n);
            return date;
        },
        /**
         * 刷新日期
         * @param {Object} date
         */
        setDate: function (date) {
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
            _self.currnetMonth = (date.getFullYear()) + "年" + (_self.tom(date.getMonth() + 1) + "月");
            for(var i = 0; i < 7; i++) {
                i == 0 ? date : _self.addDate(date, 1);
                tmpInfo.push({
                    week_frame: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()],
                    month_frame: _self.tom(date.getMonth() + 1),
                    day_frame: _self.tod(date.getDate()),
                    date_frame: date.getFullYear() + "-" + (_self.tom(date.getMonth() + 1)) + "-" + (_self.tod(date.getDate())),
                });
            }

            // 初始化成功执行一次
            _self.options.success && _self.options.success(_self.currnetMonth, {
                "from": tmpInfo[0].date_frame,
                "to": tmpInfo[6].date_frame
            });
            //渲染模板
            _self.render(tmpInfo);
        },
        render: function (tmpInfo) {
            var _self = this;
            _self.options.dataRequest(function (data) {
                var res = data || [];
                // console.log("请求的数据：" + JSON.stringify(res));
                //和业务绑定
                if(_self.options.isDebug) {
                    console.log("*********业务数据：********:\n" + JSON.stringify(res) + "\n");
                }
                for(var j = 0; j < res.length; j++) {
                    for(var i = 0; i < tmpInfo.length; i++) {
                        // 合并合并
                        if(i == j) {
                            tmpInfo[i] = innerWeekUtil.extend(res[i], tmpInfo[i])
                        }
                    }
                }
                var html = '';
                var template = "";
                // 头部
                html += '<div class="em-calendar-content week">';
                // console.log("最终结果：" + JSON.stringify(tmpInfo));
                innerWeekUtil.each(tmpInfo, function (key, value) {
                    // 不存在则默认周历
                    if(!_self.options.template) {
                        if(value.date_frame == _self.currentDate) {
                            template = '<li class="mui-table-view-cell em-active"date="{{date_frame}}"><a class="mui-navigate-right"><span class="week">{{week_frame}}</span><span class="day">{{month_frame}}月{{day_frame}}日</span><span class="status mui-hidden">零</span></a></li>';
                        } else {
                            template = '<li class="mui-table-view-cell"date="{{date_frame}}"><a class="mui-navigate-right"><span class="week">{{week_frame}}</span><span class="day">{{month_frame}}月{{day_frame}}日</span><span class="status mui-hidden">零</span></a></li>';

                        }
                    } else {
                        // console.log("=======自定义传入=======");
                        template = _self.options.template(value, _self.currentDate, key);

                    }
                    html += Mustache.render(template, value);
                });
                html += '</div>';
                document.querySelector(_self.options.container).innerHTML = html;

            }, _self, {
                "from": tmpInfo[0].date_frame,
                "to": tmpInfo[6].date_frame
            });
        },
        /**
         * 绑监听
         */
        _bindEvent: function () {
            var _self = this;
            var preEvent = _self.options.preEvent;
            var nextEvent = _self.options.nextEvent;
            var onItemClick = _self.options.onItemClick;

            // 上一周
            document.querySelector(_self.options.pre).addEventListener('tap', function () {
                _self.slidePrev().then(function (currnetMonth) {
                    preEvent && preEvent(currnetMonth);
                });
            });

            // 下一周
            document.querySelector(_self.options.next).addEventListener('tap', function () {
                _self.slideNext().then(function (currnetMonth) {
                    nextEvent && nextEvent(currnetMonth);
                });
            });

            // 每项点击事件
            mui(".em-journal-pad").on('tap', 'li', function () {
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
        refresh: function () {
            var _this = this;
            _this.setDate(new Date());
        },
        /**
         * 上一周
         */
        slidePrev: function () {
            var _self = this;
            return new Promise(function (resolve, reject) {
                _self.setDate(_self.addDate(_self.currentFirstDate, -7));
                return resolve(_self.currnetMonth);
            });
        },

        /**
         * 下一周
         */
        slideNext: function () {
            var _self = this;
            return new Promise(function (resolve, reject) {
                _self.setDate(_self.addDate(_self.currentFirstDate, 7));
                return resolve(_self.currnetMonth);
            });
        },
        /**
         * @description 该方法和Zepto("tap","selector",function(){})一样，都是遍历相同的dom元素并为之绑定监听事件
         * @param {Object} tap 点击事件
         * @param {Object} selector 选择器
         * @param {Object} itemClickCallback 点击回调  
         */
        addEventListener: function (tap, selector, itemClickCallback) {
            [].forEach.call(document.querySelectorAll(selector), function (item, index) {
                item.addEventListener(tap, function () {
                    var _this = this;
                    if(typeof (itemClickCallback) == "function" && itemClickCallback) {
                        itemClickCallback(item, index);
                    }
                });
            });
        },

    }

    window.CalendarWeek = CalendarWeek;
})();