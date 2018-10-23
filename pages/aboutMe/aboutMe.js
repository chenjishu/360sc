const app = getApp()
import urls from '../../utils/urls'
import post from '../../utils/request' 
let doing=false;
let clicked=false;
Page({
  data: {
    userInfo: {},
  },
  onLoad: function () {
  },
  onShow(){
    clicked=false;
    doing=false;
    const uid=wx.getStorageSync('uid')
    const userInfo = wx.getStorageSync('userInfo')
    //console.log(userInfo)
      if (!uid){
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
    if(clicked){
      return;
    }
    clicked=true;
    wx.navigateTo({
      url: '../myorder/myorder',
    })
  },
  toLogin() {
    if(doing){
      return
    }
    doing=true;
    wx.navigateTo({
      url: '../login/login',
      complete:function(){
        doing=false;
      }
    })
  },
  bindGetUserInfo: function (e) {
    const that=this;
    app.getUserInfo(e).then(()=>{
      that.onShow()
    }
    ).catch(()=>{
      console.log('ju绝了你')
    }
     
    )
  },
  
})
