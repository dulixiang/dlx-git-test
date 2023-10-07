import request from '@/utils/request'

// 获取萤石云token
export function getEzvizToken(data) {
    return request({
        url: '/ezviz/getEzvizToken',
        method: 'post',
        data: data
    })
}

// 获取设备通道列表
export function getCameraList(data) {
    return request({
        url: '/ezviz/getCameraList',
        method: 'post',
        params: data
    })
}

// 获取播放地址
export function getLiveAddress(deviceSerial, channelNo, type,startTime,endTime) {
    const data = {
        deviceSerial: deviceSerial,
        channelNo: channelNo,
        type: type,
        startTime:startTime,
        endTime:endTime
    }
    return request({
        url: '/ezviz/getLiveAddress',
        method: 'post',
        params: data
    })
}