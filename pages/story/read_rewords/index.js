
const app=getApp();

Page({

    data:{

        words_data:null
    },

    onLoad: function (options) {

        var that = this;

        that.setData({

            id: options.id,
            type: options.type

        });


        that.get_wrods_data();
    },
    get_wrods_data:function(e){

        var that=this;

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

                        words_data:res.data.data

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
    read_words:function(e){
       
       var that=this;

       wx.navigateTo({
           url: '/pages/story/read_rewords_pass/index?id=' + that.data.id+'&type='+that.data.type
       })

    }

 
})