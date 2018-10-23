const app = getApp()

Page({
  data: {
    userInfo: {},
  },
  onLoad: function () {
  },
  onShow(){
    const uid=wx.getStorageSync('uid')
    const userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
      if (!userInfo||!uid){
        this.setData({
          needlogin:true
        })
      }else{
        this.setData({
          userInfo:userInfo,
          needlogin:false
        })
      }
  },
  myorder(){
    wx.navigateTo({
      url: '../myorder/myorder',
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  }
})
