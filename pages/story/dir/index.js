
Page({
    
    data:{

        title:null
    },
 
    onLoad:function(options){

       
        var that=this;

        that.setData({

            title:options.title,
            id: options.id

        });

    },

    story_video:function(e){

        wx.navigateTo({
             url: '/pages/story/story_video/index?id='+this.data.id+'&type='+e.currentTarget.dataset.type
        })
         
    },
    story_read:function(e){

        wx.navigateTo({
            url: '/pages/story/read_story/idnex?id=' + this.data.id + '&type=' + e.currentTarget.dataset.type
        })
    },
    read_rewords_pass:function(e){

        wx.navigateTo({
            url: '/pages/story/read_rewords/index?id=' + this.data.id + '&type=' + e.currentTarget.dataset.type
        })

    }
 
})