import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

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
        console.error('영화 데이터를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchMovieDetail();
  }, [id]);

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
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-black dark:text-black">
            {movie.title}
          </h2>
          <span className="text-yellow-500 text-lg font-semibold">
            ⭐️{movie.vote_average}
          </span>
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
