import urls from '../../utils/urls'
import post from '../../utils/request'
　const app = getApp()
let currentPage=1;
let hasmore=true;
let ordering=false;
Page({

  data: {
    status:"",
    netError:false,
    noOne:false,
    isLoaded:false
  },
  onLoad: function (options) {
    const that = this;
    currentPage = 1;
    hasmore = true;
    app.myGetSto().then((res)=>{
      wx.showLoading()
      that.orderList(res, currentPage, that.data.status).then((res) => {
        wx.hideLoading()
        console.log(res)
        that.setData({
          list: res.result,
          imgSrc:res.imgSrc,
          isLoaded:true
        })
        if(res.result.length==0){
          that.setData({
            noOne:true
          })
        }
      }).catch((err) => {
        wx.hideLoading()
        console.error(err)
      })
    })
  },
  onShow(){
    ordering = false
  },
  orderList(Uid,page,status) {
    const that = this;
    var promise = new Promise((resolve, reject) => {
      const myparams = new Object();
      var obj = new Object;
      obj.uid = Uid;
      obj.limit = 5;
      obj.currentPage = page;
      obj.status=status||""
      console.log(obj);
      post(urls.order, obj).then((res) => {
       
      resolve(res)
      }).catch((err) => {
       
        that.setData({
          netError:true
        })
        reject(err)
      })
    })
    return promise;
  },
  //order(){
   // const that = this
   // app.myGetSto().then((res) => {

    //  that.orderList(res).then((res) => {
       
     // }).catch((err) => {
    //    console.error(err)
    //  })
   // })
 // },
  toDetail(e){
    console.log()
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderid=' + e.currentTarget.dataset.orderid,
    })
  },
  confirm(e){
    const that=this;
    wx.showModal({
      title: '确认收货',
      content: '确认收货？',
      success: function (r) {
        if (r.confirm) {
        app.comfirm(e.currentTarget.dataset.id).then(res => {
          console.log(res)
          that.onLoad()
        })
      }}
    })
   
  },
  cancelOrder(e){
    const that = this;
    wx.showModal({
      title:'取消订单',
      content:'确认取消此订单？',
      success:function(r){
        if (r.confirm){
          app.cancel(e.currentTarget.dataset.id).then(res => {
            console.log(res)
            that.onLoad()
          })
        }
      
      }
    })
  
  },
  getMore(){
    const that=this;
    if(hasmore){
      that.setData({
        isLoading:true
      })
      currentPage++;
      hasmore=false;
      const uid = wx.getStorageSync('uid');
      that.orderList(uid, currentPage, that.data.status).then(res=>{
        console.log(res);
        if (res.result.length==5){
          hasmore = true;
        }
        if (res.result.length<5){
          that.setData({
           nomore:true
          })
        }
        that.setData({
          list: [...that.data.list,...res.result],
          isLoading:false,
        })
      }).catch(err=>{
        currentPage--;
        that.setData({
          isLoading:false
        })
        
      })
    }
  },
  selectSta(e){
    const that = this;
    currentPage = 1;
    hasmore = false;
    that.setData({
      list: [],
      status: e.currentTarget.dataset.status,
      isLoaded:false
    })
    app.myGetSto().then((res) => {
      that.orderList(res, currentPage,that.data.status ).then((res) => {
        console.log(res)
        that.setData({
          list: res.result,
          imgSrc: res.imgSrc,
           isLoaded: true
        })
        if (res.result.length == 5) {
          hasmore = true;
        }
       
      }).catch((err) => {
        console.error(err)
      })
    })
  },
  logistics(e){
     wx.navigateTo({
       url: '../logistics/logistics?orderno='+e.currentTarget.dataset.no,
     })
  },
  continuePay(e){
    if (ordering){
      return;
    }
    ordering=true;
    wx.showLoading({
      title: '',
      mask:true
    })
    const obj=new Object;
    const orderNo=e.currentTarget.dataset.no;
    obj.orderNo = orderNo;
    post(urls.continuePay,obj).then(res=>{
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
          'complete': function (res) { ordering = false;wx.hideLoading() }
        }) 

    }).catch(res=>{
      ordering = false;
      wx.hideLoading()
      wx.showModal({
        title: '出错了',
        content: '出现了一点小问题，请稍后重试',
        
      })
    })
  }
})