Page({

    /**
     * 页面的初始数据
     */
    data: {
        year: 2020,
        month: 5,
        day: 0,
        dayList: [],
        currentDate: undefined
    },
    /**
     * 生命周期函数--监听页面加载
     */
    //返回某年某月天数方法1
    getMonthDayCount: function (year, month) {
        console.log(year + "  " + month);
        if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
            return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        } else {
            return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        }
    },

    //返回某年某月天数方法2
    getMonthDayCount2: function (year, month) {
        return new Date(year, month, 0).getDate();
        //new Date(2013, 13, 1)等于new Date(2014, 1, 1)
        //new Date(2013, 4, 31)等于new Date(2013, 5, 1)
        //new Date(2013, 4, -1)等于new Date(2013, 4, 29)
    },
    //返回每月第一天是周几
    getMonthFirstDayWeek: function (year, month) {
        return new Date(year, month, 1).getUTCDay();
    },

    getToday: function () {
        if (this.currentDate != undefined) {
            return this.currentDate;
        } else {
            return new Date()
        }
    },

    setDay: function (currentDate) {
        this.setData({
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
            day: currentDate.getUTCDate()
        });
    },

    generateAllDate: function (today) {
        var yy = today.getFullYear();
        var mm = today.getMonth();

        var monthDay = this.getMonthDayCount(yy, mm);
        var firstDayWeek = this.getMonthFirstDayWeek(yy, mm);
        var dayOfMonth = today.getUTCDate();
        console.log(monthDay);

        this.dayList = [];

        for (var j = 1, i = 0; i < 42; i++) {
            var status = -1;
            var content = '';
            if (i < firstDayWeek) {
                status = 0;
            } else if (j <= monthDay) {
                status = 0;
                var dd = this.formatDate(yy, mm + 1, j);
                if (this.data.signedDays && this.data.signedDays.indexOf(dd) != -1) {
                    status = 1;
                } 
                 status = 1;
                if (yy === this.data.year && mm + 1 === this.data.month && j === this.data.day) {
                    if (status == 1) status = 3;
                    else status = 2;
                    content = j++;
                } else {
                    content = j++;
                }
            }
            if (status >= 0) {
                this.dayList.push({
                    id: i,
                    status: status,
                    content: content
                });
            }
        }
        this.setData({
            dayList: this.dayList
        });
        console.log(this.dayList);
    },
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

        this.currentDate = this.getToday();
        this.setDay(this.currentDate);
        this.generateAllDate(this.currentDate);
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

    },

    formatDate: function (date) {
        return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    },

    formatDate: function (yy, mm, dd) {
        return yy * 10000 + mm * 100 + dd;
    }

})