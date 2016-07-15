//轮播图代码
~function () {
    /*
     * 第一步：造数据 动态绑定
     * */
    var banner = document.getElementById("banner");
    var inner = document.getElementById("inner");
    var tips = document.getElementById("tips");
    var imgList = inner.getElementsByTagName("img");
    console.log(imgList.length);
    var oLis = tips.getElementsByTagName("li");
    var jsonData = null;
    !function dataBind() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", "bannerimg.json", false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                jsonData = utils.jsonParse(xhr.responseText);
            }
        };
        xhr.send(null);
        //已经成功获取到数据，接下来要实现动态数据绑定
        console.log(jsonData);

        var str = "";
        for (var i = 0; i < jsonData.length; i++) {
            var cur = jsonData[i];
            str += "<div><img src=''trueSrc='" + cur.img + "'/></div>"
        }
        str += "<div><img src=''trueSrc='" + jsonData[0].img + "'/></div>";
        inner.innerHTML = str;
        utils.setCss(inner, "width", (jsonData.length + 1) * 740);//inner的宽度不写死，有多少个inner 就有多宽
        str = "";//因为还有用str所以定义str=""
        for (var j = 0; j < jsonData.length; j++) {
            if (j === 0) {
                str += "<li class='selected'></li>"
            } else {
                str += "<li></li>";
            }
        }
        tips.innerHTML = str;
    }();
    //实现图片延迟加载
    function imgDelay() {
        for (var i = 0; i < imgList.length; i++) {
            !function (i) {
                var curImg = imgList[i];
                if (curImg.isLoad) {
                    return;
                }
                var tempImg = new Image();
                tempImg.src = curImg.getAttribute("trueSrc");
                tempImg.onload = function () {
                    curImg.src = this.src;
                    curImg.style.display = "block";
                    //处理透明度
                    zhufengAnimate(curImg, {opacity: 1}, 1000);
                    tempImg = null;
                };
                curImg.isLoad = true;
            }(i);
        }
    }

    window.setTimeout(imgDelay, 1000);
    //轮播图自动轮播 一个定时器不断驱动一个autoMove函数
    var timer = window.setInterval(autoMove, 2000);
    var step = 0;
    var count = imgList.length;

    function autoMove() {

        if (step == count - 1) {
            step = 0;
            utils.setCss(inner, "left", 0)
        }
        step++;
        zhufengAnimate(inner, {left: -step * 740}, 1000);
        focusAlign();
    }

    function focusAlign() {
        for (var i = 0; i < oLis.length; i++) {
            var tempStep = step > oLis.length - 1 ? 0 : step;//需要一个临时的来处理由于图片多一张而li不存在的情况
            var curLi = oLis[i];
            tempStep === i ? curLi.className = "selected" : curLi.className = "";
        }
    }

//鼠标悬停停止轮播 鼠标离开继续
    banner.onmouseover = function () {
        window.clearInterval(timer);
    };
    banner.onmouseout = function () {
        timer = window.setInterval(autoMove, 2000);
    };

    //按钮点击实现轮播切换
    ~function () {
        for (var i = 0; i < oLis.length; i++) {
            var curLi = oLis[i];
            curLi.selfIndex = i;
            curLi.onclick = function () {
                step = this.selfIndex;
                zhufengAnimate(inner, {left: -step * 740}, 500);
                focusAlign();
            }
        }
    }();

}();
//新碟首发

var xhr=new XMLHttpRequest();
xhr.open("get","musicdata.json",false);
