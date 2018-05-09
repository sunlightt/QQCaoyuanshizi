
const app = getApp();

Page({

    data: {

        tip_msg: 'toast提示信息',
        showToast: false,
        current_index: 0,

        //读音是否正确
        result_status_error: false,
        result_status_right: false,

        words_data: null,
        savedFilePath: null,
        tempFilePath: null,
        start_record: false

    },
    onLoad: function (options) {

        var that = this;

        that.setData({

            id: options.id,
            type: options.type

        });

        that.get_wrods_data();

        // 授权
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.record']) {
                    wx.authorize({
                        scope: 'scope.record',
                        success() {

                            wx.showToast({
                                title: '授权成功',
                                icon: 'loading',
                                duration: 1000
                            });
                        }
                    })
                }
            },
            fail: function (res) {

                wx.showToast({
                    title: '授权失败',
                    icon: 'loading',
                    duration: 1000
                });

            }
        })

    },
    get_wrods_data: function (e) {

        var that = this;

        wx.showLoading({
            title: '加载中'
        });

        wx.request({
            url: app.globalData.url + 'index.php/api/Index/read_word',
            data: {

                curriculum_id: that.data.id

            },
            success: function (res) {

                wx.hideLoading();

                if (res.data.status == 200) {


                    that.setData({

                        words_data: res.data.data,
                        curriculum_id: res.data.data[0].id

                    });

                } else {

                    wx.showToast({
                        title: '数据加载失败',
                        icon: 'loading',
                        duration: 1000
                    });

                }
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
    startRecord: function (e) {

        var that = this;

        var id = that.data.curriculum_id;

        var words_data = that.data.words_data;

        var current_index = that.data.current_index;

        that.setData({

            start_record: true

        });

        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.record']) {
                    wx.authorize({
                        scope: 'scope.record',
                        success() {

                            wx.showToast({
                                title: '授权成功',
                                icon: 'loading',
                                duration: 1000
                            });
                        }
                    })
                } else {
                    wx.startRecord({
                        success: function (res) {

                            wx.showLoading({
                                title: '识别中'
                            });

                            var tempFilePath = res.tempFilePath;
                            wx.saveFile({
                                tempFilePath: tempFilePath,
                                success: function (response) {
                                    var savedFilePath = response.savedFilePath;
                                    wx.uploadFile({
                                        url: app.globalData.url + 'index.php/api/Index/vo_add',
                                        filePath: savedFilePath,
                                        name: 'file',
                                        formData: {
                                            'id': id
                                        },
                                        success: function (response) {


                                            console.log(response);

                                            wx.hideLoading();

                                            var response_data = JSON.parse(response.data);

                                            if (response_data.status == 200) {

                                                that.setData({
                                                    result_status_right: true
                                                   
                                                });

                                                setTimeout(function () {

                                                    that.setData({
                                                        current_index: Number(current_index) + 1
                                                    });

                                                }, 1000);

                                                if (current_index == words_data.length - 1) {

                                                    wx.request({
                                                        url: app.globalData.url + 'index.php/api/Index/read_complete',
                                                        data: {
                                                            uid: wx.getStorageSync('uid'),
                                                            curriculum_id: that.data.id,
                                                            type: that.data.type
                                                        },
                                                        success: function (res) {

                                                            if (res.data.status == 200) {

                                                                wx.navigateTo({
                                                                    url: '/pages/story/sotry_rewords_pass_end/index'
                                                                });

                                                                

                                                            }

                                                        }
                                                    })
                                                }

                                            } else {

                                                that.setData({
                                                    result_status_error: true
                                                });

                                                // that.setData({
                                                //     tip_msg: response_data.error,
                                                //     showToast: true,
                                                //     result_status:false
                                                // });

                                                // setTimeout(function () {

                                                //     that.setData({
                                                //         showToast: false
                                                //     });

                                                // }, 2000);

                                            }
                                        },
                                        fail: function (e) {

                                            wx.showModal({
                                                title: '提示',
                                                content: '上传失败',
                                                showCancel: false
                                            })
                                        }
                                    });

                                    that.setData({
                                        savedFilePath: savedFilePath
                                    });
                                }
                            })
                        },
                        fail: function (res) {
                            //录音失败
                        }
                    });
                }
            },
            fail: function (res) {

                wx.showToast({
                    title: '授权失败',
                    icon: 'loading',
                    duration: 1000
                });

            }
        })
    },
    stopRecord: function (e) {

        var that = this;

        wx.stopRecord();

        that.setData({

            start_record: false

        });

    },
    change_view: function (e) {

        var that = this;

        var current_index = e.detail.current;
        var words_data = that.data.words_data;

        that.setData({

            curriculum_id: words_data[current_index].id,
            result_status_error: false,
            result_status_right: false,
            current_index: current_index

        });




    },
});