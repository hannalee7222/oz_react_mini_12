import { useEffect, useState } from 'react';

export default function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', //부드럽게 최상단으로 올리기
    });
  };
  //300이상이면 버튼 렌더X
  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="맨 위로 이동"
      className="
      fixed bottom-4 right-4 z-50
      rounded-full shadow-lg
      bg-gray-800/80 text-white
      dark:bg-white/90 dark:text-gray-900
      backdrop-blur
      px-4 py-2
      text-sm font-semibold
      flex items-center justify-center
      hover:scale-105 transition-transform
      "
    >
      TOP
    </button>
  );
}
