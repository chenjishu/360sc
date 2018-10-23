import urls from '../../utils/urls'
import post from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexArr: ['male','famale'],
    arr:['男性','女性'],
    phoneNumber:"",
    password:"",
    confirmpassword:"",
    nick:"",
    ageIndex:17,
    sexIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ageArr = Array.from({ length: 100 }, (v, k) => k);
    this.setData({
      ageArr
    })
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
  submitReg(e){
   // console.log(e.detail.value);
    //var phoneNumber = e.currentTarget.dataset.phonenumber
    var that = this
    var phoneNumber = this.data.phoneNumber//手机号码
    //var vercode = this.data.vercode    //手机验证码
    if(!that.data.nick){
      wx.showToast({
        title: '请输入昵称！',
        icon: 'none',
        duration: 1500
      })
      return

    }
    if (phoneNumber.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (phoneNumber.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phoneNumber)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (that.data.password.length ==0){
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (that.data.password.length > 12 || that.data.password.length < 6) {
      wx.showToast({
        title: '密码长度不符合要求',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (that.data.confirmpassword.length == 0) {
      wx.showToast({
        title: '请确认密码',
        icon: 'none',
        duration: 1500
      })
    }
  
    if (that.data.password !=that.data.confirmpassword){
      wx.showToast({
        title: '两次密码输入不一致！',
        icon: 'none',
        duration: 1500
      })
return
    }
    var obj = e.detail.value;
    obj.sex=that.data.sexArr[that.data.sexIndex];
    obj.age = that.data.ageArr[that.data.ageIndex];
    post(urls.reg, obj).then((res) => {
      this.setData({
      })
    }).catch((err)=>{
     // console.log(err)
    })
  },
  bindChangePhoneNumber: function (e) {//手机号码改变
    var phoneNumber = e.detail.value;
    this.data.phoneNumber = phoneNumber
    this.setData({
      phoneNumber: phoneNumber
    })
   // console.log(this.data.phoneNumber)
  },
  changepassword(e){
    var password = e.detail.value;
    this.setData({
      password
    })
   // console.log(this.data.password)
  },
  cofirmpassword(e) {
    var confirmpassword = e.detail.value;
    this.setData({
      confirmpassword
    })
    //console.log(this.data.confirmpassword)
  },
  nick(e){
    var nick = e.detail.value;
    this.setData({
      nick
    })
  },
  bindsexChange(e){
    //console.log(e.detail.value);
    this.setData({
      sexIndex: e.detail.value
    })
  },
    bindageChange(e) {
    //console.log(e.detail.value);
    this.setData({
      ageIndex: e.detail.value
    })

  }
})