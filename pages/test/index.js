//index.js
//获取应用实例
let util = require('../../utils/util.js');
//let wechat = require("../../utils/wechat");
let amap = require("../../utils/amap");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cindex: "0",
    types: ["getDrivingRoute", "getWalkingRoute", "getTransitRoute", "getRidingRoute"],
    markers: [],
    polyline: [],
    distance: '',
    cost: '',
    transits: [],
    city: "",
    name: "",
    desc: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    // wx.request({
    //   url: 'http://v.juhe.cn/dream/category?key=1763de4de5d45554e9a7177763a8e196',
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (res) {
    //     console.log(res)
    //   },
    //   complete: function (res) {
    //     console.log(res)
    //   },
   // })
    let { latitude, longitude, latitude2, longitude2, city, name, desc } = e;
    let markers = [
      {
        iconPath: "/img/1.png",
        id: 0,
        latitude,
        longitude,
        width: 23,
        height: 33
      }, {
        iconPath: "/img/1.png",
        id: 1,
        latitude: latitude2,
        longitude: longitude2,
        width: 24,
        height: 34
      }
    ];

    this.setData({
      latitude, longitude, latitude2, longitude2, markers, city, name, desc
    });
    this.getRoute();
  },
  changeType(e) {
    let { id } = e.target.dataset;
    let { cindex } = this.data;
    if (id == cindex) return;
    this.setData({ cindex: id });
    this.getRoute();
  },
  getRoute() {
    let { latitude, longitude, latitude2, longitude2, types, cindex, city } = this.data;
    let type = types[cindex];
    let origin = `${longitude},${latitude}`;
    let destination = `${longitude2},${latitude2}`;
    amap.getRoute(origin, destination, type, city)
      .then(d => {
         console.log(d);
        this.setRouteData(d, type);
      })
      .catch(e => {
        console.log(e);
      })
  },
  setRouteData(d, type) {
    if (type != "getTransitRoute") {
      let points = [];
      if (d.paths && d.paths[0] && d.paths[0].steps) {
        let steps = d.paths[0].steps;
        wx.setStorageSync("steps", steps);
        steps.forEach(item1 => {
          let poLen = item1.polyline.split(';');
          poLen.forEach(item2 => {
            let obj = {
              longitude: parseFloat(item2.split(',')[0]),
              latitude: parseFloat(item2.split(',')[1])
            }
            console.log(obj);
            points.push(obj);
          })
        })
      }
      this.setData({
        polyline: [{
          points: points,
          color: "#00ff00",
          width: 6
        }]
      });
    }
    else {
      if (d && d.transits) {
        let transits = d.transits;
        transits.forEach(item1 => {
          let { segments } = item1;
          item1.transport = [];
          segments.forEach((item2, j) => {
            if (item2.bus && item2.bus.buslines && item2.bus.buslines[0] && item2.bus.buslines[0].name) {
              let name = item2.bus.buslines[0].name;
              if (j !== 0) {
                name = '--' + name;
              }
              item1.transport.push(name);
            }
          })
        })
        this.setData({ transits });
      }
    }
    if (type == "getDrivingRoute") {
      if (d.paths[0] && d.paths[0].distance) {
        this.setData({
          distance: d.paths[0].distance + '米'
        });
      }
      if (d.taxi_cost) {
        this.setData({
          cost: '打车约' + parseInt(d.taxi_cost) + '元'
        });
      }
    }
    else if (type == "getWalkingRoute" || type == "getRidingRoute") {
      if (d.paths[0] && d.paths[0].distance) {
        this.setData({
          distance: d.paths[0].distance + '米'
        });
      }
      if (d.paths[0] && d.paths[0].duration) {
        this.setData({
          cost: parseInt(d.paths[0].duration / 60) + '分钟'
        });
      }
    }
    else if (type == "getRidingRoute") {

    }
  },
  goDetail() {
    let url = `/pages/info/info`;
    wx.navigateTo({ url });
  },
  nav() {
    let { latitude2, longitude2, name, desc } = this.data;
    wx.openLocation({
      latitude: +latitude2,
      longitude: +longitude2,
      name,
      address: desc
    });
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