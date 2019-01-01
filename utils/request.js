 export default function post(url, data={}) {
  var promise = new Promise((resolve, reject) => {
    var that = this;
    data.v='1.0';
    data.os='ios';
    var postData = data;
    //console.log(data)
    //console.log(url)
    wx.request({
      url: url,
      data: postData,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        //console.log(res)
       
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res.data.msg);
        }
      },
      error: function (e) {
        //console.log(e)
        //reject('网络出错');
      }
    })
  });
  return promise;
}