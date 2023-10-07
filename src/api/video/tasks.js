import request from '@/utils/request'

// 获取巡检记录列表
export function getInspectList(data) {
    // const data = {
    //     deviceSerial: deviceSerial,
    //     startTime: startTime,
    //     endTime: endTime,
    //     inspectRecordId:inspectRecordId,
    //     size:size
    // }
    return request({
        url: '/ezviz/getInspectList',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        method: 'post',
        data: data
    })
}

// 巡检轨迹
export function getInspectTrace(data) {
    // const data = {
    //     inspectRecordId: inspectRecordId,
    //     pageStart: pageStart,
    //     pageSize: pageSize,
    // }
    return request({
        url: '/ezviz/getInspectTrace',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        method: 'post',
        data: data
    })
}
