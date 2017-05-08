'use strict';

var util = require("../../utils/util.js");

var Promise = require('../../utils/bluebird');

var utilMd5 = require('../../utils/MD5.js');

var app = getApp();

Page({
  data : {
    loginBtnBgBgColor:"#0099FF",
    btnLoading:false,
    loginBtnTxt:"登录",
    disabled : false,
    userInfo : {}
  },
  onLoad : function onLoad(params) {
    var _this = this;
    // 页面初始化
    app.getUserInfo(function(userInfo) {
      _this.setData({
        userInfo : userInfo
      })
    })
  },
  formSubmit : function formSubmit(e) {
    var params = e.detail.value;
    this.mySubmit(params);
  },
  mySubmit : function mySubmit(params) {
    var flag = this.checkUserName(params)&&this.checkPassword(params);
    if(flag) {
      this.setLoginData1();
      this.checkUserInfo(params);
    }
  },
  checkUserInfo : function checkUserInfo(params) {
    // 获取this
    var _this = this;
    // 获取两个参数
    var username = params.loginName.trim();
    var password = params.pwd.trim();
    // 将密码MD5
    var password = utilMd5.hexMD5(password);
    // 生成用户名和密码的对象
    var paramsObject = {};
    paramsObject.loginName = username;
    paramsObject.pwd = password;
    // 将其转换为字符串准备生成mac
    var paramsObject1 = JSON.stringify(paramsObject);
    const v1 = 'botler#bao@BanW@.Boss';
    const v2 = '1$0%0';
    var v3 = new Date().getTime();
    var string = v1 + v3 + v2;
    var mac = utilMd5.hexMD5(paramsObject1 + string);
    // 传递参数
    var paramsStr = {};
    paramsStr.data = paramsObject1;
    paramsStr.mac = mac;
    paramsStr.dateTime = v3;
    // 请求过程
    app.request.fetchApi('login',paramsStr,'POST').then(function(res) {
      var data = JSON.parse(res.data.data);
      if(res.data.code == '000000000') {
        setTimeout(function() {
          wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 1500
              });
              _this.setLoginData2();
              app.request.setStorage('last_time',{
                accountId : data.accountId,
                token : data.token
              }).then(function() {
                console.log('已经存上了');
              })
              _this.redirectTo(data.accountId);
        },2000);
      }else {
        wx.showModal({
            title: '提示',
            showCancel:false,
            content: '用户名或密码有误，请重新输入'
        });
        _this.setLoginData2();
      }
    })
  },
  setLoginData1 : function setLoginData1() {
    this.setData({
      loginBtnTxt:"登录中",
          disabled: !this.data.disabled,
          loginBtnBgBgColor:"#999",
          btnLoading:!this.data.btnLoading
    });
  },
  setLoginData2 : function setLoginData2() {
    this.setData({
      loginBtnTxt:"登录",
          disabled: !this.data.disabled,
          loginBtnBgBgColor:"#0099FF",
          btnLoading:!this.data.btnLoading
    })
  },
  checkUserName : function checkUserName(params) {
    var phone = util.regexConfig().phone;
    var email = util.regexConfig().email;
    var inputUserName = params.loginName.trim();
    if(inputUserName == "") {
      wx.showModal({
            title: '提示',
            showCancel: false,
            content: '用户名不能为空'
        });
        return false;
    }
    return true;
  },
  checkPassword : function checkPassword(params) {
    var password = params.pwd.trim();
    if(password == '') {
      wx.showModal({
            title: '提示',
            showCancel: false,
            content: '密码不能为空'
        });
        return false;
    }
    return true;
  },
  redirectTo:function(params){
      wx.redirectTo({
        url: '../main/main?param=' + params
      })
  }
});