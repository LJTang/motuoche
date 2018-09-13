//index.js
import QQMap from "../../utils/qqmap-wx-jssdk.min";
//获取应用实例
var  qqmapsdk;
const app = getApp();
Page({
  data: {
      popUP_Bool: false,
      height:null,
      new_List:[],
      city:'',
      location:{},
      loadMoreHidden: true,
      noMoreHidden: true,
      inLoadHidden:false,
      sort:'',
      intPageIndex:1,
      brand:[],
      brand_list:[],
      goods_cat:[],
      brand_id:'',
      paixu:'',
      cat_id:'',
      min_price:'',
      max_price:'',
      min_pl:'',
      max_pl:''
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
                  height:res.windowHeight-(rpx*101)
              });
          }
      });
      wx.setNavigationBarTitle({
          title: '新车'
      });
      that.doSendMsg();
  },

    onShow: function () {

    },
    doSendMsg:function(){
        var that=this;
        this.setData({
            loadMoreHidden: true,
            noMoreHidden: true,
            inLoadHidden: true
        });
        var json={
            paixu:'',
            brand_id:1,
            min_price:'',
            max_price:'',
            year:'',
            min_miles:'',
            max_miles:'',
            address:'',
            goods_form:'',
            min_pl:'',
            max_pl:'',
            page:that.data.intPageIndex,
        };
        app.doSend('goods_list',json,'GET').then((res)=>{
            if (res.status_code== 200){
                if (res.data.last_page >= that.data.intPageIndex) {
                    var goods = that.data.new_List;
                    for (var i = 0; i < res.data.goods.length; i++) {
                        goods.push(res.data.goods[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        new_List: goods,
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
        }).catch((errMsg) =>{});

    },
    // 开
    popOpen:function (e){
      var that=this;
        this.setData({
            popUP_Bool:true,
            title:e.currentTarget.dataset.text,
            b_Status:parseInt(e.currentTarget.dataset.statu)
        });
        app.doSend('goods',{},'GET').then((res)=>{
            console.log(res)
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
    //品牌
    bindBrand: function(e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        this.setData({
            brand_id:id
        });
        this.onGetConnect();
    },
    //px
    sort_Type: function(e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        this.setData({
            paixu:id
        });
        this.onGetConnect();
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
    onCost:function(e) {
        var that=this;
        var min=e.currentTarget.dataset.min;
        var max=e.currentTarget.dataset.max;
        this.setData({
            min_price:min,
            max_price:max,
        });
        this.onGetConnect();
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
        var json={
            paixu:that.data.paixu,
            brand_id:1,
            min_price:that.data.min_price,
            max_price:that.data.max_price,
            year:'',
            min_miles:'',
            max_miles:'',
            address:'',
            goods_form:'',
            min_pl:that.data.min_pl,
            max_pl:that.data.max_pl,
            cat_id:that.data.cat_id,
            page:that.data.intPageIndex,
        };
        app.doSend('goods_list',json,'GET').then((res)=>{
            if (res.data.status_code== 200) {
                if(res.data.last_page>= that.data.intPageIndex){
                    var goods=that.data.new_List;
                    for(var i=0;i<res.data.goods.length;i++){
                        goods.push(res.data.goods[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        new_List:goods,
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
