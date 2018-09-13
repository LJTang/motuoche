//index.js
import QQMap from "../../utils/qqmap-wx-jssdk.min";
//获取应用实例
var  qqmapsdk;
const app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
      imgUrls: [
          '/images/list1.png',
          '/images/list1.png',
          '/images/list1.png'
      ],
      nav: [
          { img: "/images/foot_nav1_a.png", url: "/pages/index/index", type:"", text: "首页", on: true },
          { img: "/images/foot_nav2.png", url: "/pages/merchant/merchant", type:"", text: "商家", on: false },
          { img: "/images/fa.png", url: "/pages/publish/publish", text: "发布 ", type:"", on: false },
          { img: "/images/foot_nav4.png", url:"", text: "客服", type:"contact",on: false },
          { img: "/images/foot_nav5.png", url: "/pages/my_index/my_index", text: "我的", type:"", on: false },
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      active:0,zx_list:[],
      jl_list:[],
      address_Array: [],
      location:{},
      city:'',
      banner:[],
      banner_mid:'',
      notice:'',
      home_Goods:[],
      intPageIndex:1,
      height:null,
      loadMoreHidden: true,
      noMoreHidden:true,
      inLoadHidden:true,
      last_page:null
  },
  //事件处理函数
    cutNav: function (e) {
        var that = this;
        var current = e.currentTarget.dataset.index;
        this.setData({
            active: current,
        });
        that.setData({
            home_Goods:[]
        });

        app.post('home',{lng:that.data.location.longitude,lat:that.data.location.latitude,address:that.data.city,juli:(current==1?'asc':''),page:1},'GET').then((res)=>{
            that.setData({
                home_Goods:res.goods
            });
            if(res.last_page<=1){
                that.setData({
                    loadMoreHidden: true,
                    noMoreHidden: false,
                    inLoadHidden: true
                });
            }else{
                that.data.intPageIndex++;
                that.setData({
                    loadMoreHidden: true,
                    noMoreHidden: true,
                    inLoadHidden:false
                })
            }
        }).catch((errMsg) => {
        });
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
                  that.setData({
                      location:{
                          latitude: res.latitude,
                          longitude: res.longitude
                      }
                  });
                  console.log(res.latitude, res.longitude);
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
                          // app.post('home',{lng:res.result.location.lng,lat:res.result.location.lat,address:that.data.city,juli:'asc',page:1},'GET').then((res)=>{
                          //     that.setData({
                          //     })
                          // }).catch((errMsg) => {
                          // });
                      },
                      fail: function(res) {

                      },
                      complete: function(res) {

                      }
                  });
              }
          });
      // 实例化API核心类
      wx.getSystemInfo({
          success: function(res) {
              var rpx=(res.windowHeight/750);
              that.setData({
                  height:res.windowHeight/2
              });
          }
      });
  },

    onShow: function () {
      var that=this;
        that.setData({
            banner:[],
            banner_mid:'',
            notice:'',
            home_Goods:[]
        });

        app.post('home',{lng:'',lat:'',address:'',juli:'',page:that.data.intPageIndex},'GET').then((res)=>{
            that.setData({
                banner:res.banner,
                banner_mid:res.banner_mid,
                notice:res.notice,
                home_Goods:res.goods,
                last_page:res.last_page
            });

            if(res.last_page<=1){
                that.setData({
                    loadMoreHidden: true,
                    noMoreHidden: false,
                    inLoadHidden: true
                });
            }else{
                that.data.intPageIndex++;
                that.setData({
                    loadMoreHidden: true,
                    noMoreHidden: true,
                    inLoadHidden:false
                })
            }
        }).catch((errMsg) => {
        });
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
        }else if(index==2){
            wx.navigateTo({
                url:url
            })
        }else{
            wx.reLaunch({
                url: url
            })
        }

    },
    upper: function(e) {},
    lower: function(e) {
        if(this.data.last_page>this.data.intPageIndex){
            this.onGetConnect();
        }else{
            this.setData({
                loadMoreHidden: true,
                noMoreHidden: false,
                inLoadHidden: true
            });
        }

    },
    scroll: function() {},
    tap: function (e){},
    tapMove: function (e){},
    onGetConnect:function (){
        this.setData({
            loadMoreHidden: true,
            noMoreHidden: true,
            inLoadHidden: true
        });
        var that=this;
        app.post('home',{lng:that.data.location.longitude,lat:that.data.location.latitude,address:that.data.city,juli:'asc',page:that.data.intPageIndex},'GET').then((res)=>{

            if(res.last_page>= that.data.intPageIndex){
                var goods=that.data.home_Goods;
                for(var i=0;i<res.goods.length;i++){
                    goods.push(res.goods[i]);
                }
                that.data.intPageIndex++;
                that.setData({
                    home_Goods:goods,
                    loadMoreHidden: true,
                    noMoreHidden: true,
                    inLoadHidden: false
                })

            }else{
                this.setData({
                    loadMoreHidden: true,
                    noMoreHidden: false,
                    inLoadHidden: true
                });
            }
            console.log(that.data.noMoreHidden)
        }).catch((errMsg) => {
        });
    }
});
