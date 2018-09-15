//index.js
import QQMap from "../../utils/qqmap-wx-jssdk.min";
var tcity = require("../../utils/citys.js");
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
      address:'',
      location:{},
      loadMoreHidden: true,
      noMoreHidden: true,
      inLoadHidden:true,
      cat_id:'',
      sort:'',
      intPageIndex:1,
      provinces: [],
      province: "",
      citys: [],
      city: "",
      countys: [],
      county: '',
      values: '',
      cityData: '',
      condition:false,
      last_page:null,
  },
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
            });
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
            merchant_List:[],
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

    onShow: function (){},
    doSendMsg:function(){
        this.setData({
            loadMoreHidden: true,
            noMoreHidden: true,
            inLoadHidden: true
        });
        var that=this;
        app.doSend('business',{lng:that.data.location.longitude,lat:that.data.location.latitude,address:that.data.city,cat_id:that.data.cat_id,page:1,sort:that.data.sort},'GET').then((res)=>{
            if (res.status_code== 200) {
                var goods = that.data.merchant_List;
                if (res.data.last_page==that.data.intPageIndex) {
                    for (var i = 0; i < res.data.shop.length; i++) {
                        goods.push(res.data.shop[i]);
                    }
                    that.setData({
                        merchant_List: goods,
                        shop_cat: res.data.shop_cat,
                        last_page: res.data.last_page,
                        loadMoreHidden: true,
                        noMoreHidden: false,
                        inLoadHidden: true
                    })

                }else if(res.data.last_page >that.data.intPageIndex) {
                    for (var i = 0; i < res.data.shop.length; i++) {
                        goods.push(res.data.shop[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        merchant_List: goods,
                        shop_cat: res.data.shop_cat,
                        last_page: res.data.last_page,
                        loadMoreHidden: true,
                        noMoreHidden: true,
                        inLoadHidden: false
                    })
                }else {
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

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
    popOpen:function (e){
        var that=this;
        this.setData({
            popUP_Bool:true,
            title:e.currentTarget.dataset.text,
            b_Status:parseInt(e.currentTarget.dataset.statu)
        });
        app.doSend('goods',{},'GET').then((res)=>{
            if (res.status_code== 200) {
                that.setData({
                    brand: res.data.brand,
                    brand_list: res.data.brand_list,
                    goods_cat: res.data.goods_cat
                })

            }else{

            }
        }).catch((errMsg) =>{});
    },
    // 关闭
    popClose:function (){
        this.setData({
            popUP_Bool:false
        });
    },
    // 开
    filtrateOpen:function (e){
        var that=this;
        this.setData({
            isFiltrate:true,
            brand_id:'',
            paixu:'',
            cat_id:'',
            min_price:'',
            max_price:'',
            min_pl:'',
            max_pl:'',
            goods_form:'',
            min_miles:'',
            max_miles:'',
            year:'',
            address:'',
            miles_text: '',
            pl_text:'',
            form_text:'',
            paixu_text:'',
            brand_text:'',
            price_text:'',
            province:'',
            city:'',
            county:'',
        });
        app.doSend('goods',{},'GET').then((res)=>{
            if (res.status_code== 200) {
                that.setData({
                    brand: res.data.brand,
                    brand_list: res.data.brand_list,
                    goods_cat: res.data.goods_cat
                })

            }else{
            }
        }).catch((errMsg) =>{});
    },
    filtrate_Open:function (e){
        this.setData({
            filtrate_Bool:true,
            title:e.currentTarget.dataset.text,
            b_Status:parseInt(e.currentTarget.dataset.statu)
        });
    },
    // 关闭
    filtrateClose:function (){
        this.setData({
            isFiltrate:false
        });
    },
    // 关闭
    filtrate_Close:function (){
        this.setData({
            filtrate_Bool:false
        });
    },
    //品牌
    bindBrand: function(e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        this.setData({
            brand_id:id
        });
        this.vacancy();
    },
    //品牌
    bindBrand_F: function(e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        this.setData({
            brand_text:e.currentTarget.dataset.text,
            brand_id:id
        });
        this.filtrate_Close();
    },
    //排序
    sort_Type: function(e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        this.setData({
            paixu:id
        });
        this.vacancy();
    },
    //排序
    sortType_F: function(e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        this.setData({
            paixu_text:e.currentTarget.dataset.text,
            paixu:id
        });
        this.filtrate_Close();
    },
    //类型
    motorcycleType: function(e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        this.setData({
            cat_id:id
        });
        this.onGetConnect();
    },
    //排序
    onCost_F:function(e) {
        var that=this;
        var min=e.currentTarget.dataset.min;
        var max=e.currentTarget.dataset.max;
        this.setData({
            price_text:e.currentTarget.dataset.text,
            min_price:min,
            max_price:max,
        });
        this.filtrate_Close();
    },
    //排量
    displacement:function(e) {
        var that=this;
        var min=e.currentTarget.dataset.min;
        var max=e.currentTarget.dataset.max;
        this.setData({
            min_pl:min,
            max_pl:max
        });
        this.vacancy();
    },
    //排量
    displacement_F:function(e) {
        var that=this;
        var min=e.currentTarget.dataset.min;
        var max=e.currentTarget.dataset.max;
        this.setData({
            pl_text:e.currentTarget.dataset.text,
            min_pl:min,
            max_pl:max
        });
        this.filtrate_Close();
    },
    //公里
    kilometre:function(e) {
        var that=this;
        var min=e.currentTarget.dataset.min;
        var max=e.currentTarget.dataset.max;
        this.setData({
            min_miles:min,
            max_miles:max
        });
        this.vacancy();
    },
    //公里
    kilometre_F:function(e) {
        var that=this;
        var min=e.currentTarget.dataset.min;
        var max=e.currentTarget.dataset.max;
        this.setData({
            miles_text:e.currentTarget.dataset.text,
            min_miles:min,
            max_miles:max
        });
        this.filtrate_Close();
    },
    //商品来源
    merchandiseResources:function(e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        this.setData({
            form_text:e.currentTarget.dataset.text,
            goods_form:id
        });
    },
    //年
    bindKeyInput:function(e){
        this.setData({
            year:e.detail.value
        });
    },
    //重置
    reset:function(){
        this.setData({
            isFiltrate:true,
            brand_id:'',
            paixu:'',
            min_price:'',
            max_price:'',
            min_pl:'',
            max_pl:'',
            goods_form:'',
            min_miles:'',
            max_miles:'',
            year:'',
            address:'',
            miles_text: '',
            pl_text:'',
            form_text:'',
            paixu_text:'',
            brand_text:'',
            price_text:'',
            province:'',
            city:'',
            county:'',
        });
    },
    //确定
    confirm:function(){
        this.setData({
            isFiltrate:false,
            intPageIndex:1,
            new_List:[]
        });
        this.onGetConnect();
    },
    // 公用方法
    vacancy:function () {
        this.setData({
            intPageIndex:1,
            popUP_Bool:false,
            new_List:[]
        });
        this.onGetConnect();
    },

    //选择
    bindSelectionSort: function(e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        that.setData({
            cat_id:id,
            merchant_List:[],
            intPageIndex:1
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

    //综合排序
    onToggle:function(e){
        this.setData({
            merchant_List:[],
            shop_cat:[],
            intPageIndex:1,
            sort:'desc'
        });
        this.onGetConnect();
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
            if (res.status_code== 200) {
                var goods=that.data.merchant_List;
                if(res.data.last_page== that.data.intPageIndex){
                    for(var i=0;i<res.data.shop.length;i++){
                        goods.push(res.data.shop[i]);
                    }
                    that.setData({
                        merchant_List:goods,
                        last_page:res.data.last_page,
                        loadMoreHidden: true,
                        noMoreHidden: false,
                        inLoadHidden: true
                    })

                }else if(res.data.last_page>that.data.intPageIndex){
                    for(var i=0;i<res.data.shop.length;i++){
                        goods.push(res.data.shop[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        merchant_List:goods,
                        last_page:res.data.last_page,
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
        }).catch((errMsg) =>{});
    }
});
