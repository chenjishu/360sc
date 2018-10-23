// pages/success/success.js
Page({
  data:{
    clickFlag:false
  },
  onLoad(){
  },
  onUnload: function () {//如果页面被卸载时被执行
    this.gotoHomePage();
  },
  gotoHomePage: function () {//自定义页面跳转方法
    let that = this;
    //------------------
    if (that.data.clickFlag) {
      return;
    } else {
      that.setData({ clickFlag: true });
    }
    //------------------
    wx.switchTab({
      url: '../index/index',
    })
  },

  toIndex(){
    wx.switchTab({
      url: '../index/index'
    })
  }
})