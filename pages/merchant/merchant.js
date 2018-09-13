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
      active:0,
      merchant_List:[],
      shop_cat:[],
      city:'',
      location:{},
      loadMoreHidden: true,
      noMoreHidden: true,
      inLoadHidden:false,
      cat_id:'',
      sort:'',
      intPageIndex:1
  },
  //事件处理函数
    cutNav: function (e) {
        var that = this;
        var current = e.currentTarget.dataset.index;
        this.setData({
            active: current
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
          app.userInfoReadyCallback = res => {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        } else {
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
      wx.getSystemInfo({
          success: function(res) {
              var rpx=(res.windowWidth / 750);
              that.setData({
                  height:res.windowHeight-(rpx*340)
              });
          }
      });
      wx.setNavigationBarTitle({
          title: '商家'
      });
      that.setData({
          merchant_List:[]
      });
      app.location().then((res)=>{
          that.setData({
              city:res.result.address_component.city,
              location:{
                  latitude:res.result.location.lat,
                  longitude:res.result.location.lng
              }
          });
          this.doSendMsg();
      }).catch((errMsg) =>{});
  },

    onShow: function () {

    },
    doSendMsg:function(){
        this.setData({
            loadMoreHidden: true,
            noMoreHidden: true,
            inLoadHidden: true
        });
        var that=this;
        app.doSend('business',{lng:that.data.location.longitude,lat:that.data.location.latitude,address:that.data.city,cat_id:that.data.cat_id,page:1,sort:that.data.sort},'GET').then((res)=>{
            if (res.status_code== 200) {
                if (res.data.last_page >= that.data.intPageIndex) {
                    var goods = that.data.merchant_List;
                    for (var i = 0; i < res.data.shop.length; i++) {
                        goods.push(res.data.shop[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        merchant_List: goods,
                        shop_cat: res.data.shop_cat,
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
    bindSelectionSort: function(e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        that.setData({
            cat_id:id,
            merchant_List:[]
        });
        this.popClose();
        this.onGetConnect();
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

    //
    onToggle:function(e){
        this.setData({
            merchant_List:[],
            shop_cat:[],
            intPageIndex:1,
            sort:'desc'
        });
    },
    upper: function(e) {},
    lower: function(e) {

        if(this.data.last_page>this.data.intPageIndex){
            this.setData({
                shop_cat:[]
            });
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
        app.doSend('business',{lng:that.data.location.longitude,lat:that.data.location.latitude,address:that.data.city,cat_id:that.data.cat_id,page:that.data.intPageIndex,sort:that.data.sort},'GET').then((res)=>{
            if (res.data.status_code== 200) {
                if(res.data.last_page>= that.data.intPageIndex){
                    var goods=that.data.merchant_List;
                    for(var i=0;i<res.data.shop.length;i++){
                        goods.push(res.data.shop[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        merchant_List:goods,
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
