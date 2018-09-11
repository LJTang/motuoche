//app.js
App({
    data:{
        hasUserInfo:''
    },
  onLaunch: function () {
    this.login();
  },
  post: function (url, data,way) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var promise = new Promise((resolve, reject) => {
      //init
      var that = this;
      var postData = data;
      //判断用户数据是否存在
      var token = wx.getStorageSync('token');
      var header = {
        'content-type': 'application/json'
      };
      if (token) {
        header.Accept = 'application/json';
        header.Authorization = 'Bearer ' + token
      }
      /*
      //自动添加签名字段到postData，makeSign(obj)是一个自定义的生成签名字符串的函数
      postData.signature = that.makeSign(postData);
      */
      //网络请求
      wx.request({
        url: this.globalData.api_url+url,
        data: postData,
        method:way,
        header: header,
        success: function (res) {//服务器返回数据
          console.log(res);
          if (res.data.status_code == 200) {//res.data 为 后台返回数据，格式为{"data":{...}, "info":"成功", "status":1}, 后台规定：如果status为1,既是正确结果。可以根据自己业务逻辑来设定判断条件
            resolve(res.data.data);
          } else {//返回错误提示信息
            wx.showToast({
              title: res.data.message,
              icon: 'none',
            })
          }
          wx.hideLoading();
        },
        error: function (e) {
          wx.hideLoading();
          reject('网络出错');
        }
      })
    });
    return promise;
  },
  /**
   * 微信登录
   */
  login: function (e) {
    var obj = this;
    wx.login({
      success: res => {
        var code = res.code;
        wx.getUserInfo({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            var data = res;
            data.code = code;
            obj.post('login', data,'POST').then((res) => {
              wx.setStorageSync('token', res.access_token);
              
            }).catch((errMsg) => {
              
            });
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    api_url: 'https://motor.guangzhoubaidu.com/api/'
  }
});