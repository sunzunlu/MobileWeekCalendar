
# <font color="#F68736" face="微软雅黑">移动端H5周历组件</font>

文档维护者：`孙尊路 `

喜欢的话，记得`star` 一下噢！

## 适用场景

- 前些阵子，写了一篇[《日历组件实现》](https://github.com/sunzunlu/MobileCalendar)的使用在线文档，遇到一个需求：实现一个H5周历来填写每周的工作日志，去网上查阅资料，发现很多示例也没有一个标准的使用文档，感觉用起来也吃力，于是乎，自己造了一个`周历组件`，文章下面有很详细的使用说明。 `本篇结合了实际的项目应用需求整理出来的，该文档后面会持续优化更新。若有不足，也请大家多多指教，小编会及时更正！`


## 实例展示
![](http://app.epoint.com.cn/test/H5/epointmobileWiKi/assets/005/20180422-2b9f3f34.gif)  



- [周历示例演示，支持上一周、下一周切换等效果](http://ydyfcs.epoint.com.cn:8066/H5/Attaches/%E5%91%A8%E5%8E%86%E7%BB%84%E4%BB%B6/calendarweek_showcase/calendarweek_showcase.html) ` 注：按F12可在浏览器预览`

- 示例demo源代码(H5)：[点击此处进行下载](https://github.com/sunzunlu/MobileWeekCalendar)


## 典型项目应用案例

- 【移动OA类】 我的日志

## 依赖资源

- `libs/calendar_base_week.js` 周历组件基类js库，可以根据业务需求，任意个性化，从而达到设计视觉效果

## 配置和使用方法

__DOM结构__

一个`div`即可

```html
<div id="weekcalendar"></div>
```

__初始化__

以下代码是最简单的用法，更多复杂用法请参考`calendarweek_showcase`[源码下载](https://github.com/sunzunlu/MobileWeekCalendar)

```js
var weekcalendar = new CalendarWeek({
    // 默认周历组件容器
    "container": "#weekcalendar",
    // 点击日期事件
    "onItemClick": function(item) {
        console.log(item.date + " " + item.week);
    },
    isDebug: false
});
```

__参数说明__

| 参数 | 参数类型  | 说明  |
| :------------- |:-------------:|:-------------|
| container | string或HTMLElement | `必选` Calendar容器的css选择器，例如“#calendar”。默认为`#calendar` |
| pre |   string或HTMLElement  | `可选` 前一周按钮的css选择器或HTML元素。默认`.pre`  |
| next |  string或HTMLElement  | `可选`后一周按钮的css选择器或HTML元素。默认`.next`  |
| dataRequest | Function | `可选` 回调函数，绑定业务数据。例如：某天有日程，则会在对应日期上标识出一个小红点或者其他标识，默认传入数据格式：data=`[{"date":"2018-04-18"},{"date":"2018-04-17"},{"date":"2018-04-16"}]`  |
| onItemClick | Function | `必选` 回调函数，当你点击或轻触某日期 300ms后执行。回调日期结果：`2018-04-07` |
| template | Function或String | `可选`，元素渲染的模板，可以是一个模板字符串，也可以是一个函数，为函数时，确保返回模板字符串，默认组件内置模板 |
| type |  1或2  | `可选` 1代表从周一到周六，2代表从周日-周六。默认`1`  |
| isDebug | Boolean | `可选`是否开启调试模式，默认`false` |

# API

生成的`weekcalendar`对象可以调用如下API

```js
var weekcalendar = new CalendarWeek(...);
```

### refresh()

外部刷新方法，重洗渲染当前周的列表数据。

```js
weekcalendar.refresh();
```
### slidePrev()

`切换为上一周`，与组件内部传入参数`pre`作用一样，该API支持Promise异步成功回调里处理自己的业务逻辑。

```js
weekcalendar.slidePrev().then(...).then(...);
```

### slideNext()

`切换为下一周`，与组件内部传入参数`next`作用一样，该API支持Promise异步成功回调里处理自己的业务逻辑。

```js
weekcalendar.slideNext().then(...).then(...);
```

## 优点和好处
能够极大方便实际项目上开发人员的上手使用，而且版本是不断根据实际项目上的需求进行优化升级的，开放源码可以让特殊需求的项目开发人员进行修改、补充和完善。

## 存在的不足之处
目前依赖js库有多个（mustache.min.js、mui.min.js）主要是一些常用的移动端js库（无可厚非），包含组件的核心库，或许有人认为影响加载速度之类的，其实已经有很多项目在应用效果还可以，当然了小编也正在努力`剥离第三方js库`,思路已经有了，只不过需要一点时间进行代码重构，若在此之前给你带来的不便，还请多多包涵，毕竟`优化组件`确实需要花费大量时间的。
