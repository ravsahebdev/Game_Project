import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getScores } from '../api'

const dummyScores = [
  { username: 'Player1', score: 100 },
  { username: 'Player2', score: 90 },
  { username: 'Player3', score: 85 },
]

const medalFor = (rank) => (rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '🏅')

function ShowScore() {
  const [scores, setScores] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getScores().then((data) => {
      setScores(Array.isArray(data) && data.length > 0 ? data : dummyScores)
    })
  }, [])

  return (
    <div className="screen-wrapper">
      <div id="score-container" className="card">
        <button className="back-btn" onClick={() => navigate('/home')}>
          Back
        </button>
        <h2>🏆 Player Rankings</h2>
        <div id="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
                <th>Badge</th>
              </tr>
            </thead>
            <tbody id="scoreTableBody">
              {scores.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{p.username}</td>
                  <td>{p.score}</td>
                  <td>{medalFor(i)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ShowScore
