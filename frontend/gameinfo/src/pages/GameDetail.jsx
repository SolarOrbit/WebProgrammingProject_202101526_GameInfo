// src/pages/GameDetail.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getGameDetail, getGameScreenshots, getGameTrailers } from '../api/game'
import { isFavorite, toggleFavorite } from '../utils/favorites'
import { getReviews, addReview, deleteReview, editReview } from '../utils/reviews'
import { auth } from '../firebase'
import { Star } from 'lucide-react'
import Modal from 'react-modal'
import PageLayout from '../components/PageLayout'

Modal.setAppElement('#root')

export default function GameDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [trailers, setTrailers] = useState([])
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState('')
  const [fav, setFav] = useState(false)
  const [loadingGame, setLoadingGame] = useState(true)
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false)
  const [screenshotIndex, setScreenshotIndex] = useState(0)
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [editingIdx, setEditingIdx] = useState(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoadingGame(true)
      // 상세 데이터 로드
      const data = await getGameDetail(id)
      setGame(data)
      setFav(await isFavorite(data.id))
      setScreenshots(await getGameScreenshots(id))
      setTrailers(await getGameTrailers(id))
      setReviews(await getReviews(id))
      setLoadingGame(false)
    }
    fetchData()
  }, [id])

  if (loadingGame) {
    return (
      <div className="space-y-6 p-6 max-w-4xl mx-auto">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    )
  }

  //if (!game) return <div className="p-4 text-center">Loading…</div>

  const onToggle = async () => {
    await toggleFavorite(game.id)
    setFav(prev => !prev)
  }
  const openTrailer = () => setIsTrailerOpen(true)
  const closeTrailer = () => setIsTrailerOpen(false)
  const openScreenshot = idx => { setScreenshotIndex(idx); setIsScreenshotOpen(true) }
  const closeScreenshot = () => setIsScreenshotOpen(false)
  const prevScreenshot = () => setScreenshotIndex((screenshotIndex + screenshots.length - 1) % screenshots.length)
  const nextScreenshot = () => setScreenshotIndex((screenshotIndex + 1) % screenshots.length)

  const handleReviewSubmit = async e => {
    e.preventDefault()
    if (!newReview.trim()) return
    await addReview(id, newReview.trim())
    const updated = await getReviews(id)
    setReviews(updated)
    setNewReview('')
  }

  const handleDelete = async idx => {
    await deleteReview(id, idx)
    setReviews(await getReviews(id))
  }

  const startEdit = idx => {
    setEditingIdx(idx)
    setEditingText(reviews[idx].text)
  }

  const saveEdit = async () => {
    await editReview(id, editingIdx, editingText)
    setReviews(await getReviews(id))
    setEditingIdx(null)
  }

  const cancelEdit = () => {
    setEditingIdx(null)
  }

  const trailerUrl = trailers[0]?.data?.max || trailers[0]?.preview

  
  return (
    <PageLayout>
    <div className="relative max-w-4xl mx-auto p-6 space-y-8">
      {/* 뒤로 가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        ← Back
      </button>

      {/* 즐겨찾기 */}
      <button onClick={onToggle} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow">
        <Star size={24} className={fav ? 'text-yellow-400' : 'text-gray-400'} />
      </button>

      {/* 제목 */}
      <h1 className="text-3xl font-bold">{game.name}</h1>

      {/* 트레일러 */}
      {trailerUrl && <button onClick={openTrailer} className="px-4 py-2 bg-red-600 text-white rounded">Watch Trailer</button>}
      <Modal isOpen={isTrailerOpen} onRequestClose={closeTrailer} className="modal" overlayClassName="overlay">
        <button onClick={closeTrailer} className="mb-4">Close</button>
        <video controls src={trailerUrl} className="w-full h-auto rounded" />
      </Modal>

      {/* 메인 이미지 */}
      <img src={game.background_image} alt={game.name} className="w-full rounded-lg shadow" />

      {/* 주요 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <p><strong>Developer:</strong> {game.developers.map(d => d.name).join(', ') || 'N/A'}</p>
          <p><strong>Publisher:</strong> {game.publishers.map(p => p.name).join(', ') || 'N/A'}</p>
          <p><strong>Metacritic:</strong> <span className={`px-2 py-1 rounded ${
              game.metacritic >= 80 ? 'bg-green-500' :
              game.metacritic >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            } text-white`}>{game.metacritic || 'N/A'}</span></p>
          <p><strong>User Rating:</strong> <span className={`px-2 py-1 rounded ${
              game.rating >= 4 ? 'bg-green-500' :
              game.rating >= 2 ? 'bg-yellow-500' :
              'bg-red-500'
            } text-white`}>{game.rating ? `${game.rating.toFixed(1)} / 5` : 'N/A'}</span></p>
          <p><strong>Genres:</strong> {game.genres.map(g => g.name).join(', ')}</p>
          <p><strong>Platforms:</strong> {game.platforms.map(p => p.platform.name).join(', ')}</p>
          <p><strong>Release Date:</strong> {game.released}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">System Requirements (PC)</h2>
          <p><strong>Minimum:</strong> {game.platforms.find(p => p.platform.slug === 'pc')?.requirements?.minimum || 'N/A'}</p>
          <p><strong>Recommended:</strong> {game.platforms.find(p => p.platform.slug === 'pc')?.requirements?.recommended || 'N/A'}</p>
        </div>
      </div>

      {/* 스크린샷 갤러리 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Screenshots</h2>
        <div className="flex space-x-4 overflow-x-auto py-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300">
          {screenshots.map((ss, idx) => (
            <img key={ss.id} src={ss.image} alt={`ss-${ss.id}`} className="flex-shrink-0 w-64 h-40 object-cover rounded-lg snap-center cursor-pointer" onClick={() => openScreenshot(idx)} />
          ))}
        </div>
        <Modal isOpen={isScreenshotOpen} onRequestClose={closeScreenshot} className="modal" overlayClassName="overlay">
          <button onClick={closeScreenshot} className="mb-4">Close</button>
          <div className="flex items-center justify-between">
            <button onClick={prevScreenshot}>❮</button>
            <img src={screenshots[screenshotIndex]?.image} alt="ss" className="max-h-[80vh] object-contain" />
            <button onClick={nextScreenshot}>❯</button>
          </div>
        </Modal>
      </div>

      {/* 설명 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Description</h2>
        <p className="prose">{game.description_raw}</p>
      </div>

      {/* 유저 리뷰 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">User Reviews</h2>
        <form onSubmit={handleReviewSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newReview}
            onChange={e => setNewReview(e.target.value)}
            placeholder="Write a review..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </form>
        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        {reviews.map((r, i) => (
          <div key={i} className="mb-3 border-b pb-2 flex flex-col space-y-1">
            {editingIdx === i ? (
              <>
                <textarea
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  className="border p-2 rounded"
                />
                <div className="space-x-2">
                  <button onClick={saveEdit} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
                  <button onClick={cancelEdit} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p>{r.text}</p>
                <span className="text-xs text-gray-500">{new Date(r.date).toLocaleString()}</span>
                {auth.currentUser && r.uid === auth.currentUser.uid && (
                  <div className="space-x-2 mt-1">
                    <button onClick={() => startEdit(i)} className="text-sm text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(i)} className="text-sm text-red-600">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
    </PageLayout>
  )
}
