//index.js
let util = require('../../utils/util.js');
let amap = require("../../utils/amap");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lonlat: "",
    city: "",
    tips: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)
    let { lonlat, city } = e;
    this.setData({
      lonlat, city
    })
  },
  bindInput(e){
    let { value } = e.detail;
    let { lonlat, city } = this.data;
    amap.getInputtips(city, lonlat, value).then(d=>{
      if(d&&d.tips){
        this.setData({
          tips: d.tips
        });
      }
    }).catch(e=>{
      console.log(e)
    })
  },
  bindSearch(e) {
    console.log(e.target.dataset);
    let {keywords} = e.target.dataset;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (keywords) {
      prevPage.setData({ keywords });
      amap.getPoiAround(keywords)
        .then(d => {
          // console.log(d);
          let { markers } = d;
          markers.forEach(item => {
            item.iconPath = "/img/1.png";
          })
          prevPage.setData({ markers });
          prevPage.showMarkerInfo(markers[0]);
          prevPage.changeMarkerColor(0);
        })
        .catch(e => {
          console.log(e);
        })
    }
   // let url = `/pages/index/index`;
    wx.navigateBack({ 
      delta: 1
     })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})