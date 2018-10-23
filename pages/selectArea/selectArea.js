var util = require('../../utils/util.js')
const _ = require('../../utils/underscore');
var app = getApp();
import urls from '../../utils/urls'
import post from '../../utils/request'

var myArea = {};
Page({
  data: {
    length: 0,
    currentIndex: 0,
    issel: true
  },
  onLoad() {
    this.getArea().then((res)=>{
      this.setData({
         prolist: res,
      })
    })
  },
  getArea(id) {
    const that = this;
    var promise = new Promise((resolve, reject) =>{
      const myparams = new Object();
      var obj = new Object;
      obj.id=id||"";
      console.log(obj);
      post(urls.allArea, obj).then((res) => {  
        resolve(res.result)
      }).catch((err) => {
        reject(err)
      })
    })
    return promise;
  },
  selectPro(e) {
    this.setData({
      citylist: [],
      })
    console.log(e.currentTarget.dataset.id)
    myArea.pro = e.currentTarget.dataset.pro
    this.getArea(e.currentTarget.dataset.id).then((res)=>{
      this.setData({
        citylist: res
      })
     
    })
    delete myArea[
      "city"
    ]
    delete myArea[
      "area"
    ]
    const arr = Object.keys(myArea)
    this.setData({
      citylist: e.currentTarget.dataset.city,
      currentIndex: 1,
      length: arr.length,
      myArea,
      issel: true
    })
  },
  selectCity(e) {
    this.setData({
      arealist: []
    })
    myArea.city = e.currentTarget.dataset.city
    this.getArea(e.currentTarget.dataset.id).then((res)=>{
      console.log(res)
      this.setData({
        arealist:res
      })
    })
    delete myArea[
      "area"
    ]
    const arr = Object.keys(myArea)
    this.setData({
      arealist: e.currentTarget.dataset.area,
      currentIndex: 2,
      length: arr.length,
      myArea,
      issel: true
    })
    console.log(this.data.arealist)
  },
  selectArea(e) {
    myArea.area = e.currentTarget.dataset.area;
    const arr = Object.keys(myArea);
    this.setData({
      length: arr.length,
      myArea,
      issel: true
    })
    const a = myArea.pro + myArea.city + myArea.area;
    console.log(myArea)
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      item: e.currentTarget.dataset.item,
      myArea:myArea.pro+myArea.city+myArea.area,
      myAreaObj:myArea
    });
    wx.navigateBack({//返回
      delta: 1
    })
  },
  changeIndex(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
      issel: false
    })
  }
});