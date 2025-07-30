import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function NavBar({ mode, setMode }) {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const trimmed = debouncedKeyword.trim();
    const isInvalidKoreanChar = /^[ㄱ-ㅎ]$/.test(trimmed);

    if (trimmed !== '' && !isInvalidKoreanChar) {
      const params = new URLSearchParams({ query: trimmed });

      if (location.pathname === '/search') {
        // 현재 페이지가 /search면 replace로 search 값만 바꿈
        navigate(
          {
            pathname: '/search',
            search: params.toString(),
          },
          { replace: true }
        ); // replace 안 하면 뒤로 가기 쌓임
      } else if (!location.pathname.startsWith('/details')) {
        navigate({
          pathname: '/search',
          search: params.toString(),
        });
      }
    }
  }, [debouncedKeyword, navigate, location.pathname]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className="bg-[#111] text-white px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Link
        to="/"
        className="text-2xl font-bold no-underline"
        onClick={() => setKeyword('')}
      >
        OZ 무비<span className="text-purple-500">.</span>
      </Link>
      <div className="flex items-center justify-between flex-1 gap-4 flex-wrap md:flex-nowrap w-full">
        <input
          type="text"
          className="w-full sm:w-[400px] px-3 py-2 rounded-md border-none outline-none text-black placeholder-gray-400"
          placeholder="영화 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <div className="flex gap-2 items-center">
          <button
            onClick={toggleMode}
            className="bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            {mode === 'light' ? '🌝다크모드' : '🌞라이트모드'}
          </button>

          <Link
            to="/login"
            onClick={() => setKeyword('')}
            className="bg-purple-600 px-4 py-2 rounded-md whitespace-nowrap"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            onClick={() => setKeyword('')}
            className="bg-purple-600 px-4 py-2 rounded-md whitespace-nowrap"
          >
            회원가입
          </Link>
        </div>
      </div>
    </nav>
  );
}
