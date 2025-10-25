import { useEffect, useState } from 'react';
import { useAuthContext } from '../supabase/useAuthContext';
import { supabase } from '../supabase/supabaseClient';
import { FaTrashAlt } from 'react-icons/fa';

export default function MyPage() {
  const { userInfo: user, updateUserName } = useAuthContext();
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        //'PGRST116' row 없는 신규 유저
        console.error('프로필 불러오기 실패:', error);
        return;
      }

      if (data) {
        setNickname(data.nickname || '');
        setProfileImgUrl(data.avatar_url || '');
      } else {
        //프로필 row가 없으면 기본값으로 빈 row(화면만 빈 값)
      }
    };

    fetchProfile();
  }, [user]);

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  //닉네임 저장
  const handleSaveNickname = async () => {
    if (nickname.trim().length < 2) {
      alert('닉네임은 2글자 이상 입력해주세요.');
      return;
    }

    //upsert = 있으면 update, 없으면 insert
    const { error } = await supabase.from('profiles').upsert({
      id: user.id, //PK
      email: user.email,
      nickname: nickname,
      avatar_url: profileImgUrl || null,
    });

    if (error) {
      console.error('닉네임 저장 실패:', error);
      alert('닉네임 저장 중 문제가 발생했습니다.');
      return;
    }
    updateUserName(nickname);

    setIsEditingNickname(false);
  };

  const handleProfileImgChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) return;

    try {
      setUploading(true);

      //이미지 파일 이름 만들기(유저id-타임스탬프 로 고유하게)
      const fileName = `${user.id}-${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('이미지 업로드 실패:', uploadError);
        alert('이미지 업로드에 실패했습니다.');
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const publicURL = publicUrlData.publicUrl;

      const { error: updateError } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        nickname: nickname || null,
        avatar_url: publicURL,
      });

      if (updateError) {
        console.error('프로필 URL 저장 실패:', updateError);
        alert('프로필 정보를 저장하지 못했습니다.');
        return;
      }

      setProfileImgUrl(publicURL);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
            {profileImgUrl ? (
              <img
                src={profileImgUrl}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500">이미지 없음</span>
            )}
          </div>

          <label
            htmlFor="profileUpload"
            className={`mt-3 text-sm ${
              uploading ? 'text-gray-400' : 'text-red-500 cursor-pointer'
            }`}
          >
            {uploading ? '업로드 중...' : '프로필 이미지 수정'}
          </label>
          <input
            type="file"
            id="profileUpload"
            accept="image/*"
            onChange={handleProfileImgChange}
            className="hidden"
            disabled={uploading}
          />
        </div>

        <div className="text-left">
          <h2 className="text-2xl font-semibold mb-1">{user?.email}</h2>

          {isEditingNickname ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                maxLength={12}
                className="border rounded px-2 py-1 text-sm"
                placeholder="닉네임 입력"
              />
              <button
                onClick={handleSaveNickname}
                className="text-sm text-red-500"
              >
                저장
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-lg">
                {nickname && nickname.trim().length > 0
                  ? nickname
                  : '닉네임을 설정해주세요'}
              </p>
              <button
                onClick={() => setIsEditingNickname(true)}
                className="text-sm text-red-500"
              >
                닉네임 수정
              </button>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
        </div>
      </div>

      <hr className="w-full border-gray-300 mb-6" />

      <div className="w-full max-w-4xl text-left">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">북마크</h3>
          <FaTrashAlt className="text-red-500 cursor-pointer" />
        </div>

        <p className="text-sm text-gray-500">아직 북마크한 영화가 없습니다.</p>
      </div>
    </div>
  );
}
