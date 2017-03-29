// pages/salaryCalcutator/salaryCalcutator.js
Page({
  data: {
    showWarnTips: false,
    salary: null,

    cityList: [],
    cityIndex: 0,

    afterCalData: {}
  },

  // 税前工资改变事件
  bindSalaryChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      salary: e.detail.value
    })
    if (this.data.salary !== null) {
      this.setData({
        showWarnTips: false
      })
    }
  },

  // 城市改变事件
  bindCityChange: function (e) {
    this.setData({ cityIndex: e.detail.value })
  },


  // 提交事件
  bindSubmitBtn: function (e) {
    var _this = this;
    if (this.data.salary == null || this.data.salary =='') {
      this.setData({ showWarnTips: true }); return;
    }

    // 7个参数
    var city = this.data.cityList[this.data.cityIndex].value,
        salary = this.data.salary;
    // 三金基数, 公积金基数 上下限
    var base_js = {
      max_base_3j: 17817,
      min_base_3j: 3563,
      max_base_gjj: 17817,
      min_base_gjj: 2020
    };
    var base_3j = salary < base_js.min_base_3j ? base_js.min_base_3j : salary > base_js.max_base_3j ? base_js.max_base_3j : salary,
      base_gjj = salary < base_js.min_base_gjj ? base_js.min_base_gjj : salary > base_js.max_base_gjj ? base_js.max_base_gjj : salary;

    console.log(city, salary, base_3j, base_gjj);

    // 这个api不稳定
    var _queryUrl = 'http://salarycalculator.sinaapp.com/calculate?city=' + city + '&origin_salary=' + salary + '&base_3j=' + base_3j + '&base_gjj=' + base_gjj + '&is_gjj=true&is_exgjj=false&factor_exgjj=0.08';

    wx.request({
      url: _queryUrl,
      method: 'GET',
      success: function (response) {
        console.log(response);
        if (response.data) {
          _this.setData({ afterCalData: response.data });
          _this.openAlert();
        }
      },
      fail: function() {
        // _this.openAlert();  //有bug
      }
    })
  },

  openAlert: function () {
    var _this = this,
        final_salary = _this.data.afterCalData.final_salary,
        msg = final_salary ? '税后工资:￥' + final_salary : 'API不稳定, 可能又挂了>_<';

    wx.showModal({
      content: msg,
      showCancel: false,
      success: false
    });
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var cities = [{ name: '上海', value: 'shanghai' }];
    this.setData({
      cityList: cities
    })

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
  }
})