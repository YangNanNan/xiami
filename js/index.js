/**
 *
 * @param {String}type 数据请求类型 get还是post
 * @param {String}url  数据请求地址
 */
function ajaxSend(type,url){
    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            data = utils.jsonParse(xhr.responseText);
        }
    };
    xhr.send(null);
    return data;
}
//轮播图代码
~function () {
    /*
     * 第一步：造数据 动态绑定
     * */
    var banner = document.getElementById("banner");
    var inner = document.getElementById("inner");
    var tips = document.getElementById("tips");
    var imgList = inner.getElementsByTagName("img");
    //console.log(imgList.length);
    var oLis = tips.getElementsByTagName("li");
    !function dataBind() {
        var jsonData = ajaxSend("get","bannerimg.json");
        //已经成功获取到数据，接下来要实现动态数据绑定
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
//猜你喜欢
~function(){

}();
//新碟首发
~function(){
    var likeR=document.getElementById("likeR");
    var step=0;
    var jsonData1=ajaxSend("get","musitdata.json");
    //var frg=document.createDocumentFragment();
    console.log(jsonData1.length);
    var str=``;
    str += `<div class="banner2" id="banner2">`;
    for(var i=0;i<jsonData1.length;i++){
        if(i==0||i==5||i==10){
            str += `<div class="inner2"><div class="likeList">`;
        }else{
            str +=`<div class="likeList">`;
        }
            str +=`<dl>
                        <dt>
                            <img src= ${jsonData1[i].img} alt="">
                            <div class="likeBg">
                                <div class="likeTop">
                                    <b class="xin"></b>
                                    <i class="sjx"></i>
                                    <ul class="hidden">
                                        <li><a href="###" class="sc"><b></b>收藏</a></li>
                                        <li><a href="###" class="fs"><b></b>发送到</a></li>
                                        <li><a href="###" class="tj"><b></b>添加到</a></li>
                                        <li><a href="###" class="fx"><b></b>分享到</a></li>
                                    </ul>
                                </div>
                                <a class="btn" href="###"></a>
                            </div>
                        </dt>
                    </dl>
                    <p class="title">${jsonData1[i].title}</p>
                    <p class="sum">${jsonData1[i].name}</p></div>`;
        if(i==4||i==9||i==14){
            str += `</div>`;
        }
    }
    str += `</div>`;
    str+=`<div class="LeftBtn" id="LeftBtn"></div>
                <div class="RightBtn" id="RightBtn"></div>`;
    //var str2=banner2.innerHTML=str;
    likeR.innerHTML=str;
    var banner2=document.getElementById("banner2");
    var LeftBtn=document.getElementById("LeftBtn");
    var RightBtn=document.getElementById("RightBtn");
    var count=jsonData1.length/5;
    //console.log(count);
    console.log(banner2);
    console.log(LeftBtn);
    LeftBtn.onclick = function () {
        console.log(step);
        step--;
        if (step <= 0) {
            step = 0;
            banner2.style.left=0;
        }
        utils.setCss(banner2, "left", step * 750);
    };
    RightBtn.onclick = function () {
        step++;
        console.log(step);
        if (step >= count) {
            step = count - 1;
            banner2.style.left=-1500+'px';
        }
        utils.setCss(banner2, "left", -step * 750);
    };
}();
//虾米精选集
~function() {
    var likeR2 = document.getElementById("likeR2");
    var step = 0;
    var jsonData2 = ajaxSend("get", "xiamidata.json");
    //var frg=document.createDocumentFragment();
    console.log(jsonData2.length);
    var str = ``;
    str += `<div class="banner1" id="banner1">`;
    for (var i = 0; i < jsonData2.length; i++) {
        if (i == 0 || i == 5 || i == 10) {
            str += `<div class="inner2"><div class="likeList">`;
        } else {
            str += `<div class="likeList">`;
        }
        str += `<dl>
                        <dt>
                            <img src= ${jsonData2[i].img} alt="">
                            <div class="likeBg">
                                <div class="likeTop">
                                    <b class="xin"></b>
                                    <i class="sjx"></i>
                                    <ul class="hidden">
                                        <li><a href="###" class="sc"><b></b>收藏</a></li>
                                        <li><a href="###" class="fs"><b></b>发送到</a></li>
                                        <li><a href="###" class="tj"><b></b>添加到</a></li>
                                        <li><a href="###" class="fx"><b></b>分享到</a></li>
                                    </ul>
                                </div>
                                <a class="btn" href="###"></a>
                            </div>
                        </dt>
                    </dl>
                    <p class="title">${jsonData2[i].title}</p>
                    <p class="sum"><b><img src=${jsonData2[i].bigImg} alt=""></b>${jsonData2[i].name}<i></i><span></span></p></div>`;
        if (i == 4 || i == 9 || i == 14) {
            str += `</div>`;
        }
    }
    str += `</div>`;
    str += `<div class="LeftBtn" id="LeftBtn1"></div>
                <div class="RightBtn" id="RightBtn1"></div>`;
    //var str2=banner2.innerHTML=str;
    likeR2.innerHTML = str;
    var banner1 = document.getElementById("banner1");
    var LeftBtn1 = document.getElementById("LeftBtn1");
    var RightBtn1 = document.getElementById("RightBtn1");
    var count = jsonData2.length / 5;
    //console.log(count);
    console.log(banner1);
    console.log(LeftBtn1);
    LeftBtn1.onclick = function () {
        console.log(step);
        if (step <= 0) {
            step = 0;
            banner1.style.left=0;
        }else{
            utils.setCss(banner1, "left", step * 750);
        }
        step--;
    };
    RightBtn1.onclick = function () {
        step++;
        console.log(step);
        if (step >= count) {
            step = count - 1;
            banner1.style.left=-1500+'px';
        }
        utils.setCss(banner1, "left", -step * 750);
    };
}();

