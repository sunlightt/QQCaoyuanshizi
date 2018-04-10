var  app = getApp();

let get_data_listonoff = true;

Page({

    data: {

        page: 1,
        page_size: 5,
        data_inf: null

    },
    onLoad: function (options) {

        var that = this;

        console.log('ceshi');


        that.get_data_inf();

    },

    get_data_inf: function (page) {

        var that = this;
        
        wx.showLoading({
            title: '加载中'
        });

        if (get_data_listonoff) {
            get_data_listonoff = false;
            wx.login({
                success: function (res) {
                    if (res.code) {
                        wx.request({
                            //获取openid接口  
                            url: app.globalData.url + 'index.php/api/Api/get_openid_api',
                            header: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                code: res.code
                            },
                            method: 'GET',
                            success: function (response) {
                                if (response.data.status == 200) {
                                    console.log(response.data);

                                    console.log(response.data.data.uid);

                                    app.globalData.openid = response.data.data.openid;

                                    wx.setStorageSync('openid', response.data.data.openid);

                                    wx.setStorageSync('uid', response.data.data.uid);

                                    wx.request({
                                        url: app.globalData.url + 'index.php/api/Index/home',
                                        data: {
                                            uid: response.data.data.uid,
                                            page: that.data.page,
                                            page_size: that.data.page_size
                                        },
                                        success: function (resdata) {

                                            wx.hideLoading();

                                            if (resdata.data.status == 200) {

                                                that.setData({

                                                    data_inf: resdata.data.data.res

                                                })

                                            } else {

                                            }
                                        }
                                    })

                                } else {
                                    wx.showToast({
                                        title: '获取用户信息失败',
                                        icon: 'loading',
                                        duration: 1000
                                    })
                                    return;
                                }
                            },
                            fail: function (res) {
                                

                                wx.showToast({
                                    title: '获取用户信息失败',
                                    icon: 'loading',
                                    duration: 1000
                                });

                                return;

                            }
                        })

                    } else {
                        console.log('获取用户登录态失败！' + res.errMsg);
                    }

                }
            });
        } else {

            wx.request({
                url: app.globalData.url + 'index.php/api/Index/home',
                data: {
                    uid: wx.getStorageSync('uid'),
                    page: that.data.page,
                    page_size: that.data.page_size
                },
                success: function (res) {

                    wx.hideLoading();

                    if (res.data.status == 200) {

                        that.setData({

                            data_inf: res.data.data.res

                        })

                    } else {

                    }
                }
            })

        }
    },
    story_dir: function (e) {

        var title=e.currentTarget.dataset.title;

        wx.navigateTo({
            url: '/pages/story/dir/index?title=' + title
        })

    }

})
