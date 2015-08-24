/**
 * Created by Shower on 2015/8/23.
 */
//替换字符串
function Replace(str, from, to) {
    return str.split(from).join(to);
}
var dayNames = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
// 日期类型格式成指定的字符串
function FormatDate(date, format) {
    format = Replace(format, "yyyy", date.getFullYear());
    format = Replace(format, "MM", date.getMonth() + 1);
    format = Replace(format, "dd", date.getDate());
    format = Replace(format, "HH", GetFullHour(date));
    format = Replace(format, "WW", dayNames[date.getDay()]);
    format = Replace(format, "mm", ("0" + (date.getMonth() + 1)).slice(-2));
    format = Replace(format, "DD", ("0" + (date.getDate())).slice(-2));
    return format;
}
function FullDate(date, format) {
    format = Replace(format, "yyyy", date.getFullYear());
    format = Replace(format, "MM", GetFullMonth(date));
    format = Replace(format, "dd", GetFullDate(date));
    format = Replace(format, "HH", GetFullHour(date));
    format = Replace(format, "WW", dayNames[date.getDay()]);
    return format;
}
//js日期字符串转换成日期类型
function parseDate(dateStr) {
    return new Date(Replace(dateStr, "-", "/"));
}
//增加月
function AddMonths(date, value) {
    date.setMonth(date.getMonth() + value);
    return date;
}
//增加天
function AddDays(date, value) {
    date.setDate(date.getDate() + value);
    return date;
}
//增加时
function AddHours(date, value) {
    date.setHours(date.getHours() + value);
    return date;
}
//返回月份(两位数)
function GetFullMonth(date) {
    var v = date.getMonth() + 1;
    if (v > 9) return v.toString();
    return "0" + v;
}

//返回日(两位数)
function GetFullDate(date) {
    var v = date.getDate();
    if (v > 9) return v.toString();
    return "0" + v;
}
//返回时(两位数)
function GetFullHour(date) {
    var v = date.getHours();
    if (v > 9) return v.toString();
    return "0" + v;
}
//比较两个时间
function compareDate() {
    var mydate = AddDays(parseDate("2012-08-23"), 1);
    var nowdate = new Date();
    if (nowdate.getTime() < mydate.getTime()) {
        return FormatDate(nowdate, "yyyy-MM-dd");
    }
    return FormatDate(mydate, "yyyy-MM-dd");
}


function loadDayData(data) {
    var Labels = ["0点", "1点", "2点", "3点", "4点", "5点", "6点", "7点", "8点", "9点", "10点", "11点", "12点",
        "13点", "14点", "15点", "16点", "17点", "18点", "19点", "20点", "21点", "22点", "23点"];
    var datasCurrent = [];
    var datasLast = [];
    var totalCurrent = 0;
    var totalLast = 0;
    for (var i = 0; i < 24; i++) {

        $.each(data, function (n, value) {
            if (FullDate(new Date(), "yyyy-MM-dd") == value.DATE_TIME) {
                if ((i == value.HOUR_TIME)) {
                    datasCurrent.push(value.TOTAL_COUNT);
                    totalCurrent += value.TOTAL_COUNT;
                }
            }
            else if (FullDate(AddDays(new Date(), -1), "yyyy-MM-dd") == value.DATE_TIME) {
                if ((i == value.HOUR_TIME)) {
                    datasLast.push(value.TOTAL_COUNT);
                    totalLast += value.TOTAL_COUNT;
                }
            }
        });
        if (i == datasCurrent.length) {
            datasCurrent.push(0);
        }
        if (i == datasLast.length) {
            datasLast.push(0);
        }
    }
    var retJson = {
        "Labels": Labels,
        "datasCurrent": datasCurrent,
        "datasLast": datasLast,
        "labelCurrent": "今日",
        "labelLast": "昨日",
        "totalCurrent": totalCurrent,
        "totalLast": totalLast
    };
    return retJson;
}

/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
function getDaysInMonth(month, year) {
    // Since no month has fewer than 28 days
    var date = new Date(year, month, 1);
    var days = [];
    //console.log('month', month, 'date.getMonth()', date.getMonth())
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

function loadWeekData(data) {
    var Labels = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
    var datasCurrent = [];
    var datasLast = [];
    var totalCurrent = 0;
    var totalLast = 0;
    for (var i = 0; i < Labels.length; i++) {
        $.each(data, function (n, value) {

            if (FullDate(AddDays(new Date(), (i - Labels.length) + 1), "yyyy-MM-dd") == value.DATE_TIME) {
                datasCurrent.push(value.TOTAL_COUNT);
                totalCurrent += value.TOTAL_COUNT;
            }
            else if (FullDate(AddDays(new Date(), (i - Labels.length) - 6), "yyyy-MM-dd") == value.DATE_TIME) {
                datasLast.push(value.TOTAL_COUNT);
                totalLast += value.TOTAL_COUNT;
            }
        });
        if (i == datasCurrent.length) {
            datasCurrent.push(0);
        }
        if (i == datasLast.length) {
            datasLast.push(0);
        }

    }
/*
    console.log(datasCurrent);
    console.log(datasLast);
    console.log(totalCurrent);
    console.log(totalLast);
*/
    var retJson = {
        "Labels": Labels,
        "datasCurrent": datasCurrent,
        "datasLast": datasLast,
        "labelCurrent": "本周",
        "labelLast": "上周",
        "totalCurrent": totalCurrent,
        "totalLast": totalLast
    };
    return retJson;
}

function loadMonthDayData(data) {

    var d = new Date();
    var this_month = d.getMonth();
    var this_year = d.getFullYear();
    var last_year = this_year;
    var last_month = 0;
    if(this_month == 0){
        last_month = 11;
        last_year = this_year - 1;
    }else{
        last_month = this_month -1;
    }

    var Labels = [];
    var LastLabels = [];
    var this_month_day = getDaysInMonth(this_month, this_year);
    //console.log(this_month_day);
    var last_month_day = getDaysInMonth(last_month, last_year);
    //console.log(last_month_day);

    for(var i= 0; i < this_month_day.length; i++){
        Labels.push(this_month_day[i].getDate() + ' 日');
    }

    for(var i= 0; i < last_month_day.length; i++){
        LastLabels.push(last_month_day[i].getDate() + ' 日');
    }

    console.log(Labels);
    console.log(LastLabels);



    var datasCurrent = [];
    var datasLast = [];

    var totalCurrent = 0;
    var totalLast = 0;

    for (var i = 0; i < this_month_day.length; i++) {
        $.each(data, function (n, value) {
            var fullDate = FormatDate(this_month_day[i],"yyyy-mm-DD");
            //console.log(fullDate);
            if (fullDate == value.DATE_TIME) {
                //console.log(value);
                datasCurrent.push(value.TOTAL_COUNT);
                totalCurrent += value.TOTAL_COUNT;
            }
            if (i == datasCurrent.length) {
                datasCurrent.push(0);
            }

        });
    }

    for (var i = 0; i < last_month_day.length; i++) {
        $.each(data, function (n, value) {
            var fullDate = FormatDate(last_month_day[i],"yyyy-mm-DD");
            if (fullDate == value.DATE_TIME) {
                //console.log(value);
                datasLast.push(value.TOTAL_COUNT);
                totalLast += value.TOTAL_COUNT;
            }

            if (i == datasLast.length) {
                datasLast.push(0);
            }
        });
    }

    console.log(datasCurrent);
    console.log(datasLast);
    var retJson = {
        "Labels": Labels,
        "datasCurrent": datasCurrent,
        "datasLast": datasLast,
        "labelCurrent": "本月",
        "labelLast": "上月",
        "totalCurrent": totalCurrent,
        "totalLast": totalLast
    };
    return retJson;
}

function loadMonthData(data) {

    var Labels = [];
    for (var i = -6; i <= 0; i++) {
        var d = new Date();
        var mon = AddMonths(d, i).getMonth() + 1;
        Labels.push(mon + '月');
    }
    var datasCurrent = [];
    var datasLast = [];
    var totalCurrent = 0;
    var totalLast = 0;
    for (var i = 0; i < Labels.length; i++) {
        $.each(data, function (n, value) {
            if (FullDate(AddMonths(new Date(), (i - Labels.length) + 1),"yyyy-MM-dd") == value.DATE_TIME) {
                    datasCurrent.push(value.TOTAL_COUNT);
                    totalCurrent += value.TOTAL_COUNT;
            }
            else if (FullDate(AddMonths(new Date(), (i - Labels.length)), "yyyy-MM-dd") == value.DATE_TIME) {
                    datasLast.push(value.TOTAL_COUNT);
                    totalLast += value.TOTAL_COUNT;

            }
        });
        if (i == datasCurrent.length) {
            datasCurrent.push(0);
        }
        if (i == datasLast.length) {
            datasLast.push(0);
        }
    }
    var retJson = {
        "Labels": Labels,
        "datasCurrent": datasCurrent,
        "datasLast": datasLast,
        "labelCurrent": "本周",
        "labelLast": "上周",
        "totalCurrent": totalCurrent,
        "totalLast": totalLast
    };
    return retJson;
}
