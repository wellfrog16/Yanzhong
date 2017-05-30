define(['jquery'], function ($) {

    // { target: 对象,total : 总帧数, row : 一行几个, fps: 每秒帧数, width: 单帧宽, height:单帧高, loop : 是否循环, overCallback: 回调, loopCallback: 循环回调 }
    return function (args) {
        //var scale = $('body').width() / args.width;
        var scale = document.documentElement.clientWidth / 640
        args.target.css("transform", "scale(" + scale + ")");
        args.target.css("background-size", args.row * 100 + '%');
        //args.target.css("transform-origin", '0px 0px 0px');
        //args.target.css('opacity', '1');

        var num = 0;
        var timer = setInterval(function () {
            if (num++ >= args.total - 1) {
                if (args.loop) {
                    args.target.css('background-position', '0px 0px');
                    num = 0;
                } else {
                    clearInterval(timer);
                }
            }
            else {
                var x = args.width * (num % args.row) * -1,
                    y = args.height * parseInt(num / args.row) * -1

                args.target.css('background-position', x + 'px ' + y + 'px');
            }
        }, 1000 / args.fps)

        return timer;
    }

});