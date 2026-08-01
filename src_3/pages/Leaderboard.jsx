import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getScores } from '../api'

function Leaderboard() {
  const [scores, setScores] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getScores().then((data) => setScores(Array.isArray(data) ? data : []))
  }, [])

  return (
    <div className="screen-wrapper">
      <div id="leaderboard-screen" className="card">
        <button className="back-btn" onClick={() => navigate('/home')}>
          Back
        </button>
        <h2>Leaderboard</h2>
        {scores.length === 0 ? (
          <p>No scores yet — go play a game!</p>
        ) : (
          <ul id="leaderboardList">
            {scores.map((s, i) => (
              <li key={i}>
                {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : '🎮 '}
                {s.username} — {s.score} attempts
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
