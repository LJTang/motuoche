import GMAPI from "../../utils/api";
import QQMap from "../../utils/qqmap-wx-jssdk.min";
//获取应用实例
var  qqmapsdk;
const app = getApp();
Page({
  data: {
    popUP_Bool: false,
      city:'',
      time:'',
      timeTo:'',
      imgURL:'/images/men.png',
      imgURL2:'/images/men.png',
      imgURL3:'/images/dian_top.png',
      sj_Array:[],
      shop_cat_id:'',
      class_name:'',
      d_address:'',
      user_name:'',
      phone:'',
      wx_numb:'',
      location:{}
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
      var that=this;
      wx.setNavigationBarTitle({
          title: '商家入驻'
      });
      app.post('shop','','GET').then((res) => {
        that.setData({
            sj_Array:res
        })
      }).catch((errMsg) =>{});
    },
    onShow:function(){
        var that=this;
        app.post('user', '','GET').then((res) =>{
            that.setData({
                user_name:res.name,
                phone:res.mobile,
                wx_numb:res.wechat_number,
                d_address:res.address,
                location:{
                    longitude:res.longitude,
                    latitude:res.latitude
                }
            })
        }).catch((errMsg)=>{});
    },
    bindPickerChange:function(e){
        var index=e.detail.value;
        var list=this.data.sj_Array;
        this.setData({
            shop_cat_id:list[index].id,
            class_name:list[index].cat_name
        });
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
    // 时间
    bindTimeChange: function(e) {
        this.setData({
            time: e.detail.value
        })
    },
    // 时间
    bindTimeChange_To: function(e) {

        this.setData({
            timeTo: e.detail.value
        })
    },
    //选择
    listenerButtonChooseImage: function(e) {
        var that = this;
        var index=e.currentTarget.dataset.index;
        wx.chooseImage({
            count: 1,
            //original原图，compressed压缩图
            sizeType: ['original'],
            //album来源相册 camera相机
            sourceType: ['album', 'camera'],
            //成功时会回调
            success: function(res){
                console.log(res.tempFilePaths[0]);
                if(index==0){
                    that.setData({
                        imgURL:res.tempFilePaths[0]
                    });
                }else if(index==1){
                    that.setData({
                        imgURL2:res.tempFilePaths[0]
                    })
                }else{
                    that.setData({
                        imgURL3:res.tempFilePaths[0]
                    })
                }
                /*
                wx.uploadFile({
                    header: {
                        'content-type': 'multipart/form-data'
                    },
                    url: 'http://motor.guangzhoubaidu.com/api/store_img',
                    filePath: res.tempFilePaths[0],
                    name: 'store_img',
                    formData:'',
                    success: function(res){
                        console.log(res);
                        var data = JSON.parse(res.data);
                        if(index==0){
                            that.setData({
                                imgURL:that.data.url+data.data
                            });
                        }else if(index==1){
                            that.setData({
                                imgURL2:that.data.url+data.data
                            })
                        }else{
                            that.setData({
                                imgURL3:that.data.url+data.data
                            })
                        }
                    }
                });
                */
            }
        })
    },
    //选择位置位置
    chooseLocation:function(e){
        var that=this
        wx.chooseLocation({
            success: function(res){
                console.log(res)
                that.setData({
                    address:res.name,
                    d_address:res.address,
                    location:{
                        longitude:res.longitude,
                        latitude:res.latitude
                    }
                })
            },
            fail: function() {

            },
            complete: function() {

            }
        })
    },

    submit_SJ:function (e){
        var that = this;
        var timestamp = Date.parse(new Date());
        var strDate=GMAPI.formatTime(timestamp,'Y-M-D');
        // console.log(GMAPI.doTurnTimestamp(strDate+' '+that.data.time));
        // console.log(GMAPI.formatTime(GMAPI.doTurnTimestamp(strDate+' '+that.data.time),'Y-M-D h:m'))

        if(e.detail.value.shop_name==''){
            wx.showToast({
                title: '店铺名称不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(that.data.name==''){
            wx.showToast({
                title: '联系人不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.mobile.length!=11||e.detail.value.mobile==''||GMAPI.checkPhone(e.detail.value.mobile)==false){
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.wechat_number==''){
            wx.showToast({
                title: '微信号不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.address==''){
            wx.showToast({
                title: '地址不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(that.data.time==''||that.data.timeTo==''){
            wx.showToast({
                title: '营业时间不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(that.data.imgURL=='/images/men.png'){
            wx.showToast({
                title: '门店照片不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(that.data.imgURL2=='/images/men.png'){
            wx.showToast({
                title: '工商执照不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(that.data.imgURL3=='/images/dian_top.png'){
            wx.showToast({
                title: '店铺照片不能为空',
                icon: 'none',
                duration: 2000
            });
        }else{
            var json={shop_name:e.detail.value.shop_name,shop_cat_id:that.data.shop_cat_id,name:e.detail.value.name,
                mobile:e.detail.value.mobile,wechat_number:e.detail.value.wechat_number,address:e.detail.value.address,
                business_start:that.data.time,business_end:that.data.timeTo,business_scope:e.detail.value.business_scope,
                longitude:that.data.location.longitude,latitude:that.data.location.latitude
               };
            console.log(json);
            app.doSend('shop', json,'POST').then((res)=>{
                if(res.status_code==200){
                    var id=res.data;
                    var msg=res.message;

                    for(var i=0;i<3;i++){
                        wx.uploadFile({
                            header: {
                                'content-type': 'multipart/form-data'
                            },
                            url: 'http://motor.guangzhoubaidu.com/api/store_img',
                            filePath:(i==0?that.data.imgURL:(i==1?that.data.imgURL2:that.data.imgURL3)),
                            name:(i==0?'store_img':(i==1?'license_img':'business_img')),
                            formData:{'id':id},
                            success: function(res){
                                wx.showToast({
                                    title: msg,
                                    icon: 'none',
                                    duration: 2000
                                });
                            }
                        });
                    }
                }else if(res.status_code==403){
                    wx.showToast({
                        title: res.message,
                        icon: 'none',
                        duration: 2000
                    });
                    wx.navigateTo({
                        url: '/pages/personal_data/personal_data'
                    })
                }else{
                    wx.showToast({
                        title: res.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }).catch((errMsg)=>{});
        }

    }
});
