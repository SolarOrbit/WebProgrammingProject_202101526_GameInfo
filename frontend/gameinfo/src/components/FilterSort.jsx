// src/components/FilterSort.jsx
import React from 'react'

// 확장된 장르 목록 예시
const genres = [
  { label: '전체', value: '' },
  { label: '액션', value: 'action' },
  { label: '어드벤처', value: 'adventure' },
  { label: '롤플레잉잉', value: 'role-playing-games-rpg' },
  { label: '슈팅', value: 'shooter' },
  { label: '퍼즐', value: 'puzzle' },
  { label: '전략', value: 'strategy' },
  { label: '시뮬레이션', value: 'simulation' },
  { label: '스포츠', value: 'sports' },
  { label: '레이싱', value: 'racing' }
]

const orderingOptions = [
  { label: '평점 (높은 순)', value: '-rating' },
  { label: '평점 (낮은 순)', value: 'rating' },
  { label: '최신', value: '-released' },
  { label: '오래된 순', value: 'released' }
]

export default function FilterSort({ genre, ordering, onGenreChange, onOrderChange }) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select
   className="
     px-3
     py-2
     border
     rounded
     bg-white
     text-gray-900
     dark:bg-gray-700
     dark:text-gray-100
     dark:border-gray-600
   "
   value={genre}
   onChange={e => onGenreChange(e.target.value)}
>
        {genres.map(g => (
          <option key={g.value} value={g.value}>{g.label}</option>
        ))}
      </select>
      <select
   className="
     px-3
     py-2
     border
     rounded
     bg-white
     text-gray-900
     dark:bg-gray-700
     dark:text-gray-100
     dark:border-gray-600
   "
   value={ordering}
   onChange={e => onOrderChange(e.target.value)}
>
        {orderingOptions.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
