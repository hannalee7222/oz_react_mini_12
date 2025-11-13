import { useEffect, useRef, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuthContext } from '../supabase/useAuthContext';
import { useSupabaseAuth } from '../supabase/useSupabaseAuth';
import { useThemeStore } from '../store/useThemeStore';
import { toast } from 'react-toastify';

function SunIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 0l1.8-1.79 1.41 1.41-1.79 1.8-1.42-1.42zM12 4V1h-0v3h0zm0 19v-3h0v3h0zM4 12H1v0h3v0zm19 0h-3v0h3v0zM6.76 19.16l-1.42 1.42-1.79-1.8 1.41-1.41 1.8 1.79zM19.16 17.24l1.79 1.8-1.41 1.41-1.8-1.79 1.42-1.42zM12 7a5 5 0 100 10 5 5 0 000-10z" />
    </svg>
  );
}
function MoonIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M21.75 14.5A9.75 9.75 0 1110 2.25a8 8 0 0011.75 12.25z" />
    </svg>
  );
}

export default function NavBar() {
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const { userInfo } = useAuthContext();
  const { logout } = useSupabaseAuth();

  useEffect(() => {
    const trimmed = debouncedKeyword.trim();
    const isInvalidKoreanChar = /^[ㄱ-ㅎ]$/.test(trimmed);
    const isSearchInputFocused = document.activeElement === inputRef.current;
    if (!isSearchInputFocused) return;

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
      } else {
        navigate({
          pathname: '/search',
          search: params.toString(),
        });
      }
    }
  }, [debouncedKeyword, navigate, location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith('/details')) {
      setKeyword('');
    }
  }, [location.pathname]);

  const handleMyPageClick = () => {
    if (!userInfo) {
      toast.info(
        '로그인 후 이용가능합니다. 로그인/회원가입 페이지로 이동합니다.'
      );
      navigate('/login');
      return;
    }
    navigate('/mypage');
  };

  const displayName = userInfo
    ? `${userInfo.userName || userInfo.email} 님`
    : '방문자 님';

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
          ref={inputRef}
          className="w-full sm:w-[400px] px-3 py-2 rounded-md border-none outline-none text-black placeholder-gray-400"
          placeholder="영화 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-gray-200">
            {displayName}
          </span>

          <div className="relative group">
            <button
              aria-label="사용자 메뉴"
              className="p-[2px] rounded-full text-purple-400 hover:text-purple-500 focus:outline-none"
            >
              <FaUserCircle size={30} />
            </button>
            <ul
              className="
              absolute right-0 mt-0 w-36 bg-gray-800 border border-gray-700 text-white 
              rounded-md shadow-lg z-20
              opacity-0 pointer-events-none translate-y-1
              group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0
              transition-all duration-150
              "
            >
              {!userInfo ? (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg=gray-700"
                      onClick={() => setKeyword('')}
                    >
                      로그인 / 회원가입
                    </Link>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-700"
                      onClick={handleMyPageClick}
                    >
                      마이페이지
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/mypage"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      마이페이지
                    </Link>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-700"
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                    >
                      로그아웃
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          <button
            onClick={toggleMode}
            aria-label={
              mode === 'light' ? '다크모드로 전환' : '라이트모드로 전환'
            }
            className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 focus:outline-none"
          >
            {mode === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
}
