// 剧本

define(['jquery', 'swiper', 'weixin', 'frameplayer', 'createjs'], function ($, swiper, wx, frameplayer) {
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
        ]

        loader.on("complete", onComplete);
        loader.loadManifest(source, true, 'img/');

        function onComplete() {
            $('body').append(self.template.loading);

            self.load();
        }
    }

    self.load = function () {
        var loader = new createjs.LoadQueue(false);

        // 关键！----设置并发数  
        loader.setMaxConnections(5);
        // 关键！---一定要将其设置为 true, 否则不起作用。  
        loader.maintainScriptOrder = true;

        var source = [
          { 'src': 'scene01/bubble-biaobai.png' },
          { 'src': 'scene01/bubble-dashan.png' },
          { 'src': 'scene01/button-next.png' },
          { 'src': 'scene01/info-bg.png' },
          { 'src': 'scene01/info-words.png' },

          { 'src': 'scene02/button-boy.png' },
          { 'src': 'scene02/button-girl.png' },
          { 'src': 'scene02/info-bg.png' },
          { 'src': 'scene02/info-words.png' },
          { 'src': 'scene02/mengxiaomei.png' },
          { 'src': 'scene02/xianqige.png' },

          { 'src': 'scene03/button.png' },
          { 'src': 'scene03/input-bg.png' },
          { 'src': 'scene03/loading.png' },
          { 'src': 'scene03/mengxiaomei-words.png' },
          { 'src': 'scene03/mengxiaomei.png' },
          { 'src': 'scene03/xianqige-words.png' },
          { 'src': 'scene03/xianqige.png' },

          { 'src': 'scene04/audio.png' },
          { 'src': 'scene04/button-retry.png' },
          { 'src': 'scene04/button-share.png' },
          { 'src': 'scene04/light.png' },
          { 'src': 'scene04/mengxiaomei.png' },
          { 'src': 'scene04/share.png' },
          { 'src': 'scene04/two.png' },
          { 'src': 'scene04/xianqige.png' },

          { 'src': 'scene05/finished.png' },
          { 'src': 'scene05/mengxiaomei.png' },
          { 'src': 'scene05/walk.png' },

          { 'src': 'scene06/button.png' },
          { 'src': 'scene06/jd.jpg' },
          { 'src': 'scene06/youhui.png' }
        ]

        loader.on("progress", onProgress);
        loader.on("complete", onComplete);
        loader.loadManifest(source, true, 'img/');


        function onComplete(e) {

            self.share('none');
            
            
            self.initSwiper();
        }

        function onProgress(e) {
            //console.log(loader.progress);
            $('.loading span').text((loader.progress * 100 | 0) + " %");
        }
    }

    self.swiper = null;
    self.initSwiper = function () {

        $('body').append(self.template.swiper);
        self.fixPosition();

        // 主体swiper 初始化
        self.swiper = new swiper('.swiper-container', {
            onlyExternal: true,
            effect: 'fade',
            speed:1000,
            fade: {
                crossFade: true,
            },
            onInit: function (swiper) {
                
                swiperAnimateCache(swiper); //隐藏动画元素
                setTimeout(function () {
                    $('.loading').fadeOut(function () {
                        swiperAnimate(swiper); //初始化完成开始动画
                        swiper.slideTo(0);
                        self.scene.s02.open();
                    })
                }, 100)
                console.log('初始化完成')
            },
            onSlideChangeEnd: function (swiper) {
                swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
            }
        });
    }

    self.man = true;

    self.scene = {

        s01 : {
            open: function () {
                self.scene.s01.bindAciton();
                setTimeout(function () {
                    self.scene.s01.movie.play();
                }, 1000);                
            },

            close: function () {
                clearInterval(self.scene.s01.movie.timer[0]);
                self.scene.s02.open();
            },

            bindAciton: function () {
                $('.scene01 .button').hammer().on("tap", function (e) {
                    self.scene.s01.close();
                });
            },

            movie: {
                timer: [null],
                play: function () {
                    self.scene.s01.movie.two();
                },
                two: function () {
                    $(".scene01 .two").show();
                    self.scene.s01.movie.timer[0] = frameplayer({
                        target: $(".scene01 .two"),
                        total: 3,
                        row: 1,
                        loop: true,
                        fps: 4,
                        width: 304,
                        height: 203
                    });
                }
            }
        },

        s02: {
            open: function () {
                self.man = true;
                self.scene.s02.bindAciton();
                self.scene.s02.movie.play();
                self.swiper.slideTo(1);
            },

            close: function () {
                clearInterval(self.scene.s02.movie.timer[0]);
                clearInterval(self.scene.s02.movie.timer[1]);
                self.scene.s03.open();
            },

            bindAciton: function () {
                $('.scene02 .btn-mengxiaomei').hammer().on("tap", function (e) {
                    self.man = false;
                    $('.scene03 .xianqige, .scene03 .xianqige-words').hide();
                    self.scene.s02.close();
                });

                $('.scene02 .btn-xianqige').hammer().on("tap", function (e) {                    
                    $('.scene03 .mengxiaomei, .scene03 .mengxiaomei-words').hide();
                    self.scene.s02.close();
                });
            },

            movie: {
                timer: [null, null],
                play: function () {
                    self.scene.s02.movie.xianqige();
                    self.scene.s02.movie.mengxiaomei();
                },
                xianqige: function () {
                    self.scene.s02.movie.timer[0] = frameplayer({
                        target: $(".scene02 .xianqige"),
                        total: 2,
                        row: 1,
                        loop: true,
                        fps: 3,
                        width: 199,
                        height: 289
                    });
                },
                mengxiaomei: function () {
                    self.scene.s02.movie.timer[1] = frameplayer({
                        target: $(".scene02 .mengxiaomei"),
                        total: 2,
                        row: 1,
                        loop: true,
                        fps: 3,
                        width: 156,
                        height: 234
                    });
                }
            }
        },

        s03: {
            open: function () {
                self.scene.s03.bindAciton();
                self.scene.s03.movie.play();
                self.swiper.slideTo(2);
            },

            close: function () {
                $('.scene03 .mask').hide();
                clearInterval(self.scene.s03.movie.timer[0]);
                self.scene.s04.open();
            },

            bindAciton: function () {
                $('.scene03 .button').hammer().on("tap", function (e) {

                    if ($('.scene03 textarea').val() == '') { return; }

                    $('.scene03 .mask').show();

                    if (self.man) {
                        $('.scene04 .mengxiaomei').hide();
                    }
                    else {
                        $('.scene04 .xianqige').hide();
                    }

                    $.ajax({
                        type: 'POST',
                        url: 'http://www.tron-m.com/ifly/api/tts.do',
                        data: JSON.stringify({
                            "speaker": self.man ? "xiaoxin" : 'yefang',
                            "text": $('.scene03 textarea').val(),
                            "ssTempo": "",
                            "ssPitch": "",
                            "ssRate": ""
                        }),
                        contentType: 'application/json;charset=UTF-8',
                        dataType:'json',
                        success: function (json) {
                            console.log('发送成功')
                            console.log(json)

                            $('audio').attr('src', 'http://www.tron-m.com/ifly/api/play.do?playId=' + json.result);
                            self.voiceId = json.result;

                            self.share(json.result);

                            var loader = new createjs.LoadQueue(true);

                            // 关键！----设置并发数  
                            loader.setMaxConnections(5);
                            // 关键！---一定要将其设置为 true, 否则不起作用。  
                            loader.maintainScriptOrder = true;

                            loader.on("progress", onProgress);
                            loader.on("complete", onComplete);
                            loader.installPlugin(createjs.Sound);
                            loader.loadFile({ id: "myaudio", src: "http://www.tron-m.com/ifly/data/" + json.result + '.wav' });

                            function onProgress(e) {

                            }

                            function onComplete(e) {

                            }

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

                    setTimeout(function () {
                        self.scene.s03.close();
                    }, 1000)
                });
            },

            movie: {
                timer: [null],
                play: function () {
                    if (self.man) {
                        self.scene.s03.movie.xianqige();
                    }
                    else {
                        self.scene.s03.movie.mengxiaomei();
                    }
                },
                xianqige: function () {
                    self.scene.s03.movie.timer[0] = frameplayer({
                        target: $(".scene03 .xianqige"),
                        total: 2,
                        row: 1,
                        loop: true,
                        fps: 3,
                        width: 232,
                        height: 260
                    });
                },
                mengxiaomei: function () {
                    self.scene.s03.movie.timer[0] = frameplayer({
                        target: $(".scene03 .mengxiaomei"),
                        total: 2,
                        row: 1,
                        loop: true,
                        fps: 3,
                        width: 202,
                        height: 234
                    });
                }
            }
        },

        s04: {
            open: function () {
                self.scene.s04.bindAciton();
                self.scene.s04.movie.play();
                self.swiper.slideTo(3);
            },

            close: function () {
                clearInterval(self.scene.s04.movie.timer[0]);
                clearInterval(self.scene.s04.movie.timer[1]);
                clearInterval(self.scene.s04.movie.timer[2]);
                self.scene.s05.open();
            },

            bindAciton: function () {
                $('.btn-retry').hammer().on("tap", function (e) {
                    $('audio').removeAttr('src');
                    $('.scene03 textarea').val('');
                    $('.scene03 .mengxiaomei, .scene03 .mengxiaomei-words').show();
                    $('.scene03 .xianqige, .scene03 .xianqige-words').show();
                    $('.scene04 .xianqige').show();
                    $('.scene04 .mengxiaomei').show();

                    self.scene.s02.open();
                });

                $('.scene04 .audio').hammer().on("tap", function (e) {
                    //console.log('播放声音')
                    //alert('播放')
                    //$('audio')[0].play();
                    createjs.Sound.play("myaudio", { loop: 0 });
                });

                $('.btn-share').hammer().on("tap", function (e) {
                    $('.scene04 .share').show();

                    self.scene.s04.movie.light();
                    self.scene.s04.movie.two();
                });

                //$('.scene04 .share, .scene05 .s1').hammer().on("tap", function (e) {
                //    self.swiper.slideNext();
                //});

                $('.scene04 .share').hammer().on("tap", function (e) {
                    self.scene.s04.close();
                });
            },

            movie: {
                timer: [null, null, null],
                play: function () {
                    if (self.man) {
                        self.scene.s04.movie.xianqige();
                    }
                    else {
                        self.scene.s04.movie.mengxiaomei();
                    }
                },
                xianqige: function () {
                    self.scene.s04.movie.timer[0] = frameplayer({
                        target: $(".scene04 .xianqige"),
                        total: 2,
                        row: 1,
                        loop: true,
                        fps: 3,
                        width: 364,
                        height: 327
                    });
                },
                mengxiaomei: function () {
                    self.scene.s04.movie.timer[0] = frameplayer({
                        target: $(".scene04 .mengxiaomei"),
                        total: 2,
                        row: 1,
                        loop: true,
                        fps: 3,
                        width: 244,
                        height: 222
                    });
                },
                light: function () {
                    self.scene.s04.movie.timer[1] = frameplayer({
                        target: $(".scene04 .light"),
                        total: 7,
                        row: 3,
                        loop: false,
                        fps: 12,
                        width: 600,
                        height: 600
                    });
                },
                two: function () {
                    self.scene.s04.movie.timer[2] = frameplayer({
                        target: $(".scene04 .two"),
                        total: 2,
                        row: 1,
                        loop: true,
                        fps: 3,
                        width: 428,
                        height: 303
                    });
                }
            }
        },

        s05: {
            open: function () {
                self.scene.s05.bindAciton();                
                self.swiper.slideTo(4);
                self.scene.s05.movie.play();

            },

            close: function () {

            },

            bindAciton: function () {

            },

            movie: {
                timer: [null, null],
                play: function () {
                    
                    self.scene.s05.movie.mengxiaomei();

                    setTimeout(function () {
                        self.scene.s05.movie.xianqige();
                    }, 1000)
                },
                xianqige: function () {
                    $(".scene05 .xianqige").show();
                    self.scene.s05.movie.timer[0] = frameplayer({
                        target: $(".scene05 .xianqige"),
                        total: 5,
                        row: 1,
                        loop: false,
                        fps: 6,
                        width: 640,
                        height: 308
                    });
                },
                mengxiaomei: function () {
                    self.scene.s05.movie.timer[1] = frameplayer({
                        target: $(".scene05 .mengxiaomei"),
                        total: 3,
                        row: 3,
                        loop: true,
                        fps: 4,
                        width: 156,
                        height: 181
                    });
                }
            }
        },

        s06: {
            open: function () {

            },

            close: function () {

            },

            bindAciton: function () {

            },

            movie: function () {

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
        loading: '<div class="loading"><span></span></div>',
        swiper:
            '<div class="swiper-container">\
                <div class="swiper-wrapper">\
                    <div class="swiper-slide scene01">\
                        <div class="s1 ani jsfix" swiper-animate-effect="fadeIn" swiper-animate-duration="0.5s" swiper-animate-delay="0.5s"></div>\
                        <div class="s2 ani jsfix" swiper-animate-effect="fadeIn" swiper-animate-duration="0.5s" swiper-animate-delay="1.0s"></div>\
                        <div class="button ani jsfix" swiper-animate-effect="fadeIn" swiper-animate-duration="0.5s" swiper-animate-delay="1.5s"></div>\
                        <div class="s4 ani jsfix" swiper-animate-effect="fadeInUp" swiper-animate-duration="0.5s" swiper-animate-delay="2.0s"></div>\
                        <div class="s5 ani jsfix" data-mode="top-right" swiper-animate-effect="fadeInUp" swiper-animate-duration="0.5s" swiper-animate-delay="2.2s"></div>\
                        <div class="two jsfix" data-mode="top-right" data-movie="yes"></div>\
                    </div>\
                    <div class="swiper-slide scene02">\
                        <div class="xianqige jsfix" data-movie="yes"></div>\
                        <div class="mengxiaomei jsfix" data-mode="top-right" data-movie="yes"></div>\
                        <div class="btn-xianqige ani jsfix"></div>\
                        <div class="btn-mengxiaomei ani jsfix" data-mode="top-right"></div>\
                        <div class="s5 ani jsfix" swiper-animate-effect="zoomIn" swiper-animate-duration="0.5s" swiper-animate-delay="0.5s"></div>\
                        <div class="s6 ani jsfix" swiper-animate-effect="fadeIn" swiper-animate-duration="0.5s" swiper-animate-delay="1s"></div>\
                    </div>\
                    <div class="swiper-slide scene03">\
                        <div class="xianqige jsfix" data-movie="yes"></div>\
                        <div class="xianqige-words jsfix" data-mode="top-right"></div>\
                        <div class="mengxiaomei jsfix" data-movie="yes"></div>\
                        <div class="mengxiaomei-words jsfix" data-mode="top-right"></div>\
                        <div class="s5 jsfix"><textarea placeholder="请输入文字"></textarea></div>\
                        <div class="button jsfix"></div>\
                        <div class="mask"><div class="loading"></div></div>\
                    </div>\
                    <div class="swiper-slide scene04">\
                        <div class="audio jsfix"></div>\
                        <div class="xianqige jsfix" data-movie="yes"></div>\
                        <div class="mengxiaomei jsfix" data-movie="yes"></div>\
                        <div class="btn-retry jsfix"></div>\
                        <div class="btn-share jsfix" data-mode="top-right"></div>\
                        <div class="share">\
                            <div class="light jsfix" data-mode="top-right" data-movie="yes"></div>\
                            <div class="share-words jsfix"></div>\
                            <div class="two jsfix" data-movie="yes"></div>\
                        </div>\
                    </div>\
                    <div class="swiper-slide scene05">\
                        <div class="s1 ani jsfix" swiper-animate-effect="zoomIn" swiper-animate-duration="0.5s" swiper-animate-delay="1.5s"></div>\
                        <div class="mengxiaomei jsfix" data-mode="top-right" data-movie="yes"></div>\
                        <div class="xianqige jsfix" data-movie="yes"></div>\
                    </div>\
                    <div class="swiper-slide scene06">\
                        <div class="s1"><img src="img/scene06/jd.jpg"></div>\
                        <div class="s2"><img src="img/scene06/youhui.png"></div>\
                        <div class="s3"><img src="img/scene06/button.png"></div>\
                    </div>\
                </div>\
            </div>'
    }

    // 设备简单判断
    self.device = (function () {
        var ua = navigator.userAgent.toLowerCase(), device;
        if (/android/.test(ua)) {
            device = 'android';
        }
        else if (/safari/.test(ua)) {
            device = 'safari';
        }
        else {
            device = 'iphone';
        }

        return device;
    })();

    // 分享
    self.share = function (voiceId) {
        //var host = "http://m.canon.com.cn/m/products/printer/pixma/pixmaevent";
        //var project = '';

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

                function callback(){
                    alert(11)
                }

                wx.ready(function () {
                    var url = 'http://www.tron-m.com/frog/yanzhong/20170530/?voiceId=' + voiceId,
                        title = '咸柠帮你说情话',
                        desc = '咸柠帮你说情话',
                        imgUrl = 'http://www.tron-m.com/frog/yanzhong/20170530/img/main/bg.jpg'

                    wx.onMenuShareTimeline({
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

















