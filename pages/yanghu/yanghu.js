//index.js
import QQMap from "../../utils/qqmap-wx-jssdk.min";
//获取应用实例
var  qqmapsdk;
const app = getApp();
Page({
  data: {
      popUP_Bool: false,
      height:null,
      intPageIndex:1,
      last_page:null,
      y_List:[],
      loadMoreHidden: true,
      noMoreHidden: true,
      inLoadHidden: true
  },
  //事件处理函数
    cutNav: function (e) {
        var that = this;
        var current = e.currentTarget.dataset.index;
        this.setData({
            active: current,
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
        this.onGetConnect();
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
            brand_id:'',
            min_price:'',
            max_price:'',
            year:'',
            min_miles:'',
            max_miles:'',
            address:'',
            goods_form:'',
            cat_id:5,
            min_pl:'',
            max_pl:'',
            page:that.data.intPageIndex,
        };
        app.doSend('goods_list',json,'GET').then((res)=>{
            if (res.status_code== 200) {
                var goods = that.data.y_List;
                if (res.data.last_page == that.data.intPageIndex) {
                    for (var i = 0; i < res.data.goods.length; i++) {
                        goods.push(res.data.goods[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        y_List: goods,
                        last_page: res.data.last_page,
                        loadMoreHidden: true,
                        noMoreHidden: true,
                        inLoadHidden: false
                    })

                }else if(res.data.last_page>that.data.intPageIndex) {
                    for (var i = 0; i < res.data.goods.length; i++) {
                        goods.push(res.data.goods[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        y_List: goods,
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
        }).catch((errMsg) =>{});

    },
    upper: function(e){},
    lower: function(e){
        if(this.data.last_page>=this.data.intPageIndex){
            this.setData({
                loadMoreHidden: true,
                noMoreHidden: true,
                inLoadHidden: true
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
            paixu:'',
            brand_id:'',
            min_price:'',
            max_price:'',
            year:'',
            min_miles:'',
            max_miles:'',
            address:'',
            goods_form:'',
            min_pl:'',
            max_pl:'',
            cat_id:5,
            page:'',
        };
        app.doSend('goods_list',json,'GET').then((res)=>{
            if (res.status_code== 200) {
                var goods=that.data.y_List;
                if(res.data.last_page==that.data.intPageIndex){
                    for(var i=0;i<res.data.goods.length;i++){
                        goods.push(res.data.goods[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        y_List:goods,
                        last_page:res.data.last_page,
                        loadMoreHidden: true,
                        noMoreHidden: true,
                        inLoadHidden: false
                    })

                }else if(res.data.last_page>that.data.intPageIndex){
                    for(var i=0;i<res.data.goods.length;i++){
                        goods.push(res.data.goods[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        y_List:goods,
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

            console.log(that.data.noMoreHidden)
        }).catch((errMsg) => {
        });
    }
});
