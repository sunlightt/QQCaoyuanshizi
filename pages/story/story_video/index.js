
var app = getApp();

Page({

    data: {
        current_view: 'view0',
        current_text: '',
        story_data: [],
        play_video_onoff: false,
        current_index: 0,
        video_src: null,
        poster_src: null
    },
    onLoad: function (options) {

        var that = this;

        that.setData({

            id: options.id,
            type: options.type

        });

        that.get_story_video_data();

    },

    get_story_video_data: function (e) {

        var that = this;

        wx.request({
            url: app.globalData.url + 'index.php/api/Index/word_story',
            data: {

                curriculum_id: that.data.id

            },
            success: function (res) {

                if (res.data.status == 200) {

                    if (res.data.data.length > 0) {

                        that.setData({

                            story_data: res.data.data,
                            current_text: res.data.data[0].words,
                            video_src: res.data.data[0].url,
                            poster_src: res.data.data[0].img

                        });

                    }else{

                        that.setData({

                            play_video_onoff:false

                        });

                    }

                } else {

                    wx.showToast({
                        title: '数据加载失败',
                        icon: 'loading',
                        duration: 1000
                    });

                }
            },
            fail: function (res) {

                wx.showToast({
                    title: '数据加载失败',
                    icon: 'loading',
                    duration: 1000
                });
            }
        })
    },
    read_story: function (e) {

        wx.navigateTo({
            url: '/pages/story/read_story/idnex'
        })

    },
    change_view: function (e) {

        var that = this;

        var current_index = e.detail.current;
        var current_view = 'view' + e.detail.current;

        var story_data = that.data.story_data;

        if (current_index == story_data.length) {

            that.setData({

                play_video_onoff: false

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
            })

            return;
        }

        that.setData({
            play_video_onoff: false,
            current_view: current_view,
            current_text: story_data[current_index].words,
            current_index: current_index,
            video_src: story_data[current_index].url,
            poster_src: story_data[current_index].img
        })

    },
    play_video: function (e) {

        var that = this;
        that.setData({

            play_video_onoff: true

        }, function () {

            console.log('完成');

            // 创建video实例
            // this.audioCtx = wx.createAudioContext('myAudio');

            // this.audioCtx.seek(5)

            // this.audioCtx.play()

        });

    },
    review_study: function (e) {

        var that = this;

        var current_index = 0;
        var current_view = 'view' + e.detail.current;

        var story_data = that.data.story_data;

        that.setData({
            current_view: current_view,
            current_text: story_data[current_index].words,
            current_index: current_index,
            video_src: story_data[current_index].url,
            poster_src: story_data[current_index].img
        })

    }

})