var util = require('../../utils/util.js')
const _ = require('../../utils/underscore');
var app = getApp();
import urls from '../../utils/urls'
import post from '../../utils/request'
let addHasDown = true;
Page({
  data: {
    imgUrls: [
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    hotgood:{},
    bestgoods:{}
  },
  onLoad: function (options) {
    
  },
  onShow(){
    this.postHotgood(),
      this.postBestgood()
    //app.getInfo()
  },
  addShop(e){ 
    const that=this;
    if (!addHasDown) {
      console.log('正在进行事件')
      return;
    }
    addHasDown = false;
    console.log(e)
    console.log(e.currentTarget.dataset.goodssn)
    app.addShop(e.currentTarget.dataset.goodssn, 1).then(()=>{
      that.onShow()
      addHasDown = true;
    }).catch((err) => {
      addHasDown = true;
      wx.showToast({
        title: '网络竟然出错了',
        icon: 'none',
        duration: 2000
      })
    })
   
  },
  removeShop(e){
    e.currentTarget.dataset.id

  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  bindQueTap: function (e) {
    console.log(1)
    if (util.isRepeatClick()) return//判断是否为重复点击
    var that = this;
    wx.navigateTo({
      url: '../goodDetail/goodDetail'
    })
  },
  togood() {
    //var that=this;
    console.log(1)
    wx.navigateTo({
      url: '../searchgoods/searchgoods',
    })
  },
  postHotgood: function () {
    app.getsto().then(res=>{
      console.log(res)

      var obj = new Object;
      obj.currentPage = 1;
      obj.goodsType = 1;
      if(!!res){
        obj.uid=res;
      };
      post(urls.hotGood, obj).then((res) => {
        console.log(res)
        this.setData({
          imgsrc: res.imgSrc,
          hotgoods: res.result
        })
        console.log(this.data.hotgoods)
      })
    })
  },
  postBestgood: function () {
    app.getsto().then(res => {
      var obj = new Object;
      obj.currentPage = 1;
      obj.goodsType = 3;
      if (!!res) {
        obj.uid = res;
      };
      post(urls.hotGood, obj).then((res) => {
        this.setData({
          imgsrc: res.imgSrc,
          bestgoods: res.result
        })
        console.log('哈哈哈哈')
        console.log(this.data.bestgoods)
      })
      })

  },
  toGoodDetail(e){
    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.id,
    })

  },
  
  
})

