import React from 'react';

export default function MovieCard({
  poster_path,
  title,
  vote_average,
  id,
  onClick,
}) {
  return (
    <div
      className="w-full max-w-[180px] mx-auto flex flex-col items-center cursor-pointer text-center"
      onClick={() => onClick(id)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w300${poster_path}`}
        alt={title}
        className="w-full h-[270px] object-cover rounded-lg"
      />
      <h3 className="text-base font-semibold mt-2 truncate overflow-hidden whitespace-nowrap">
        {title}
      </h3>
      <p className="text-sm text-gray-500">⭐️평점: {vote_average}</p>
    </div>
  );
}
