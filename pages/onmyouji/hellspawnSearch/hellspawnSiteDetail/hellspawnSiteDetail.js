
/**
 * pages/onmyouji/hellspawnSearch/hellspawnSiteDetail/hellspawnSiteDetail.js
 * 
 * @description 式神搜索页
 * @version 1.0.0
 * 
 */

var http = require("../../../../utils/http.js");

Page({

  data: {
    id: "",
    hellspawn: {},
    sceneList: [],
    haveScene: true
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 100000
    });
    this.setData({
      id: options.id
    })
    if (options.id) {
      this.getHellspawnInfo();
      this.getHellspawnScenes();
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  // 获取records中id一致的位置
  searchRecord: function (id, records) {
    records.forEach(function(d, i) {
      if(d.id == id) return i;
    })
    return -1;
  },

  addHellspawnToLocalStoage: function () {
    var oldRecord = wx.getStorageSync('search_record');
    if (oldRecord) {
      var index = this.searchRecord(this.data.id, oldRecord);
      var weight = wx.getStorageSync('weight') + 1;
      var hs = this.data.hellspawn;
      hs.weight = weight;
      if (index >= 0) {
        oldRecord[index] = hs;
        oldRecord.sort(function (a, b) {
          return b.weight - a.weight
        });
      } else {
        oldRecord.unshift(hs);
      }
      wx.setStorage({
        key: 'search_record',
        data: oldRecord
      });
    } else {
      var weight = 1;
      var hs = this.data.hellspawn;
      hs.weight = weight;
      wx.setStorage({
        key: 'search_record',
        data: new Array(hs)
      });
    }
    wx.setStorage({
      key: 'weight',
      data: weight
    });
  },

  // 根据id获取的式神信息
  getHellspawnInfo: function () {
    var url = http.generateUrl("api/v1/hellspawn/" + this.data.id);
    var _this = this;
    wx.request({
      url: url,
      method: 'GET',
      success: function (res) {
        if (res.data.status == 1) {
          _this.setData({
            hellspawn: res.data.body.hellspawn
          })
          _this.addHellspawnToLocalStoage();
          wx.setNavigationBarTitle({
            title: _this.data.hellspawn.name
          })
        }
      }
    })
  },

  // 根据id获取的式神场景
  getHellspawnScenes: function () {
    var url = http.generateUrl("api/v1/hellspawn/" + this.data.id + '/scenes'), _this = this;
    wx.request({
      url: url,
      method: 'GET',
      success: function (res) {
        // success
        wx.hideToast();
        if (res.data.status == 1) {
          _this.setData({
            sceneList: res.data.body.scene_list
          });
          if (_this.data.sceneList.length == 0) {
            _this.setData({
              haveScene: false
            });
          }
        }
      }
    })
  }
})