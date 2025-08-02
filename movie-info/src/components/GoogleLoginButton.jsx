import { useSupabaseAuth } from '../supabase/useSupabaseAuth';

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useSupabaseAuth();

  const handleClick = async () => {
    await loginWithGoogle();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center py-2 border border-gray-300  bg-white hover:bg-gray-50 rounded-lg transition"
    >
      <div className="flex items-center gap-3">
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
          className="w-5 h-5"
        />
        <span className="text-sm font-medium text-black">Google로 로그인</span>
      </div>
    </button>
  );
}
