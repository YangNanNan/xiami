var DOM = (function () { //这个作用域不销毁
    var flag = "getComputedStyle" in window;
    return {
        /**
         *
         * @param likeArray
         * @returns {Array}
         */
        listToArray: function (likeArray) {
            var arr = [];
            try {
                arr = Array.prototype.slice.call(likeArray);
            } catch (e) {
                for (var i = 0; i < likeArray.length; i++) {
                    arr.push(likeArray[i]);
                }
            }
            return arr;
        },
        /**
         *
         * @param str
         * @returns {Object}
         */
        formatJSON: function (str) {
            return "JSON" in window ? JSON.parse(str) : eval('(' + str + ')');
        },
        /**
         *
         * @param attr
         * @param val
         * @returns {*}
         */
        win: function (attr, val) {
            if (typeof val == "undefined") {
                return document.documentElement[attr] || document.body[attr]
            }
            document.documentElement[attr] = val;
            document.body[attr] = val;
        },
        /**
         *
         * @param ele
         * @param attr
         * @returns {*}
         */
        getCss: function (ele, attr) {
            var val = '';
            var reg = '';
            if (flag) {
                val = getComputedStyle(ele, null)[attr];
            } else {
                if (attr == "opacity") {
                    val = ele.currentStyle["filter"];
                    reg = /^alpha\(opacity=(\d+(\.\d+)?)\)$/;
                    val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
                } else {
                    val = ele.currentStyle[attr];
                }
            }
            reg = /^-?\d+(\.\d+)?(px|pt|em|rem|%)?$/;
            return reg.test(val) ? parseFloat(val) : val;
        },
        /**
         *
         * @param ele
         * @returns {{top: (Number|number), left: (Number|number)}}
         */
        offset: function (ele) {
            var top = ele.offsetTop;
            var left = ele.offsetLeft;
            var p = ele.offsetParent;
            while (p) {
                if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
                    top += p.clientTop;
                    left += p.clientLeft;
                }
                top += p.offsetTop;
                left += p.offsetLeft;
                p = p.offsetParent;
            }
            return {
                top: top,
                left: left
            }
        },
        /**
         *
         * @param ele
         * @param tagName
         * @returns {Array}
         */
        children: function (ele, tagName) {
            var arr = [];
            if (flag) {
                arr = this.listToArray(ele.children);
            } else {
                //先拿到ele下所有儿子节点
                for (var i = 0; i < ele.childNodes.length; i++) {
                    var cur = ele.childNodes[i];//拿到当前节点
                    if (cur.nodeType == 1) {
                        arr[arr.length] = cur;
                    }
                }
            }
            if (typeof tagName == "string") {
                var newArr = [];
                for (var i = 0; i < arr.length; i++) {
                    var cur = arr[i];
                    if (cur.nodeName == tagName.toUpperCase()) {
                        newArr.push(cur);
                    }
                }
                arr = newArr;
            }
            return arr;
        },
        /**
         *
         * @param ele 要获得的上一个元素
         * @returns {Element}
         */
        prev: function (ele) {
            if (flag) {
                return ele.previousElementSibling;
            }
            var p = ele.previousSibling;
            while (p && p.nodeType != 1) {
                p = p.previousSibling;
            }
            return p;
        },
        next: function (ele) {
            if (flag) {
                return ele.nextElementSibling;
            }
            var p = ele.nextSibling;
            while (p && p.nodeType != 1) {
                p = p.nextSibling;
            }
            return p;
        },
        prevAll: function (ele) {
            var arr = [];
            var p = this.prev(ele);
            while (p) {
                arr.unshift(p);
                p = this.prev(p);
            }
            return arr;
        },
        nextAll: function (ele) {
            var arr = [];
            var n = this.next(ele);
            while (n) {
                arr.push(n);
            }
            return arr;
        },
        sibling: function (ele) {//获取相邻元素 上一个哥哥和下一个弟弟
            var arr = [];
            this.prev(ele) ? arr.push(this.prev(ele)) : false;
            this.next(ele) ? arr.push(this.next(ele)) : false;
            return arr;
        },
        siblings: function (ele) {//获取兄弟元素 所有的哥哥和所有的弟弟
            return this.prevAll(ele).concat(this.nextAll(ele));
        },
        index: function (ele) {//获得当前元素的索引位置
            return this.prevAll(ele).length;
        },
        firstChild: function (container) {//第一个儿子节点
            if (flag) {
                return container.firstElementChild;
            }
            return this.children(container).length ? this.children(container)[0] : null;
        },
        lastChild: function (container) {
            if (flag) {
                return container.lastElementChild;
            }
            return this.children(container).length ? this.children(container)[this.children(container).length - 1] : null;
        },
        /**
         *
         * @param ele 要操作的元素
         * @param container 要放到的盒子里
         */
        append: function (ele, container) {//把某个元素追加到哪个元素里面的末尾
            return container.appendChild(ele);
        },
        /**
         *
         * @param ele 我们要插进去的那么元素
         * @param container 把元素放到哪个容器里
         */
        prepend: function (ele, container) {//加到盒子内元素的前面
            var of = this.firstChild(container);//拿取第一个儿子
            return container.insertBefore(ele, of);//没有儿子会自动把他append进去
        },
        /**
         *
         * @param newEle 新的元素插入到oldEle前面
         * @param oldEle 旧的元素
         */
        insertBefore: function (newEle, oldEle) {
            return oldEle.parentNode.insertBefore(newEle, oldEle);
        },
        /**
         *
         * @param ele
         * @param oldEle
         */
        insertAfter: function (ele, oldEle) {//把某个元素插到某个元素的后面
            var oN = this.next(oldEle);
            return oldEle.parentNode.insertBefore(ele, oN);
        },
        /**
         *
         * @param ele 当前元素
         * @param name 判断的名字
         * @returns {boolean} 是否存在
         */
        hasClass: function (ele, name) {
            var reg = new RegExp("(?:^| +)" + name + "(?: +|$)");
            return reg.test(ele.className);
        },
        /**
         *
         * @param ele 当前操作的元素
         * @param className 要添加的类名 字符串格式
         */
        addClass: function (ele, className) {
            var ary = className.split(/\s+/);//把多个的分开
            for (var i = 0; i < ary.length; i++) {
                var cur = ary[i];//把每一个要添加的样式都拿出来进行hasClass
                if (!this.hasClass(ele, cur)) {//判断有没有要添加的样式，没有样式才要添加
                    ele.className += " " + cur;//要增加一个空格否则连在一起了，加的是拆分好的样式
                }
            }
        },
        /**
         *
         * @param ele 当前操作的元素
         * @param className 移除的那个样式
         */
        removeClass: function (ele, className) {
            if (this.hasClass(ele, className)) {
                ele.className = ele.className.replace(className, "");
            }
        },
        /**
         *
         * @param className 要获得所带样式名的
         * @param context 上下文，从哪里获取
         */
        getByClass: function (className, context) {
            var context = context || document;//如果没有context就走document
            if (flag) {
                return DOM.listToArray(context.getElementsByClassName(className));
            }
            var allTag = context.getElementsByTagName("*");//获取所有的标签
            var classList = className.replace(/^ +| +$/g, "").split(/\s+/);//去掉前后空格(/^ +| +$/g,"")全局匹配
            var arr=[];
            for (var i = 0; i < allTag.length; i++) {
                var cur = allTag[i];
                var flag=true;
                for (var j = 0; j < classList.length; j++) {
                    var curClassName = classList[j];
                    var reg=new RegExp("(?:^| +)"+curClassName+"(?: +|$)");
                    if(!reg.test(cur.className)){
                        flag=false;
                        break;
                    }
                }
                if(flag){
                    arr.push(cur);
                }
            }
            return arr;
        }
    }
})();



