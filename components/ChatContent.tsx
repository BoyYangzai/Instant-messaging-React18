import axios from 'axios'
import { useRef } from 'react'
import styled from 'styled-components'
import noCurrentUser from '../public/pictures/noCurrentUser.gif'
import chatbgc from '../public/pictures/chat.png'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import { httpHost, wsHOST } from '../network/index'
import { notification, Spin } from 'antd'


export default function ChatContent({
  currentUser = 'yang',
  setCurrentUser = new Function(),
  messages = [{
    sender: '',
    content: '',
    receiver: ''
  }],
  setMessages = new Function(),
  isloading = true,
  setIsloading = new Function()
}) {
  const socket = io(wsHOST)
  const value = useSelector((store: any) => store.username.value)
  const input = useRef<HTMLInputElement>(null)

  function sendMessage() {
    const message = input.current!.value
    if (message.length > 0 && message.length <= 20) {
      setTimeout(() => {
        let chatScreen = document.querySelector('#chat') as HTMLElement
        (chatScreen) && (chatScreen.scrollTo(0, chatScreen.scrollHeight))
      }, 100);
      axios.post(`${httpHost}message/send`, {
        sender: value,
        content: message,
        receiver: currentUser
      })
        .then(res => {
          socket.emit('sendMessage', {
            to: currentUser
          })
          input.current!.value = ''
        })
        .catch(err => console.log(err))
    } else if (message.length > 20) {
      notification.warning({
        message: '警告提示',
        description: '消息长度不能超过20个字符'
      })
    }
  }
  return (
    <Container>
      <img src={chatbgc.src} className='chatbgc' alt="" />
      {
        currentUser === '' ? <h1 className='welcome'>点击左侧用户列表开始聊天</h1> : ''
      }
      {
        currentUser === '' ?
          <img className='noCurrentUser' src={noCurrentUser.src} alt="" />
          :
          <div className='chatContent' >
            <div className="content" id='chat'>
              {
                isloading ?
                  <Spin
                    size='large'
                    className='loading'
                    tip="对话加载中...">
                  </Spin>
                  :
                  messages.map((message, index) => {
                    return (
                      message.receiver === currentUser
                        ?
                        <div className='right' key={index}>
                          {message.content}
                        </div>
                        :
                        <div className='left' key={index}>
                          {message.content}
                        </div>
                    )
                  })
              }
            </div>
            <div className="sender">
              <input ref={input} type="text" className='input' />
              <button className='send'
                onClick={() => { sendMessage() }}
              >发送消息</button>
            </div>
          </div>
      }
    </Container>
  )
}

const Container = styled.div`
position: relative;
    width: 75%;
    height: 100%;
    .noCurrentUser{
        width: 100%;
        height: 100%;
    }
    .chatContent{
        width: 100%;
        height: 100%;
    }
    .welcome{
        font-size: 2vw;
        font-family:"楷体";
        color: #12f4f4f3;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-70%);
        z-index: 1;
    }
    .content{
        width: 100%;
        height: 70%;
        overflow-y: scroll;
        overflow-x: hidden;
        ::-webkit-scrollbar{
            width: 1px;
            background-color: #0e24cb;
        }
        position: relative;
      .loading{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
      .left{
      width:100%;
      height: 10vh;
      font-size: 1.5vw;
      font-family: 'Times New Roman';
      color: #13a7bbde;
      margin-left: 5%;
        border-radius: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .right{
      width:100%;
      height: 10vh;
      font-size: 1.5vw;
      font-family: 'Times New Roman';
      color: #d2b108d4;
      transform: translateX(-7%);
      border-radius: 10px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    }
    .sender{
      width: 100%;
      height: 30%;
      position: relative;
      .input{
        display:block;
        width: 100%;
        height: 100%;
        background-color: transparent;
        border: 1px solid #0ecbb8;
        overflow: hidden;
        font-size: 1.5vw;
        color: #d2b108d4;
        :focus{
          outline: none;
        }
      }
      .send{
        width: 5vw;
        height: 2vw;
        background-color: #0ecbb8;
        position: absolute;
        right: 5%;
        bottom: 6%;
      }
    }
    .chatbgc{
     width: 100%;
      height: 100%;
      position: absolute;
      z-index: -1;
  
}
// `
// import React from 'react'

// export default function ChatContent(
//   {
//     currentUser = 'yang',
//     setCurrentUser = new Function(),
//     messages = [{
//         sender: '',
//         content: '',
//         receiver: ''
//     }],
//     setMessages = new Function()
// }
// ) {
//   return (
//     <div>ChatContent</div>
//   )
// }
