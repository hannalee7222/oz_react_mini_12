import { useAuthContext } from './useAuthContext';
import { supabase } from './supabaseClient';
import { useCallback } from 'react';

export function useSupabaseAuth() {
  const { setUserInfo } = useAuthContext();

  const signUp = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          profileImageUrl: '',
        },
      },
    });

    if (error) {
      return {
        error: {
          status: error?.status ?? 500,
          message: error?.message || '회원가입 중 오류가 발생했습니다.',
        },
      };
    }

    return { user: data.user };
  };

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        error: {
          status: error?.status ?? 500,
          message:
            error?.message || '로그인 중 알 수 없는 오류가 발생했습니다.',
        },
      };
    }
    return { user: data.user };
  };

  const loginWithKakao = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
    });

    if (error) {
      console.error('카카오 로그인 실패', error.message);
      return {
        error: {
          status: error.status,
          message: error.message,
        },
      };
    }
    return { user: data?.user };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.log('Google 로그인 실패', error.message);
      return {
        error: {
          status: error.status,
          message: error.message,
        },
      };
    }
    return { user: data?.user };
  }, []);

  const getUserInfo = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('유저 정보를 가져오는 데 실패했습니다.', error.message);
      return { error: { status: error.status, message: error.message } };
    }

    const authedUser = data?.user;
    if (!authedUser) return;

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('nickname, avatar_url')
      .eq('id', authedUser.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('프로필 불러오기 실패:', profileError.message);
    }
    const userData = {
      id: authedUser.id,
      email: authedUser.email,
      userName: profileData?.nickname || authedUser.user_metadata?.email || '',
      profileImageUrl:
        profileData?.avatar_url ||
        authedUser.user_metadata?.profileImageUrl ||
        '',
    };

    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserInfo(userData);
  }, [setUserInfo]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  }, [setUserInfo]);

  return {
    signUp,
    login,
    logout,
    getUserInfo,
    loginWithKakao,
    loginWithGoogle,
  };
}
