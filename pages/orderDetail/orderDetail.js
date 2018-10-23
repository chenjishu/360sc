import urls from '../../utils/urls'
import post from '../../utils/request'
　const app = getApp();
let opt;
Page({

  data: {
  
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderid
    })
    this.getDetail(options.orderid)
  
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
      success: function () {
        app.comfirm(e.currentTarget.dataset.id).then(res => {
          console.log(res)
          that.getDetail(that.data.orderId)
        })
      }
    })

  },
  cancelOrder(e) {
    const that = this;
    wx.showModal({
      title: '取消订单',
      content: '确认取消此订单？',
      success: function () {
        app.cancel(e.currentTarget.dataset.id).then(res => {
          console.log(res)
          that.getDetail(that.data.orderId)
        })
      }
    })

  },
  logistics(e) {
    wx.navigateTo({
      url: '../logistics/logistics?orderno=' + e.currentTarget.dataset.no,
    })
  }

}) 