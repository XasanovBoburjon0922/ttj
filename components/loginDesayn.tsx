import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
// import { URL } from '@/service/resquest';
import { useRouter } from 'next/navigation';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const LoginDesayn: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [modalContent, setModalContent] = useState<string>("login"); 
  const router = useRouter();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [loginPhone, setLoginPhone] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [forgotLoginEmail, setForgotLoginEmail] = useState<string>("");
  const [forgotVerifyCode, setForgotVerifyCode] = useState<string>("");

  const [resetPassword, setResetPassword] = useState<string>("");

  const loginModalOpen = () => {
    const data = {
      password: loginPassword,
      phone: loginPhone
    };
    try {
      axios.post(`https://nbtuit.pythonanywhere.com/api/v1/users/login/`, data).then(res => {
        window.localStorage.setItem("token", res.data.tokens.access);
        window.localStorage.setItem("role", res.data.role);
        window.localStorage.setItem("username", loginPhone);
        setLoginPassword("");
        setLoginPhone("");
        toast.success("Hush kelibsiz ");
        setTimeout(() => {
          setIsLoggedIn(true);
        }, 500)
        router.push('/');
      });
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    setModalContent("forgotEmail"); 
  };

  const forgotLoginBtnClick = () => {
    axios.post(`http://3.70.236.23:7777/v1/forgot/${forgotLoginEmail}`).then(res => {
      setModalContent("forgotVerify");
    });
  };

  const forgotOTPBtnClick = () => {
    axios.post(`http://3.70.236.23:7777/v1/verify`, {}, {
      params: {
        email: forgotLoginEmail,
        otp: forgotVerifyCode
      }
    }).then(res => {
      setLoginPhone(forgotLoginEmail);
      setModalContent("createNewLogin");
    });
  };

  const resetClick = () => {
    const data = {
      email: forgotLoginEmail,
      new_password: resetPassword,
      otp: forgotVerifyCode
    };
    axios.put(`http://3.70.236.23:7777/v1/reset-password`, data).then(res => {
      setModalContent("login");
    });
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      {modalContent === "login" && (
        <>
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input name="phone" maxLength={13} defaultValue={`+998`} onChange={(e) => setLoginPhone(e.target.value)} prefix={<UserOutlined className="site-form-item-icon p-3" />} placeholder="Phone number" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <div className='relative'>
              <Input
                name='password'
                onChange={(e) => setLoginPassword(e.target.value)}
                prefix={<LockOutlined className="site-form-item-icon p-3" />}
                type={showPassword ? "text" : "password"}
                placeholder='***********'
              />
              <div className='absolute right-3 top-[8px] z-[50] transform cursor-pointer' onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <img className='w-[30px]' src="/eye-icon.svg" alt="Hide password" width={16} height={16} />
                ) : (
                  <img className='w-[30px]' src="/eye-off-icon.svg" alt="Show password" width={16} height={16} />
                )}
              </div>
            </div>
          </Form.Item>
          <Form.Item>
            <a className="text-blue-400 hover:text-blue-600" onClick={handleForgotPassword}>
              Forgot password
            </a>
          </Form.Item>
          <Form.Item>
            <Button onClick={loginModalOpen} type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </>
      )}

      {modalContent === "forgotEmail" && (
        <div className='flex flex-col items-center space-y-5'>
          <Input
            value={forgotLoginEmail}
            onChange={(e) => setForgotLoginEmail(e.target.value)}
            placeholder='Enter your email'
            size='large'
          />
          <Button onClick={forgotLoginBtnClick}>Send Code</Button>
        </div>
      )}

      {modalContent === "forgotVerify" && (
        <div className='flex flex-col items-center space-y-5'>
          <div className='flex flex-col items-center space-y-5'>
            <Input value={forgotVerifyCode} onChange={(e) => setForgotVerifyCode(e.target.value)} size='large' placeholder='Enter verification code' />
            <Button onClick={forgotOTPBtnClick}>Enter Code</Button>
          </div>
        </div>
      )}

      {modalContent === "createNewLogin" && (
        <div className='flex flex-col items-center space-y-5'>
          <Input value={forgotLoginEmail} size='large' placeholder='Enter your email' />
          <Input value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} size='large' placeholder='Enter your new password' />
          <Button onClick={resetClick}>Get new Password</Button>
        </div>
      )}
    </Form>
  );
};

export default LoginDesayn;
