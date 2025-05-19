// components/SearchBar.jsx
import React, { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }
  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
       type="text"
      placeholder="검색어를 입력해 보세요..."
       className="
        flex-1
        border
        rounded
        px-3
        py-2
        bg-white
        text-gray-900
        placeholder-gray-500
        dark:bg-gray-700
        dark:text-gray-100
        dark:placeholder-gray-400
        dark:border-gray-600
       "
      value={query}
   onChange={e => setQuery(e.target.value)}
 />
      <button
     type="submit"
     className="
       px-4
       py-2
       bg-blue-600
       text-white
       rounded
       hover:bg-blue-700
       dark:bg-blue-500
       dark:hover:bg-blue-600
     "
   >
     검색
   </button>
    </form>
  )
}