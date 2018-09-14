//index.js
import QQMap from "../../utils/qqmap-wx-jssdk.min";
//获取应用实例
var  qqmapsdk;
const app = getApp();
Page({
  data: {
    userInfo: {},
      buy_List:[],
      city:'',
      intPageIndex:1,
      last_page:null,
      loadMoreHidden: true,
      noMoreHidden: true,
      inLoadHidden: true
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

      // 实例化API核心类
      wx.setNavigationBarTitle({
          title: '求购'
      });
        this.doSendMsg();
  },

    onShow: function () {},
    doSendMsg:function(){
        var that=this;
        this.setData({
            loadMoreHidden: true,
            noMoreHidden: true,
            inLoadHidden: true
        });
        app.doSend('goods_list',{goods_form:3},'GET').then((res)=>{
            if (res.status_code== 200){
                if (res.data.last_page== that.data.intPageIndex) {
                    var goods = that.data.buy_List;
                    for (var i = 0; i < res.data.goods.length; i++) {
                        goods.push(res.data.goods[i]);
                    }
                    that.setData({
                        buy_List: goods,
                        last_page: res.data.last_page,
                        loadMoreHidden: true,
                        noMoreHidden: false,
                        inLoadHidden: true
                    });
                    return;
                }else if (res.data.last_page >that.data.intPageIndex) {
                    var goods = that.data.buy_List;
                    for (var i=0; i<res.data.goods.length;i++) {
                        goods.push(res.data.goods[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        buy_List: goods,
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
        app.doSend('goods_list',{goods_form:3},'GET').then((res)=>{
            if (res.data.status_code== 200) {
                if(res.data.last_page==that.data.intPageIndex){
                    var goods=that.data.buy_List;
                    for(var i=0;i<res.data.goods.length;i++){
                        goods.push(res.data.goods[i]);
                    }
                    that.setData({
                        buy_List:goods,
                        loadMoreHidden: true,
                        noMoreHidden: true,
                        inLoadHidden: false
                    });
                    return;
                }else if(res.data.last_page>that.data.intPageIndex){
                    var goods=that.data.buy_List;
                    for(var i=0;i<res.data.goods.length;i++){
                        goods.push(res.data.goods[i]);
                    }
                    that.data.intPageIndex++;
                    that.setData({
                        buy_List:goods,
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
        }).catch((errMsg) => {
        });
    },


    onMakePhoneCall:function (e){
        var that=this;
        wx.makePhoneCall({
            phoneNumber:e.currentTarget.dataset.text
        })
    },
    onCopy:function (e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.text,
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
