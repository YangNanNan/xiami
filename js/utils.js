/**
 * Created by Administrator on 2016/4/19.
 */
/*
 *
 * �ڹ����Ĺ����У�����������ܻ��߷�����Ҫ����head���������Ĺ����ļ�������n���˹�ͬ��д������Ҫ������
 *
 *
 * */
var utils = {
    listToArray: function (similarArray) {
        try {
            a = Array.prototype.slice.call(similarArray);
        } catch (e) {
            //alert("1");
            var a = [];
            for (var i = 0; i < similarArray.length; i++) {
                a[a.length] = similarArray[i]
            }
        }
        return a;
    },
    jsonParse: function (jsonStr) {//��json��ʽ�ַ���ת��Ϊ����
        return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")")
    },
    /**
     *
     * @param ele
     * @returns {{left: *, top: *}}
     */
    offset: function (ele) {//只要存在offsetParent我们就尝试把offsetParent的边框和它的offsetLeft加上，一直到body不存在offsetParent（body的offsetParent是null）为止。我们知道截止的条件，所有使用while循环
        var eleLeft = ele.offsetLeft;//当前元素的offsetLeft
        var eleTop = ele.offsetTop;//单签元素的offsetTop
        var eleParent = ele.offsetParent;
        var left = null;
        var top = null;
        left += eleLeft;
        top += eleTop;
        while (eleParent) {
            //console.log(eleParent);
            /*
             * ie8中会有一个问题如果在ie8中就不加父级的边框了。因为已经加过了
             * 判断我的当前浏览器是不是ie8  window.navigator.userAgent 1、可以用正则 text MSIE8.0 2、字符串中的indexof MSIE8.0
             * */
            if (window.navigator.userAgent.indexOf("MSIE 8.0") !== -1) {
                left += eleParent.offsetLeft;
                top += eleParent.offsetTop;
            } else {
                left += eleParent.clientLeft/*父级参照物的边框*/ + eleParent.offsetLeft;
                top += eleParent.clientTop/*父级参照物的边框*/ + eleParent.offsetTop;
            }
            eleParent = eleParent.offsetParent;
        }
        return {left: left, top: top};
    },
    /**
     * 获取浏览器窗口
     * @param attr
     * @param val
     * @returns {*}
     */
    getWin: function (attr, val) {//一个参数的时候是读取，两个参数可以赋值
        if (typeof val != "undefined") {
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    },
    /**
     *  获取某个元素的具体的某一个属性,并把获取到的带单位的值把单位去掉
     * @param curEle 获取指定元素
     * @param attr   指定元素的某种样式 (字符串)   //null参数是伪类
     * @returns {*} 返回指定某种元素某种样式的值
     */
    getCss: function (curEle, attr) {
        //处理带单位问题
        var reg = /^(-?\d+(\.\d+)?)(?:px|em|pt|deg|rem)$/;
        var val = null;
        if (/MSIE(?:6|7|8)/.test(window.navigator.userAgent)) {//判断是否为ie低版本浏览器
            if (attr === "opacity") {//处理filter的滤镜问题 filter:alpha(opacity=40);
                val = curEle.currentStyle["filter"];
                var reg1 = /^alpha\(opacity=(\d+(\.\d+)?)\)/;
                return reg1.test(val) ? RegExp.$1 / 100 : 1;
            }
            val = curEle.currentStyle[attr];
        } else {
            val = attr === "opacity" ? window.getComputedStyle(curEle, null)[attr] / 1 : window.getComputedStyle(curEle, null)[attr];//null参数是伪类
        }
        return reg.test(val) ? parseFloat(val) : val;//如果正则验证通过,说明返回值是带单位的,那么就要人为去掉这个单位,否则不变
    },
    /**
     *
     * @param ele 当前要设置的元素
     * @param attr 当前要设置的css属性
     * @param value 当前要设置的css属性值
     */
    setCss: function (ele, attr, value) {
        if (attr == "opacity") {
            if (window.navigator.userAgent.indexOf("MSIE") >= 0) {
                ele.style["filter"] = "alpha(opacity=" + value * 100 + ")";
            } else {
                ele.style.opacity = value;
            }
            return;
        }
        if (attr === "float") {
            ele.style["cssFloat"] = value;
            ele.style["styleFloat"] = value;
            return;
        }
        var reg = /^(width|height|left|top|right|bottom|(margin|padding)(Top|Bottom|Left|Right)?)$/;
        if (reg.test(attr)) {
            if (!isNaN(value)) {//给不带单位的加上单位
                value += "px";
            }
        }

        ele.style[attr] = value;
    },
    /**
     *
     * @param ele 要设置的元素
     * @param obj 要设置元素的样式属性对象
     */
    setGroupCss: function (ele, obj) {
        obj = obj || "0";
        if (obj.toString() != "[object Object]") {
            return;
        }
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                this.setCss(ele, key, obj[key]);
            }
        }
    }
};
