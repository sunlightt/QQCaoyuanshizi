
Page({
    
    data:{

        title:null
    },
 
    onLoad:function(options){

       
        var that=this;

        console.log(options);


        that.setData({

            title:options.title

        });

    },

    story_video:function(e){

        wx.navigateTo({
             url: '/pages/story/story_video/index'
        })
         
    },
    story_read:function(e){

        wx.navigateTo({
            url: '/pages/story/read_story/idnex'
        })
    },
    read_rewords_pass:function(e){

        wx.navigateTo({
            url: '/pages/story/read_rewords_pass/index'
        })

    }
 
})