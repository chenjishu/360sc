var util = require('../../utils/util.js')
const _ = require('../../utils/underscore');
var app = getApp();
import urls from '../../utils/urls'
import post from '../../utils/request'

Page({
  data: {

  },
  onLoad: function (options) {
    const uri=options.uri;
    console.log(uri)
    this.getDetail(uri).then((res) => {
      console.log(res.result)
      this.setData({
        imgSrc: res.imgSrc,
        info: res.result,
        albumImg: res.result.albumImg.split(','),
        goodsLabel: res.result.goodsLabel.split(','),
        goodsDesc: res.result.goodsDesc.split(',')
      })
      console.log(res.result.albumImg.split(','))
    })
  },
  addShop(e) {
    const that = this;
    if (this.data.info.wishStatus == 1) {
      wx.switchTab({
        url: '../shopingCart/shopingCart'
      })
      return;
    }
    if (this.data.info.wishStatus == 2) {
      console.log(2)
      app.addShop(e.currentTarget.dataset.goodssn, 1).then((res) => {
        that.setData({
          info: Object.assign({}, that.data.info, { wishStatus: 1 })
        })
      })
    }

  },
  getDetail(id) {
    const that = this;
    return new Promise((resolve, reject) => {
      app.getsto().then(res => {
        const myparams = new Object();
        const obj = new Object;
        obj.goodsSn=id;
        if (!!res) {
          obj.uid = res;
        };
        console.log(obj);
        post(urls.goodD, obj).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    })
  },
  seeShop: function (e) {
    console.log(2);
    wx.switchTab({
      url: '../shopingCart/shopingCart'
    })
  },
  buy() {
    const uid = wx.getStorageSync('uid');
    const userInfo = wx.getStorageSync('userInfo');
    if (!uid || !userInfo) {
      wx.navigateTo({
        url: '../login/login',
      })
      return;
    }

    const goodInfo = {};
    goodInfo.cname = this.data.info.goodsName;
    goodInfo.goodsSn = this.data.info.goodsSn;
    goodInfo.img = this.data.info.img;
    goodInfo.quantity = 1;
    goodInfo.shopPrice = this.data.info.shopPrice;
    const list = [];
    list.push(goodInfo);
    const imgsrc = this.data.imgSrc
    console.log(list);
    console.log(imgsrc);
    wx.navigateTo({
      url: '../settlement/settlement?list=' + JSON.stringify(list) + '&imgsrc=' + imgsrc,
    })


  }
})