//index.js
import QQMap from "../../utils/qqmap-wx-jssdk.min";
//获取应用实例
var  qqmapsdk;
const app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      active:0,zx_list:[],
      jl_list:[],

      city:''
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
        if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
        } else if (this.data.canIUse){
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })
        }

      // 实例化API核心类
      wx.setNavigationBarTitle({
          title: '求购'
      });
  },

    onShow: function () {
        // 调用接口
        // qqmapsdk.search({
        //     keyword: '酒店',
        //     success: function (res) {
        //         console.log(res);
        //     },
        //     fail: function (res) {
        //         console.log(res);
        //     },
        //     complete: function (res) {
        //         console.log(res);
        //     }
        // });
    },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
    // 关闭
    popClose:function () {
        this.setData({
            canIUse:false,
            hasUserInfo:false
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

    },
    onMakePhoneCall:function (){
        var that=this;
        wx.makePhoneCall({
            phoneNumber:'18988936665'
        })
    },
    onCopy:function () {
        wx.setClipboardData({
            data: 'data',
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        console.log(res.data)
                    }
                })
            }
        })
    }
});
