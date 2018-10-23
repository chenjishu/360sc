var util = require('../../utils/util.js')
const _ = require('../../utils/underscore');
var app = getApp();
import urls from '../../utils/urls'
import post from '../../utils/request'
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
    wx.getStorage({
      key: 'uid',
      success: function (res) {
        that.setData({
          userId:res.data
        })
       
      },
      fail: function () {
      
      }
    })
  },
  addAdress(userId, receiver, mobile, province, city, district, address) {
    const that = this;
    var promise = new Promise((resolve, reject) => {
      const myparams = new Object();
      var obj = new Object;
      obj.uid =userId,
      obj.receiver = receiver,
      obj.mobile=mobile,
      obj.province = province,
      obj.city=city,
      obj.district=district,
      obj.address=address,
      console.log(obj);
      post(urls.addAdress, obj).then((res) => {
        resolve(res.result)
      }).catch((err) => {
        reject(err)
      })
    })
    return promise;
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
  
  },
  toAdress(){
    wx.navigateTo({
      url: '../selectArea/selectArea',
    })
  },
  formSubmit: function (e) {
    console.log(e.detail.value)
    const that=this;
   
    if (!e.detail.value.name) {
      wx.showToast({
        title: '请输入收货人姓名！',
        icon: 'none',
        duration: 1500
      })
      return

    }
    if (e.detail.value.phoneNumber.length == 0) {
      wx.showToast({
        title: '请输入联系方式！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (e.detail.value.phoneNumber.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(e.detail.value.phoneNumber)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if(!this.data.myArea){
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1500
      })  
      return;
    };
    if (!e.detail.value.address){
      wx.showToast({
        title: '请填写详细收货地址',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    app.myGetSto().then(res=>{
      that.addAdress(res, e.detail.value.name, e.detail.value.phoneNumber, that.data.myAreaObj.pro, that.data.myAreaObj.city, that.data.myAreaObj.area, e.detail.value.address).then(()=>{
        wx.navigateBack({
          
        })
      })
    })
  },
  back(){
    wx.navigateBack({
      
    })
  }
})