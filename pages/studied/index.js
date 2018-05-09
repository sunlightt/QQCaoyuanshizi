var app = getApp();

Page({

    data: {

        page: 1,
        page_size: 5,
        data_inf: null,

        last_item: false

    },
    onLoad: function (options) {


        var that = this;


        that.get_data_inf();


    },
    get_data_inf: function (page) {

        var that = this;

        if (!page) {

            page = 1;

        }

        wx.showLoading({
            title: '加载中'
        });

        wx.request({
            url: app.globalData.url + 'index.php/api/Index/already_do',
            data: {
                uid: wx.getStorageSync('uid'),
                page: page,
                page_size: that.data.page_size
            },
            success: function (res) {

                wx.hideLoading();

                if (res.data.status == 200) {


                    var data_inf = res.data.data.res;

                    var old_data_inf = that.data.data_inf;


                    if (page == 1) {

                        that.setData({

                            data_inf: data_inf,
                            totalpage: res.data.data.totalpage

                        });

                    } else {

                        for (var i = 0; i < data_inf.length; i++) {

                            old_data_inf.push(data_inf[i]);

                        }

                        that.setData({

                            data_inf: old_data_inf

                        });

                    }

                    wx.hideLoading();

                } else {

                    wx.showToast({
                        title: '获取数据失败',
                        icon: 'loading',
                        duration: 1000
                    });

                }
            },
            fail: function (res) {

                wx.showToast({
                    title: '获取数据失败',
                    icon: 'loading',
                    duration: 1000
                });
            }
        })
    },
    onPullDownRefresh: function (e) {

        var that = this;

        wx.stopPullDownRefresh();

        that.setData({
            page: 1,
            page_size: 5,
            data_inf: null,
            last_item: false

        });

        that.get_data_inf();

    }


})