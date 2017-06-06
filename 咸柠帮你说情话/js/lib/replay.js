// 剧本

define(['jquery', 'script', 'tools', 'frameplayer', 'createjs'], function ($, script, tools, frameplayer) {
    var self = {}

    self.open = function () {
        // loading界面        
        self.preload();
    }


    self.preload = function () {
        var loader = new createjs.LoadQueue(false);

        // 关键！----设置并发数  
        loader.setMaxConnections(5);
        // 关键！---一定要将其设置为 true, 否则不起作用。  
        loader.maintainScriptOrder = true;

        var source = [
          { 'src': 'main/bg.jpg' },

          { 'src': 'loading/bottle.png' },
          { 'src': 'loading/circle.png' },
          { 'src': 'loading/text.png' }
        ]

        loader.on("complete", onComplete);
        loader.loadManifest(source, true, 'img/');

        function onComplete() {
            $('body').append(self.template.loading);

            self.loadTimer = frameplayer({
                target: $(".loading .text"),
                total: 4,
                row: 1,
                loop: true,
                fps: 2,
                width: 230,
                height: 49
            });

            self.load();
        }
    }

    self.loadTimer = null
    self.load = function () {
        var loader = new createjs.LoadQueue(false);

        // 关键！----设置并发数  
        loader.setMaxConnections(5);
        // 关键！---一定要将其设置为 true, 否则不起作用。  
        loader.maintainScriptOrder = true;

        var source = [
          { 'src': 'replay/button.png' },
          { 'src': 'replay/mengxiaomei.png' },
          { 'src': 'replay/xianqige.png' },
        ]

        loader.on("progress", onProgress);
        loader.on("complete", onComplete);
        loader.loadManifest(source, true, 'img/');


        function onComplete(e) {

            clearInterval(self.loadTimer);
            $('.loading .text').fadeOut();

            $('body').append(self.template.body);
            self.scene.open();
        }

        function onProgress(e) {
            //console.log(loader.progress);

            $('.loading img').css('transform', 'rotate(' + (loader.progress * 360 | 0) + 'deg)');

            //$('.loading span').text((loader.progress * 100 | 0) + " %");
        }
    }

    self.scene = {
        open: function () {
            $('.loading').fadeOut(function () {

            });
        },

        close: function () {

        },

        bindAction: function () {

        },

        movie: {
            timer: [null, null],
            play: function () {

                self.scene.s05.movie.mengxiaomei();

                setTimeout(function () {
                    self.scene.s05.movie.xianqige();
                }, 1000)
            }
        }
    }



    self.template = {
        loading: '<div class="loading"><div class="body"><div class="circle"><img src="img/loading/bottle.png" ></div><div class="text"></div></div></div>',
        body: '<div class="replay"><div class="char"><img src="img/replay/xianqige.png"></div></div>'
    }



    // 分享
    self.share = function (voiceId) {
        $.ajax({
            type: 'post',
            //url: host + '/share/jssdk',
            //data: { url: window.location.href, m: 'getWxConfig' },
            url: 'http://www.tron-m.com/wx/jssdk?m=getWxConfig',
            //data: { url: 'http://www.tron-m.com/frog/yanzhong/20170530/?voiceId=' + voiceId },
            dataType: 'json',
            success: function (args) {
                ////////////
                args = args.result;

                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: args.appId, // 必填，公众号的唯一标识
                    timestamp: args.timestamp, // 必填，生成签名的时间戳
                    nonceStr: args.nonceStr, // 必填，生成签名的随机串
                    signature: args.signature,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                function callback() {
                    if (voiceId != 'none') { self.scene.s05.open(); }
                }

                wx.ready(function () {
                    var url = 'http://www.tron-m.com/frog/yanzhong/20170602/mobile04/?man=' + (self.man ? 1 : 0) + '&voiceId=' + voiceId,
                        title = '咸柠帮你说情话',
                        desc = '咸柠帮你说情话',
                        imgUrl = 'http://www.tron-m.com/frog/yanzhong/20170602/mobile04/img/main/bg.jpg'

                    wx.onMenuShareTimeline({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            callback();
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            callback()
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareQQ({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            callback()
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareWeibo({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            callback()
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareQZone({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            callback()
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                });

                wx.error(function (res) {
                    console.log("wx has error:" + res);
                });
            }
        });
    }

    return self;
});

















