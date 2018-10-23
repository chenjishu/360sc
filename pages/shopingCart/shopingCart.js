var app = getApp();
import urls from '../../utils/urls'
import post from '../../utils/request';
var wait;
var down =true;
Page({
  data: {
    // input默认是1  
    num: 1,
    delBtnWidth: 180,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    right:0,
    list:[],//购物车商品
    imgSrc:"",//图片url
    selectAll:false,
    loaded:false,
    needLogin:false,
    netErr:false,
    price:0//合计价格
  },
  onLoad(){
    //this.wishlist()
  },
  onShow() {
    this.setData({
      selectAll: false
    })
    this.wishlist()
  },
  /* 点击减号 */

  bindMinus: function (e) {
    if (!down) return;
    down = false
    clearTimeout(wait);
    const that=this;
    const i = e.currentTarget.dataset.index;
    var num = this.data.list[i].quantity;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    if(num<1){
      return;
    }
    const goodssn = e.currentTarget.dataset.goodssn;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'false' : 'true';
    // 将数值与状态写回  
    this.setData({
      list: [...that.data.list.slice(0, i), Object.assign({}, that.data.list[i], { quantity: num, minusStatus: minusStatus }), ...that.data.list.slice(i + 1)]
    });
    down=true;
    //console.log(this.data.list)
    wait = setTimeout(() => {
      console.log('hahha')
      app.addShop(goodssn, num).then(() => {
        this.wishlist()
      }).catch((e) => {
        wx.showToast({
          title: '网络竟然出错了',
          icon: 'none',
          duration: 2000
        })
      })

    }, 1500)
  },
  /* 点击加号 */
  bindPlus: function (e) {
    if(!down)return;
    down = false
    clearTimeout(wait);
    const that = this;
    const i = e.currentTarget.dataset.index;
    var num = this.data.list[i].quantity;
    num++
    console.log(num)
    const goodssn = e.currentTarget.dataset.goodssn;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      list: [...that.data.list.slice(0, i), Object.assign({}, that.data.list[i], { quantity: num, minusStatus: minusStatus }), ...that.data.list.slice(i + 1)]
    });
    down=true;
    wait = setTimeout(() => {
      app.addShop(goodssn, num).then(() => {
        this.wishlist()
      }).catch((e) => {
        wx.showToast({
          title: '网络竟然出错了',
          icon: 'none',
          duration: 2000
        })
      })

    }, 1500)
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    const that = this;
    const i = e.currentTarget.dataset.index;
    var num = e.detail.value >= 1 ? e.detail.value : that.data.list[i].quantity;
    if(num<1){
      return;
    }
    const goodssn = e.currentTarget.dataset.goodssn;
    app.addShop(goodssn, num).then(() => {
      //this.wishlist()
    }).catch((e)=>{
      wx.showToast({
        title: '网络竟然出错了',
        icon: 'none',
        duration: 2000
      })
    })
    
   // var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      list: [...that.data.list.slice(0, i), Object.assign({}, that.data.list[i], { quantity: num}), ...that.data.list.slice(i + 1)]
    });
  },
  buy(){
    let newArr=[];
    for (var k in this.data.list){
      if(this.data.list[k].selected){
        newArr.push(
          this.data.list[k]
        )
      }
    }
    console.log(newArr)
    if (!newArr.length){
         return;
    }
    wx.navigateTo({
      url: '../settlement/settlement?list=' + JSON.stringify(newArr)+'&imgsrc='+this.data.imgSrc
    })
  },

touchS(e){
  if (e.touches.length == 1) {
    // 设置活动起始点
    this.tmpStartx = e.touches[0].clientX;
  }
},
touchM(){
},
touchE(e){
  const that = this;
  var newList=[];
  for (var j = 0; j < that.data.list.length; j++) {
    newList[j] = { ...that.data.list[j], 'right': 0 }
  }
  that.setData({
    list: newList
  })
  const i = e.currentTarget.dataset.index;
  var disX = parseInt(this.tmpStartx) - parseInt(e.changedTouches[0].clientX);//console.log(disX);
  if (disX >= 50){
    this.setData({
      list: [...that.data.list.slice(0, i), Object.assign({}, that.data.list[i], { 'right': 50 }), ...that.data.list.slice(i + 1)]
    });
    
  } else if (disX <= 50){
    this.setData({
      list: [...that.data.list.slice(0, i), Object.assign({}, that.data.list[i], { 'right': 0 }), ...that.data.list.slice(i + 1)]
    });
  }
},
wishlist(){
  const that=this;
  app.getsto().then((res)=>{
    if(!!res){

      that.setData({
        needLogin: false
      })
      const obj = new Object;
      obj.uid = res;
      post(urls.wishList, obj).then((res) => {
        console.log(res.result)
        var newList = []
        for (var i = 0; i < res.result.length; i++) {
          // console.log(res.result[k])
          newList[i] = { ...res.result[i], 'right': 0, 'minusStatus': res.result[i].quantity > 1 ? true : false }
        }
        //console.log(newList)
        that.setData({
          loaded: true,
          list: newList,
          imgSrc: res.imgSrc
        })
      }).catch((e) => {
        that.setData({
          loaded: true,
          netErr: true
        })
      })
    }else{
      that.setData({
        needLogin: true,
        loaded: true
      })
    }
  })
},
delectById(id){
  return new Promise((resolve,reject)=>{
    const obj = new Object;
    obj.id = id;
    post(urls.delWish, obj).then((res) => {
      wx.showToast({
        title: '删除购物车商品成功',
        icon: 'none',
        duration: 2000
      })
      resolve();
    }).catch((e) => {
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none',
        duration: 2000
      })
    })
  })
 
},
  delect(e){
    const id=e.currentTarget.dataset.id;
    const i=e.currentTarget.dataset.index;
    const that=this;
    wx.showModal({
      title: '删除商品',
      content: '确认删除该商品？',
      success: function (res) {
      
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除商品',
          })
          that.delectById(id).then(()=>{
            wx.hideLoading()
            that.setData({
              list: [...that.data.list.slice(0, i), ...that.data.list.slice(i + 1)]
            });
            
          })
        } else if (res.cancel) {
          
        }
      }
    })

  },
  select(e){
    const i= e.currentTarget.dataset.index;
    const that=this;
    that.setData({
      list: [...that.data.list.slice(0, i), Object.assign({}, that.data.list[i], { selected: !that.data.list[i].selected }), ...that.data.list.slice(i + 1)],
      selectAll:false
    })
    console.log()
    this.fixPrice(that.data.list)
 
  },
  selectAll(){
    const that = this;
    const newList=that.data.list;
    for(var k in newList){
      newList[k].selected = !that.data.selectAll
    }
    that.setData({
      list:newList,
      selectAll: !that.data.selectAll
    })
    that.fixPriceAll(that.data.list)
   
  },
  toIndex(){
    wx.switchTab({
      url: '../index/index'
    })

  },
  toLogin(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  fixPrice(arr){
    let price=0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].selected){
        price += arr[i].quantity * arr[i].shopPrice
      }
    }
    console.log(price)
    this.setData({
      price: price.toFixed(2)
    })
  },
  fixPriceAll(arr){
    let price = 0;
    if (this.data.selectAll){
      for (var i = 0; i < arr.length; i++) {
        price += arr[i].quantity * arr[i].shopPrice
      }
      this.setData({
        price: price.toFixed(2)
      })
    }else{
      this.setData({
        price:0
      })
    }
  },
  bindGetUserInfo: function (e) {
    const that = this;
    app.getUserInfo(e).then(() => {
      that.onShow()
    }
    ).catch(() => {
      console.log('ju绝了你')
    }

    )
  },

})  