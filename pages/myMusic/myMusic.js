// 

/**
 * pages/myMusic/myMusic.js
 * @description 在线音乐列表页及搜索页
 * @version 1.0.0
 */
var sliderWidth = 96;   // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
var api = require("../../utils/myMusicAPI.js");

Page({
  data: {
    loading: true,
    isPlaying: false,
    songlist: [],
    tabs: ["我的专辑页", "歌曲搜索"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  // tab 点击事件
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    if (this.data.activeIndex == 0) {
      this._songListActive();
    } else {
      this._songSearchActive();
    }
  },

  // 音乐列表页
  _songListActive: function() {
    var _this = this;
    wx.setNavigationBarTitle({ title: "我的音乐列表" });

    var dataPromise = api.getMusicList(88175331).then(function(data){
        _this.setData({
          songlist: data
        })
    });
  },

  // 搜索页
  _songSearchActive: function() {
    wx.setNavigationBarTitle({ title: "查找歌曲" });
  },

  // 播放音乐
  playToggle: function(e) {
    if(this.data.isPlaying){
      wx.pauseBackgroundAudio()
      this.setData({isPlaying: false});
    } else{
      wx.playBackgroundAudio({
        dataUrl: e.currentTarget.dataset.musicurl,
        title: e.currentTarget.dataset.musictitle
      })
      this.setData({isPlaying: true})
    }
  },

  // 页面加载 
  onLoad: function (options) {
    var _this = this;
    // 计算并设置tab
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          sliderLeft: (res.windowWidth / _this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / _this.data.tabs.length * _this.data.activeIndex
        });
      }
    });
    this.data.activeIndex == 0 ? this._songListActive() : this._songSearchActive();

  },
  onReady: function () {
    // 页面渲染完成
    this.setData({
      loading: false
    })
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})