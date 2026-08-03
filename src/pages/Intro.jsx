import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser, createAccount } from '../api'

function Intro() {
  // stage: start -> logo -> login -> create
  const [stage, setStage] = useState('start')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginMsg, setLoginMsg] = useState('')
  const [loginOk, setLoginOk] = useState(false)

  const [newUsername, setNewUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [favoriteColor, setFavoriteColor] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [createMsg, setCreateMsg] = useState('')

  const introSoundRef = useRef(null)
  const { user, login } = useAuth()
  const navigate = useNavigate()

  // Agar pehle se login hai, seedha home pe le jao (jaisa original session-check)
  useEffect(() => {
    if (user) navigate('/home')
  }, [user, navigate])

  const handleStart = () => {
    setStage('logo')
    if (introSoundRef.current) {
      introSoundRef.current.volume = 0.5
      introSoundRef.current.play().catch(() => {
        console.log('Autoplay blocked')
      })
    }

    // ~3.5s logo animation, then straight to login
    setTimeout(() => {
      if (introSoundRef.current) {
        introSoundRef.current.pause()
        introSoundRef.current.currentTime = 0
      }
      setStage('login')
    }, 3500)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setLoginMsg('⚠️ Username aur password dono bharo!')
      setLoginOk(false)
      return
    }

    const data = await loginUser(username, password)
    if (data.success) {
      setLoginMsg('✅ Successfully Logged In!')
      setLoginOk(true)
      login(data.user)
      setTimeout(() => navigate('/home'), 400)
    } else {
      setLoginMsg('❌ ' + (data.message || 'Login fail ho gaya.'))
      setLoginOk(false)
    }
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    if (newUsername && fullName && newPassword) {
      const userData = {
        username: newUsername,
        fullName,
        favoriteColor,
        password: newPassword,
        achievements: [],
      }
      const data = await createAccount(userData)
      if (data.success) {
        login(data.user)
        navigate('/home')
      } else {
        setCreateMsg(data.message || 'Account create nahi ho paya.')
      }
    } else {
      setCreateMsg('Sab fields bharna zaroori hai!')
    }
  }

  return (
    <div className="screen-wrapper">
      <audio ref={introSoundRef} src={`${import.meta.env.BASE_URL}music/game_new.mp3`} />

      {stage === 'start' && (
        <div style={{ textAlign: 'center' }}>
          <button id="startButton" onClick={handleStart}>
            Let's Play
          </button>
          <p className="intro-tagline">🎮 Guess the Secret Number (1-100)</p>
        </div>
      )}

      {stage === 'logo' && (
        <div id="logo-container">
          <div id="logo">R</div>
          <div id="star">★</div>
        </div>
      )}

      {stage === 'login' && (
        <div id="login-screen" className="card">
          <h2>Welcome to the Game!</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p id="forgotPassword">Forgot Password?</p>
            <button type="submit">Login</button>
          </form>
          <button
            type="button"
            onClick={() => {
              setStage('create')
              setCreateMsg('')
            }}
          >
            Create Account
          </button>
          {loginMsg && (
            <p style={{ color: loginOk ? '#16a34a' : '#dc2626', marginTop: '10px' }}>
              {loginMsg}
            </p>
          )}
        </div>
      )}

      {stage === 'create' && (
        <div id="create-account-screen" className="card">
          <button className="back-btn" type="button" onClick={() => setStage('login')}>
            Back
          </button>
          <h2>Create Account</h2>
          <form onSubmit={handleCreateAccount}>
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Favorite Color"
              value={favoriteColor}
              onChange={(e) => setFavoriteColor(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit">Create Account</button>
          </form>
          {createMsg && <p style={{ color: '#dc2626', marginTop: '10px' }}>{createMsg}</p>}
        </div>
      )}
    </div>
  )
}

export default Intro
