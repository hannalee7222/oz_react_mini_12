import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlineBookmark, HiBookmark } from 'react-icons/hi2';
import { useAuthContext } from '../supabase/useAuthContext';
import {
  addBookmark,
  removeBookmark,
  isBookmarked,
} from '../supabase/bookmarks';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [busy, setBusy] = useState(false);
  const [booked, setBooked] = useState(false);
  const { userInfo: user } = useAuthContext(); //로그인 여부 확인

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=ko-KR&api_key=${API_KEY}`
        );

        if (!res.ok) throw new Error('영화 데이터를 불러오는 데 실패했습니다.');
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieDetail();
  }, [id]);

  //북마크 초기 상태
  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      try {
        const ok = await isBookmarked(user.id, Number(id));
        setBooked(ok);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user, id]);

  const toggleBookmark = async () => {
    if (!user) {
      alert('로그인 후 북마크를 사용할 수 있어요.');
      return;
    }
    if (!movie) return;

    try {
      setBusy(true);
      if (booked) {
        await removeBookmark(user.id, Number(id));
        setBooked(false);
      } else {
        await addBookmark(user.id, movie);
        setBooked(true);
      }
    } catch (e) {
      console.error(e);
      alert('북마크 처리 중 오류가 발생했어요.');
    } finally {
      setBusy(false);
    }
  };

  if (!movie) return <p className="text-center py-10">로딩 중...</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md mt-10">
      <img
        className="w-full lg:w-[300px] h-auto object-cover rounded-lg"
        src={`https://image.tmdb.org/t/p/w500${
          movie.backdrop_path || movie.poster_path
        }`}
        alt={movie.title}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-black ">
            {movie.title}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-yellow-500 text-lg font-semibold">
              ⭐️{movie.vote_average}
            </span>
            <button
              type="button"
              onClick={toggleBookmark}
              disabled={busy}
              aria-label={booked ? '북마크 해제' : '북마크 추가'}
              className="p-1 rounded-md hover:bg-gray-100 active:scale-95 transition"
              title={booked ? '북마크 해제' : '북마크 해제'}
            >
              {booked ? (
                <HiBookmark className="w-6 h-6 text-red-500" />
              ) : (
                <HiOutlineBookmark className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 my-3">
          {movie.genres.map((genre) => (
            <span
              key={genre.id}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <p className="text-sm md:text-base text-gray-700 leading-relaxed mt-2">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}
