var util = require('../../utils/util.js')
const _ = require('../../utils/underscore');
var app = getApp();
import urls from '../../utils/urls'
import post from '../../utils/request'
Page({
  data: {
  
  },
  onLoad: function (options) {
    const that=this
    wx.getStorage({
      key: 'uid',
      success: function (res) {
        //console.log(res.data)
        that.getList(res.data).then((res)=>{
          console.log(res)
          that.setData({
            list:res
          })
        }).catch((err)=>{
          console.error('出错咯')
        })
      },
      fail:function(){
        wx.navigateTo({
          url: '../login/login',
        })
      }
    })
    
  },
  getList(uid){
    const that = this;
    const promise = new Promise((resolve, reject) => {
      //const myparams = new Object();
      const obj = new Object;
      obj.uid = uid;
      post(urls.adressList, obj).then((res) => {
        //console.log(obj)
        resolve(res.result)
      }).catch((err) => {
        reject(err)
      })
    })
    return promise;
  },
  removeAddress(e){
    const that = this;
    wx.showModal({
      title: '删除地址',
      content: '确认删除该地址',
      success: function (res) {
        if (res.confirm) {
          const obj = new Object;
          obj.id = e.currentTarget.id
          post(urls.removeAddress, obj).then((res) => {
            const list = that.data.list;
            list.splice(e.currentTarget.dataset.index, 1)
            that.setData({
              list
            })
            wx.showToast({
              title: '删除地址成功',
              icon: 'success',
              duration: 1500
            })

          }).catch((err) => {
            wx.showToast({
              title: '删除地址失败',
              icon: 'fail',
              duration: 1500
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShow: function () {
    const that = this
    wx.getStorage({
      key: 'uid',
      success: function (res) {
        //console.log(res.data)
        that.getList(res.data).then((res) => {
          console.log(res)
          that.setData({
            list: res
          })
        }).catch((err) => {
          console.error('出错咯')
        })
      },
      fail: function () {
        wx.navigateTo({
          url: '../login/login',
        })
      }
    })
  
  },
  turnToAdd(){
    wx.navigateTo({
      url: '../addAdress/addAdress',
    })
  },
  update(e){
    const that=this;
    app.myGetSto().then((res)=>{
      console.log(res)
      const obj=new Object;
      obj.uid=res;
      obj.id=e.currentTarget.dataset.id;
      post(urls.updateAddress, obj).then((res) => {
        console.log(res);
        that.onLoad();
        wx.navigateBack({
          
        })

      }).catch((e) => {
        console.log('失败了' + e)
      })
  }).catch((e))
    
  }
})