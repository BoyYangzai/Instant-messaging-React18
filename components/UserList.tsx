import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import io from 'socket.io-client'
import { httpHost, wsHOST } from '../network'
import { Avatar } from 'antd'
export default function UserList({
    currentUser = 'yang',
    setCurrentUser = new Function(),
    messages = [{
        sender: '',
        content: '',
        receiver: ''
    }],
    setMessages = new Function(),
    setIsloading = new Function()
}) {
    const socket = io(wsHOST)
    const value = useSelector((store: any) => store.username.value)
    const [Users, setUsers] = useState([{
        username: '',
        avatar: '',
    }])
    async function setCurrentChater(user: any) {
        setCurrentUser(user)
    }
    function getCurentMessages() {
        axios.post(`${httpHost}message/list`, {
            "username": value,
            "currentChater": currentUser
        }).then(res => {
            setMessages(res.data.data.messageList)
        })
    }
    function deletCurrentMessages() {
        setMessages([])
    }
    useEffect(() => {
        setIsloading(true)
        deletCurrentMessages()
        if (currentUser !== '') {
            getCurentMessages()
        }
    }, [currentUser])
    useEffect(() => {
        setTimeout(() => {
            setIsloading(false)
        }, 100);
    }, [messages])
    function getUserList() {
        axios.post(`${httpHost}user/all`).then(res => {
            setUsers(res.data)
        })
    }
    useEffect(() => {
        getUserList()
    }, [])
    useEffect(() => {
        socket.on('showMessage', getCurentMessages)
        return () => {
            socket.off('showMessage')
        }
    })
    return (
        <Container>
            {
                Users.map((user, index) => {
                    if (user.username == value) {
                        return;
                    }
                    return (
                        <div
                            className="userCard"
                            onClick={() => setCurrentChater(user.username)}
                            key={index}
                        >
                            <Avatar className='avatar' src={user.avatar}></Avatar>
                            <p className='username' >{user.username}</p>
                        </div>
                    )
                })
            }
            {
                Users.map((user, index) => {
                    if (user.username == value) {
                        return (
                            <Avatar className='myAvatar' src={user.avatar}></Avatar>
                        )
                    }
                })
            }
        </Container>
    )
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-wrap: wrap;
width:35%;
height: 100%;
background-color: #946127c5;
overflow-y: scroll;
::-webkit-scrollbar
{
    
 width: 4px;
 background-color:grey;
}
   .myAvatar{
        position:fixed;
        right: 10px;
        top: 5vw;
        z-index: 100;
        width: 7vw;
        height: 7vw;
    }
.userCard{
    width: 90%;
    height: 20%;
    border: 1px solid #5a4d4daa;
    justify-content: space-around;
    align-items: center;
    display: flex;
    .avatar{
        width: 7vw;
        height: 7vw;
    }
    .username{
        font-size: 20px;
        color: #e67f09;
    }
    transition: all 0.5s;
    :hover{
        background-color: #e67f09;
        cursor: pointer;
        .username{
            font-weight : bold;
            color: #1d0b04dd;
        }
    }
 
}
`


function data(data: any, user: string): (...args: any[]) => void {
    throw new Error('Function not implemented.')
}
// import React from 'react'
// import styled from 'styled-components'

// export default function UserList(
//     {
//         currentUser = 'yang',
//         setCurrentUser = new Function(),
//         messages = [{
//             sender: '',
//             content: '',
//             receiver: ''
//         }],
//         setMessages = new Function()
//     }
// ) {
//   return (
//       <div>{currentUser}</div>
//   )
// }
