import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="screen-wrapper">
      <div id="home-screen" className="card home-links">
        <h2 id="welcomeMessage">Welcome, {user?.fullName || user?.username || 'Player'}!</h2>
        <p className="home-subtitle">Pick a mode to jump in</p>

        <div className="home-grid">
          <Link to="/game" className="tile tile-cyan">
            <span className="tile-icon">🎯</span>
            Start Game
          </Link>
          <Link to="/scores" className="tile tile-gold">
            <span className="tile-icon">🏆</span>
            Show Scores
          </Link>
          <Link to="/profile" className="tile tile-magenta">
            <span className="tile-icon">🧑‍🚀</span>
            Profile
          </Link>
          <Link to="/multiplayer" className="tile tile-green">
            <span className="tile-icon">⚔️</span>
            1v1 Mode
          </Link>
          <Link to="/leaderboard" className="tile tile-cyan" style={{ gridColumn: '1 / -1' }}>
            <span className="tile-icon">📊</span>
            Leader Board
          </Link>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Home
