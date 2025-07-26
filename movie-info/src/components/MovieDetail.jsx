import React, { useState } from 'react';
import movieDetailData from '../movieDetailData.json';
import './MovieDetail.css';

export default function MovieDetail() {
  const [movie] = useState(movieDetailData);

  return (
    <div className="movie-detail">
      <img
        className="movie-backdrop"
        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
        alt={movie.title}
      />

      <div className="movie-info">
        <div className="title-score">
          <h2>{movie.title}</h2>
          <span>⭐️{movie.vote_average}</span>
        </div>

        <div className="genres">
          {movie.genres.map((genre) => (
            <span key={genre.id} className="genre">
              {genre.name}
            </span>
          ))}
        </div>

        <p className="overview">{movie.overview}</p>
      </div>
    </div>
  );
}
