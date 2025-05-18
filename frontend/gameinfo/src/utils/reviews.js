// src/utils/reviews.js
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db, auth } from '../firebase'

const reviewDocRef = gameId => doc(db, 'reviews', gameId)

export async function getReviews(gameId) {
  const ref = reviewDocRef(gameId)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { comments: [] })
    return []
  }
  return snap.data().comments || []
}

export async function addReview(gameId, text) {
  const ref = reviewDocRef(gameId)
  const snap = await getDoc(ref)
  const comment = { uid: auth.currentUser.uid, text, date: Date.now() }
  if (!snap.exists()) {
    await setDoc(ref, { comments: [comment] })
  } else {
    await updateDoc(ref, { comments: arrayUnion(comment) })
  }
}

/** 리뷰 삭제 */
export async function deleteReview(gameId, index) {
  const ref = reviewDocRef(gameId)
  const snap = await getDoc(ref)
  const comments = snap.exists() ? snap.data().comments : []
  comments.splice(index, 1)
  await updateDoc(ref, { comments })
}

/** 리뷰 수정 */
export async function editReview(gameId, index, newText) {
  const ref = reviewDocRef(gameId)
  const snap = await getDoc(ref)
  const comments = snap.exists() ? snap.data().comments : []
  if (comments[index]) {
    comments[index].text = newText
    comments[index].date = Date.now()
    await updateDoc(ref, { comments })
  }
}
