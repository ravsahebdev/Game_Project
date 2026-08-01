// Fixed, full-screen animated background: glowing blurred orbs + subtle grid.
// Rendered once in App.jsx (outside <Routes>) so it never re-mounts on
// page/route change - gives a smooth persistent "arcade" backdrop.
function BackgroundFX() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <span className="orb orb-cyan" />
      <span className="orb orb-magenta" />
      <span className="orb orb-gold" />
      <div className="grid-overlay" />
    </div>
  )
}

export default BackgroundFX
