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
        <Link to="/game">
          <button id="gameStartBtn">Start Game</button>
        </Link>
        <Link to="/scores">
          <button id="showScoresBtn">Show Scores</button>
        </Link>
        <Link to="/profile">
          <button id="profileBtn">Profile</button>
        </Link>
        <Link to="/multiplayer">
          <button id="multiplayerBtn">1v1 Mode</button>
        </Link>
        <Link to="/leaderboard">
          <button id="leaderboardBtn">Leader Board</button>
        </Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Home
