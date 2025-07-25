import React from 'react';
import './MovieCard.css';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ poster_path, title, vote_average }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('./details');
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <img
        src={`https://image.tmdb.org/t/p/w300${poster_path}`}
        alt={title}
        className="movie-poster"
      />
      <h3 className="movie-title">{title}</h3>
      <p className="movie-score">평점: {vote_average}</p>
    </div>
  );
}
