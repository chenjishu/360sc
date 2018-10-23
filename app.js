//app.js
import urls from './utils/urls'
import post from './utils/request'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  myGetSto:function(){
    var promise=new Promise((resolve,reject)=>{
      wx.getStorage({
        key: 'uid',
        success: function (res) {
          resolve(res.data)
        },
        fail: function () {
          wx.navigateTo({
            url: '../login/login',
          })
        }
      })
    })
    return promise;
  },
  getsto(){
    var promise = new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'uid',
        success: function (res) {
          if (!res.data){
            resolve('')

          }else{
            resolve(res.data)
          }
          
        },
        fail: function () {
         resolve('')
        }
      })
    })
    return promise;
  },
  addShop(goodSn, goodsNumber) {
    const that=this
    //console.log('进入了')
    return new Promise((resolve,reject)=>{
      that.myGetSto().then((res) => {
        var obj = new Object;
        obj.uid = res;
        obj.goodsSn = goodSn;
        obj.goodsNumber = goodsNumber;
        post(urls.addShop, obj).then((res) => {
          console.log(res)
          resolve(res)
        }).catch((e) => {
          reject(e)
        })
      }).catch(()=>{
        
      })
    })
  },
  removeShop(id){
    return new Promise((resolve, reject) => {
      const obj = new Object;
      obj.id = id;
      post(urls.delWish, obj).then((res) => {
        wx.showToast({
          title: '删除购物车商品成功',
          icon: 'none',
          duration: 2000
        })
        resolve();
      }).catch((e) => {
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 2000
        })
      })
    })
  },
  comfirm(orderId){
    return new Promise((resolve,reject)=>{
      const obj = new Object;
      obj.orderId = orderId;
      post(urls.cofirm, obj).then(res => {
        resolve(res)
      }).catch((err)=>{
        reject(err)
      })
    })
  },
  cancel(orderId){
    return new Promise((resolve, reject) => {
      const obj = new Object;
      obj.orderId = orderId;
      post(urls.cancel, obj).then(res => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getInfo : function () {
    var that = this;
    return new Promise((resolve,reject)=>{
      wx.login({
        success: function (res) {
          if (res.code) {
            console.log(res.code)
            //获取openId
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                //小程序唯一标识
                appid: 'wxa95ec732876e40d0',
                //小程序的 app secret
                secret: '8e83d4ef940c0cde6a02c56e421052a4',
                grant_type: 'authorization_code',
                js_code: res.code
              },
              method: 'GET',
              header: { 'content-type': 'application/json' },
              success: function (openIdRes) {
                resolve(openIdRes.data.openid)
                if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                  // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
                  wx.getUserInfo({
                    success: function (data) {
                      // 自定义操作
                      // 绑定数据，渲染页面
                      console.log(data)
                    },
                    fail: function (failData) {
                      console.info("用户拒绝授权");
                    }
                  });
                } else {
                  console.info("获取用户openId失败");
                }
              },
              fail: function (error) {
                console.info("获取用户openId失败");
                console.info(error);
              }
            })
          }
        }
      });

    })
  } 


})