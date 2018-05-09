//app.js
App({
    onLaunch: function () {


        var that = this;

        // 登录
        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.request({
                        //获取openid接口  
                        url: that.globalData.url + 'index.php/api/Api/get_openid_api',
                        header: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            code: res.code
                        },
                        method: 'GET',
                        success: function (response) {
                            if (response.data.status == 200) {


                                that.globalData.openid = response.data.data.openid;
                                wx.setStorageSync('openid', response.data.data.openid);

                                wx.setStorageSync('uid', response.data.data.uid);

                                wx.getUserInfo({
                                    success: function (respon) {
                                        that.globalData.userInfo = respon.userInfo;
                                        wx.request({
                                            url: that.globalData.url +'index.php/api/Api/get_info',
                                            data: {
                                                uid: response.data.data.uid,
                                                nickname: respon.userInfo.nickName,
                                                avatar: respon.userInfo.avatarUrl
                                            },
                                            success: function (resdata) {
                                                
                                                if (resdata.data.status != 200) {

                                                    wx.showToast({
                                                        title: '存储信息失败',
                                                        icon: 'loading',
                                                        duration: 1000
                                                    });

                                                }
                                            },
                                            fail: function () {
                                                wx.showToast({
                                                    title: '存储信息失败',
                                                    icon: 'loading',
                                                    duration: 1000
                                                });
                                            }
                                        })
                                    },
                                    fail: function (res) {

                                        wx.showLoading({
                                            title: '授权才可正常使用',
                                        });

                                        setTimeout(function () {

                                            wx.hideLoading();

                                            wx.getSetting({
                                                success: (res) => {

                                                    if (!res.authSetting['scope.userInfo']) {

                                                        wx.openSetting({
                                                            success: (response) => {

                                                                wx.showToast({
                                                                    title: '请重新授权',
                                                                    icon: 'loading',
                                                                    duration: 1000
                                                                });

                                                            }
                                                        })

                                                    }
                                                }
                                            })

                                        }, 1000);
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

    },
    globalData: {
        userInfo: null,
        url: 'https://safe.yuanchuangyuan.com/'
    }
})