// 剧本

define(['jquery', 'swiper', 'weixin', 'frameplayer', 'tools', 'createjs'], function ($, swiper, wx, frameplayer, tools) {
    var self = {}

    self.code = null;
    self.user = null;

    self.baseUrl = 'http://www.tron-m.com/yanzhong'
    self.cdnUrl = 'http://yanzhong16.oss-cn-shanghai.aliyuncs.com/';
    self.jd = 'https://item.jd.com/1726224.html'

    self.open = function () {

        //self.preload();
        //return
        //加载完毕播放
        //document.addEventListener("WeixinJSBridgeReady", function () {
        //    $('#shake')[0].play();
            
        //}, false);

        //alert(0)


        self.authorization();
    }

    // 检查授权
    self.authorization = function () {
        self.code = tools.getUrlParam('code');

        
        if (self.code == null) { // 未授权
            $.ajax({
                type: 'POST',
                url: 'http://www.tron-m.com/ifly/api/snsUserinfoCode.do',
                data: {
                    'redirect_uri': self.baseUrl
                },
                //contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                success: function (json) {
                    console.log('发送成功')
                    console.log(json)
                    //alert(json.code)
                    //alert(json.message)
                    location.href = json.result;

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
        else { // 已经授权

            _hmt.push(['_trackEvent', '浏览', '主题']);

            // 用户已经授权，读取用户信息
            $.ajax({
                type: 'POST',
                url: 'http://www.tron-m.com/ifly/api/snsUserinfo.do',
                data: {
                    'code': self.code
                },
                //contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                success: function (json) {

                    self.user = json.result;

                    // loading界面        
                    self.preload();
                },
                error: function (xhr, textStatus) {
                    console.log('错误')

                    //location.href = self.baseUrl;
                    //console.log(xhr)
                    //console.log(textStatus)
                },
                complete: function () {
                    console.log('结束')
                },
                dataType: 'json'
            });


        }
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
        loader.loadManifest(source, true, self.cdnUrl + 'img/');

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
            { 'src': 'main/landscape.png' },

          { 'src': 'scene01/bubble-biaobai.png' },
          { 'src': 'scene01/bubble-dashan.png' },
          { 'src': 'scene01/button-next.png' },
          { 'src': 'scene01/info-bg.png' },
          { 'src': 'scene01/info-words.png' },
          { 'src': 'scene01/two.png' },

          { 'src': 'scene02/button-boy.png' },
          { 'src': 'scene02/button-girl.png' },
          { 'src': 'scene02/info.png' },
          { 'src': 'scene02/mengxiaomei.png' },
          { 'src': 'scene02/xianqige.png' },

          { 'src': 'scene03/button.png' },
          { 'src': 'scene03/input-bg-tips.png' },
          { 'src': 'scene03/input-bg.png' },
          { 'src': 'scene03/loading.png' },
          { 'src': 'scene03/meng.png' },
          { 'src': 'scene03/mengxiaomei-words.png' },
          { 'src': 'scene03/mengxiaomei.png' },
          { 'src': 'scene03/qi.png' },
          { 'src': 'scene03/xianqige-words.png' },
          { 'src': 'scene03/xianqige.png' },

          { 'src': 'scene04/audio-sound.png' },
          { 'src': 'scene04/audio.png' },
          { 'src': 'scene04/bottle.png' },
          { 'src': 'scene04/button-retry.png' },
          { 'src': 'scene04/button-share.png' },
          { 'src': 'scene04/light.png' },
          { 'src': 'scene04/mengxiaomei.png' },
          { 'src': 'scene04/pause.png' },
          { 'src': 'scene04/play.png' },
          { 'src': 'scene04/share.png' },
          { 'src': 'scene04/two.png' },
          { 'src': 'scene04/xianqige.png' },

          { 'src': 'scene05/finished.png' },
          { 'src': 'scene05/mengxiaomei.png' },
          { 'src': 'scene05/walk.png' },

          { 'src': 'scene06/button.png' },
          { 'src': 'scene06/youhui.png' }
        ]

        loader.installPlugin(createjs.Sound);
        loader.loadFile({ id: "boy", src: 'audio/boy.wav' });
        loader.loadFile({ id: "girl", src: 'audio/girl.mp3' });
        loader.loadFile({ id: "button", src: 'audio/button.mp3' });
        loader.on("progress", onProgress);
        loader.on("complete", onComplete);
        loader.loadManifest(source, true, self.cdnUrl + 'img/');


        function onComplete(e) {

            clearInterval(self.loadTimer);
            $('.loading .text').fadeOut();

            self.share('none');
            self.initSwiper();
        }

        function onProgress(e) {
            //console.log(loader.progress);

            $('.loading img').css('transform', 'rotate(' + (loader.progress * 360 | 0) + 'deg)');
            
            //$('.loading span').text((loader.progress * 100 | 0) + " %");
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

                        self.scene.s01.open();
                    })
                }, 100)
                console.log('初始化完成')
            },
            onTransitionEnd: function (swiper) {
                console.log('动画')
                swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
            }
        });
    }

    self.man = true;
    self.playing = false;

    self.scene = {

        s01: {
            inited : false,
            open: function () {
                self.scene.s01.bindAciton();
                setTimeout(function () {
                    self.scene.s01.movie.play();
                }, 1000);
                self.swiper.slideTo(0);
            },

            close: function () {
                clearInterval(self.scene.s01.movie.timer[0]);
            },

            bindAciton: function () {
                if (self.scene.s01.inited) { return false; }
                else { self.scene.s01.inited = true; }

                $('.scene01 .button, .scene01 .s4,.scene01 .s5').hammer().on("tap", function (e) {
                    //$('#shake')[0].pause();
                    createjs.Sound.play("button");
                    self.scene.s01.close();                    
                    self.scene.s02.open();                    
                });

                var effect = 'tada';

                $('.scene01 .s5').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

                    $(this).removeClass('ani fadeInUp animated ' + effect);
                    $('.scene01 .s4').removeClass('ani fadeInUp animated ' + effect).addClass('animated ' + effect)
                });

                $('.scene01 .s4').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

                    $(this).removeClass('ani fadeInUp animated ' + effect);
                    $('.scene01 .s5').removeClass('ani fadeInUp animated ' + effect).addClass('animated ' + effect)
                });


                //$('.scene01 .s5')
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
                        width: 400,
                        height: 267
                    });
                }
            }
        },

        s02: {
            inited: false,
            open: function () {
                self.man = true;
                self.scene.s02.bindAciton();
                self.scene.s02.movie.play();
                self.swiper.slideTo(1);
            },

            close: function () {
                clearInterval(self.scene.s02.movie.timer[0]);
                clearInterval(self.scene.s02.movie.timer[1]);
                clearInterval(self.scene.s02.movie.timer[2]);
            },

            bindAciton: function () {
                if (self.scene.s02.inited) { return false; }
                else { self.scene.s02.inited = true; }

                $('.scene02 .btn-mengxiaomei').hammer().on("tap", function (e) {
                    self.man = false;
                    $('.scene03 .mengxiaomei, .scene03 .mengxiaomei-words').show();
                    createjs.Sound.play("girl");
                    self.scene.s02.close();
                    self.scene.s03.open();
                });

                $('.scene02 .btn-xianqige').hammer().on("tap", function (e) {
                    $('.scene03 .xianqige, .scene03 .xianqige-words').show();
                    createjs.Sound.play("boy");
                    self.scene.s02.close();
                    self.scene.s03.open();
                });
            },

            movie: {
                timer: [null, null],
                play: function () {
                    self.scene.s02.movie.xianqige();
                    self.scene.s02.movie.mengxiaomei();
                    self.scene.s02.movie.info();
                },
                info: function () {
                    self.scene.s02.movie.timer[2] = frameplayer({
                        target: $(".scene02 .info"),
                        total: 10,
                        row: 1,
                        loop: true,
                        fps: 3,
                        width: 640,
                        height: 388
                    });
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
            inited: false,
            open: function () {
                self.scene.s03.bindAciton();
                self.scene.s03.movie.play();
                self.swiper.slideTo(2);
                $('.block').css({ 'z-index': '-1' });
            },

            close: function () {
                $('.block').css({ 'z-index': '9999' });
                $('.scene03 .mask').hide();
                clearInterval(self.scene.s03.movie.timer[0]);
                clearInterval(self.scene.s03.movie.timer[1]);
                clearInterval(self.scene.s03.movie.timer[2]);
                $('.scene03 .line').hide();
                $('.scene03 textarea').blur();
                $('.scene03 textarea').val('');
                $('.scene03 .mengxiaomei, .scene03 .meng-box, .scene03 .mengxiaomei-words').hide();
                $('.scene03 .xianqige, .scene03 .qi-box, .scene03 .xianqige-words').hide();
                $('.scene03 .s5').css('background-image', 'url(' + self.cdnUrl + 'img/scene03/input-bg-tips.png)');

                $('body').attr('data-switch', 'off');
            },

            bindAciton: function () {
                if (self.scene.s03.inited) { return false; }
                else { self.scene.s03.inited = true; }

                $('.scene03 .s5').hammer().on("tap", function () {
                    $('.scene03 .s5').css('background-image', 'url(' + self.cdnUrl + 'img/scene03/input-bg.png)');
                    clearInterval(self.scene.s03.movie.timer[2]);
                    $('.scene03 .line').hide();
                    $('.scene03 textarea').focus();
                });

                //
                $('.scene03 textarea').on('focus', function () {
                    $('body').attr('data-switch', 'on');
                });

                $('.scene03 textarea').on('blur', function () {
                    $('body').attr('data-switch', 'off');
                });

                $('.scene03 .button').hammer().on("tap", function (e) {

                    if ($('.scene03 textarea').val() == '') { return; }

                    $('.scene03 .mask').show();
                    createjs.Sound.play("button");
                    self.scene.s03.movie.loading();

                    if (self.man) {
                        $('.scene04 .xianqige').show();
                    }
                    else {
                        $('.scene04 .mengxiaomei').show();
                    }

                    $.ajax({
                        type: 'POST',
                        url: 'http://www.tron-m.com/ifly/api/tts.do',
                        data: JSON.stringify({
                            'userId': self.user.id,
                            "speaker": self.man ? "xiaofeng" : 'yefang',
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

                            //alert(json)

                            //$('audio').attr('src', 'http://www.tron-m.com/ifly/api/play.do?playId=' + json.result);
                            self.voiceId = json.result;

                            self.share(json.result, self.user.nickname);

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
                                self.scene.s03.close();
                                self.scene.s04.open();
                            }

                        },
                        error: function (xhr, textStatus) {
                            console.log('错误')
                            //alert(xhr)
                            //alert(textStatus)
                            //console.log(xhr)
                            //console.log(textStatus)
                        },
                        complete: function () {
                            console.log('结束')
                        },
                        dataType: 'json'
                    });

                    //setTimeout(function () {
                    //    self.scene.s03.close();
                    //    self.scene.s04.open();
                    //}, 1000)
                });
            },

            movie: {
                timer: [null, null, null],
                play: function () {
                    self.scene.s03.movie.line();

                    if (self.man) {
                        self.scene.s03.movie.xianqige();

                        $('.qi-box').show();

                        //setTimeout(function () {
                            //$('.qi').show();
                        //}, 1000)
                        
                    }
                    else {
                        self.scene.s03.movie.mengxiaomei();

                        $('.meng-box').show();
                        //setTimeout(function () {
                            //$('.meng').show();
                        //}, 1000)
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
                },

                line : function(){
                    self.scene.s03.movie.timer[2] = setInterval(function () {
                        $('.scene03 .line').toggle();
                    }, 1000)
                },

                loading: function () {
                    self.scene.s03.movie.timer[1] = frameplayer({
                        target: $(".scene03 .voice-loading"),
                        total: 7,
                        row: 1,
                        loop: true,
                        fps: 3,
                        width: 526,
                        height: 467
                    });
                }
            }
        },

        s04: {
            inited: false,
            open: function () {
                self.scene.s04.bindAciton();
                self.scene.s04.movie.play();
                self.swiper.slideTo(3);
            },

            close: function () {
                clearInterval(self.scene.s04.movie.timer[0]);
                clearInterval(self.scene.s04.movie.timer[1]);
                clearInterval(self.scene.s04.movie.timer[2]);
                clearInterval(self.scene.s04.movie.timer[3]);

                $('.scene04 .xianqige').hide();
                $('.scene04 .mengxiaomei').hide();
                
            },

            bindAciton: function () {
                if (self.scene.s04.inited) { return false; }
                else { self.scene.s04.inited = true; }

                $('.btn-retry').hammer().on("tap", function (e) {
                    self.scene.s04.close();
                    self.scene.s02.open();
                });

                $('.scene04 .audio-button').hammer().on("tap", function (e) {

                    if (self.playing) { return }
                    //console.log('播放声音')

                    self.playing = true;

                    //$('audio')[0].play();
                    $('.scene04 .audio-button').removeClass('audio-button-play').addClass('audio-button-pause');
                    $('.scene04 .audio-button').addClass('audio-rotate');
                    var cc = createjs.Sound.play("myaudio", { loop: 0 });

                    cc.on("complete", function () {
                        $('.scene04 .audio-button').removeClass('audio-button-pause').addClass('audio-button-play');
                        $('.scene04 .audio-button').removeClass('audio-rotate');
                        $('.scene04 .audio-button').css('transform', 'rotate(0deg)');
                        self.playing = false;
                    }, this);
                });

                $('.btn-share').hammer().on("tap", function (e) {
                    $('.scene04 .share').show();

                    self.scene.s04.movie.light();
                    self.scene.s04.movie.two();
                });

                // 点击去下一页
                $('.scene04 .share').hammer().on("tap", function (e) {
                    self.scene.s04.close();
                    self.scene.s05.open();
                });
            },

            movie: {
                timer: [null, null, null, null],
                play: function () {
                    self.scene.s04.movie.sound();

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
                        width: 364,
                        height: 331
                    });
                },
                sound: function () {
                    self.scene.s04.movie.timer[3] = frameplayer({
                        target: $(".scene04 .audio-sound"),
                        total: 2,
                        row: 1,
                        loop: true,
                        fps: 3,
                        width: 549,
                        height: 116
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
            inited: false,
            open: function () {
                self.scene.s05.bindAciton();                
                self.swiper.slideTo(4);
                self.scene.s05.movie.play();
            },

            close: function () {
                clearInterval(self.scene.s05.movie.timer[0]);
                clearInterval(self.scene.s05.movie.timer[1]);
                clearInterval(self.scene.s05.movie.timer[2]);
            },

            bindAciton: function () {

            },

            movie: {
                timer: [null, null, null],
                play: function () {
                    setTimeout(function () {
                        self.scene.s05.movie.xianqige();
                    }, 500)

                    setTimeout(function () {
                        $(".scene05 .mengxiaomei").show();
                        self.scene.s05.movie.mengxiaomei();
                    }, 1500);

                    setTimeout(function () {
                        $(".scene05 .finished").show();
                        self.scene.s05.movie.finished();

                        _hmt.push(['_trackEvent', '跳转', '即将进入京东']);
                    }, 1800);

                    setTimeout(function () {
                        //self.scene.s05.close();
                        //self.scene.s06.open();
                        location.href = 'https://wqs.jd.com/event/promote/yanzhong/index.shtml';
                    }, 3800)
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
                        height: 320
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
                },
                finished: function () {
                    self.scene.s05.movie.timer[2] = frameplayer({
                        target: $(".scene05 .finished"),
                        total: 2,
                        row: 2,
                        loop: true,
                        fps: 3,
                        width: 593,
                        height: 440
                    });
                }
            }
        },

        s06: {
            open: function () {
                self.scene.s06.bindAciton();
                self.scene.s06.movie.play();
                self.swiper.slideTo(5);
            },

            close: function () {
                clearInterval(self.scene.s06.movie.timer[0]);
            },

            bindAciton: function () {
                $('.scene06 .button').hammer().on("tap", function (e) {

                    _hmt.push(['_trackEvent', '跳转', '即将进入京东']);
                    setTimeout(function () { location.href = 'https://wqs.jd.com/event/promote/yanzhong/index.shtml'; }, 1000)
                });
            },

            movie: {
                timer: [null],
                play: function () {
                    self.scene.s06.movie.two();
                },
                two: function () {
                    $(".scene06 .two").show();
                    self.scene.s06.movie.timer[0] = frameplayer({
                        target: $(".scene06 .two"),
                        total: 3,
                        row: 1,
                        loop: true,
                        fps: 4,
                        width: 400,
                        height: 267
                    });
                }
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
        loading: '<div class="loading"><div class="body"><div class="circle"><img src="' + self.cdnUrl + 'img/loading/bottle.png" ></div><div class="text"></div></div></div>',
        replay : '',
        swiper:
            '<div class="swiper-container">\
                <div class="swiper-wrapper">\
                    <div class="swiper-slide scene01">\
                        <div class="s1 ani jsfix" swiper-animate-effect="fadeIn" swiper-animate-duration="0.5s" swiper-animate-delay="1s"></div>\
                        <div class="s2 ani jsfix" swiper-animate-effect="fadeIn" swiper-animate-duration="0.5s" swiper-animate-delay="1.0s"></div>\
                        <div class="button ani jsfix" swiper-animate-effect="fadeIn" swiper-animate-duration="0.5s" swiper-animate-delay="1.5s"></div>\
                        <div class="s4 ani jsfix" swiper-animate-effect="fadeInUp" swiper-animate-duration="0.5s" swiper-animate-delay="1.6s"></div>\
                        <div class="s5 ani jsfix" data-mode="top-right" swiper-animate-effect="fadeInUp" swiper-animate-duration="0.5s" swiper-animate-delay="1.8s"></div>\
                        <div class="two jsfix" data-mode="top-right" data-movie="yes"></div>\
                    </div>\
                    <div class="swiper-slide scene02">\
                        <div class="xianqige jsfix" data-movie="yes"></div>\
                        <div class="mengxiaomei jsfix" data-mode="top-right" data-movie="yes"></div>\
                        <div class="btn-xianqige ani jsfix"></div>\
                        <div class="btn-mengxiaomei ani jsfix" data-mode="top-right"></div>\
                        <div class="info jsfix" data-movie="yes"></div>\
                    </div>\
                    <div class="swiper-slide scene03">\
                        <div class="xianqige jsfix" data-movie="yes"></div>\
                        <div class="xianqige-words jsfix" data-mode="top-right"></div>\
                        <div class="qi-box"><div class="qi jsfix ani" data-mode="top-right" swiper-animate-effect="tada" swiper-animate-duration="0.8s" swiper-animate-delay="0.5s"></div></div>\
                        <div class="mengxiaomei jsfix" data-movie="yes"></div>\
                        <div class="mengxiaomei-words jsfix" data-mode="top-right"></div>\
                        <div class="meng-box"><div class="meng jsfix ani" data-mode="top-right" data-mode="top-right" swiper-animate-effect="tada" swiper-animate-duration="0.8s" swiper-animate-delay="0.5s"></div></div>\
                        <div class="s5 jsfix"><textarea maxlength="100"></textarea></div>\
                        <div class="line jsfix"></div>\
                        <div class="button jsfix"></div>\
                        <div class="mask"><div class="voice-loading jsfix" data-movie="yes"></div></div>\
                    </div>\
                    <div class="swiper-slide scene04">\
                        <div class="audio-words jsfix"></div>\
                        <div class="audio-sound jsfix" data-movie="yes"></div>\
                        <div class="audio-button-play audio-button jsfix"></div>\
                        <div class="xianqige jsfix" data-movie="yes"></div>\
                        <div class="mengxiaomei jsfix" data-movie="yes"></div>\
                        <div class="btn-retry jsfix"></div>\
                        <div class="btn-share jsfix" data-mode="top-right"></div>\
                        <div class="bottle jsfix" data-mode="top-right"></div>\
                        <div class="share">\
                            <div class="light jsfix" data-mode="top-right" data-movie="yes"></div>\
                            <div class="share-words jsfix"></div>\
                            <div class="two jsfix" data-movie="yes"></div>\
                        </div>\
                    </div>\
                    <div class="swiper-slide scene05">\
                        <div class="finished jsfix" data-movie="yes"></div>\
                        <div class="mengxiaomei jsfix" data-mode="top-right" data-movie="yes"></div>\
                        <div class="xianqige jsfix" data-movie="yes"></div>\
                    </div>\
                    <div class="swiper-slide scene06">\
                        <div class="two jsfix" data-movie="yes"></div>\
                        <div class="youhui jsfix"></div>\
                        <div class="words jsfix">点击领取京东优惠券</div>\
                        <div class="button jsfix"></div>\
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
    self.share = function (voiceId, nickname) {

        $.ajax({
            type: 'post',
            //url: host + '/share/jssdk',
            //data: { url: window.location.href, m: 'getWxConfig' },
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

                function callback(){
                    if (voiceId != 'none') {
                        self.scene.s05.open();
                        _hmt.push(['_trackEvent', '分享', '音频转换后']);
                    }
                    else {
                        _hmt.push(['_trackEvent', '分享', '音频转换前']);
                    }

                    
                }

                wx.ready(function () {
                    //var url = self.baseUrl + '/?man=' + (self.man ? 1 : 0) + '&nickname=' + encodeURIComponent(nickname) + '&voiceId=' + voiceId,
                    var url = self.baseUrl + '/?man=' + (self.man ? 1 : 0) + '&voiceId=' + voiceId,
                        title = '咸柠帮你说情话',
                        desc = '可以提高表白成功率哦 一般人我可不告诉TA',
                        imgUrl = self.cdnUrl + 'img/main/share.jpg';

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

















