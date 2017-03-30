
/**
 * 基于网易云音乐API
 * https://github.com/yanunon/NeteaseCloudMusic/wiki/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90API%E5%88%86%E6%9E%90
 * 
 * v1.0.2
 */

var BASE_URL =  'https://music.163.com/api/';

// 根据专辑id获取专辑歌曲列表
// 带参数的get请求
// https://music.163.com/api/playlist/detail?id=88175331
var getMusicList = (id) => getMusicListRequest({id:id}, 'playlist/detail');
var getMusicListRequest = function(data, uri) {
	var paramStr = '?', tempArr = [];
	if(typeof data == 'object') {
		for(var prop in data) {
			tempArr.push(prop + '=' + data[prop]);
		}
		paramStr += tempArr.join('&')
	}

	return new Promise(function (resolve, reject) {
		var nowTime = new Date().getTime(), isReSave = true;
		if(wx.getStorageSync('musicListTime')) {
			// 缓存3小时
			isReSave = (nowTime - wx.getStorageSync('musicListTime') > 1000 * 60 * 60 * 3);
		} else {
			wx.setStorageSync('musicListTime', nowTime +'')
		}
		
		isReSave && wx.request({
			url: BASE_URL + uri + paramStr,
			method: 'GET',
			success: (res) => {
				if(res.data.code != 200) return;
				var tracks = res.data.result.tracks, retList = [];
				for(var i=0,j=tracks.length; i<j; i++) {
					retList.push({
						song_id: tracks[i].id,
						title: tracks[i].name,
						author: tracks[i].artists[0].name,
						albumPicUrl: tracks[i].album.picUrl,
						mp3Url: tracks[i].mp3Url
					})
				}
				wx.setStorageSync('musicListData', retList)

				resolve(retList);
			},
			fail: err => {
				reject(err)
			}
		})

		!isReSave && resolve(wx.getStorageSync('musicListData'))

	})
}


module.exports = {
	getMusicList
}