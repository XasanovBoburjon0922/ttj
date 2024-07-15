import React from 'react';
import LoginDesayn from './loginDesayn';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  return (
    <div className="container flex items-center justify-center">
      <div className="w-[440px] flex flex-col mt-[100px]">
        <h2 className="font-bold text-[33px]">Welcome to TUIT NF! 👋🏻</h2>
        <p className="my-3 font-semibold text-gray-500">
          Please sign-in to your account and start the adventure
        </p>
        <LoginDesayn setIsLoggedIn={setIsLoggedIn} />
      </div>
    </div>
  );
};

export default Login;
