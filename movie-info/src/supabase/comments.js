import { supabase } from './supabaseClient';

export const EMOJI_CHOICES = ['😭', '😊', '😡', '🤣', '😬'];

//영화별 댓글 목록
export async function listCommentsByMovie(movieId) {
  const { data, error } = await supabase
    .from('comments')
    .select(
      'id,user_id,movie_id,movie_title,poster_path,mood,content,created_at'
    )
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

//댓글 생성(내용없이 이모지만 가능)
export async function addComment({
  userId,
  movieId,
  movieTitle,
  posterPath,
  mood,
  content,
}) {
  if (!userId) throw new Error('로그인 필요');
  //이모지 또는 내용 중 하나는 있어야 함
  if (!mood && !content?.trim()) {
    throw new Error('이모지 또는 내용을 입력해주세요.');
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        user_id: userId,
        movie_id: movieId,
        movie_title: movieTitle ?? null,
        poster_path: posterPath ?? null,
        mood: mood ?? null,
        content: content?.trim() || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

//나의 남긴 댓글 목록
export async function listMyComments(userId) {
  const { data, error } = await supabase
    .from('comments')
    .select('id,movie_id,movie_title,poster_path,mood,content,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

//내가 남긴 댓글 삭제
export async function deleteMyComment(commentId) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}
