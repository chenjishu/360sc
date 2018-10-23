// pages/authorize/index.js
var app = getApp();
let Domain = app.globalData.domain;
Page({

  data: {

  },
  bindGetUserInfo: function (e) {
    // 获得最新的用户信息
    console.log(e)
    if (!e.detail.userInfo) {
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.checkSessionAndLogin();
  },
  /* 
    这里使用openid 作为与后端session 连接的标志
    检查是否存在openid，即之前是否登录过
      如果登录过，检查session_key 是否过期
        如果过期了，remove openid 重新执行login 并将用户信息发送到服务器端更新
        如果没过期则返回
      如果没登录过则执行login 并将用户信息发送到服务器更新
  */
  checkSessionAndLogin: function () {
    let that = this;
    let thisOpenId = wx.getStorageSync('openid');
    console.log(thisOpenId)

    // 已经进行了登录，检查登录是否过期
    if (thisOpenId) {
      console.log('have openid')
      wx.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
          wx.navigateBack({});
        },
        fail: function () {
          console.log('but session_key expired');
          // session_key 已经失效，需要重新执行登录流程
          wx.removeStorageSync('openid');
          that.checkSessionAndLogin();
        }
      })
    } else {
      // 没有进行登录则先进行登录操作
      console.log('do not have openid');
      that.loginAndGetOpenid();
    }
  },
  // 执行登录操作并获取用户openId
  loginAndGetOpenid: function () {
    console.log('do login and get openid');
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: Domain + '/user/wx_login',
            data: {
              code: res.code
            },
            success: function (res) {
              res = res.data;
              console.log(res)
              // 保存openId，并将用户信息发送给后端
              if (res.code === 0) {
                wx.showModal({
                  title: 'set openid',
                  content: res.data,
                })
                wx.setStorageSync('openid', res.data);
                that.sendUserInfoToServer();
              } else {
                wx.showModal({
                  title: 'Sorry',
                  content: '用户登录失败~',
                })
              }
            }
          })
        }
      }
    })
  },
  sendUserInfoToServer: function () {
    console.log('now send user info to server');
    let userInfo = wx.getStorageSync('userInfo');
    let thisOpenId = wx.getStorageSync('openid');
    userInfo.openid = thisOpenId;
    wx.request({
      url: Domain + '/user/updateUser',
      method: 'POST',
      dataType: 'json',
      data: userInfo,
      success: function (res) {
        res = res.data;
        if (res.code === 0) {
          wx.navigateBack({});
        } else {
          wx.showModal({
            title: 'Sorry',
            content: '同步信息出错~',
          })
        }
      }
    })
  }
})
