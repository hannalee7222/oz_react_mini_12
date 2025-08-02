import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useSupabaseAuth } from '../supabase/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import KakaoLoginButton from '../components/KakaoLoginButton';
import { Link } from 'react-router-dom';
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
      setErrors({ password: res.error.message });
      return;
    }

    await getUserInfo();
    navigate('/');

    //로그인 시도 확인용
    console.log('로그인 시도:', { email, password });
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
    <section className="max-w-md mx-auto mt-20 p-8 border border-gray-800 dark:border-gray-200 bg-white dark:bg-gray-400 text-black dark:text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
      <AuthForm
        mode="login"
        fields={fields}
        onSubmit={handleLogin}
        errorMessages={errors}
      />
      <div className="flex flex-col gap-1 mt-2 mb-6">
        <KakaoLoginButton />
        <GoogleLoginButton />
      </div>
      <p className="text-center text-sm mt-4">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="text-purple-600 hover:underline">
          회원가입
        </Link>
      </p>
    </section>
  );
}
