//�ֲ�ͼ����
~function () {
    /*
     * ��һ���������� ��̬��
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
        //�Ѿ��ɹ���ȡ�����ݣ�������Ҫʵ�ֶ�̬���ݰ�
        console.log(jsonData);

        var str = "";
        for (var i = 0; i < jsonData.length; i++) {
            var cur = jsonData[i];
            str += "<div><img src=''trueSrc='" + cur.img + "'/></div>"
        }
        str += "<div><img src=''trueSrc='" + jsonData[0].img + "'/></div>";
        inner.innerHTML = str;
        utils.setCss(inner, "width", (jsonData.length + 1) * 740);//inner�Ŀ�Ȳ�д�����ж��ٸ�inner ���ж��
        str = "";//��Ϊ������str���Զ���str=""
        for (var j = 0; j < jsonData.length; j++) {
            if (j === 0) {
                str += "<li class='selected'></li>"
            } else {
                str += "<li></li>";
            }
        }
        tips.innerHTML = str;
    }();
    //ʵ��ͼƬ�ӳټ���
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
                    //����͸����
                    zhufengAnimate(curImg, {opacity: 1}, 1000);
                    tempImg = null;
                };
                curImg.isLoad = true;
            }(i);
        }
    }

    window.setTimeout(imgDelay, 1000);
    //�ֲ�ͼ�Զ��ֲ� һ����ʱ����������һ��autoMove����
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
            var tempStep = step > oLis.length - 1 ? 0 : step;//��Ҫһ����ʱ������������ͼƬ��һ�Ŷ�li�����ڵ����
            var curLi = oLis[i];
            tempStep === i ? curLi.className = "selected" : curLi.className = "";
        }
    }

//�����ֹͣͣ�ֲ� ����뿪����
    banner.onmouseover = function () {
        window.clearInterval(timer);
    };
    banner.onmouseout = function () {
        timer = window.setInterval(autoMove, 2000);
    };

    //��ť���ʵ���ֲ��л�
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
//�µ��׷�

var xhr=new XMLHttpRequest();
xhr.open("get","musicdata.json",false);
