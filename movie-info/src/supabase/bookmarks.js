import { supabase } from './supabaseClient';

export async function getMyBookmarks(userId) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('movie_id,title,poster_path,vote_average,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function isBookmarked(userId, movieId) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

export async function addBookmark(userId, movie) {
  const payload = {
    user_id: userId,
    movie_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? movie.backdrop_path ?? null,
    vote_average: movie.vote_average ?? null,
  };
  const { error } = await supabase.from('bookmarks').insert(payload);
  if (error && error.code !== '23505') throw error;
}

export async function removeBookmark(userId, movieId) {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);
  if (error) throw error;
}

export async function clearAllBookmarks(userId) {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId);
  if (error) throw error;
}
