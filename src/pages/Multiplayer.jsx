import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebaseConfig'
import { doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore'

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

function Multiplayer() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const myName = user?.username || 'Player'

  const [joinCode, setJoinCode] = useState('')
  const [room, setRoom] = useState(null)
  const [guess, setGuess] = useState('')
  const [error, setError] = useState('')
  const unsubRef = useRef(null)

  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current()
    }
  }, [])

  const listenToRoom = (code) => {
    if (unsubRef.current) unsubRef.current()
    unsubRef.current = onSnapshot(doc(db, 'rooms', code), (snap) => {
      if (snap.exists()) setRoom({ code, ...snap.data() })
    })
  }

  const handleCreateRoom = async () => {
    if (!db) {
      setError('Multiplayer ke liye Firebase setup zaroori hai (README.md dekho).')
      return
    }
    const code = generateRoomCode()
    const secretNumber = Math.floor(Math.random() * 100) + 1
    await setDoc(doc(db, 'rooms', code), {
      host: myName,
      guest: null,
      secretNumber,
      status: 'waiting',
      guesses: [],
      winner: null,
      createdAt: Date.now(),
    })
    listenToRoom(code)
  }

  const handleJoinRoom = async () => {
    if (!db) {
      setError('Multiplayer ke liye Firebase setup zaroori hai (README.md dekho).')
      return
    }
    const code = joinCode.trim().toUpperCase()
    if (!code) {
      setError('Room code daalo!')
      return
    }
    const ref = doc(db, 'rooms', code)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      setError('Ye room nahi mila. Code check karo.')
      return
    }
    const data = snap.data()
    if (data.guest && data.guest !== myName && data.host !== myName) {
      setError('Ye room already full hai.')
      return
    }
    if (!data.guest && data.host !== myName) {
      await updateDoc(ref, { guest: myName, status: 'playing' })
    }
    setError('')
    listenToRoom(code)
  }

  const handleGuess = async () => {
    if (!room || room.status === 'finished') return
    const num = Number(guess)
    if (!guess || num < 1 || num > 100 || Number.isNaN(num)) {
      setError('1 se 100 ke beech valid number daalo!')
      return
    }
    setError('')
    const ref = doc(db, 'rooms', room.code)
    const isCorrect = num === room.secretNumber
    await updateDoc(ref, {
      guesses: arrayUnion({ username: myName, guess: num, correct: isCorrect, at: Date.now() }),
      ...(isCorrect ? { status: 'finished', winner: myName } : {}),
    })
    setGuess('')
  }

  const leaveRoom = () => {
    if (unsubRef.current) unsubRef.current()
    setRoom(null)
    setJoinCode('')
    setError('')
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') handleGuess()
  }

  // ---------- Lobby ----------
  if (!room) {
    return (
      <div className="screen-wrapper">
        <div id="multiplayer-screen" className="card has-back">
          <button className="back-btn" onClick={() => navigate('/home')}>
            Back
          </button>
          <h2>⚔️ 1v1 Duel</h2>
          <p>
            Room banao ya dost ke room code se judo — dono ko wahi secret number guess karna hai,
            jo pehle sahi bataye wo jeetega!
          </p>
          <button onClick={handleCreateRoom}>Create Room</button>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button onClick={handleJoinRoom}>Join Room</button>
          {error && <p style={{ color: '#ff4d6d', marginTop: 10 }}>{error}</p>}
        </div>
      </div>
    )
  }

  // ---------- Waiting for opponent ----------
  if (room.status === 'waiting') {
    return (
      <div className="screen-wrapper">
        <div id="multiplayer-screen" className="card has-back">
          <button className="back-btn" onClick={leaveRoom}>
            Back
          </button>
          <h2>Waiting for opponent…</h2>
          <div className="attempts-badge">Room Code: {room.code}</div>
          <p style={{ marginTop: 14 }}>
            Ye code apne dost ko bhejo. Jab wo "Join Room" karega, duel turant shuru ho jayega.
          </p>
        </div>
      </div>
    )
  }

  // ---------- Active / finished duel ----------
  return (
    <div className="screen-wrapper">
      <div id="multiplayer-screen" className="card has-back">
        <button className="back-btn" onClick={leaveRoom}>
          Back
        </button>
        <h2>⚔️ Room {room.code}</h2>
        <p>
          {room.host} vs {room.guest || '...'}
        </p>

        {room.status === 'finished' ? (
          <p className="message-banner correct">🏆 {room.winner} jeet gaya!</p>
        ) : (
          <>
            <input
              type="number"
              placeholder="Guess 1-100"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyUp={handleKeyUp}
            />
            <button onClick={handleGuess}>Guess</button>
          </>
        )}
        {error && <p style={{ color: '#ff4d6d' }}>{error}</p>}

        {room.guesses?.length > 0 && (
          <ul style={{ marginTop: 16, maxHeight: 220, overflowY: 'auto' }}>
            {[...room.guesses].reverse().map((g, i) => (
              <li key={i}>
                {g.correct ? '🎯' : '❌'} {g.username}: {g.guess}
              </li>
            ))}
          </ul>
        )}

        {room.status === 'finished' && <button onClick={leaveRoom}>Play Again</button>}
      </div>
    </div>
  )
}

export default Multiplayer
