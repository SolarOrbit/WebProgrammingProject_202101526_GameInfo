// src/pages/Home.jsx
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import Header from '../components/Header'
import FilterSort from '../components/FilterSort'
import GameCard from '../components/GameCard'
import SkeletonCard from '../components/SkeletonCard'
import { searchGames, getGameDetail } from '../api/game'

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [genre, setGenre] = useState('')
  const [ordering, setOrdering] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // 페이지 단위 데이터 로드
  const fetchPage = async (q, pageNum = 1) => {
    setLoading(true)
    setError(null)
    try {
      const basic = await searchGames(q, genre, ordering, pageNum)
      const detailed = await Promise.all(basic.map(g => getGameDetail(g.id)))
      setGames(detailed)
      setHasMore(basic.length === 20)
      setPage(pageNum)
      setSearchParams({ q })
    } catch (e) {
      console.error(e)
      setError('검색 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 초기 및 필터/정렬 변경 시 첫 페이지 로드
  useEffect(() => {
    if (query) fetchPage(query, 1)
  }, [query, genre, ordering])

  // 검색창에서 입력된 값으로 URL 업데이트
  const handleSearch = q => {
    setSearchParams({ q })
  }

  const handlePrev = () => page > 1 && fetchPage(query, page - 1)
  const handleNext = () => hasMore && fetchPage(query, page + 1)

  return (
    <>
      {/* 헤더 */}
      <Header onSearch={handleSearch} />

      {/* 필터 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <FilterSort
          genre={genre}
          ordering={ordering}
          onGenreChange={g => setGenre(g)}
          onOrderChange={o => setOrdering(o)}
        />

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : games.map(game => <GameCard key={game.id} game={game} />)
          }
        </div>

        {/* 결과 없을 때 */}
        {!loading && games.length === 0 && (
          <p className="text-center text-gray-500 mt-8">검색 결과가 없습니다.</p>
        )}

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50"
          >이전</button>
          <span className="text-gray-700 dark:text-gray-300">{page} 페이지</span>
          <button
            onClick={handleNext}
            disabled={!hasMore || loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50"
          >다음</button>
        </div>

        {/* 에러 */}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </>
  )
}
