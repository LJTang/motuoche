var app = getApp();
Page({
    data: {
        screenWidth: 0,
        screenHeight:0,
        imgwidth:0,
        imgheight:0,
    },
    onLoad: function() {
        var _this = this;
        wx.getSystemInfo({
            success: function(res) {
                _this.setData({
                    screenHeight: res.windowHeight,
                    screenWidth: res.windowWidth,
                });
            }
        });
    },
    imageLoad: function(e) {
        var _this=this;
        var $width=e.detail.width,    //获取图片真实宽度  
            $height=e.detail.height,
            ratio=$width/$height;   //图片的真实宽高比例  
        var viewWidth=500,           //设置图片显示宽度，  
            viewHeight=500/ratio;    //计算的高度值     
        this.setData({
            imgwidth:viewWidth,
            imgheight:viewHeight
        })
    }
});