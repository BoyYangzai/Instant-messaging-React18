import { Avatar, Button, notification, Spin } from 'antd'
import Search from 'antd/lib/input/Search'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { httpHost } from '../network'
import { routerBeforEach } from '../utils/router-beforEach'


export default function SetAvatar() {
    const router = useRouter()
    const [avatar, setAvatar] = useState('')
    const [randomAvatar, setRandomAvatar] = useState('')
    function preview(qq: string) {
        setAvatar(`https://q2.qlogo.cn/headimg_dl?dst_uin=${qq}&spec=100`)
    }
    async function postAvatar(avatarSrc: string) {
        return axios.post(`${httpHost}user/avatar`, {
            username: localStorage.getItem('username'),
            avatar: avatarSrc
        })
    }
    async function submitAvatar() {
        let res = avatar ? await postAvatar(avatar) : await postAvatar(randomAvatar)
        if (res.data.code == 200) {
            notification.success({
                message: '成功提醒',
                description: '设置头像成功'
            })
            router.push('/chat')
        }
    }
    useEffect(() => {
       routerBeforEach(router)
        setRandomAvatar(`https://api.multiavatar.com/Binx%${Math.floor((Math.random() * 50000))}.png`)
    }, [])

    return (
        <Container>

            <div className="center">
                <Search
                    placeholder="在这里输入你的QQ号"
                    allowClear
                    enterButton="头像预览"
                    size="large"
                    onSearch={preview}
                    className="preview"
                />
                <Avatar shape="circle" size="large" src={avatar ? avatar : randomAvatar} className='avatar' alt='随机头像生成中' />
                <Button type="primary" shape="circle" className='submit-btn' onClick={submitAvatar}>确认选择</Button>
            </div>
        </Container>
    )
}

const Container = styled.div`
width: 100vw;
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
flex-wrap: wrap;
.center{
    width:50vw;
    height:50vh;
    display: flex;
justify-content: center;
align-items: center;
flex-wrap: wrap;
position: relative;
.preview{
    width: 100vw;
    height: 10vh;;
    display:block;
}
.avatar{
    display: block;
    width: 10vw;
    height:10vw ;
    margin-bottom: 10vw;
}
}
.submit-btn{
    position: absolute;
    right:50%;
    bottom:0;
    transform: translateX(50%);
    width: 5vw;
    height:5vw ;
    :hover{
        background-color: #0923e6d8;
        cursor: pointer;
    }
}

`