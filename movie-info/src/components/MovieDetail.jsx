import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetail.css';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_TOKEN}`,
  },
};

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`,
          options
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error('영화 데이터를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (!movie) return <p>로딩 중...</p>;

  return (
    <div className="movie-detail-container">
      <img
        className="movie-detail-image"
        src={`https://image.tmdb.org/t/p/w500${
          movie.backdrop_path || movie.poster_path
        }`}
        alt={movie.title}
      />

      <div className="movie-detail-info">
        <div className="movie-detail-header">
          <h2>{movie.title}</h2>
          <span className="movie-detail-score">⭐️{movie.vote_average}</span>
        </div>

        <div className="movie-detail-genres">
          {movie.genres.map((genre) => (
            <span key={genre.id} className="genre-badge">
              {genre.name}
            </span>
          ))}
        </div>

        <p className="movie-detail-overview">{movie.overview}</p>
      </div>
    </div>
  );
}
