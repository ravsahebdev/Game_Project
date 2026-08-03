import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { subscribeToUser } from '../api'

function getInitials(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('')
}

function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!user?.username) return
    const unsubscribe = subscribeToUser(user.username, setStats)
    return () => unsubscribe && unsubscribe()
  }, [user])

  // Local-mode fallback (no Firebase configured yet) still shows something useful
  const localAchievements = JSON.parse(localStorage.getItem('achievements')) || { firstAttemptWins: 0 }

  const displayName = user?.fullName || user?.username || 'Player'
  const gamesPlayed = stats?.gamesPlayed ?? 0
  const bestScore = stats?.bestScore ?? '—'
  const firstTryWins = stats?.firstTryWins ?? localAchievements.firstAttemptWins ?? 0

  return (
    <div className="screen-wrapper">
      <div id="profile-screen" className="card has-back">
        <button className="back-btn" onClick={() => navigate('/home')}>
          Back
        </button>

        <div className="profile-avatar">{getInitials(displayName)}</div>
        <h2 className="profile-name">{displayName}</h2>
        <p className="profile-username">@{user?.username || 'guest'}</p>

        <div className="profile-stats-grid">
          <div className="stat-card">
            <span className="stat-value">{gamesPlayed}</span>
            <span className="stat-label">Games Played</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{bestScore}</span>
            <span className="stat-label">Best Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{firstTryWins}</span>
            <span className="stat-label">First-Try Wins</span>
          </div>
        </div>

        {firstTryWins > 0 && (
          <div className="badge-row">
            <span className="badge">🎯 Sharp Shooter</span>
          </div>
        )}
        {gamesPlayed >= 10 && (
          <div className="badge-row">
            <span className="badge">🔥 Regular Player</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
