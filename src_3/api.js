// ----------------------------------------------------------------
// Ye file backend (http://localhost:5000) ko call karti hai
// (jaisa original backend.js / package.json me tha - Express + MongoDB).
// Agar backend nahi chal raha, to automatically localStorage me
// hi account/scores save ho jate hai - taki game bina backend ke
// bhi turant khel sako. Jab tumhara Node/Express/Mongo server
// ready ho jaye, ye khud usko use karna shuru kar dega.
// ----------------------------------------------------------------

const API_BASE = 'http://localhost:5000'

async function tryBackend(path, options) {
  try {
    const res = await fetch(`${API_BASE}${path}`, options)
    if (!res.ok) throw new Error('Server error')
    return await res.json()
  } catch (err) {
    return null // backend uplabdh nahi hai -> fallback use karo
  }
}

function getLocalUsers() {
  return JSON.parse(localStorage.getItem('rockstar_users') || '[]')
}
function saveLocalUsers(users) {
  localStorage.setItem('rockstar_users', JSON.stringify(users))
}

export async function createAccount(userData) {
  const result = await tryBackend('/create-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  if (result) return result

  const users = getLocalUsers()
  if (users.some((u) => u.username === userData.username)) {
    return { success: false, message: 'Ye username pehle se maujood hai!' }
  }
  users.push(userData)
  saveLocalUsers(users)
  return { success: true, user: userData }
}

export async function loginUser(username, password) {
  const result = await tryBackend('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (result) return result

  const users = getLocalUsers()
  const found = users.find((u) => u.username === username && u.password === password)
  if (found) return { success: true, user: found }
  return { success: false, message: 'Galat username ya password.' }
}

export async function addScore(username, score) {
  const result = await tryBackend('/add-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, score }),
  })
  if (result) return result

  const scores = JSON.parse(localStorage.getItem('rockstar_scores') || '[]')
  scores.push({ username, score, date: Date.now() })
  localStorage.setItem('rockstar_scores', JSON.stringify(scores))
  return { success: true }
}

export async function getScores() {
  const result = await tryBackend('/get-scores', { method: 'GET' })
  if (result) return result

  const scores = JSON.parse(localStorage.getItem('rockstar_scores') || '[]')
  return [...scores].sort((a, b) => a.score - b.score)
}
