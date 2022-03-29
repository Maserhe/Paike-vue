import request from '../axios.js';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const getXnxqList = () => {
    return request({
        url: '/weixin-ggjxzl/getXnxqList',
        method: 'get',
    });
}

