// src/components/GameCard.jsx
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Star } from 'lucide-react'
import { isFavorite, toggleFavorite } from '../utils/favorites'

export default function GameCard({ game }) {
  const location = useLocation()
  const [fav, setFav] = useState(false)

  // 초기 즐겨찾기 상태
  useEffect(() => {
    let mounted = true
    isFavorite(game.id).then(flag => {
      if (mounted) setFav(flag)
    })
    return () => { mounted = false }
  }, [game.id])

  // 즐겨찾기 토글 핸들러
  const onToggle = async e => {
    e.preventDefault()
    try {
      await toggleFavorite(game.id)
      setFav(prev => !prev)
    } catch (err) {
      console.error('즐겨찾기 토글 오류:', err)
    }
  }

  return (
    <div className="relative w-full max-w-xs bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* 즐겨찾기 버튼 */}
      <button
        onClick={onToggle}
        className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow focus:outline-none"
        aria-label="Toggle Favorite"
      >
        <Star size={20} className={fav ? 'text-yellow-400' : 'text-gray-400'} />
      </button>

      {/* 카드 전체 링크 */}
      <Link
        to={{ pathname: `/game/${game.id}`, search: location.search }}
        className="block transform transition hover:scale-105"
      >
        {/* 이미지 영역 */}
        <div className="relative w-full pb-[75%]">
          <img
            src={game.background_image || '/placeholder.png'}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {/* 텍스트 영역 */}
        <div className="p-4 space-y-1">
          <h2 className="text-lg font-semibold truncate text-gray-900 dark:text-white">
            {game.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            Developer: {game.developers?.[0]?.name || 'Unknown'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Released: {game.released || 'N/A'}
          </p>
        </div>
      </Link>
    </div>
  )
}
