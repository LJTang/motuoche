//index.js
import QQMap from "../../utils/qqmap-wx-jssdk.min";
//获取应用实例
var  qqmapsdk;
const app = getApp();
Page({
  data: {
      popUP_Bool: false,
      height:null
  },
  //事件处理函数
    cutNav: function (e) {
        var that = this;
        var current = e.currentTarget.dataset.index;
        this.setData({
            active: current,
            zx_list:[],
            jl_list:[]
        });
        // GMAPI.doSendMsg('api/Goods/goods_list',{type:that.data.active}, 'POST', that.onMsgCallBack_Home);
    },
  onLoad: function () {
      var that = this;
      wx.getSystemInfo({
          success: function(res) {
              var rpx=(res.windowWidth / 750);
              that.setData({
                  height:res.windowHeight
              });
          }
      });
      wx.setNavigationBarTitle({
          title: '养护及其他'
      });
  },

    onShow: function () {

    },
    // 关闭
    popOpen:function () {
        this.setData({
            popUP_Bool:true
        });
    },
    // 关闭
    popClose:function () {
        this.setData({
            popUP_Bool:false
        });
    },

    //选择
    bindPickerChange: function(e) {
        var that=this;
        var index=parseInt(e.detail.value);
        var list=this.data.address_Array;
        this.setData({
            address_id:list[index].id,
            city:list[index].name
        });
    },
    jump:function (e) {
        var url=e.currentTarget.dataset.url;
        var index=e.currentTarget.dataset.index;
        if(index==3){
            return;
        }else{
            wx.reLaunch({
                url: url
            })
        }

    }
});
