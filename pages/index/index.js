//index.js
import QQMap from "../../utils/qqmap-wx-jssdk.min";
var tcity = require("../../utils/citys.js");
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
      // city:'',
      banner:[],
      banner_mid:'',
      notice:'',
      home_Goods:[],
      intPageIndex:1,
      height:null,
      loadMoreHidden: true,
      noMoreHidden:true,
      inLoadHidden:true,
      last_page:null,
      condition:false,
      provinces: [],
      province: "",
      citys: [],
      city: "",
      countys: [],
      county: '',
      values: '',
      cityData: '',
      juli: ''
  },
  //事件处理函数
    cutNav: function (e) {
        var that = this;
        var current = e.currentTarget.dataset.index;
        this.setData({
            active: current,
            home_Goods:[],
            intPageIndex:1,
            juli:(current==1?'asc':'')
        });
        this.onGetConnect();
    },
    onLoad: function () {
      var that = this;
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']){
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            // this.globalData.userInfo = res.userInfo;
                            that.setData({
                                userInfo:res.userInfo,
                                hasUserInfo:false
                            });

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)

                            }
                            // GMAPI.doSendMsg('api/user/userInfo',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_BusinessTips);

                        }
                    })
                }else{
                    that.setData({
                        hasUserInfo:true
                    });
                }
            }
        });

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
                            city: res.result.address_component.city,
                            location: {
                                latitude: res.result.location.lat,
                                longitude: res.result.location.lng,
                                banner:[],
                                banner_mid:'',
                                notice:'',
                                home_Goods:[]
                            }
                        });
                        app.doSend('home',{lng:that.data.location.longitude,lat:that.data.location.latitude,address:that.data.city,juli:'',page:that.data.intPageIndex},'GET').then((res)=>{
                            if (res.status_code== 200) {
                                that.setData({
                                    banner:res.data.banner,
                                    banner_mid:res.data.banner_mid,
                                    notice:res.data.notice,
                                    last_page:res.data.last_page
                                });
                                var goods = that.data.home_Goods;
                                if (res.data.last_page == that.data.intPageIndex) {
                                    for (var i = 0; i < res.data.goods.length; i++) {
                                        goods.push(res.data.goods[i]);
                                    }
                                    that.data.intPageIndex++;
                                    that.setData({
                                        home_Goods: goods,
                                        loadMoreHidden: true,
                                        noMoreHidden: true,
                                        inLoadHidden: false
                                    })

                                } else if (res.data.last_page > that.data.intPageIndex) {
                                    for (var i = 0; i < res.data.goods.length; i++) {
                                        goods.push(res.data.goods[i]);
                                    }
                                    that.data.intPageIndex++;
                                    that.setData({
                                        home_Goods: goods,
                                        loadMoreHidden: true,
                                        noMoreHidden: true,
                                        inLoadHidden: false
                                    })

                                } else {
                                    this.setData({
                                        loadMoreHidden: true,
                                        noMoreHidden: false,
                                        inLoadHidden: true
                                    });
                                }
                            }else{
                                this.setData({
                                    loadMoreHidden: true,
                                    noMoreHidden: false,
                                    inLoadHidden: true
                                });
                            }
                        }).catch((errMsg) => {});
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

      tcity.init(that);
      var cityData = that.data.cityData;
      const provinces = [];
      const citys = [];
      const countys = [];
      for (let i = 0; i < cityData.length; i++) {
          provinces.push(cityData[i].name);
      }
      for (let i = 0; i < cityData[0].sub.length; i++) {
          citys.push(cityData[0].sub[i].name)
      }
      for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
          countys.push(cityData[0].sub[0].sub[i].name)
      }
      that.setData({
          'provinces': provinces,
          'citys': citys,
          'countys': countys,

      })
  },
    onShow: function () {
      var that=this;
      /*
        that.setData({
            banner:[],
            banner_mid:'',
            notice:'',
            home_Goods:[]
        });

        app.doSend('home',{lng:that.data.location.longitude,lat:that.data.location.latitude,address:that.data.city,juli:'',page:that.data.intPageIndex},'GET').then((res)=>{
                            if (res.status_code== 200) {
                                that.setData({
                                    banner:res.data.banner,
                                    banner_mid:res.data.banner_mid,
                                    notice:res.data.notice,
                                    last_page:res.data.last_page
                                });
                                var goods = that.data.home_Goods;
                                if (res.data.last_page == that.data.intPageIndex) {
                                    for (var i = 0; i < res.data.goods.length; i++) {
                                        goods.push(res.data.goods[i]);
                                    }
                                    that.data.intPageIndex++;
                                    that.setData({
                                        home_Goods: goods,
                                        loadMoreHidden: true,
                                        noMoreHidden: true,
                                        inLoadHidden: false
                                    })

                                } else if (res.data.last_page > that.data.intPageIndex) {
                                    for (var i = 0; i < res.data.goods.length; i++) {
                                        goods.push(res.data.goods[i]);
                                    }
                                    that.data.intPageIndex++;
                                    that.setData({
                                        home_Goods: goods,
                                        loadMoreHidden: true,
                                        noMoreHidden: true,
                                        inLoadHidden: false
                                    })

                                } else {
                                    this.setData({
                                        loadMoreHidden: true,
                                        noMoreHidden: false,
                                        inLoadHidden: true
                                    });
                                }
                            }else{
                                this.setData({
                                    loadMoreHidden: true,
                                    noMoreHidden: false,
                                    inLoadHidden: true
                                });
                            }
                        }).catch((errMsg) => {});
                        */

    },

    // 授权
    getUserInfo: function (e) {
        var that=this;
        this.setData({
            popUp_Bool:false
        });
        if(e.detail.errMsg=='getUserInfo:ok'){
            app.globalData.userInfo = e.detail.userInfo;
            wx.setStorage({
                key: 'getUserInfo',
                data: true
            });
            this.setData({
                my_UserInfo:false,
                imgURL:e.detail.userInfo.avatarUrl,
                userInfo: e.detail.userInfo,
                hasUserInfo: false
            });
            wx.login({
                success: res => {
                    var code = res.code;
                    wx.setStorage({
                        key: 'log',
                        data:{code:res.code}
                    });
                    var data = e.detail;
                    data.code = code;
                    app.post('login',data,'POST').then((res) =>{
                        wx.setStorageSync('token', res.access_token);
                    }).catch((errMsg) =>{});
                }
            });

        }else{
            this.setData({
                popUp_Bool:false,
                hasUserInfo: true
            });
        }
    },
    //选择地区
    bindChange: function (e) {
        var val = e.detail.value;
        var t = this.data.values;
        var cityData = this.data.cityData;

        if (val[0] != t[0]) {
            const citys = [];
            const countys = [];
            for (let i = 0; i < cityData[val[0]].sub.length; i++) {
                citys.push(cityData[val[0]].sub[i].name)
            }
            for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
                countys.push(cityData[val[0]].sub[0].sub[i].name)
            }

            this.setData({
                province: this.data.provinces[val[0]],
                city: cityData[val[0]].sub[0].name,
                citys: citys,
                county: cityData[val[0]].sub[0].sub[0].name,
                countys: countys,
                values: val,
                value: [val[0], 0, 0]
            })

            return;
        }

        if (val[1] != t[1]) {
            const countys = [];
            for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
                countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
            }
            this.setData({
                city: this.data.citys[val[1]],
                county: cityData[val[0]].sub[val[1]].sub[0].name,
                countys: countys,
                values: val,
                value: [val[0], val[1], 0]
            });
            return;
        }
        if (val[2] != t[2]) {
            this.setData({
                county: this.data.countys[val[2]],
                values: val
            });
            return;
        }
    },
    //打开选择地址
    open: function () {
        this.setData({
            condition:true
        });
    },
    //确定选择地址
    d_Confirm: function () {
        this.setData({
            condition:false,
            home_Goods:[],
            intPageIndex:1
        });
        this.onGetConnect();
    },
    //关闭选择地址
    d_Close: function () {
        this.setData({
            condition:false
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
    //底部导航栏
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
        if(this.data.last_page>=this.data.intPageIndex){
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
        app.doSend('home',{lng:that.data.location.longitude,lat:that.data.location.latitude,address:that.data.city,juli:that.data.juli,page:that.data.intPageIndex},'GET').then((res)=>{
            if (res.status_code== 200) {
                var goods = that.data.home_Goods;
                if (res.data.last_page == that.data.intPageIndex) {
                    for (var i = 0; i < res.data.goods.length; i++) {
                        goods.push(res.data.goods[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        home_Goods: goods,
                        last_page: res.data.last_page,
                        loadMoreHidden: true,
                        noMoreHidden: true,
                        inLoadHidden: false
                    })

                } else if (res.data.last_page > that.data.intPageIndex) {
                    for (var i = 0; i < res.data.goods.length; i++) {
                        goods.push(res.data.goods[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        home_Goods: goods,
                        last_page: res.data.last_page,
                        loadMoreHidden: true,
                        noMoreHidden: true,
                        inLoadHidden: false
                    })
                } else {
                    this.setData({
                        loadMoreHidden: true,
                        noMoreHidden: false,
                        inLoadHidden: true
                    });
                }
            }else{
                this.setData({
                    loadMoreHidden: true,
                    noMoreHidden: false,
                    inLoadHidden: true
                });
            }
        }).catch((errMsg) => {
        });
    },
    jump_Search:function () {
        wx.navigateTo({
            url: '/pages/search/search'
        })
    }
});
