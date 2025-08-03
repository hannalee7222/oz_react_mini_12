import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useSupabaseAuth } from '../supabase/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const { signUp, getUserInfo } = useSupabaseAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!/^[가-힣a-zA-Z0-9]{2,8}$/.test(name))
      newErrors.name = '이름은 2~8자 이상의 한글, 영문, 숫자만 가능합니다.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = '이메일 형식이 올바르지 않습니다.';
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password))
      newErrors.password =
        '비밀번호는 대소문자, 숫자를 포함한 8자 이상이어야 합니다.';
    if (confirm !== password)
      newErrors.confirm = '비밀번호가 일치하지 않습니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await signUp({ email, password, userName: name });

    if (res.error) {
      setErrors((prev) => ({ ...prev, email: '이미 가입된 이메일입니다.' }));
      return;
    }

    await getUserInfo();
    navigate('/');

    console.log('회원가입 시도:', { name, email, password });
  };

  const fields = [
    {
      name: 'name',
      label: '이름',
      type: 'text',
      placeholder: '이름',
      value: name,
      onChange: (e) => setName(e.target.value),
    },
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
    {
      name: 'confirm',
      label: '비밀번호 확인',
      type: 'password',
      placeholder: '비밀번호 확인',
      value: confirm,
      onChange: (e) => setConfirm(e.target.value),
    },
  ];

  return (
    <AuthForm
      mode="signup"
      fields={fields}
      onSubmit={handleSignup}
      errorMessages={errors}
    />
  );
}
