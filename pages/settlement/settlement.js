 var app = getApp();
import urls from '../../utils/urls'
import post from '../../utils/request';
let ordering=false;
let down=false;
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
      
      },
      fail: function () {

      }
    })
  },
  onShow: function () {
    ordering=false;
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
    if(ordering){
      return;
    }
    ordering=true;
    wx.showLoading({
      title: '',
      mask:true
    })
    const that = this;
    if (!that.data.defaultAddress.id){
      wx.hideLoading();
      wx.showModal({
        title: '默认地址不能为空',
        content: '前往填写默认地址?',
        success:function(res){
          if (res.confirm){
            wx.navigateTo({
              url: '../selectAdress/selectAdress'
            })
          }
        
        }
      })
      return;

    }
      let str = '';
      for (var k in this.data.list) {
        str += this.data.list[k].goodsSn + '_' + this.data.list[k].quantity + ','
      }
      console.log(str.substring(0, str.length - 1))

      app.myGetSto().then((res) => {
        app.getInfo().then(openid => {
         console.log(openid)
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
                  down=true;
                  wx.navigateTo({
                    url: '../success/success',
                  })

                 },
                'fail': function (res) {
              
                 },
                'complete': function (res) { ordering=false;}
              }) 
          }).catch((e) => {
            ordering=false;
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
    const that=this;
    let price=0;
    console.log(list)
    for (var k in list){
      price += list[k].quantity*list[k].shopPrice*1;
      console.log(price)
  }
  this.setData({
    price:price.toFixed(2),
    all: (price * 1 + that.data.expressFee * 1).toFixed(2)
  })

    
  },
  expressFee(){
    const that=this;
    const obj=new Object;
    post(urls.expressFee,obj).then(res=>{
      that.setData({
        expressFee: res.result.expressFee,
        all: (that.data.price*1 + res.result.expressFee*1).toFixed(2)
      })
    })
    

  }
})