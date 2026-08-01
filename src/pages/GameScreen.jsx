import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addScore } from '../api'

// Music file names - vahi rakhe hai jo original project me the.
// Bas inhe apne mp3 files ke saath public/music/ folder me daal do.
const victorySounds = [
  'song1.mp3', 'song2.mp3', 'song3.mp3', 'song4.mp3', 'song5.mp3', 'song7.mp3', 'song8.mp3',
  'song9.mp3', 'song10.mp3', 'song11.mp3', 'song12rav.mp3', 'song13.mp3', 'song14.mp3',
  'song15.mp3', 'song16.mp3', 'song20.mp3', 'song21.mp3', 'song22.mp3', 'song23.mp3',
  'song25.mp3', 'song26.mp3', 'Booyah.mp3',
]
const funnySounds = { 15: 'funny1.mp3', 20: 'funny2.mp3', 25: 'funny3.mp3' }

function GameScreen() {
  const [secretNumber, setSecretNumber] = useState(() => Math.floor(Math.random() * 100) + 1)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState('')
  const [messageClass, setMessageClass] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [confetti, setConfetti] = useState([])

  const bgMusicRef = useRef(null)
  const funnySoundRef = useRef(null)

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const bg = new Audio('/music/Free_Fire_All.mp3')
    bg.loop = true
    bg.volume = 0.5
    bgMusicRef.current = bg
    return () => {
      bg.pause()
    }
  }, [])

  const playBgMusic = () => {
    if (bgMusicRef.current && bgMusicRef.current.paused) {
      bgMusicRef.current.play().catch(() => {
        console.log('Autoplay blocked. Please interact with the page to play music.')
      })
    }
  }

  const handleInputChange = (e) => {
    setGuess(e.target.value)
    playBgMusic()
  }

  const createConfetti = () => {
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      color: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )})`,
      left: Math.random() * window.innerWidth,
      duration: Math.random() * 4 + 5,
      round: Math.random() > 0.5,
    }))
    setConfetti(pieces)
    setTimeout(() => setConfetti([]), 12000)
  }

  const checkGuess = async () => {
    if (gameOver) return

    const userGuess = Number(guess)
    if (!guess || userGuess < 1 || userGuess > 100 || Number.isNaN(userGuess)) {
      setMessage('⚠️ Enter a valid number between 1 and 100!')
      setMessageClass('warning')
      setGuess('')
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (userGuess === secretNumber && funnySoundRef.current) {
      funnySoundRef.current.pause()
      funnySoundRef.current.currentTime = 0
    }

    if (funnySounds[newAttempts] && userGuess !== secretNumber) {
      if (funnySoundRef.current) {
        funnySoundRef.current.pause()
        funnySoundRef.current.currentTime = 0
      }
      const funnySound = new Audio(`/music/${funnySounds[newAttempts]}`)
      funnySound.volume = 1.0
      if (bgMusicRef.current) bgMusicRef.current.volume = 0.2
      funnySound.play().catch(() => {})
      funnySound.onended = () => {
        if (bgMusicRef.current) bgMusicRef.current.volume = 0.5
      }
      funnySoundRef.current = funnySound
    }

    if (userGuess === secretNumber) {
      setMessage(`🎉 Congratulations! You guessed it in ${newAttempts} tries!`)
      setMessageClass('correct')
      setGameOver(true)
      if (bgMusicRef.current) bgMusicRef.current.volume = 0.2

      let victorySrc
      if (newAttempts === 1) {
        victorySrc = 'song61st.mp3'
      } else if (userGuess === 70) {
        victorySrc = 'songjethalal.mp3'
      } else if (userGuess === 60) {
        victorySrc = 'songpopatlal.mp3'
      } else {
        victorySrc = victorySounds[Math.floor(Math.random() * victorySounds.length)]
      }
      const victorySound = new Audio(`/music/${victorySrc}`)
      victorySound.play().catch(() => {})
      victorySound.onended = () => {
        if (bgMusicRef.current) bgMusicRef.current.volume = 0.5
      }

      createConfetti()
      addScore(user?.username || 'player1', newAttempts)

      if (newAttempts === 1) {
        const achievements = JSON.parse(localStorage.getItem('achievements')) || {
          firstAttemptWins: 0,
        }
        achievements.firstAttemptWins++
        localStorage.setItem('achievements', JSON.stringify(achievements))
      }
    } else {
      if (Math.abs(userGuess - secretNumber) <= 5) {
        setMessage("🔥 You're very close! Try again!")
        setMessageClass('close')
      } else {
        setMessage(userGuess < secretNumber ? '⬆️ Try a bigger number!' : '⬇️ Try a smaller number!')
        setMessageClass('wrong')
      }
      setGuess('')
    }
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') checkGuess()
  }

  const resetGame = () => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1)
    setAttempts(0)
    setMessage('')
    setMessageClass('')
    setGuess('')
    setGameOver(false)

    if (funnySoundRef.current) {
      funnySoundRef.current.pause()
      funnySoundRef.current.currentTime = 0
    }
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.5
      bgMusicRef.current.play().catch(() => {})
    }
  }

  return (
    <div className="screen-wrapper">
      <div id="game-container" className="card has-back">
        <button className="back-btn" onClick={() => navigate('/home')}>
          Back
        </button>
        <h2>🎯 Guess the Secret Number (1-100)</h2>
        <p id="message" className={`message-banner ${messageClass}`}>
          {message}
        </p>
        <input
          type="number"
          placeholder="Enter a number"
          min="1"
          max="100"
          value={guess}
          disabled={gameOver}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
        />
        <button onClick={checkGuess} disabled={gameOver}>
          Check
        </button>
        {gameOver && <button onClick={resetGame}>Play Again</button>}
        {attempts > 0 && (
          <div className="attempts-badge" id="attempts">
            🎲 Attempts: {attempts}
          </div>
        )}
      </div>

      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti"
          style={{
            backgroundColor: c.color,
            left: c.left,
            animationDuration: `${c.duration}s`,
            borderRadius: c.round ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}

export default GameScreen
