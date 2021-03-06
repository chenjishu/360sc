//const URL = "http://2072j5868d.iask.in:52701/";//测试环境
//const URL ="https://m.shi-yi.com/"
const URL ="https://m.yp360.cn/"
module.exports = {
  hotGood: URL + "api/route.htm?method=commodity.goods.pagelist",//
  reg: URL + "api/route.htm?method=register",//
  login: URL + "api/route.htm?method=user.login",//
  cookie: URL + "api/route.htm?method=user.cookie",//
  pagelist: URL + "api/route.htm?method=commodity.goods.pagelist",//
  cat: URL + "api/route.htm?method=commodity.cat.list",//分类接口
  order: URL + "api/route.htm?method=trade.order.getAll",//订单信息
  orderDetail: URL + "api/route.htm?method=trade.order.get",//订单详情
  addadress: URL + "api/route.htm?method=user.address.add",//增加地址
  allArea: URL + "api/route.htm?method=wish.baseArea.list",//省市区区域列表
  goodDetail:URL+"/api/route.htm?method=commodity.goods.getById",//商品详情
  adressList:URL+"api/route.htm?method=user.address.list",//查询收货地址
  addAdress:URL +"api/route.htm?method=user.address.add",//增加收货地址
  updateAddress: URL +"api/route.htm?method=user.address.update",//修改默认收货地址
  removeAddress:URL+"api/route.htm?method=user.address.remove",//删除地址
  addShop:URL+"api/route.htm?method=wish.update",//添加购物车
  wishList:URL+"api/route.htm?method=wish.wishList",//购物车列表
  delWish:URL+"api/route.htm?method=wish.del",//删除购物车
  addtrade:URL+"api/route.htm?method=trade.after.add",
  cofirm: URL +"api/route.htm?method=trade.confirmReceipt",//确认收货
  cancel: URL +"api/route.htm?method=trade.order.cancel",//取消订单
  login: URL +"api/route.htm?method=user.getLogin",
  expressFee:URL+"api/route.htm?method=trade.getExpressFee",
  logistics:URL+"api/route.htm?method=trade.order.logistics",
  bannerImg: URL +"api/route.htm?method=cms.news.getInfoAll",
  continuePay: URL + "api/route.htm?method=trade.continuePay",//继续付款
  article:URL+"/api/route.htm?method=article.list",
  content: URL +"/api/route.htm?method=article.getInfo",
  read: URL +"/api/route.htm?method=article.update",
  goodD: URL +"/api/route.htm?method=commodity.getByCommodityIdAndInfo",
  delOrder: URL +"/api/route.htm?method=trade.removeCancelOrder"
};