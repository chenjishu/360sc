import urls from '../../utils/urls'
import post from '../../utils/request' 
　const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
 /** getUid(openid,name,portraitImg){
    return new Promise((resolve,reject)=>{
      const obj = new Object;
      obj.openid = openid;
      obj.name = name;
      obj.portraitImg = portraitImg;
      post(urls.login, obj).then(res => {
        console.log(res)
        resolve(res.result.uid)
      }).catch((err)=>{
        console.log(err)
      })
    })
  
  },**/
  bindGetUserInfo: function (e) {
    const that = this;
    app.getUserInfo(e).then(() => {
      wx.navigateBack({
        
      })
    }
    ).catch(() => {
     
    }

    )
  },

 /** bindChangePhoneNumber(e){
    const mobile = e.detail.value;
    this.setData({
      mobile
    })
  },
  bindChangePassword(e) {
    const password = e.detail.value;
    this.setData({
      password
    })
  },
 
  submitLogin(e){
    const that=this;
    if (that.data.mobile==0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (that.data.mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(that.data.mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (that.data.password.length == 0) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (that.data.password.length > 12 || that.data.password.length < 6) {
      wx.showToast({
        title: '密码长度有错误',
        icon: 'none',
        duration: 1500
      })
      return
    }
    const obj = {}
    post(urls.cookie, obj).then((res) => {
        //console.log(1)
      const obj2 =e.detail.value;
        obj2.params = "{'loginT': 'ordinary'}"
        post(urls.login, obj2).then((res) => {
          console.log(res.result.id)
          wx.setStorage({
            key: "userId",
            data: res.result.id,
            success:function(){
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1500
              })
              setTimeout(() => {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 1500)
            }
          })
          
          
          console.log(1)
        }).catch((err)=>{
          //console.log('哈哈哈哈哈哈哈哈哈')
          wx.showToast({
            title: err,
            icon: 'none',
            duration: 1500
          })
        })
    })
  }**/







})