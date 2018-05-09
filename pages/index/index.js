var app = getApp();

let get_data_listonoff = true;

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

                                    app.globalData.openid = response.data.data.openid;

                                    wx.setStorageSync('openid', response.data.data.openid);

                                    wx.setStorageSync('uid', response.data.data.uid);

                                    wx.request({
                                        url: app.globalData.url + 'index.php/api/Index/home',
                                        data: {
                                            uid: response.data.data.uid,
                                            page: page,
                                            page_size: that.data.page_size
                                        },
                                        success: function (resdata) {

                                            wx.hideLoading();

                                            if (resdata.data.status == 200) {


                                                var data_inf = resdata.data.data.res;

                                                var old_data_inf = that.data.data_inf;


                                                if (page == 1) {

                                                    that.setData({

                                                        data_inf: data_inf,
                                                        totalpage: resdata.data.data.totalpage

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

        }
    },
    story_dir: function (e) {

        var title = e.currentTarget.dataset.title;
        var describe = e.currentTarget.dataset.describe;
        var price = e.currentTarget.dataset.price;
        var url = e.currentTarget.dataset.url;
        var id = e.currentTarget.dataset.id;
        var lock_status = e.currentTarget.dataset.lock_status =='lock' ? true : false;

        if (lock_status){

            wx.navigateTo({
                url: '/pages/pay/index?title=' + title + '&describe=' + describe + '&price=' + price + '&url=' + url + '&id=' + id
            });

            return;

        }

        wx.navigateTo({
            url: '/pages/story/dir/index?title=' + title + '&id=' + id
        })

    },
    down_loading: function (e) {


        var that = this;

        var current_page = that.data.page;

        current_page++;

        var totalpage = that.data.totalpage;

        if (current_page <= totalpage) {

            that.get_data_inf(current_page);

        } else {

            wx.showToast({
                title: '已加载完',
                icon: 'loading',
                duration: 1000
            });

            that.setData({

                last_item: true

            });

            return;

        }

        that.setData({

            page: current_page

        });
    },
    onShareAppMessage:function(e){
        return {
            title: '青青草原',
            path: '/pages/index/index',
            success: function (res) {
                wx.showToast({
                    title: '分享成功',
                    icon: 'loading',
                    duration: 1000
                });
            }
        }
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
