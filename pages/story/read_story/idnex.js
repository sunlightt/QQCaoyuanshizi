const WxParse = require('../../../wxParse/wxParse.js');

const app = getApp();

var play_status_onoff = true;

var swiper_status = true;

var progress_status = true;


var lyricObj = "[ti:告白气球1]" +
    "[ar:周杰伦]" +
    "[al:周杰伦的床边故事]" +
    "[by:Love]" +
    "[00:00.00]告白气球" +
    "[00:04.55]词：方文山 曲：周杰伦" +
    "[00:09.23]演唱：周杰伦" +
    "[00:13.67]小灰灰歌词 xiaohuihui.net.cn" +
    "[00:22.92]塞纳河畔 左岸的咖啡" +
    "[00:26.04]我手一杯 品尝你的美" +
    "[00:28.95]留下唇印的嘴" +
    "[00:31.98]" +
    "[00:33.67]花店玫瑰 名字写错谁" +
    "[00:36.76]告白气球 风吹到对街" +
    "[00:39.61]微笑在天上飞" +
    "[00:42.67]" +
    "[00:43.07]你说你有点难追 想让我知难而退" +
    "[00:48.98]礼物不需挑最贵 只要香榭的落叶" +
    "[00:54.38]营造浪漫的约会 不害怕搞砸一切" +
    "[00:59.69]拥有你就拥有 全世界" +
    "[01:04.26]" +
    "[01:04.54]亲爱的 爱上你 从那天起" +
    "[01:10.98]甜蜜的很轻易" +
    "[01:14.96]亲爱的 别任性 你的眼睛" +
    "[01:21.76]在说我愿意" +
    "[01:25.68]" +
    "[01:30.54]LRC编辑：小灰灰 QQ:762229008" +
    "[01:44.12]" +
    "[01:48.18]塞纳河畔 左岸的咖啡" +
    "[01:51.36]我手一杯 品尝你的美" +
    "[01:54.31]留下唇印的嘴" +
    "[01:57.44]" +
    "[01:59.09]花店玫瑰 名字写错谁" +
    "[02:01.71]告白气球 风吹到对街" +
    "[02:04.78]微笑在天上飞" +
    "[02:07.97]" +
    "[02:08.31]你说你有点难追 想让我知难而退" +
    "[02:14.33]礼物不需挑最贵 只要香榭的落叶" +
    "[02:19.62]营造浪漫的约会 不害怕搞砸一切" +
    "[02:25.01]拥有你就拥有 全世界" +
    "[02:29.60]" +
    "[02:29.90]亲爱的 爱上你 从那天起" +
    "[02:36.48]甜蜜的很轻易" +
    "[02:40.44]亲爱的 别任性 你的眼睛" +
    "[02:47.09]在说我愿意" +
    "[02:50.80]" +
    "[02:51.29]亲爱的 爱上你 恋爱日记" +
    "[02:57.70]飘香水的回忆" +
    "[03:01.53]一整瓶 的梦境 全都有你" +
    "[03:08.39]搅拌在一起" +
    "[03:12.34]亲爱的别任性 你的眼睛" +
    "[03:20.33]在说我愿意" +
    "[03:27.47]";

function format(time) {
    console.log(time);
    var time = parseInt(time);
    console.log(time);
    var m = parseInt(time / 60);
    var s = parseInt(time % 60);
    m = zero(m);
    s = zero(s);
    function zero(num) {
        if (num < 10) {
            num = "0" + num;
        }
        return num;
    }
    return m + ":" + s;
}

//歌词处理
function lyric_ctrl(lyricstr, type) {

    var lyric_str = lyricstr.replace(/\r\n/g, "");
    var temp = lyric_str.split("[");
    var html = "";
    var lyric_arr = [];

    for (var i = 0; i < temp.length; i++) {
        var arr = temp[i].split("]");
        var text = (arr[1]);
        var time = arr[0].split(",");

        var temp2 = time[0].split(".");

        if (type != 'one') {

            var ms = temp2[1];//毫秒
            var temp3 = temp2[0].split(":");
            var s = temp3[1];//秒
            var m = temp3[0];//分

            // console.log('分', m);
            // console.log('秒', s);
            // console.log('毫秒', ms);


            var s_sum = parseInt(m * 60) + parseInt(s);


            if (text) {
                lyric_arr.push({ 'time': s_sum, 'text': text });
            }

        } else {

            var ms = temp2[1];//毫秒
            var temp3 = temp2[0].split(":");
            var s = temp3[1] + '.' + ms;//秒
            var m = temp3[0];//分

            // console.log('分', m);
            // console.log('秒', s);
            // console.log('毫秒', ms);

            var s_sum = parseInt(m * 60) + parseFloat(s);


            if (text) {
                lyric_arr.push({ 'time': s_sum, 'text': text });
            }


        }

    }

    return lyric_arr;

}


Page({

    data: {

        audio_data: [],
        go_read_words_pass: false,

        lyric_arr: [],

        lyric_words: '',

        //一句词
        lyric_words_arr: [],
        //单个词
        lyric_words_arr_one: [],

        audio_src: null,

        current_play_audio_index: 0

    },
    onReady: function (options) {

        var that = this;

        that.audioCtx = wx.createAudioContext('myAudio');

    },
    onLoad: function (options) {

        var that = this;

        // var lyric_arr = lyric_ctrl(lyricObj);

        that.setData({

            id: options.id,
            type: options.type
            // lyric_arr: lyric_arr

        });

        that.get_story_data();


    },
    get_story_data: function (e) {

        var that = this;

        wx.showLoading({
            title: '加载中'
        });

        wx.request({
            url: app.globalData.url + 'index.php/api/Index/read_story',
            data: {

                curriculum_id: that.data.id

            },
            success: function (res) {


                if (res.data.status == 200) {

                    var lyric_words_arr = that.data.lyric_words_arr;

                    var lyric_words_arr_one = that.data.lyric_words_arr_one;

                    var data = res.data.data;

                    for (var i = 0; i < data.length; i++) {

                        var lyric_arr = lyric_ctrl(res.data.data[i].music_lrc, 'lyric_arr');

                        var lyric_arr_one = lyric_ctrl(res.data.data[i].music_lrc2, 'one');

                        lyric_words_arr.push(lyric_arr);

                        lyric_words_arr_one.push(lyric_arr_one);

                    }

                    console.log(lyric_arr);

                    console.log(lyric_words_arr_one);

                    that.setData({

                        audio_data: res.data.data,

                        audio_src: res.data.data[0].voice,

                        lyric_words: lyric_words_arr[0][0].text,

                        lyric_words_arr: lyric_words_arr

                    });



                    WxParse.wxParse('article', 'html', lyric_words_arr[0][0].text, that, 5);


                } else {

                    wx.showToast({
                        title: '数据加载失败',
                        icon: 'loading',
                        duration: 1000
                    });

                }

                wx.hideLoading();
            },
            fail: function (res) {

                wx.hideLoading();

                wx.showToast({
                    title: '数据加载失败',
                    icon: 'loading',
                    duration: 1000
                });
            }
        })
    },
    read_rewords: function (e) {

        wx.navigateTo({
            url: '/pages/story/read_rewords/index?id=' + this.data.id
        });
    },
    read_story: function (e) {

        wx.navigateTo({
            url: '/pages/story/read_story/idnex'
        })
    },
    play_audio: function (e) {

        var that = this;

        if (play_status_onoff) {

            that.audioCtx.play();

            wx.showToast({
                title: '开始播放',
                icon: 'loading',
                duration: 1000
            });

            play_status_onoff = false;


        } else {

            wx.showToast({
                title: '播放暂停',
                icon: 'loading',
                duration: 1000
            });

            that.audioCtx.pause();

            play_status_onoff = true;

        }

        swiper_status = false;

    },
    change_view: function (e) {

        var that = this;

        swiper_status = true;

        play_status_onoff = true;

        var current_index = e.detail.current;

        var audio_data = that.data.audio_data;

        var lyric_words_arr = that.data.lyric_words_arr;

        var audio_src = that.data.audio_src;

        var current_play_audio_index = that.data.current_play_audio_index;

        // 播放暂停

        this.audioCtx.pause();

        if (audio_data[current_index]) {

            that.setData({

                current_play_audio_index: current_index,

                audio_src: audio_data[current_index].voice

            });

        }

        if (current_index == audio_data.length) {

            that.setData({

                go_read_words_pass: true

            });

            wx.request({
                url: app.globalData.url + 'index.php/api/Index/read_complete',
                data: {
                    uid: wx.getStorageSync('uid'),
                    curriculum_id: that.data.id,
                    type: that.data.type
                },
                success: function (res) {

                    console.log(res);

                }
            });


        } else {

            that.setData({

                go_read_words_pass: false

            });
        }

    },

    swiper_animationend: function (e) {

        // play_status_onoff = false;

        var that = this;

        var current_index = e.detail.current;

        var audio_data = that.data.audio_data;

        var lyric_words_arr = that.data.lyric_words_arr;

        var current_play_audio_index = that.data.current_play_audio_index;

        if (current_index == audio_data.length) {

            that.audioCtx.pause();

            play_status_onoff = true;

        } else {

            if (play_status_onoff && swiper_status) {

                that.audioCtx.play();

                play_status_onoff = false;

                that.setData({

                    lyric_words: lyric_words_arr[current_index][0].text

                });

                WxParse.wxParse('article', 'html', lyric_words_arr[current_index][0].text, that, 5);

            }

        }

    },

    time_update: function (e) {

        var that = this;

        var current_Time = e.detail.currentTime;

        console.log(current_Time);

        // var current_Time_split = e.detail.currentTime.split('.');

        // var current_Time_split_len = current_Time_split[1].length;

        var float_time = Math.floor(current_Time * 100) / 100;

        console.log(float_time);

        var parse_time = parseInt(current_Time);

        var current_play_audio_index = that.data.current_play_audio_index;

        var lyric_arr = that.data.lyric_words_arr[current_play_audio_index];

        var lyric_words_arr_one = that.data.lyric_words_arr_one[current_play_audio_index];

        var lyric_words = null;

        var current_diffence = null;

        for (var i = 0; i < lyric_arr.length; i++) {

            if (parse_time == lyric_arr[i].time) {

                lyric_words = lyric_arr[i].text;

                if (lyric_arr[i + 1].time){

                    that.setData({

                        lyric_words: lyric_arr[i].text,
                        current_diffence: (Number(lyric_arr[i + 1].time) - Number(lyric_arr[i].time))
                    });

                    current_diffence = Number(lyric_arr[i + 1].time) - Number(lyric_arr[i].time);

                }else{

                    that.setData({

                        lyric_words: lyric_arr[i].text,
                        current_diffence:3
                    });

                    current_diffence = 3;
                }


                console.log('当前时间', lyric_arr[i].time);

                console.log('下次时间', lyric_arr[i + 1].time);


                // var text_msg = '告白气球';

                // text_msg.replace(/白/, "黑");

                // var replace_text_msg = text_msg.replace(/白/, "<strong>黑</strong>");


                // WxParse.wxParse('article', 'html', lyric_arr[i].text, that, 5);

                that.set_color(current_diffence);
                
            }

        }

    },

    //当前文字颜色
    set_color: function (current_diffence) {

        var that = this;

        if (progress_status) {

            progress_status=false;

            var index = 0;

            var lyric_words = that.data.lyric_words;

            var lyric_words_arr = lyric_words.split('');

            var replace_lyric_words = null;

            clearInterval(timer);

            var difference = (current_diffence / lyric_words_arr.length) * 1000;

            console.log('时间差',difference);

            var timer = setInterval(function () {

                if (lyric_words_arr[index]) {

                    var reg_str = lyric_words_arr[index];

                    var reg = new RegExp(reg_str);

                    replace_lyric_words = lyric_words.replace(reg, "<strong>" + reg_str + "</strong>");

                    console.log(replace_lyric_words);

                    WxParse.wxParse('article', 'html', replace_lyric_words, that, 5);

                }

                if (index == lyric_words_arr.length-1){

                    clearInterval(timer);

                    progress_status=true;

                }

                index++;

            }, difference);


        }

    },

    play_end: function (e) {

        this.audioCtx.seek(0);

    }

})