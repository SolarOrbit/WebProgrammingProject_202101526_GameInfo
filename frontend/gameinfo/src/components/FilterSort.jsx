// src/components/FilterSort.jsx
import React from 'react'

// 확장된 장르 목록 예시
const genres = [
  { label: 'All', value: '' },
  { label: 'Action', value: 'action' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'RPG', value: 'role-playing-games-rpg' },
  { label: 'Shooter', value: 'shooter' },
  { label: 'Puzzle', value: 'puzzle' },
  { label: 'Strategy', value: 'strategy' },
  { label: 'Simulation', value: 'simulation' },
  { label: 'Sports', value: 'sports' },
  { label: 'Racing', value: 'racing' }
]

const orderingOptions = [
  { label: 'Rating (High to Low)', value: '-rating' },
  { label: 'Rating (Low to High)', value: 'rating' },
  { label: 'Newest', value: '-released' },
  { label: 'Oldest', value: 'released' }
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
