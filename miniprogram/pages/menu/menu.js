// pages/menu/menu.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        signedDays: []
    },

    clickAddData: function () {
        var that = this;
        console.log("signedDays="+this.data.signedDays)
        this.data.signedDays.push( new Date().toInt());
        this.data.signedDays = this.uniqueArray(this.data.signedDays);
        this.setData({signedDays:this.data.signedDays})
        wx.cloud.database().collection("daily").doc(this.data.openid).update({
            data: {
                date: that.data.signedDays
            },
            success: function (res) {
                console.log(res);
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },

    uniqueArray:function(arr) {
        if (!Array.isArray(arr)) {
            console.log('type error!')
            return
        }
        var array = [];
        for (var i = 0; i < arr.length; i++) {
            if (array .indexOf(arr[i]) === -1) {
                array .push(arr[i])
            }
        }
        return array;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.cloud.callFunction({
            name: 'login',
            complete: res => {
                console.log(res);
                console.log('云函数获取到的openid: ', res.result.openid);
                console.log('云函数获取到的appid: ', res.result.appid)
                console.log('云函数获取到的unionid: ', res.result.unionid)
                var openid = res.result.openid;
                that.setData({
                    openid: openid
                })

                wx.cloud.database().collection("daily").doc(openid).get({
                    success: function (res) {
                        that.setData({
                            signedDays: res.data.date
                        })
                    },
                    fail: function (res) {
                        console.log(res)
                    }
                });
            }
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

Date.prototype.toInt = function (fmt) {
    return this.getFullYear() * 10000 + (this.getMonth() + 1) * 100 + this.getDate();
}