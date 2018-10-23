import urls from '../../utils/urls';
import post from '../../utils/request';
var app = getApp();
let list=[];
let page=1;
let hasmore=true;
let loading=false;
var option;
let uid=''
let addHasDown = true;
Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
     page = 1;
     hasmore = true;
     loading = false;
    //options.currentPage=page;
    option = options;
    app.getsto().then(res=>{
      uid=res
    })
    this.goodList(option);
  },
  onShow(){
    addHasDown=true;
  },
  addShop(e) {
    console.log(addHasDown)
    if (!addHasDown){
      console.log('正在进行事件')
      return;
    } 
    addHasDown = false;
    console.log('1111')
    console.log(addHasDown)
    console.log(e)
    const that=this;
    const i = e.currentTarget.dataset.index;
    console.log(e.currentTarget.dataset.goodssn)
    app.addShop(e.currentTarget.dataset.goodssn, 1).then((res)=>{
      that.setData({
        list: [...that.data.list.slice(0, i), Object.assign({}, that.data.list[i], { wishStatus:1}), ...that.data.list.slice(i + 1)]
      })
      console.log('完成了')
      addHasDown = true;
    }).catch((err)=>{
      addHasDown = true;
      wx.showToast({
        title: '网络竟然出错了',
        icon: 'none',
        duration: 2000
      })
    })
  },
  onReachBottom: function () {
    this.goodList(option);
  },
  onShareAppMessage: function () {
  
  },
  toGoodDetail(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.id,
    })

  },
  goodList: function (option) {
    const that = this;
    if (hasmore){
      console.log('触发了刷新事件')
      hasmore=false;
      that.setData({
        hasmore,
        loading: true
      })
      option.currentPage = page;
      var obj = new Object;
      obj.goodsType = option.goodsType || '';
      obj.catNo = option.catNo || '';
      obj.goodsName = option.goodsName || '';
      obj.currentPage = option.currentPage || '';
      obj.uid=uid;
      console.log(obj)
      that.setData({
       
      })
      post(urls.pagelist, obj).then((res) => {
        console.log(res.result)
        if (res.result.length==0){
          console.log('没有商品了')
          loading=false;
          that.setData({
            loading
          })
          return;

        }
        that.setData({
          imgsrc: res.imgSrc,
          list: [...that.data.list,...res.result]
        })
        page++;
        hasmore = true;
        if (res.result.length < 6) {
          hasmore = false;

        }
        that.setData({
          loading:false,
          hasmore
        })

      })
    }
    return;
  },
  submitOrder(e){
    list=[]
    this.setData({
      list
    })
    console.log(e.detail.value.name)
    page=1;
    option.curretPage=1;
    option.goodsName = e.detail.value.name;
    hasmore=true;loading=false;
    this.setData({
      hasmore,
      loading
    })
    this.goodList(option);

  }
})