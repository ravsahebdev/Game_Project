// Shared game data (accounts, scores, live stats) via Firestore.
// Falls back to this browser's localStorage only if Firebase hasn't
// been configured yet in src/firebaseConfig.js.

import { db } from './firebaseConfig'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  increment,
} from 'firebase/firestore'

function getLocalUsers() {
  return JSON.parse(localStorage.getItem('game_users') || '[]')
}
function saveLocalUsers(users) {
  localStorage.setItem('game_users', JSON.stringify(users))
}

export async function createAccount(userData) {
  if (!db) {
    const users = getLocalUsers()
    if (users.some((u) => u.username === userData.username)) {
      return { success: false, message: 'Ye username pehle se maujood hai!' }
    }
    users.push(userData)
    saveLocalUsers(users)
    return { success: true, user: userData }
  }

  try {
    const ref = doc(db, 'users', userData.username)
    const existing = await getDoc(ref)
    if (existing.exists()) {
      return { success: false, message: 'Ye username pehle se maujood hai!' }
    }
    const newUser = {
      ...userData,
      gamesPlayed: 0,
      bestScore: null,
      firstTryWins: 0,
      createdAt: Date.now(),
    }
    await setDoc(ref, newUser)
    return { success: true, user: newUser }
  } catch (err) {
    console.error('[createAccount] Firestore error:', err)
    return { success: false, message: 'Connection error, dobara try karo.' }
  }
}

export async function loginUser(username, password) {
  if (!db) {
    const users = getLocalUsers()
    const found = users.find((u) => u.username === username && u.password === password)
    if (found) return { success: true, user: found }
    return { success: false, message: 'Galat username ya password.' }
  }

  try {
    const ref = doc(db, 'users', username)
    const snap = await getDoc(ref)
    if (!snap.exists()) return { success: false, message: 'Ye username maujood nahi hai.' }
    const user = snap.data()
    if (user.password !== password) return { success: false, message: 'Galat password.' }
    return { success: true, user }
  } catch (err) {
    console.error('[loginUser] Firestore error:', err)
    return { success: false, message: 'Connection error, dobara try karo.' }
  }
}

export async function addScore(username, score) {
  if (!db) {
    const scores = JSON.parse(localStorage.getItem('game_scores') || '[]')
    scores.push({ username, score, date: Date.now() })
    localStorage.setItem('game_scores', JSON.stringify(scores))
    if (score === 1) {
      const achievements = JSON.parse(localStorage.getItem('achievements')) || { firstAttemptWins: 0 }
      achievements.firstAttemptWins++
      localStorage.setItem('achievements', JSON.stringify(achievements))
    }
    return { success: true }
  }

  try {
    await addDoc(collection(db, 'scores'), { username, score, date: Date.now() })

    const userRef = doc(db, 'users', username)
    const snap = await getDoc(userRef)
    if (snap.exists()) {
      const data = snap.data()
      const bestScore = data.bestScore == null ? score : Math.min(data.bestScore, score)
      const updates = { gamesPlayed: increment(1), bestScore }
      if (score === 1) updates.firstTryWins = increment(1)
      await updateDoc(userRef, updates)
    }
    return { success: true }
  } catch (err) {
    console.error('[addScore] Firestore error:', err)
    return { success: false }
  }
}

export async function getScores(limitCount = 20) {
  if (!db) {
    const scores = JSON.parse(localStorage.getItem('game_scores') || '[]')
    return [...scores].sort((a, b) => a.score - b.score).slice(0, limitCount)
  }

  try {
    const q = query(collection(db, 'scores'), orderBy('score', 'asc'), limit(limitCount))
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data())
  } catch (err) {
    console.error('[getScores] Firestore error:', err)
    return []
  }
}

// Live subscription to a user's profile stats (games played, best score, etc).
// Returns an unsubscribe function. No-ops (returns a dummy unsubscribe) if
// Firebase isn't configured, since local mode has no realtime concept.
export function subscribeToUser(username, callback) {
  if (!db || !username) return () => {}
  const ref = doc(db, 'users', username)
  const unsubscribe = onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data())
  })
  return unsubscribe
}
