Page({

    data: {
        current_view:'view0',
        current_text:'木',
        story_data:[
            {
                top: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img1.png',
                bottom: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img2.png',
                text:'木'
            },
            {
                top: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img1.png',
                bottom: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img2.png',
                text: '休'
            },
            {
                top: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img1.png',
                bottom: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img2.png',
                text: '林'
            },
            {
                top: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img1.png',
                bottom: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img2.png',
                text: '森'
            },
            {
                top: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img1.png',
                bottom: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img2.png',
                text: '沐'
            },
            {
                top: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img1.png',
                bottom: 'http://p6v1wjzjz.bkt.clouddn.com/pro_img2.png',
                text: '淋'
            }
        ]
    },
    read_story: function (e) {

        wx.navigateTo({
            url: '/pages/story/read_story/idnex'
        })

    },
    change_view: function (e) {

        var that=this;

        var current_index = e.detail.current;
        var current_view ='view'+e.detail.current;

        var story_data = that.data.story_data;

        that.setData({
            current_view: current_view,
            current_text: story_data[current_index].text
        })

        console.log(current_view);

    }

})