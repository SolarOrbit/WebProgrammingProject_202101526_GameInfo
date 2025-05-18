// src/pages/Home.jsx
import React, { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import FilterSort from '../components/FilterSort'
import GameCard from '../components/GameCard'
import SkeletonCard from '../components/SkeletonCard'
import { searchGames, getGameDetail } from '../api/game'
import PageLayout from '../components/PageLayout'

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
  const loadMoreRef = useRef(null)

  const handleSearch = async q => {
    setLoading(true)
    setError(null)
    setSearchParams({ q })
    try {
      const basic = await searchGames(q, genre, ordering, 1)
      const detailed = await Promise.all(basic.map(g => getGameDetail(g.id)))
      setGames(detailed)
      setHasMore(basic.length === 20)
      setPage(2)
    } catch (e) {
      console.error(e)
      setError('검색 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) handleSearch(query)
  }, [query])

  useEffect(() => {
    if (!loadMoreRef.current) return
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) loadMore()
      },
      { rootMargin: '200px' }
    )
    obs.observe(loadMoreRef.current)
    return () => obs.disconnect()
  }, [hasMore, loading])

  const loadMore = async () => {
    if (!hasMore) return
    setLoading(true)
    try {
      const basic = await searchGames(query, genre, ordering, page)
      const detailed = await Promise.all(basic.map(g => getGameDetail(g.id)))
      setGames(prev => [...prev, ...detailed])
      setHasMore(basic.length === 20)
      setPage(prev => prev + 1)
    } catch (e) {
      console.error(e)
      setError('추가 로드 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <PageLayout>
      {/* 헤더 (검색창 포함) */}
      <Header onSearch={handleSearch} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 필터 */}
        <FilterSort
          genre={genre}
          ordering={ordering}
          onGenreChange={setGenre}
          onOrderChange={setOrdering}
        />

        {error && <p className="text-center text-red-500">{error}</p>}

        {/* 검색 결과 또는 스켈레톤 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : games.map(game => <GameCard key={game.id} game={game} />)}
        </div>

        {/* 결과 없음 안내 */}
        {!loading && games.length === 0 && (
          <p className="text-center text-gray-500 mt-4">검색 결과가 없습니다.</p>
        )}

        {/* 로딩 중 메시지 및 로드 더미 */}
        {loading && <p className="text-center mt-4">불러오는 중…</p>}
        <div ref={loadMoreRef} className="h-1"></div>
      </div>
    </PageLayout>
    </>
  )
}
