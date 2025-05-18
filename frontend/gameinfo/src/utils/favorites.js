// src/utils/favorites.js
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db, auth } from '../firebase'

// 유저별 즐겨찾기 문서 참조, 로그인 안 된 경우 null 반환
const favDocRef = () => {
  if (!auth.currentUser) return null
  return doc(db, 'favorites', auth.currentUser.uid)
}

/** 즐겨찾기 목록 가져오기 */
export async function getFavorites() {
  const ref = favDocRef()
  if (!ref) return []
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { gameIds: [] })
    return []
  }
  return snap.data().gameIds || []
}

/** 특정 게임이 즐겨찾기에 있는지 */
export async function isFavorite(id) {
  const ref = favDocRef()
  if (!ref) return false
  const favs = await getFavorites()
  return favs.includes(id)
}

/** 즐겨찾기 추가 */
export async function addFavorite(id) {
  const ref = favDocRef()
  if (!ref) return
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { gameIds: [id] })
  } else {
    await updateDoc(ref, { gameIds: arrayUnion(id) })
  }
}

/** 즐겨찾기 제거 */
export async function removeFavorite(id) {
  const ref = favDocRef()
  if (!ref) return
  await updateDoc(ref, { gameIds: arrayRemove(id) })
}

/** 즐겨찾기 토글 */
export async function toggleFavorite(id) {
  const ref = favDocRef()
  if (!ref) return
  const favs = await getFavorites()
  if (favs.includes(id)) {
    await removeFavorite(id)
  } else {
    await addFavorite(id)
  }
}
