import { useEffect, useState } from 'react';
import { useAuthContext } from '../supabase/useAuthContext';
import { supabase } from '../supabase/supabaseClient';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  getMyBookmarks,
  clearAllBookmarks,
  removeBookmark,
} from '../supabase/bookmarks';
import { listMyComments, deleteMyComment } from '../supabase/comments';
import { toast } from 'react-toastify';

const DEFAULT_AVATAR = '/images/default_image.png';

export default function MyPage() {
  const { userInfo: user, updateUserName } = useAuthContext();
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const navigate = useNavigate();

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
        //DB에는 avatar_url이 없으면 null, 상태에는 ''로 두고 UI에서 기본이미지로 대체하기
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
      toast.warn('닉네임은 2글자 이상 입력해주세요.');
      return;
    }

    //upsert = 있으면 update, 없으면 insert
    const { error } = await supabase.from('profiles').upsert({
      id: user.id, //PK
      email: user.email,
      nickname: nickname,
      //DB에는 기본이미지 안 넣을 거고, 실제 업로드한 URL만 저장할 거임.
      avatar_url: profileImgUrl || null,
    });

    if (error) {
      console.error('닉네임 저장 실패:', error);
      toast.error('닉네임 저장 중 문제가 발생했습니다.');
      return;
    }
    updateUserName(nickname);

    setIsEditingNickname(false);
  };

  const handleProfileImgChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

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
        toast.error('이미지 업로드에 실패했습니다.');
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
        toast.error('프로필 정보를 저장하지 못했습니다.');
        return;
      }

      setProfileImgUrl(publicURL);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const list = await getMyBookmarks(user.id);
        setBookmarks(list);
      } catch (e) {
        console.error('북마크 불러오기 실패', e);
      }
    })();
  }, [user]);

  const handleClear = async () => {
    if (!user) return;
    if (!confirm('모든 북마크를 삭제할까요?')) return;
    try {
      await clearAllBookmarks(user.id);
      setBookmarks([]);
    } catch (e) {
      console.error('전체 삭제 실패', e);
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleRemoveOne = async (movieId) => {
    if (!user) return;
    try {
      await removeBookmark(user.id, movieId);
      setBookmarks((prev) => prev.filter((b) => b.movie_id !== movieId));
    } catch (e) {
      console.error('개별 삭제 실패', e);
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const rows = await listMyComments(user.id);
        setMyComments(rows);
      } catch (e) {
        console.error('내 댓글 불러오기 실패', e);
      }
    })();
  }, [user]);

  const removeMyComment = async (commentId) => {
    if (!confirm('댓글을 삭제할까요?')) return;
    try {
      setDeletingCommentId(commentId);
      await deleteMyComment(commentId);
      setMyComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      console.error('내 댓글 삭제 실패', e);
      toast.error('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  //상세 페이지 이동
  const goDetail = (movieId) => navigate(`/details/${movieId}`);

  //화면에서 사용할 프로필 이미지(실제 URL 또는 기본이미지)
  const effectiveProfileImg = profileImgUrl || DEFAULT_AVATAR;

  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
            <img
              src={effectiveProfileImg}
              alt="profile"
              className="w-full h-full object-cover"
            />
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
          {isEditingNickname ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                maxLength={12}
                className="border rounded px-2 py-1 text-sm text-gray-800"
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
            <div className="flex items-center gap-3">
              <p
                className={
                  nickname && nickname.trim().length > 0
                    ? 'text-2xl font-semibold text-purple-500'
                    : 'text-lg text-gray-400'
                }
              >
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

          <p className="text-sm text-gray-500 mt-4">{user?.email}</p>
        </div>
      </div>

      <hr className="w-full border-gray-300 mb-6" />

      <div className="w-full max-w-4xl text-left">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">북마크</h3>
          <button
            onClick={handleClear}
            title="모두 삭제"
            className="text-red-500 hover:text-red-600"
          >
            <FaTrashAlt className="cursor-pointer" />
          </button>
        </div>
        {bookmarks.length === 0 ? (
          <p className="text-sm text-gray-500">
            아직 북마크한 영화가 없습니다.
          </p>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {bookmarks.map((b) => (
              <div key={b.id} className="relative group">
                <img
                  onClick={() => goDetail(b.movie_id)}
                  src={`https://image.tmdb.org/t/p/w300${b.poster_path ?? ''}`}
                  alt={b.title}
                  className="w-full h-[220px] object-cover rounded-lg cursor-pointer"
                />
                <div className="mt-1 text-sm font-semibold truncate">
                  {b.title}
                </div>
                <div className="text-xs text-gray-500">
                  ⭐️ {Number(b.vote_average ?? 0).toFixed(1)}
                </div>

                <button
                  onClick={() => handleRemoveOne(b.movie_id)}
                  className="absolute top-2 right-2 text-xs bg-white/90 text-black px-2 py-1 rounded shadow hover:bg-white"
                  title="북마크 해제"
                >
                  해제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="w-full border-gray-300 my-6" />

      {/*내가 남긴 댓글 */}
      <div className="w-full max-w-4xl text-left">
        <h3 className="text-lg font-semibold mb-4">내가 남긴 댓글</h3>
        {myComments.length === 0 ? (
          <p className="text-sm text-gray-500">아직 댓글이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {myComments.map((c) => (
              <li key={c.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => goDetail(c.movie_id)}
                    title="상세 페이지로 이동"
                  >
                    {c.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${c.poster_path}`}
                        alt={c.movie_title || 'poster'}
                        className="w-[46px] h-[69px] object-cover rounded"
                      />
                    ) : (
                      <div className="w-[46px] h-[69px] bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        no img
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm truncate max-w-[200px]">
                        {c.movie_title || `영화 #${c.movie_id}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {c.mood || '💬'} ·{' '}
                        {new Date(c.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeMyComment(c.id)}
                    className="text-xs bg-white/90 text-red-500 px-2 py-1 rounded shadow hover:bg-white"
                    disabled={deletingCommentId === c.id}
                    title="댓글 삭제"
                  >
                    {deletingCommentId === c.id ? '삭제 중...' : '삭제'}
                  </button>
                </div>

                {c.content && (
                  <p className="mt-2 text-sm whitespace-pre-wrap break-words">
                    {c.content}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
