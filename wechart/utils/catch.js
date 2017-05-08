'use strict';

var Promise = require('./bluebird.js');

function fetch(api, path, params,method) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api + '/' + path,
      data: params,
      // header: { 'Content-Type': 'json' },
      header: {'content-type': 'application/x-www-form-urlencoded'},
      method : method,
      success: resolve,
      fail: reject
    });
  });
};

function setStorage(key, value) {
  return new Promise(function (resolve, reject) {
    wx.setStorage({ key: key, data: value, success: resolve, fail: reject });
  });
}

function getStorage(key) {
  return new Promise(function (resolve, reject) {
    wx.getStorage({ key: key, success: resolve, fail: reject });
  });
}

const URI = 'http://tapp.baobanwang.com';

function fetchApi(type,params,method) {
	return fetch(URI,type,params,method);
}

// 将方法输出
module.exports = { fetchApi : fetchApi, setStorage : setStorage, getStorage : getStorage};