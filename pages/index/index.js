//index.js
//获取应用实例
const app = getApp();
const amapFile = require('../../libs/amap-wx.js');
let key = 'f8d475ade11e8db64375c94122ee3053';
let myAmapFun = new amapFile.AMapWX({
  key
});

let amap = require("../../utils/amap.js");
let markersData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    city: '',
    markerId: 0,
    controls: [{
      id: 0,
      position: {
        left: 10,
        top: 200,
        width: 40,
        height: 40
      },
      iconPath: "/img/1.png",
      clickable: true
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(e) {
      myAmapFun.getRegeo({ 
        success:(d)=>{
          let { name, desc, latitude, longitude}=d[0];
          console.log(name,desc)
          let { province } = d[0].regeocodeData.addressComponent;
          this.setData({
            city: province,
            latitude,
            longitude,
            textData:{
              name,
              desc
            }
          })
      }, fail:(err)=>{
        console.log(err);
      }
    })
  },
  bindInput() {
    let {
      latitude,
      longitude,
      city
    } = this.data;
    let url = `/pages/input/index?city=${city}&lonlat=${longitude},${latitude}`;
    wx.navigateTo({
      url
    });
  },
  maker(e) {
    console.log(e);
    let {markerId} = e;
    let {markers} = this.data;
    let marker = markers[markerId];
    // console.log(marker);
    this.showMarkerInfo(marker);
    this.changeMarkerColor(markerId);
  },
  showMarkerInfo(data) {
    let {
      name,
      address: desc
    } = data;
    this.setData({
      textData: {
        name,
        desc
      }
    })
  },
  changeMarkerColor(markerId) {
    let {
      markers
    } = this.data;
    markers.forEach((item, index) => {
      item.iconPath = "/img/marker.png";
      if (index == markerId) item.iconPath = "/img/marker_checked.png";
    })
    this.setData({
      markers,
      markerId
    });
  },
  getRoute() {
    // 起点
    let {
      latitude,
      longitude,
      markers,
      markerId,
      city,
      textData
    } = this.data;
    let {
      name,
      desc
    } = textData;
    if (!markers.length) return;
    // 终点
    let {
      latitude: latitude2,
      longitude: longitude2
    } = markers[markerId];
    let url = `/pages/test/index?longitude=${longitude}&latitude=${latitude}&longitude2=${longitude2}&latitude2=${latitude2}&city=${city}&name=${name}&desc=${desc}`;
    wx.navigateTo({
      url
    });
  },
  clickcontrol(e) {
    console.log("回到用户当前定位点");
    let {
      controlId
    } = e;
    let mpCtx = wx.createMapContext("map");
    mpCtx.moveToLocation();
  },
  mapchange() {
    // console.log("改变视野");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})