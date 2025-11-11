import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../supabase/useAuthContext';
import {
  EMOJI_CHOICES,
  listCommentsByMovie,
  addComment,
  deleteMyComment,
} from '../supabase/comments';

export default function CommentsSection({ movieId, movie }) {
  const { userInfo: user } = useAuthContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [mood, setMood] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const count = list.length;
  const title = useMemo(
    () => (count === 1 ? '댓글 1' : `댓글 ${count}`),
    [count]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const rows = await listCommentsByMovie(Number(movieId));
        if (alive) setList(rows);
      } catch (e) {
        console.error('댓글 목록 실패', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [movieId]);

  const guardLoginFocus = () => {
    if (!user) {
      alert('로그인 후 이용가능합니다.');
      navigate('/login');
      return true;
    }
    return false;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인 후 이용가능합니다.');
      navigate('/login');
      return;
    }
    if (!mood && !content.trim()) {
      alert('이모지 또는 내용을 입력해주세요.');
      return;
    }
    try {
      setPosting(true);
      const created = await addComment({
        userId: user.id,
        movieId: Number(movieId),
        movieTitle: movie?.title ?? null,
        posterPath: movie?.poster_path ?? movie?.backdrop_path ?? null,
        mood,
        content,
      });
      setList((prev) => [created, ...prev]);
      setMood('');
      setContent('');
    } catch (e) {
      console.error(e);
      alert('댓글 등록 중 오류가 발생했어요.');
    } finally {
      setPosting(false);
    }
  };

  const onDelete = async (id) => {
    if (!user) return;
    if (!confirm('댓글을 삭제할까요?')) return;
    try {
      setDeletingId(id);
      await deleteMyComment(id);
      setList((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
      alert('삭제 중 오류가 발생했어요.');
    } finally {
      setDeletingId(null);
    }
  };

  const placeholder = user ? '댓글 입력' : '로그인 후 이용가능합니다.';

  return (
    <section className="max-w-5xl mx-auto mt-8 p-4 lg:p-6 bg-white rounded-xl shadow">
      <h3 className="text-lg text-gray-900 font-semibold mb-4">{title}</h3>

      {/*작성 폼 */}
      <form onSubmit={onSubmit} className="mb-6">
        {/*이모지 라디오버튼 */}
        <div className="flex gap-2 mb-3">
          {EMOJI_CHOICES.map((emo) => (
            <label
              key={emo}
              className={`cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full border text-xl ${
                mood === emo
                  ? 'bg-gray-100 border-gray-400'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="mood"
                value={emo}
                className="hidden"
                checked={mood === emo}
                onChange={(e) => setMood(e.target.value)}
                onFocus={guardLoginFocus}
              />
              <span aria-label={`이모지 ${emo}`}>{emo}</span>
            </label>
          ))}
        </div>

        <textarea
          className="w-full border border-gray-300 rounded-md p-2 text-sm resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-red-300"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={guardLoginFocus}
        />

        <div className="mt-2 text-right">
          <button
            type="submit"
            disabled={posting}
            className="px-4 py-2 rounded-md bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition"
            title="댓글 등록"
          >
            {posting ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>

      {/*댓글 목록 */}
      {loading ? (
        <p className="text-sm text-gray-500">불러오는 중...</p>
      ) : list.length === 0 ? (
        <p className="text-sm text-gray-500">아직 댓글이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((c) => (
            <li key={c.id} className="border rounded-md p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{c.mood || '💬'}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                </div>
                {user?.id === c.user_id && (
                  <button
                    onClick={() => onDelete(c.id)}
                    className="text-xs text-red-500 hover:text-red-600"
                    disabled={deletingId === c.id}
                  >
                    {deletingId === c.id ? '삭제 중...' : '삭제'}
                  </button>
                )}
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
    </section>
  );
}
