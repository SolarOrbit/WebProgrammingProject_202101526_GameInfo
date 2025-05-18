// src/api/game.js
import axios from 'axios'

const BASE_URL = 'https://api.rawg.io/api'
const API_KEY  = import.meta.env.VITE_RAWG_API_KEY

/**
 * 게임 검색 (검색어, 장르, 정렬, 페이지 지원)
 * @param {string} query 검색어
 * @param {string} genre 장르 필터 (값이 없으면 전체)
 * @param {string} ordering 정렬 기준
 * @param {number} page 페이지 번호
 * @param {number} pageSize 페이지당 결과 수
 */
export async function searchGames(query, genre = '', ordering = '', page = 1, pageSize = 20) {
  const params = { key: API_KEY, search: query, page, page_size: pageSize }
  if (genre) params.genres = genre
  if (ordering) params.ordering = ordering
  const res = await axios.get(`${BASE_URL}/games`, { params })
  return res.data.results
}

export async function getGameDetail(id) {
  const res = await axios.get(`${BASE_URL}/games/${id}`, { params: { key: API_KEY } })
  return res.data
}

export async function getGameScreenshots(id) {
  const res = await axios.get(`${BASE_URL}/games/${id}/screenshots`, { params: { key: API_KEY } })
  return res.data.results
}

/**
 * 게임 트레일러(무비) 목록 조회
 * @param {number|string} id 게임 ID
 * @returns {Promise<Array>} [{ id, name, preview, data: { max: URL, ... } }, ...]
 */
export async function getGameTrailers(id) {
  const res = await axios.get(`${BASE_URL}/games/${id}/movies`, {
    params: { key: API_KEY }
  });
  return res.data.results;
}