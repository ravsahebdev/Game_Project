import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Multiplayer() {
  const [opponent, setOpponent] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const handleConnect = () => {
    if (opponent.trim() === '') {
      setMsg("⚠️ Enter an opponent's username!")
      return
    }
    setMsg(`✅ Request sent to ${opponent}!`)
  }

  return (
    <div className="screen-wrapper">
      <div id="multiplayer-screen" className="card has-back">
        <button className="back-btn" onClick={() => navigate('/home')}>
          Back
        </button>
        <h2>1v1 Mode</h2>
        <input
          type="text"
          placeholder="Enter Opponent's Username"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
        />
        <button onClick={handleConnect}>Connect</button>
        {msg && <p id="multiplayerMessage">{msg}</p>}
      </div>
    </div>
  )
}

export default Multiplayer
