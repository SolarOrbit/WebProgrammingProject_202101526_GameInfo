// src/pages/GameDetail.jsx
import React, { useEffect, useState, useContext } from 'react'; // useContext 추가 (AuthContext 사용 가능성)
import { useNavigate, useParams } from 'react-router-dom';
import { getGameDetail, getGameScreenshots, getGameTrailers } from '../api/game';
import { isFavorite, toggleFavorite } from '../utils/favorites';
import { getReviews, addReview, deleteReview, editReview } from '../utils/reviews';
import { auth } from '../firebase'; // auth는 이미 import 되어 있음
import { AuthContext } from '../contexts/AuthContext'; // 사용자 로그인 상태 확인용
import { Star, ArrowLeft, Edit3, Trash2, ThumbsUp, MessageCircle, ExternalLink, ShoppingCart } from 'lucide-react'; // 아이콘 추가
import Modal from 'react-modal';
import PageLayout from '../components/PageLayout';
import ExpandableText from '../components/ExpandableText'; // ExpandableText 컴포넌트 임포트

Modal.setAppElement('#root');

// 점수 배지 컴포넌트 (GameCard와 유사하게 사용)
const RatingBadge = ({ score, type, large = false }) => {
  if (!score && type !== 'user') return null;

  let bgColorClass = 'bg-gray-400 dark:bg-gray-600';
  let textColorClass = 'text-white';
  let icon = null;
  let label = '';

  if (type === 'metacritic') {
    label = '메타스코어';
    if (score >= 75) bgColorClass = 'bg-green-500 hover:bg-green-600';
    else if (score >= 50) bgColorClass = 'bg-yellow-500 hover:bg-yellow-600';
    else if (score > 0) bgColorClass = 'bg-red-500 hover:bg-red-600';
  } else if (type === 'user') {
    label = '유저 평점';
    icon = <ThumbsUp size={large ? 18 : 14} className="mr-1.5" />;
    if (score >= 4) bgColorClass = 'bg-blue-500 hover:bg-blue-600'; // 유저 평점 색상 변경
    else if (score >= 2.5) bgColorClass = 'bg-yellow-500 hover:bg-yellow-600';
    else if (score > 0) bgColorClass = 'bg-red-500 hover:bg-red-600';
  }

  const scoreText = score ? (type === 'user' ? score.toFixed(1) : score) : 'N/A';
  const textSizeClass = large ? 'text-lg px-4 py-2' : 'text-sm px-3 py-1';

  return (
    <div className={`flex flex-col items-center justify-center rounded-lg shadow-md transition-all ${bgColorClass} ${textColorClass} ${textSizeClass}`}>
      <span className={`font-semibold ${large ? 'text-2xl' : 'text-xl'}`}>{scoreText}</span>
      <span className={`text-xs uppercase mt-1 ${large ? 'opacity-80' : 'opacity-70'}`}>{label}</span>
    </div>
  );
};


export default function GameDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext); // 현재 사용자 정보 가져오기

  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [fav, setFav] = useState(false);
  const [loadingGame, setLoadingGame] = useState(true);
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoadingGame(true);
      try {
        const data = await getGameDetail(id);
        setGame(data);
        if (user) { // 로그인한 경우에만 즐겨찾기 상태 확인
          setFav(await isFavorite(data.id));
        }
        setScreenshots(await getGameScreenshots(id));
        setTrailers(await getGameTrailers(id));
        setReviews(await getReviews(id));
      } catch (error) {
        console.error("Failed to fetch game data:", error);
        // 여기에 에러 처리 로직 추가 (예: 에러 페이지로 이동 또는 알림)
      } finally {
        setLoadingGame(false);
      }
    }
    fetchData();
  }, [id, user]); // user를 의존성 배열에 추가 (로그인 상태 변경 시 fav 업데이트)
  //https://api.rawg.io/api/games/3498?key=67f46bb51e684906a784c4585be988ee
   // gameStores 변수 정의 수정
  const gameStores = game
    ? game.stores
        ?.map(storeEntry => {
          let generatedUrl = '';
          const storeSlug = storeEntry.store?.slug;
          const storeDomain = storeEntry.store?.domain;
          const storeName = storeEntry.store?.name;

          if (storeEntry.url && storeEntry.url.trim() !== "") {
            generatedUrl = storeEntry.url;
          }
          else if (storeDomain && game.name) {
            if (storeSlug === 'steam') {
              generatedUrl = `https://${storeDomain}/search/?term=${encodeURIComponent(game.name)}`;
            } else if (storeSlug === 'epic-games') {
              // 제공해주신 Epic Games Store 검색 URL 패턴 적용
              // 언어 코드 'ko'는 상황에 따라 포함하거나 제외할 수 있습니다.
              // 여기서는 기본적인 검색을 위해 q 파라미터만 사용하거나, 제공된 패턴을 단순화합니다.
              generatedUrl = `https://${storeDomain}/ko/browse?q=${encodeURIComponent(game.name)}&sortBy=relevancy&sortDir=DESC`;
              // 더 단순하게는: generatedUrl = `https://${storeDomain}/store/search?q=${encodeURIComponent(game.name)}`;
              // 또는, 게임 이름으로 직접 제품을 찾는 패턴이 있다면 (예: /store/p/게임-슬러그) 그것을 사용할 수 있지만,
              // RAWG API에서 Epic Games Store의 제품 슬러그를 제공하는지는 확인 필요.
              // 현재는 검색 결과로 연결하는 것이 가장 안전합니다.
            }
          }

          return {
            ...storeEntry,
            url: generatedUrl,
            storeInfo: storeEntry.store,
          };
        })
        .filter(s => {
          const isValidUrl = s.url && s.url.trim() !== "";
          const isSteam = s.storeInfo?.slug === 'steam';
          const isEpic = s.storeInfo?.slug === 'epic-games';
          return isValidUrl && (isSteam || isEpic);
        })
    : [];


  if (loadingGame) {
    // 로딩 스켈레톤 UI (기존 유지 또는 개선)
    return (
      <PageLayout>
        <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse mx-auto"></div>
          <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="flex justify-between animate-pulse">
            <div className="h-16 w-32 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-16 w-32 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-3 animate-pulse">
              {[...Array(5)].map((_, i) => <div key={i} className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>)}
            </div>
            <div className="space-y-3 animate-pulse">
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-4/6 mb-2"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mt-1"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!game) {
    return <PageLayout><p className="text-center text-xl py-10">Game data could not be loaded.</p></PageLayout>;
  }

  const onToggleFavorite = async () => {
    if (!user) {
      alert('Please login to add favorites.');
      navigate('/login');
      return;
    }
    await toggleFavorite(game.id);
    setFav(prev => !prev);
  };

  const openTrailer = () => trailers.length > 0 && setIsTrailerOpen(true);
  const closeTrailer = () => setIsTrailerOpen(false);
  const openScreenshot = idx => { setScreenshotIndex(idx); setIsScreenshotOpen(true); };
  const closeScreenshot = () => setIsScreenshotOpen(false);
  const prevScreenshot = () => setScreenshotIndex((screenshotIndex + screenshots.length - 1) % screenshots.length);
  const nextScreenshot = () => setScreenshotIndex((screenshotIndex + 1) % screenshots.length);

  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (!user) {
      alert('Please login to write a review.');
      navigate('/login');
      return;
    }
    if (!newReview.trim()) return;
    await addReview(id, newReview.trim());
    setReviews(await getReviews(id)); // 리뷰 목록 즉시 업데이트
    setNewReview('');
  };

  const handleDeleteReview = async (reviewId, index) => { // reviewId 대신 index를 사용 (현재 구조)
    await deleteReview(id, index);
    setReviews(await getReviews(id));
  };

  const startEditReview = (index, text) => {
    setEditingIdx(index);
    setEditingText(text);
  };

  const saveEditReview = async () => {
    if (editingIdx === null) return;
    await editReview(id, editingIdx, editingText);
    setReviews(await getReviews(id));
    setEditingIdx(null);
    setEditingText('');
  };

  const cancelEditReview = () => {
    setEditingIdx(null);
    setEditingText('');
  };

  const trailerUrl = trailers[0]?.data?.max || trailers[0]?.data?.['480'] || trailers[0]?.preview;
  const pcPlatform = game.platforms?.find(p => p.platform.slug === 'pc');

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
        {/* 최상단: 뒤로가기, 제목, 즐겨찾기 */}
        <div className="flex items-center justify-between mb-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-center px-4 truncate flex-1">
            {game.name}
          </h1>
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full transition-colors ${fav ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-400 hover:text-gray-500 dark:hover:text-yellow-400'}`}
            aria-label="Toggle Favorite"
          >
            <Star size={30} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* 대표 이미지 (16:9 비율) */}
        <div className="aspect-video w-full rounded-xl shadow-2xl overflow-hidden mb-8 bg-gray-200 dark:bg-gray-800">
          {game.background_image ? (
            <img src={game.background_image} alt={`${game.name} background`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
          )}
        </div>
        
        {/* 트레일러 버튼 (이미지 아래 또는 원하는 위치에) */}
        {trailerUrl && (
          <div className="text-center mb-8">
            <button
              onClick={openTrailer}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              트레일러 보기
            </button>
          </div>
        )}

        {/* 메타크리틱 & 유저 레이팅 */}
        <div className="flex justify-around items-stretch gap-4 md:gap-8 mb-8">
          <RatingBadge score={game.metacritic} type="metacritic" large />
          <RatingBadge score={game.rating} type="user" large />
        </div>

      {/* 판매처 링크 버튼 섹션 */}
        {game && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
              <ShoppingCart size={26} className="mr-3 text-blue-500" /> 상점으로 이동
            </h2>
            {gameStores && gameStores.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {gameStores.map(storeEntry => (
                  <a
                    key={storeEntry.store.id}
                    href={storeEntry.url} // 여기서 수정된 url 사용
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 ease-in-out group"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {storeEntry.store.name}
                    </span>
                    <ExternalLink size={20} className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 py-3 text-center">
                현재 이용 가능한 상점이 없습니다. 😢
              </p>
            )}
          </div>
        )}

        {/* 정보 섹션 (좌우 구분) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            {/* 왼쪽 정보 */}
            <div className="space-y-3 md:pr-8 md:border-r md:border-gray-300 dark:md:border-gray-600">
              {[
                { label: "개발사", value: game.developers?.map(d => d.name).join(', ') || 'N/A' },
                { label: "배급사", value: game.publishers?.map(p => p.name).join(', ') || 'N/A' },
                { label: "장르", value: game.genres?.map(g => g.name).join(', ') || 'N/A' },
                { label: "플렛폼", value: game.platforms?.map(p => p.platform.name).join(', ') || 'N/A' },
                { label: "출시일", value: game.released ? new Date(game.released).toLocaleDateString() : 'N/A' },
              ].map((item, index, arr) => (
                <div key={item.label} className={`py-2 ${index < arr.length -1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                  <strong className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">{item.label}</strong>
                  <span className="text-gray-800 dark:text-gray-100">{item.value}</span>
                </div>
              ))}
            </div>

            {/* 오른쪽 정보 (요구사항) */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">시스템 요구사항 (PC)</h3>
              {pcPlatform?.requirements?.minimum || pcPlatform?.requirements?.recommended ? (
                <>
                  {pcPlatform.requirements.minimum && (
                    <div className="mb-3"> {/* 각 요구사항 섹션 간 여백 */}
                      <strong className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">최소:</strong>
                      <ExpandableText text={pcPlatform.requirements.minimum} maxLength={150} />
                    </div>
                  )}
                  {pcPlatform.requirements.recommended && (
                    <div>
                      <strong className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">권장:</strong>
                      <ExpandableText text={pcPlatform.requirements.recommended} maxLength={150} />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">PC용 권장사항이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
        
         {/* 게임 설명 (별도 카드로 분리) */}
        {game.description_raw && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                    설명
                </h2>
                {/* ExpandableText 컴포넌트 사용 */}
                <ExpandableText text={game.description_raw} maxLength={500} />
            </div>
        )}


        {/* 스크린샷 갤러리 */}
        {screenshots && screenshots.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">스크린샷</h2>
            <div className="flex space-x-4 overflow-x-auto py-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
              {screenshots.map((ss, idx) => (
                <img
                  key={ss.id}
                  src={ss.image}
                  alt={`Screenshot ${idx + 1}`}
                  className="flex-shrink-0 w-72 h-auto object-cover rounded-lg snap-center cursor-pointer hover:opacity-80 transition-opacity shadow-md hover:shadow-xl"
                  onClick={() => openScreenshot(idx)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 유저 리뷰 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
            <MessageCircle size={28} className="inline mr-2 align-bottom" /> 유저 리뷰
          </h2>
          {user && ( // 로그인한 사용자만 리뷰 작성 폼 표시
            <form onSubmit={handleReviewSubmit} className="mb-6">
              <textarea
                value={newReview}
                onChange={e => setNewReview(e.target.value)}
                placeholder="게임에 대한 생각을 공유하세요..."
                className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 resize-none"
                rows="4"
              />
              <button
                type="submit"
                className="mt-3 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                리뷰 제출
              </button>
            </form>
          )}
          {!user && (
            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              <Link to="/login" className="text-blue-500 hover:underline">로그인</Link> 후 리뷰를 작성하세요.
            </p>
          )}

          {reviews.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-4">아직 리뷰가 없습니다. 첫 번째 리뷰를 작성하세요!</p>}
          <div className="space-y-6">
            {reviews.map((r, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700/50">
                {editingIdx === i ? (
                  <div className="space-y-3">
                    <textarea
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 resize-none"
                      rows="3"
                    />
                    <div className="flex space-x-2 justify-end">
                      <button onClick={saveEditReview} className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors">저장</button>
                      <button onClick={cancelEditReview} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-sm rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">취소</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-800 dark:text-gray-200 mb-1.5">{r.text}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>User: {r.uid.substring(0, 8)}...</span> {/* UID 일부 표시 또는 displayName 사용 */}
                      <span>{new Date(r.date).toLocaleString()}</span>
                    </div>
                    {auth.currentUser && r.uid === auth.currentUser.uid && (
                      <div className="mt-3 flex space-x-3 justify-end">
                        <button onClick={() => startEditReview(i, r.text)} className="text-sm text-blue-500 hover:underline flex items-center">
                          <Edit3 size={14} className="mr-1" /> 수정
                        </button>
                        <button onClick={() => handleDeleteReview(id, i)} className="text-sm text-red-500 hover:underline flex items-center">
                          <Trash2 size={14} className="mr-1" /> 삭제
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 트레일러 모달 (디자인은 현재와 유사하게 유지 또는 개선) */}
        <Modal
            isOpen={isTrailerOpen}
            onRequestClose={closeTrailer}
            style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
                content: { position: 'relative', background: 'transparent', border: 'none', padding: 0, width: '90vw', height: 'auto', maxWidth: '1200px' }
            }}
            contentLabel="Game Trailer Modal"
        >
            {trailerUrl && (
                <div className="aspect-video bg-black rounded-lg shadow-2xl overflow-hidden">
                    <video controls autoPlay src={trailerUrl} className="w-full h-full" />
                </div>
            )}
            <button onClick={closeTrailer} className="fixed top-5 right-5 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 z-10" aria-label="Close trailer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </Modal>

        {/* 스크린샷 모달 (이전 답변에서 버튼 위치 고정된 버전 사용) */}
        {/* ... 스크린샷 모달 코드 (버튼 위치 고정된 버전) ... */}
        <Modal
          isOpen={isScreenshotOpen}
          onRequestClose={closeScreenshot}
          style={{
            overlay: { backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
            content: { position: 'relative', background: 'transparent', border: 'none', padding: 0, overflow: 'visible', maxWidth: 'calc(100vw - 80px)', maxHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
          }}
          contentLabel="Screenshot Modal"
          shouldCloseOnOverlayClick={true}
        >
          <div className="relative flex items-center justify-center">
            {screenshots.length > 0 && screenshots[screenshotIndex] && (
              <img src={screenshots[screenshotIndex]?.image} alt={`Enlarged screenshot ${screenshotIndex + 1}`} className="block max-h-[calc(100vh-120px)] max-w-[calc(100vw-160px)] object-contain rounded-lg shadow-2xl" />
            )}
          </div>
          {screenshots.length > 1 && (
            <button onClick={prevScreenshot} className="fixed left-4 top-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all focus:outline-none" aria-label="Previous screenshot" style={{ zIndex: 1001 }} >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
          )}
          {screenshots.length > 1 && (
            <button onClick={nextScreenshot} className="fixed right-4 top-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all focus:outline-none" aria-label="Next screenshot" style={{ zIndex: 1001 }} >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          )}
          <button onClick={closeScreenshot} className="fixed top-5 right-5 p-2.5 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all focus:outline-none" aria-label="Close modal" style={{ zIndex: 1001 }} >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </Modal>

      </div>
    </PageLayout>
  );
}