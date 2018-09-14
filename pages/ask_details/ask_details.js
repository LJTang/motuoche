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
      location:{},
      jl_list:[],
      d_id:'',
      details:'',
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
    },
  onLoad: function (options) {
      var that = this;
      that.setData({
          d_id:options.id
      });
        if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
        } else if (this.data.canIUse){
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
      wx.setNavigationBarTitle({
          title: '求购详情'
      });
  },

    onShow: function () {
        var that=this;
        var lon,lat;
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                lat = res.latitude;
                lon = res.longitude;
                var speed = res.speed;
                var accuracy = res.accuracy;
                that.setData({
                    location:{
                        latitude: res.latitude,
                        longitude: res.longitude
                    }
                });
                qqmapsdk = new QQMap({
                    key: 'F4BBZ-AEFLP-2GDDZ-L6G57-KP3A2-CDF3L'
                });

                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: lat,
                        longitude:lon
                    },
                    success: function(res) {
                        that.setData({
                            city:res.result.address_component.city,
                            location:{
                                latitude:res.result.location.lat,
                                longitude:res.result.location.lng
                            }
                        });
                        app.doSend('qiugou_detail',{goods_id:that.data.d_id,lng:res.result.location.lng,lat:res.result.location.lat},'GET').then((res)=>{
                            if (res.status_code== 200) {
                                that.setData({
                                    details: res.data,
                                    url: res.url
                                });
                            }else{
                                wx.showToast({
                                    title: res.message,
                                    icon: 'none',
                                })
                            }
                        }).catch((errMsg) =>{});
                    },
                    fail: function(res) {},
                    complete: function(res) {}
                });
            }
        });

    },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
    onMakePhoneCall:function (){
        var that=this;
        wx.makePhoneCall({
            phoneNumber:that.data.details.goods.mobile
        })
    },
    onCopy:function () {
        var that=this;
        wx.setClipboardData({
            data:that.data.details.goods.wechat_number,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title:'复制成功',
                            icon:'none',
                            duration: 2000
                        });
                    }
                })
            }
        })
    }
});
