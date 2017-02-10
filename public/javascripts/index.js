window.onload = function () {

    //警告款显示时间
    var width = document.documentElement.clientWidth;
    $(".alert").css({
        left:(width-$(".alert").outerWidth())/2+"px"
    }).stop().show().fadeOut(5000);
    //设置时间
    $('.article-time').each(function (index,item) {
        $(item).html(timeShow($(item).html()));
    });
    set();
//获取样式
    function getStyle(obj,prop){
        if (obj.currentStyle) {
            return obj.currentStyle[prop]
        }else{
            return getComputedStyle(obj,false)[prop]
        };
    }
//瀑布流位置设置函数
    function set(){
        var oContainer = document.getElementsByClassName("box")[0];
        if(oContainer){
            var aDiv = oContainer.getElementsByClassName("article");
            var arr = [];
            var margin = 20;
            var oDivWidth = aDiv[0].offsetWidth;
            var height = 0;
            var n = parseInt(document.documentElement.clientWidth/(oDivWidth+2*margin));
            for(var i=0 ; i<aDiv.length ; i++){
                if (i<n) {
                    aDiv[i].style.top = margin + "px";
                    aDiv[i].style.left = i*oDivWidth + (2*i+1)*margin + "px";
                    height = parseInt(getStyle(aDiv[i],"height")) + margin;
                    oContainer.style.width = (oDivWidth+2*margin)*n +"px"
                    arr.push(height);
                }else{
                    var minHeight = Math.min.apply(null,arr);
                    var minKey = arr.indexOf(minHeight);
                    aDiv[i].style.left = minKey*oDivWidth + (2*minKey+1)*margin + "px";
                    aDiv[i].style.top = minHeight + margin + "px";
                    height = parseInt(getStyle(aDiv[i],"height")) + margin
                    arr[minKey] = minHeight + height;
                };
            }
        }
    }
//屏幕尺寸发生改变
    window.onresize = function(){
        set()
    }
//时间显示函数
    function timeShow(num) {
        var date = new Date(Number(num));
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var str = year+"年"+buling(month)+"月"+buling(day)+"日"+buling(hour)+"点"+buling(minute)+"分"+buling(second)+"秒"
        //补零函数
        function buling(num) {
            if (num<10){
                return "0"+num
            }else {
                return num
            }
        }
        return str
    }
}
