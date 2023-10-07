import request from '@/utils/request'

// 获取工地列表(分页)
export function getWorksiteList(data) {
    return request({
        url: '/center/getWorksiteList',
        method: 'post',
        data: data
    })
}

// 获取工地列表(不分页)
export function getWorksiteList2(data) {
    return request({
        url: '/center/getWorksiteList2',
        method: 'post',
        data: data
    })
}

// 保存工地
export function saveWorksite(data) {
    return request({
        url: '/center/saveWorksite',
        method: 'post',
        data: data
    })
}

// 删除工地
export function delWorksite(data) {
    return request({
        url: '/center/delWorksite',
        method: 'post',
        data: data
    })
}

// 获取部门下未关联到工地的设备
export function getNoWorksiteDeviceList(data) {
    return request({
        url: '/center/getNoWorksiteDeviceList',
        method: 'post',
        data: data
    })
}

// 获取工地设备列表(分页)
export function getWorksiteDeviceList(data) {
    return request({
        url: '/center/getWorksiteDeviceList',
        method: 'post',
        data: data
    })
}

// 获取工地设备列表(不分页)
export function getWorksiteDeviceList2(data) {
    return request({
        url: '/center/getWorksiteDeviceList2',
        method: 'post',
        data: data
    })
}

// 获取全部设备(分页)
export function getAllDeviceList(pageNum,pageSize,keyword,type) {
    const data = {
        pageNum: pageNum,
        pageSize: pageSize,
        keyword: keyword,
        type:type
    }
    return request({
        url: '/center/getAllDeviceList',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        method: 'post',
        params: data
    })
}

// 设备分配部门
export function updateDevDep(data) {
    return request({
        url: '/center/updateDevDep',
        method: 'post',
        data: data
    })
}

// 绑定设备到工地
export function updateDevWs(data) {
    return request({
        url: '/center/updateDevWs',
        method: 'post',
        data: data
    })
}

// 获取用户关联的部门列表
export function getUserDep(data) {
    return request({
        url: '/center/getUserDep',
        method: 'post',
        params: data
    })
}

// 获取用户未关联部门列表
export function getUserNoDep(data) {
    return request({
        url: '/center/getUserNoDep',
        method: 'post',
        data: data
    })
}

// 新增用户部门关联
export function addUserDep(data) {
    return request({
        url: '/center/addUserDep',
        method: 'post',
        data: data
    })
}

// 删除用户部门关联
export function delUserDep(data) {
    return request({
        url: '/center/delUserDep',
        method: 'post',
        data: data
    })
}

// 获取设备播放地址列表
export function getVideoDeviceList(data) {
    return request({
        url: '/center/getVideoDeviceList',
        method: 'post',
        data: data
    })
}