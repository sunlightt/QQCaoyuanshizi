
const app = getApp();

Page({

    onLoad: function (options) {

        var that = this;

        that.setData({
            title: options.title,
            describe: options.describe,
            price: options.price,
            url: options.url,
            id: options.id,
        });

    },

    pay: function (e) {

        var that = this;

        wx.request({
            url: app.globalData.url + 'index.php/api/Pay/goto_pay',
            data: {
                openid: wx.getStorageSync('openid'),
                uid: wx.getStorageSync('uid'),
                curriculum_id: that.data.id,
                price: that.data.price
            },
            success: function (reponse) {


                if (reponse.data.status == 200) {

                    var appId = reponse.data.data.appId;
                    var nonceStr = reponse.data.data.nonceStr;
                    var package1 = reponse.data.data.package;
                    var paySign = reponse.data.data.paySign;
                    var signType = reponse.data.data.signType;

                    var timeStamp = reponse.data.data.timeStamp;

                    wx.requestPayment({

                        'nonceStr': nonceStr,
                        'package': package1,
                        'signType': signType,
                        'timeStamp': timeStamp,
                        'paySign': paySign,
                        'success': function (res) {

                            wx.showToast({ title: '支付成功', icon: 'success', duration: 2000 });

                            setTimeout(function doHandler() {

                                wx.reLaunch({
                                    url: '/pages/index/index'
                                })

                            }, 2000);

                        },
                        'fail': function (res) {

                            wx.showToast({ title: '支付失败', icon: 'loading', duration: 2000 });

                        }
                    })


                } else {

                    wx.showToast({
                        title: '支付失败',
                        icon: 'loading',
                        duration: 1000
                    });
                }

            },
            fail: function (res) {

                wx.showToast({
                    title: '支付失败',
                    icon: 'loading',
                    duration: 1000
                });
            }
        });
    }
   

})