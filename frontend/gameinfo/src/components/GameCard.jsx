// src/components/GameCard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star as StarIcon, ThumbsUp, AlertCircle } from 'lucide-react'; // ThumbsUp, AlertCircle 아이콘 추가 (예시)
import { isFavorite, toggleFavorite } from '../utils/favorites';

// 점수 표시를 위한 헬퍼 컴포넌트 (선택 사항, 가독성을 위해 분리)
const RatingBadge = ({ score, type }) => {
  if (!score && type !== 'user') return null; // 유저 평점은 0점도 의미가 있을 수 있음

  let bgColorClass = 'bg-gray-400'; // 기본 회색 (N/A)
  let textColorClass = 'text-white';

  if (type === 'metacritic') {
    if (score >= 75) bgColorClass = 'bg-green-500';
    else if (score >= 50) bgColorClass = 'bg-yellow-500';
    else if (score > 0) bgColorClass = 'bg-red-500';
  } else if (type === 'user') {
    if (score >= 3.5) bgColorClass = 'bg-green-500';
    else if (score >= 2.5) bgColorClass = 'bg-yellow-500';
    else if (score > 0) bgColorClass = 'bg-red-500';
  }

  const scoreText = score ? (type === 'user' ? score.toFixed(1) : score) : 'N/A';

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${bgColorClass} ${textColorClass}`}>
      {type === 'metacritic' && 'M: '}
      {type === 'user' && <ThumbsUp size={12} className="inline mr-1" />}
      {scoreText}
    </span>
  );
};

export default function GameCard({ game }) {
  const location = useLocation();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    let mounted = true;
    isFavorite(game.id).then(flag => {
      if (mounted) setFav(flag);
    });
    return () => { mounted = false; };
  }, [game.id]);

  const onToggle = async e => {
    e.preventDefault();
    try {
      await toggleFavorite(game.id);
      setFav(prev => !prev);
    } catch (err) {
      console.error('즐겨찾기 토글 오류:', err);
    }
  };

  return (
    <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <button
        onClick={onToggle}
        className="absolute top-3 right-3 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md focus:outline-none z-10 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle Favorite"
      >
        <StarIcon size={20} className={fav ? 'text-yellow-400 fill-current' : 'text-gray-400'} />
      </button>

      <Link
        to={{ pathname: `/game/${game.id}`, search: location.search }}
        className="block transform transition-transform hover:scale-105 group h-full flex flex-col"
      >
        <div className="relative w-full pb-[56.25%]"> {/* 16:9 비율 유지, 또는 pb-[75%] 4:3 비율 */}
          <img
            src={game.background_image || '/placeholder.png'}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
          />
          {/* 점수 표시를 이미지 위에 배치 (선택 사항) */}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            {game.metacritic && <RatingBadge score={game.metacritic} type="metacritic" />}
            {game.rating && <RatingBadge score={game.rating} type="user" />}
          </div>
        </div>

        <div className="p-4 space-y-1.5 flex-grow flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold truncate text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {game.name}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {game.developers?.[0]?.name || 'Unknown Developer'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Released: {game.released || 'N/A'}
            </p>
          </div>

          {/* 점수 표시를 텍스트 영역 하단에 배치 (선택 사항) */}
          <div className="flex items-center justify-start space-x-2 pt-2 mt-auto">
            {/* 이미 이미지 위에 표시했다면 여기서는 생략 가능 */}
            {/* {!game.metacritic && !game.rating && <p className="text-xs text-gray-400">No ratings yet</p>} */}
          </div>
        </div>
      </Link>
    </div>
  );
}