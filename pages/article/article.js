var util = require('../../utils/util.js')
const _ = require('../../utils/underscore');
var app = getApp();
import urls from '../../utils/urls'
import post from '../../utils/request'
var news;
var limit=10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    console.log(options.index)
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.windowWidth);
        console.log(res.windowHeight);
        that.setData({
          height: res.windowHeight
        })
      },
    })
    this.setData({
      currentIndex:options.index
    })  
    this.initNews();
    this.getnews(options.index)
  },
  initNews(){
    news = new Array();
    for (let i=0;i<4;i++){
      let item={};
      item.page=1;
      item.status=i+1;
      item.hasmore=true;
      item.news=[]
        news.push(item);
    }
    console.log(news);
  },
  getnews(index){
    const that=this
    const obj={};
    obj.status=index*1+1;
    obj.currentPage=news[index].page;
    obj.limit=limit;
    //console.log(obj);
    if(news[index].hasmore){
      news[index].hasmore = false;
      post(urls.article, obj).then(res => {
        if(res.result.length==limit){
          news[index].hasmore=true;
          news[index].page++;
        }else{
          news[index].done=true;

        }
        //console.log(res)
        news[index].news = news[index].news.concat(res.result)
        that.setData({ news: news })
        console.log(that.data.news)
      })
    }
    
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  sChange(e){
    const index=e.detail.current
    this.setData({
      currentIndex:index
    })
    if (this.data.news[index].news.length==0){
      this.getnews(e.detail.current)
    }
    
  },
  changeIdx(e){
    this.setData({
      currentIndex:e.currentTarget.dataset.index
    })
  },
  lower(){
    this.getnews(this.data.currentIndex)
  }
})