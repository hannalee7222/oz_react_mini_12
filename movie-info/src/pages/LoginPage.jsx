import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useSupabaseAuth } from '../supabase/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import KakaoLoginButton from '../components/KakaoLoginButton';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const { login, getUserInfo } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setErrors({ email: '유효한 이메일 형식이 아닙니다.' });
      return;
    }

    const res = await login({ email, password });

    if (res.error) {
      setErrors({ password: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      return;
    }

    await getUserInfo();
    navigate('/');
  };

  const fields = [
    {
      name: 'email',
      label: '이메일',
      type: 'email',
      placeholder: '이메일',
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      name: 'password',
      label: '비밀번호',
      type: 'password',
      placeholder: '비밀번호',
      value: password,
      onChange: (e) => setPassword(e.target.value),
    },
  ];

  return (
    <>
      <AuthForm
        mode="login"
        fields={fields}
        onSubmit={handleLogin}
        errorMessages={errors}
      />
      <div className="max-w-md mx-auto flex flex-col gap-1 mt-2 mb-6">
        <KakaoLoginButton />
        <GoogleLoginButton />
      </div>
    </>
  );
}
