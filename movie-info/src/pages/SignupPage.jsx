import { Link } from 'react-router-dom';

export default function SignupPage() {
  return (
    <section className="max-w-md mx-auto mt-20 p-8 border border-gray-800 dark:border-gray-200 bg-white dark:bg-gray-400 text-black dark:text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="이름"
          required
          className="p-3 text-base bg-white dark:bg-gray-500 text-black dark:text-white border border-gray-300 dark:border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          placeholder="이메일"
          required
          className="p-3 text-base bg-white dark:bg-gray-500 text-black dark:text-white border border-gray-300 dark:border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="비밀번호"
          required
          className="p-3 text-base bg-white dark:bg-gray-500 text-black dark:text-white border border-gray-300 dark:border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          required
          className="p-3 text-base bg-white dark:bg-gray-500 text-black dark:text-white border border-gray-300 dark:border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="p-3 bg-gray-600 text-white hover:bg-gray-700 transition rounded-md"
        >
          회원가입
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="text-purple-600 hover:underline">
          로그인
        </Link>
      </p>
    </section>
  );
}
