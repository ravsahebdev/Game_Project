import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const achievements = JSON.parse(localStorage.getItem('achievements')) || { firstAttemptWins: 0 }

  return (
    <div className="screen-wrapper">
      <div id="profile-screen" className="card has-back">
        <button className="back-btn" onClick={() => navigate('/home')}>
          Back
        </button>
        <h2>Profile</h2>
        <p>
          Username: <span id="profileUsername">{user?.username || 'Guest'}</span>
        </p>
        <p>
          Full Name: <span id="profileFullName">{user?.fullName || '-'}</span>
        </p>
        <p>
          Achievements:{' '}
          <span id="profileAchievements">
            {achievements.firstAttemptWins > 0
              ? `🏆 First-try wins: ${achievements.firstAttemptWins}`
              : 'No achievements yet'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Profile
