// src/pages/Favorites.jsx
import React, { useState, useEffect } from 'react'
import { getFavorites } from '../utils/favorites'
import { getGameDetail } from '../api/game'
import GameCard from '../components/GameCard'

export default function Favorites() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    async function fetchFavorites() {
      try {
        const ids = await getFavorites()
        if (!mounted) return
        const details = await Promise.all(ids.map(id => getGameDetail(id)))
        if (!mounted) return
        setGames(details)
      } catch (err) {
        console.error('Error fetching favorites:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchFavorites()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return <p className="text-center p-4">불러오는 중…</p>
  }

  if (!loading && games.length === 0) {
    return <p className="text-center p-4">즐겨찾기가 비어 있습니다.</p>
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
