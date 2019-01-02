// pages/newContent/newContent.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
   //console.log(options.content)
    var art = options.content
    //var art = " < p > 阿斯顿发斯蒂芬阿斯蒂芬阿斯顿发斯蒂芬阿沙发斯蒂芬阿斯蒂芬家加快水电费就给噢请问UI噢请问UI欧文UI哦斯蒂芬</p> <p>4556456</p> <p>416</p> <p>46</p> <p>644</p> <p>647489789764561874</p> <p>5648689687847845678478456<img src='http://120.76.238.48:800/hkyp/commodity/content/0b4ce0d4a85c4076b7969d4cc38695d5.jpg'/></p>"
    WxParse.wxParse('art', 'html', art, that, 5);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})