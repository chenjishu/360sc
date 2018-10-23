 var app = getApp();
import urls from '../../utils/urls'
import post from '../../utils/request';
Page({
  data: {
    list:[],
    imgSrc:'',
    price:0
  },

  onLoad: function (options) {
    this.setData({
      list:JSON.parse(options.list),
      imgSrc:options.imgsrc
    })
    const that = this
    this.countPrice(JSON.parse(options.list))
    this.expressFee()
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        //console.log(res.data)
      },
      fail: function () {
      //  wx.navigateTo({
      //    url: '../login/login',
      //  })
      }
    })

  },
  
  onShow: function () {
    const that=this
    app.myGetSto().then(res=>{
      that.getList(res).then((res) => {
        console.log(res)
        that.setData({
          addressList: res
        })
        for (var k in res) {
          console.log(2)
          if (res[k].isDefault == 'Y') {
            console.log(res[k])
            that.setData({
              defaultAddress: res[k]
            })
            return;
          }
        }
        if(res.length==0){
          that.setData({
            defaultAddress: []
          })
        }
      }).catch((err) => {
        console.error('出错咯')
      })


    })
   
  },
  order(){
    wx.showLoading({
      title: '',
    })
    const that = this;
      let str = '';
      for (var k in this.data.list) {
        str += this.data.list[k].goodsSn + '_' + this.data.list[k].quantity + ','
      }
      console.log(str.substring(0, str.length - 1))

      app.myGetSto().then((res) => {
        app.getInfo().then(openid => {
          const obj = new Object;
          obj.uid = res;
          obj.openid = openid;
          obj.addressId = that.data.defaultAddress.id;
          obj.goodsIdStr = str.substring(0, str.length - 1);
          obj.buyerMessage = '';
          post(urls.addtrade, obj).then((res) => {
           wx.hideLoading()
            wx.requestPayment(
              {
                'timeStamp': res.result.timestamp,
                'nonceStr': res.result.noncestr,
                'package': res.result.package,
                'signType': 'MD5',
                'paySign': res.result.sign,
                'success': function (res) {
                  console.log(1)
                  wx.navigateTo({
                    url: '../success/success',
                  })
                 },
                'fail': function (res) {
              
                 },
                'complete': function (res) { }
              }) 
          }).catch((e) => {
            console.log(2)
            console.log('失败了' + e)
          })
        })
       
      })
  },

  turnToMyadress(){
    wx.navigateTo({
      url: '../selectAdress/selectAdress'
    })
  },
  getList(uid) {
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
  countPrice(list){
    let price=0;
    console.log(list)
    for (var k in list){
      price += list[k].quantity*list[k].shopPrice*1;
      console.log(price)
  }
  this.setData({
    price
  })

    
  },
  expressFee(){
    const that=this;
    const obj=new Object;
    post(urls.expressFee,obj).then(res=>{
      that.setData({
        expressFee: res.result.expressFee
      })
    })
    

  }
})