// src/pages/Favorites.jsx
import React, { useState, useEffect, useContext } from 'react'; // useContext 추가
import { Link } from 'react-router-dom'; // Link 추가
import { getFavorites } from '../utils/favorites';
import { getGameDetail } from '../api/game';
import GameCard from '../components/GameCard';
import PageLayout from '../components/PageLayout'; // PageLayout 임포트
import { AuthContext } from '../contexts/AuthContext'; // AuthContext 임포트
import { Heart, Search, Star } from 'lucide-react'; // 아이콘 임포트

export default function Favorites() {
  const { user } = useContext(AuthContext); // 사용자 정보 가져오기
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 사용자가 로그인한 경우에만 즐겨찾기를 가져옵니다.
    if (!user) {
      setLoading(false);
      setGames([]); // 로그인하지 않았으면 게임 목록 비움
      return;
    }

    let mounted = true;
    async function fetchFavorites() {
      setLoading(true); // 로딩 상태 시작
      try {
        const ids = await getFavorites();
        if (!mounted) return;

        // 즐겨찾기 ID가 있을 때만 상세 정보 요청
        if (ids && ids.length > 0) {
          const details = await Promise.all(ids.map(id => getGameDetail(id).catch(err => {
            console.error(`Failed to fetch details for game ${id}:`, err);
            return null; // 특정 게임 정보 로드 실패 시 null 반환
          })));
          if (!mounted) return;
          setGames(details.filter(game => game !== null)); // null이 아닌 게임만 상태에 저장
        } else {
          setGames([]); // ID가 없으면 빈 배열로 설정
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        if (mounted) setGames([]); // 에러 발생 시 빈 배열로
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchFavorites();
    return () => { mounted = false; };
  }, [user]); // user가 변경될 때마다 useEffect 재실행

  // 로그인하지 않은 사용자 UI
  if (!user && !loading) {
    return (
      <PageLayout>
        <div className="text-center py-20 px-6">
          <Heart size={64} className="mx-auto text-gray-400 dark:text-gray-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">내 즐겨찾기 게임</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            즐겨찾기를 보려면 <Link to="/login" className="text-blue-500 hover:underline dark:text-blue-400">로그인</Link> 해주세요.
          </p>
        </div>
      </PageLayout>
    );
  }


  // 로딩 중 UI
  if (loading) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading your favorites...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-screen-xl mx-auto px-4 py-8"> {/* PageLayout 내부에서 최대 너비 조정 */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
            <Heart size={36} className="mr-3 text-red-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">내 즐겨찾기 게임</h1>
          </div>
          {games.length > 0 && (
            <p className="text-md text-gray-600 dark:text-gray-400">
              <span className="font-bold text-blue-600 dark:text-blue-400">{games.length}</span>개의 즐겨찾기 게임이 있습니다.
            </p>
          )}
        </div>

        {games.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <Search size={64} className="mx-auto text-gray-400 dark:text-gray-500 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">이런! 아직 즐겨찾기가 없습니다!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              즐겨찾기에 추가한 게임이 없습니다.
              <br />
              게임을 탐색하고 <Star size={16} className="inline align-baseline mx-1 text-yellow-400" /> 아이콘을 클릭하여 즐겨찾기에 저장하세요.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Search size={20} className="mr-2" /> 게임 탐색
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {games.map(game => (
              game && <GameCard key={game.id} game={game} /> // game 객체가 유효한지 한번 더 확인
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}