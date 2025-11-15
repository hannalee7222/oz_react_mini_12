import React from 'react';

function MovieCard({ poster_path, title, vote_average, id, onClick }) {
  const handleClick = () => {
    if (onClick) onClick(id);
  };

  //poster_path 값이 null인 경우 대비
  const imageSrc = poster_path
    ? `https://image.tmdb.org/t/p/w300${poster_path}`
    : '';

  return (
    <div
      className="w-full max-w-[180px] mx-auto flex flex-col items-center cursor-pointer text-center"
      onClick={handleClick}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-[270px] object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-[270px] flex items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
          이미지 없음
        </div>
      )}
      <h3 className="text-sm font-semibold mt-2 leading-tight overflow-hidden break-keep max-h-[3rem]">
        {title}
      </h3>
      <p className="text-sm text-gray-500">⭐️평점: {vote_average ?? '-'}</p>
    </div>
  );
}

export default React.memo(MovieCard);
