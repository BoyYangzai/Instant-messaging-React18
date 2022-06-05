import { notification } from 'antd';
import axios from 'axios';

axios.interceptors.request.use(request => {
    if (localStorage.getItem('tpken')) {
        request.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return request
})
axios.interceptors.response.use(response => {
    return response
}, error => {
    notification.error({
        message: '错误提示',
        description: '服务器错误'
    })
}
)