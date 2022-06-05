import type { NextPage } from 'next'
import style from 'styled-components'
import { Form, Input, Button, Checkbox, notification } from 'antd';
import pciture from '../public/pictures/background.png'
import { createContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import io from 'socket.io-client'
import { httpHost, wsHOST } from '../network';

export const Username = createContext('')
const Home: NextPage = () => {
  const socket = io(wsHOST)
  const router = useRouter()
  interface FormData {
    username: string,
    password: string,
    confirmedPassword: string
  }
  function passwordIsValid(formData: FormData) {
    return formData.password === formData.confirmedPassword
  }
  function hasAvatar(username: string) {
    return axios.post(`${httpHost}user/hasavatar`, {
      username
    })
  }
  async function register(values: FormData) {
   return  axios.post(`${httpHost}auth/register`, {
      username: values.username,
     password: values.password,
     avatar:`https://api.multiavatar.com/Binx%${Math.floor((Math.random() * 50000))}.png`
    })
        
  }
  async function login(values: FormData) {
    axios.post(`${httpHost}auth/login`, values).then(
      async res => {
        if (res?.data === undefined) {
          notification.error({
            message: '登录失败',
            description: '请检查网络设置',
            duration: 2
          })
          return;
        }
        if (res?.data?.access_token !== undefined) {
          notification['success']({
            message: '成功提示',
            description: '您已经成功登录',
            duration: 2
          })
          socket.emit("connection", async (socket: { join: (arg0: string) => any; id: any; }) => {
            await socket.join(values.username);
          });
          localStorage.setItem('token', res.data.access_token)
          localStorage.setItem('username', values.username)
          let ishasAvatar = await hasAvatar(values.username)
          if (ishasAvatar.data) {
            router.push('/chat')
          } else {
            router.push('/avatar')
          }

        } else {
          notification['error']({
            message: '失败提示',
            description: `${res?.data.msg}`,
            duration: 2
          })
        }
      }
    )

  }
  const onFinish = async (values: FormData) => {
    if (passwordIsValid(values)) {
      let registerRes = await register(values)
      if (registerRes.data.code == 200 || registerRes.data.code == 1001) {
        login(values)
      }
    } else {
      notification['error']({
        message: '请注意！',
        description: '两次输入密码不一致',
        duration: 2
      })
    };
  }

    return (
      <Container>
        <img className='background' src={pciture.src} alt="" />
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          className='form'
        >
          <Form.Item
            label="输入用户名："
            name="username"
            className='form-item'
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="请输入密码："
            name="password"
            className='form-item'
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="请确认密码："
            name="confirmedPassword"
            className='form-item'
            rules={[{ required: true, message: '请确认密码' }]}
          >
            <Input.Password></Input.Password>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" className='submit-btn'>
              登录
            </Button>

          </Form.Item>
          <p>
            新用户未注册会自动注册并登录
          </p>
        </Form>

      </Container>

    )
  }
  const Container = style.div`
   display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    .form{
      background: #fff;
      width: 30vw;
      height: 50vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 5px 5px 30px #109fb27b;
      opacity: 0.5;
      label{
            color: #0e77eede;
            margin-right: 10px;
            font-size: 16px;
      }
    }
    .form-item{
      padding: 10px;
      margin-top: 10px;
      }
      .background{
      width: 100vw;
      height: 100vh;
      position: absolute;
      z-index: -1;
    }
    .submit-btn{
      :hover{
        background: #3f0eeede;
        color: #ffffff;
        border-color: #3f0eeede;
      }
    }
    `

  export default Home
