# Rockstar - Guess the Number (React + Vite)

Tumhara purana game project ab React (Vite) me revive kar diya gaya hai. Sabkuch
usi flow ke saath: intro animation → login/create account → home → number
guessing game (confetti + sounds ke saath) → profile, 1v1 mode, leaderboard,
player rankings.

## Setup

```bash
npm install
npm run dev
```

Browser me `http://localhost:5173` khul jayega.

## Folder structure

```
src/
  api.js              -> backend (localhost:5000) calls, localStorage fallback ke saath
  App.jsx             -> saare routes yahan defined hai
  App.css             -> poora styling (gradient bg, cards, buttons, confetti)
  context/
    AuthContext.jsx    -> login session state (localStorage me persist hota hai)
  components/
    ProtectedRoute.jsx -> bina login ke home/game/etc access nahi hoga
  pages/
    Intro.jsx          -> start button -> logo -> intro image -> login/create account
    Home.jsx           -> home screen (game/scores/profile/multiplayer/leaderboard buttons)
    GameScreen.jsx      -> guess the number 1-100 game
    Profile.jsx
    Multiplayer.jsx
    Leaderboard.jsx
    ShowScore.jsx       -> player rankings table
  assets/images/
    Rockstar.png        -> tumhari original image, intro screen pe use hoti hai
```

## Music

Maine music files include nahi ki (tumhare paas already hai). Bas apni mp3 files
`public/music/` folder me daal do — exact naam `public/music/README.txt` me
likhe hai (game_new.mp3, Free_Fire_All.mp3, song1.mp3...song26.mp3, funny1-3.mp3,
Booyah.mp3, song61st.mp3, songjethalal.mp3, songpopatlal.mp3).

## Backend (optional)

Login/signup/scores pehle `http://localhost:5000` (tumhara Express + MongoDB
backend.js/package.json wala setup) try karte hai. Agar wo server nahi chal
raha, to app khud localStorage me hi account aur scores save kar leta hai —
matlab bina backend setup kiye bhi turant khel sakte ho. Jab tumhara Node
server ban jaye to bas usse `/login`, `/create-account`, `/add-score`,
`/get-scores` endpoints pe wahi response format dena hai jo pehle diya tha,
aur ye khud backend use karna start kar dega.
