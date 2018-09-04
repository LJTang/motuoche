//index.js
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
      imgURL3:'/images/dian_top.png'
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
      wx.setNavigationBarTitle({
          title: '商家入驻'
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
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            time: e.detail.value
        })
    },
    // 时间
    bindTimeChange_To: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
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
            success: function(res) {
                console.log(res);
                wx.uploadFile({
                    url: 'https://chunhao.guangzhoubaidu.com/api/uploads/fileupload',
                    filePath: res.tempFilePaths[0],
                    name: 'file',
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
                })


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
    }
});
