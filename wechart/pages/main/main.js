'use strict';

var Promise = require('../../utils/bluebird');

var utilMd5 = require('../../utils/MD5.js');

var QR =  require('../../utils/wxqrcode.js');

var app = getApp();

Page({
	data : {
		src : ''
	},
	onLoad (options) {
		// 获取this
		var _this = this;
		// 生成传递的参数
		app.request.getStorage('last_time').then(function(res) {
			if(res.data != '') {
				var data = res.data.accountId;
				var token = res.data.token;
				var paramsStr = _this.getParams(data,token);
				return paramsStr;
			}else {
				var data = optios.param;
				var paramsStr = _this.getParams(data);
				return paramsStr;
			}
		}).then(function(res) {
			// 进来首次生成二维码
		    _this.getPost(res);
		    // 60s刷新一次
		    setInterval(function(){
		    	_this.getPost(res);
		    },60000);
		}).catch(function(e) {
			
		})
 	},
 	getSize : function(){
        var size= 0;        
        try {
            var res = wx.getSystemInfoSync();
            var scale = 750/430; //不同屏幕下QRcode的适配比例；设计稿是750宽
            var width = res.windowWidth/scale;        
            size = width;
        } catch (e) {
            
        } 
        return size;
    },
    createCode : function(text,size) {
    	var img = QR.createQrCodeImg(text,{'size' : parseInt(size)});
    	this.setData({
    		src : img
    	})
    },
    getPost : function(paramsStr) {
    	var _this = this;
    	app.request.fetchApi('qrcode/create/long',paramsStr,'POST').then(function(res) {
	    	var size = _this.getSize();
	    	_this.createCode(res.data.data,size);
	    })
    },
    getParams : function(data) {
    	// 设置第一个内容
    	var accountId = {};
		accountId.accountId = data;
		var accountId = JSON.stringify(accountId);
		// 常量
		const v1 = 'botler#bao@BanW@.Boss';
	    const v2 = '1$0%0';
	    var v3 = new Date().getTime();
	    var string = v1 + v3 + v2;
	    // 生成mac
	    var mac = utilMd5.hexMD5(accountId + string);
	    // 生成传递的对象
	    var paramsStr = {};
	    paramsStr.data = accountId;
	    paramsStr.mac = mac;
	    paramsStr.dateTime = v3;
	    if(arguments.length > 1) {
	    	paramsStr.token = arguments[1];
	    }
	    return paramsStr;
    },
    logOut : function() {
    	wx.showModal({
		  title: '您是否要退出登录？',
		  success: function(res) {
		   	if(res.confirm == true) {
		   		wx.clearStorage();
		   		wx.redirectTo({
			       url: '../login/login'
			    })
		   	}
		  }
		})
    }
})