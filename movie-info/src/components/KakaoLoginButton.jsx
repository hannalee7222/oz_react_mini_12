import { useSupabaseAuth } from '../supabase/useSupabaseAuth';

export default function KakaoLoginButton() {
  const { loginWithKakao } = useSupabaseAuth();

  const handleLogin = async () => {
    await loginWithKakao();
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center py-2 border border-yellow-400 bg-yellow-300 hover:bg-yellow-400 rounded-lg transition"
    >
      <div className="flex items-center gap-3">
        <img
          src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
          alt="Kakao logo"
          className="w-5 h-5"
        />
        <span className="text-sm font-medium text-black">카카오로 로그인</span>
      </div>
    </button>
  );
}
