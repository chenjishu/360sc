import urls from '../../utils/urls'
import post from '../../utils/request'
　const app = getApp();
let opt;
let ordering=false
Page({

  data: {
  
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderid
    })
    this.getDetail(options.orderid)
  
  },
  onShow(){
    ordering = false;
  },
  getDetail(id){
    const that=this;
    const myparams = new Object();
    var obj = new Object;
    obj.orderNo = id;
    post(urls.orderDetail, obj).then((res) => {
      console.log(res.result)
      that.setData({
        imgSrc:res.imgSrc,
        detail:res.result
      })
      
    }).catch((err) => {
   console.log(err)
    })
  },
  confirm(e) {
    console.log(e.currentTarget.dataset.id)
    const that = this;
    wx.showModal({
      title: '确认收货',
      content: '确认收货？',
      success: function (r) {
        if (r.confirm) {
        app.comfirm(e.currentTarget.dataset.id).then(res => {
          console.log(res)
          that.getDetail(that.data.orderId)
        })
      }}
    })

  },
  cancelOrder(e) {
    const that = this;
    wx.showModal({
      title: '取消订单',
      content: '确认取消此订单？',
      success: function (r) {
        if (r.confirm){
          console.log(r)
        app.cancel(e.currentTarget.dataset.id).then(res => {
          console.log(res)
          that.getDetail(that.data.orderId)
        })
        }
      }
    })

  },
  logistics(e) {
    wx.navigateTo({
      url: '../logistics/logistics?orderno=' + e.currentTarget.dataset.no,
    })
  },

  continuePay(e) {
    if (ordering) {
      return;
    }
    ordering = true;
    wx.showLoading({
      title: '',
      mask: true
    })
    const obj = new Object;
    const orderNo = e.currentTarget.dataset.no;
    obj.orderNo = orderNo;
    post(urls.continuePay, obj).then(res => {
      wx.requestPayment(
        {
          'timeStamp': res.result.timestamp,
          'nonceStr': res.result.noncestr,
          'package': res.result.package,
          'signType': 'MD5',
          'paySign': res.result.sign,
          'success': function (res) {
            wx.navigateTo({
              url: '../success/success',
            })

          },
          'fail': function (res) {

          },
          'complete': function (res) { ordering = false; wx.hideLoading() }
        })

    }).catch(res => {
      ordering = false;
      wx.hideLoading()
      wx.showModal({
        title: '出错了',
        content: '出现了一点小问题，请稍后重试',

      })
    })
  }

}) 