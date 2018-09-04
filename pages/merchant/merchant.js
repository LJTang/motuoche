//index.js
import QQMap from "../../utils/qqmap-wx-jssdk.min";
//获取应用实例
var  qqmapsdk;
const app = getApp();
Page({
  data: {
    popUP_Bool: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
      imgUrls: [
          '/images/list1.png',
          '/images/list1.png',
          '/images/list1.png'
      ],
      nav: [
          { img: "/images/foot_nav1.png", url: "/pages/index/index", type:"", text: "首页", on: false },
          { img: "/images/foot_nav2_a.png", url: "/pages/merchant/merchant", type:"", text: "商家", on: true },
          { img: "/images/fa.png", url: "/pages/login/login", text: "发布 ", type:"", on: false },
          { img: "/images/foot_nav4.png", url:"", text: "客服", type:"contact",on: false },
          { img: "/images/foot_nav5.png", url: "/pages/my_index/my_index", text: "我的", type:"", on: false },
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      active:0,zx_list:[],
      jl_list:[],
      address_Array: [
          {
              id: 0,
              name: '美国'
          },
          {
              id: 1,
              name: '中国'
          },
          {
              id: 2,
              name: '巴西'
          },
          {
              id: 3,
              name: '日本'
          }
      ],
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
        var lon,lat;
        wx.getLocation({
              type: 'wgs84',
              success: function(res) {
                  lat = res.latitude;
                  lon = res.longitude;
                  var speed = res.speed;
                  var accuracy = res.accuracy;

                  qqmapsdk = new QQMap({
                      key: 'OX4BZ-M7UKU-HQJVB-2WYDC-BAPLT-KFBSF'
                  });
                  // 39.984060,116.307520
                  qqmapsdk.reverseGeocoder({
                      location: {
                          latitude: lat,
                          longitude:lon
                      },
                      success: function(res) {
                          that.setData({
                              city:res.result.address_component.city
                          })
                      },
                      fail: function(res) {

                      },
                      complete: function(res) {

                      }
                  });
              }
          });
      // 实例化API核心类
      wx.setNavigationBarTitle({
          title: '商家'
      });
  },

    onShow: function () {

    },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
        }else if(index==2){
            wx.navigateTo({
                url:url
            })
        }else{
            wx.reLaunch({
                url: url
            })
        }

    }
});
