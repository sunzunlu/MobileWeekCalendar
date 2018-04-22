
# <font color="#F68736" face="微软雅黑">移动周历组件</font>

文档维护者：`移动研发部-孙尊路 `

## 适用场景

- 前些阵子，写了一篇叫做[《日历组件实现》](https://github.com/sunzunlu/MobileCalendar)的文章，最近有个需求：要实现一个周历，用于填写每周的工作日志，去论坛查阅资料，发现很多示例也没有一个标准的使用文档，感觉用起来也吃力，于是乎，自己写了一个`周历组件`，里面有很详细的使用说明。 `本篇主要是带大家入门周历组件的使用，该文档后面会持续优化更新。若有不足，请大家多多指教，作者会及时更正！`


## 实例展示
![](assets/005/20180422-2b9f3f34.gif)  



- [周历示例演示，支持上一周、下一周切换等效果](http://app.epoint.com.cn/test/H5/Attaches/%E5%91%A8%E5%8E%86%E7%BB%84%E4%BB%B6/calendarweek_showcase/calendarweek_showcase.html) ` 注：按F12可在浏览器预览`

- 示例demo源代码(H5)：[点击此处进行下载](https://github.com/sunzunlu/MobileWeekCalendar)


## 典型项目应用案例

- 【移动OA类】 我的日志

## 依赖资源

- `libs/calendar_base_week.js` 周历组件基类js库

## 配置和使用方法

__DOM结构__

一个`div`即可

```html
<div id="weekcalendar"></div>
```

__初始化__

以下代码是最简单的用法，更多复杂用法请参考`calendarweek_showcase`[源码下载](https://github.com/sunzunlu/MobileWeekCalendar)

```js
var CalendarWeek = new CalendarWeek({
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
| isDebug | Boolean | `可选`是否开启调试模式，默认`false` |
