import './interceptors/intercetptors'
export const httpHost = (process.env.NODE_ENV == 'development') ? 'http://localhost:3000/' : 'http://101.43.191.122:3000/' 
export const wsHOST = (process.env.NODE_ENV == 'development') ? 'http://localhost:2999/' : 'http://101.43.191.122:2999/' 
