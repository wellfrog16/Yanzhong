// 剧本

define(['jquery', 'script', 'weixin', 'tools', 'frameplayer', 'createjs'], function ($, script, wx, tools, frameplayer) {
    var self = {}

    self.baseUrl = 'http://www.tron-m.com/frog/yanzhong/20170602/mobile13'

    self.open = function () {
        _hmt.push(['_trackEvent', '浏览', '回放']);

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

        loader.installPlugin(createjs.Sound);
        loader.loadFile({ id: "myaudio", src: "http://www.tron-m.com/ifly/data/" + tools.getUrlParam('voiceId') + '.wav' });
        loader.on("progress", onProgress);
        loader.on("complete", onComplete);
        loader.loadManifest(source, true, 'img/');


        function onComplete(e) {


            $.ajax({
                type: 'POST',
                url: 'http://www.tron-m.com/ifly/api/userShare.do',
                data: {
                    'uuid': tools.getUrlParam('voiceId')
                },
                //contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                success: function (json) {
                    //console.log(json);

                    clearInterval(self.loadTimer);
                    $('.loading .text').fadeOut();            

                    self.share();
                    self.scene.open(json.result.userInfo);

                },
                error: function (xhr, textStatus) {
                    console.log('错误')
                    //console.log(xhr)
                    //console.log(textStatus)
                },
                complete: function () {
                    console.log('结束')
                },
                dataType: 'json'
            });

        }

        function onProgress(e) {
            //console.log(loader.progress);

            $('.loading img').css('transform', 'rotate(' + (loader.progress * 360 | 0) + 'deg)');

            //$('.loading span').text((loader.progress * 100 | 0) + " %");
        }
    }

    self.playing = false;

    self.scene = {
        open: function (userInfo) {
            $('.loading').fadeOut(function () {
                $('body').append(self.template.body);

                if (tools.getUrlParam('man') == 1) { $('.replay .xianqige').show(); }
                else { $('.replay .mengxiaomei').show(); }

                // 取昵称
                $('.replay .nickname').text(userInfo.nickname)

                self.fixPosition();

                $('.replay').fadeIn();

                self.scene.bindAction();
                self.scene.movie.play();
            });
        },

        close: function () {
            clearInterval(self.scene.movie.timer[0]);
        },

        bindAction: function () {
            $('.replay .audio-button').hammer().on("tap", function (e) {

                if (self.playing) { return }
                //console.log('播放声音')

                self.playing = true;

                //$('audio')[0].play();
                $('.replay .audio-button').removeClass('audio-button-play').addClass('audio-button-pause');
                $('.replay .audio-button').addClass('audio-rotate');
                var cc = createjs.Sound.play("myaudio", { loop: 0 });

                cc.on("complete", function () {
                    $('.replay .audio-button').removeClass('audio-button-pause').addClass('audio-button-play');
                    $('.replay .audio-button').removeClass('audio-rotate');
                    $('.replay .audio-button').css('transform', 'rotate(0deg)');
                    self.playing = false;
                }, this);
            });

            $('.replay .button').hammer().on("tap", function (e) {
                self.scene.close();
                $('.replay').remove();
                script.open();
            });
        },

        movie: {
            timer: [null],
            play: function () {
                self.scene.movie.sound();

            },

            sound: function () {
                self.scene.movie.timer[0] = frameplayer({
                    target: $(".replay .audio-sound"),
                    total: 2,
                    row: 1,
                    loop: true,
                    fps: 3,
                    width: 549,
                    height: 116
                });
            }
        }
    }


    // 坐标修正
    self.fixPosition = function () {

        var scaleNum = document.documentElement.clientWidth / 640;
        var ele = $('.jsfix');

        ele.each(function () {
            var o = $(this);
            var mode = o.attr('data-mode');
            var isMovie = o.attr('data-movie') || 'no';

            if (isMovie == 'no') {
                o.css({
                    'width': scaleNum * parseInt(o.css('width')),
                    'height': scaleNum * parseInt(o.css('height')),
                    'line-height': scaleNum * parseInt(o.css('line-height')) + 'px'
                });
            }

            switch (mode) {

                case 'top-right':
                    o.css({
                        'top': scaleNum * parseInt(o.css('top')),
                        'right': scaleNum * parseInt(o.css('right'))
                    });
                    break;

                case 'bottom-left':
                    o.css({
                        'bottom': scaleNum * parseInt(o.css('bottom')),
                        'left': scaleNum * parseInt(o.css('left'))
                    });
                    break;

                case 'bottom-right':
                    o.css({
                        'bottom': scaleNum * parseInt(o.css('bottom')),
                        'right': scaleNum * parseInt(o.css('right'))
                    });
                    break;


                default:
                    o.css({
                        'top': scaleNum * parseInt(o.css('top')),
                        'left': scaleNum * parseInt(o.css('left'))
                    });
                    break;
            }
        });
    }


    self.template = {
        loading: '<div class="loading"><div class="body"><div class="circle"><img src="img/loading/bottle.png" ></div><div class="text"></div></div></div>',
        body: '<div class="replay">\
                <div class="xianqige jsfix"></div>\
                <div class="mengxiaomei jsfix"></div>\
                <div class="audio-bg jsfix"></div>\
                <div class="audio-words jsfix"></div>\
                <div class="nickname jsfix"></div>\
                <div class="audio-sound jsfix" data-movie="yes"></div>\
                <div class="audio-button-play audio-button jsfix"></div>\
                <div class="button jsfix"></div>\
            </div>'
    }



    // 分享
    self.share = function () {

        //var s = self.baseUrl + '/?man=' + tools.getUrlParam('man') + '&nickname=' + tools.getUrlParam('nickname') + '&voiceId=' + tools.getUrlParam('voiceId');

        $.ajax({
            type: 'post',
            //url: 'http://www.tron-m.com/wx/jssdk',
            //data: { url: location.href, m: 'getWxConfig' },
            url: 'http://www.tron-m.com/wx/jssdk?m=getWxConfig',
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
                    _hmt.push(['_trackEvent', '分享', '分享了回放']);
                }


                wx.ready(function () {
                    //var url = self.baseUrl + '/?man=' + tools.getUrlParam('man') + '&nickname=' + tools.getUrlParam('nickname') + '&voiceId=' + tools.getUrlParam('voiceId'),
                    var url = self.baseUrl + '/?man=' + tools.getUrlParam('man') + '&voiceId=' + tools.getUrlParam('voiceId'),
                        title = '咸柠帮你说情话',
                        desc = '可以提高表白成功率哦 一般人我可不告诉TA',
                        imgUrl = self.baseUrl + '/img/main/share.jpg'

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
                    console.log(res);
                });
            }
        });
    }

    return self;
});

















