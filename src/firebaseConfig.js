// -----------------------------------------------------------------
// Ye file game ko "sabke liye shared" banati hai (Firebase Firestore
// database ke through) — isliye alag alag log, alag alag device se
// khel sakte hai aur ek hi leaderboard/multiplayer room dekh sakte hai.
//
// SETUP (5 minute ka kaam, koi coding nahi):
// 1. https://console.firebase.google.com pe jao, Google account se login karo
// 2. "Add project" -> naam do (jo marzi) -> continue -> project bana lo
// 3. Left sidebar me "Build" -> "Firestore Database" -> "Create database"
//    -> "Start in test mode" select karo -> location choose karo -> Enable
// 4. Project Overview (gear icon -> Project settings) -> "Your apps" ->
//    "</>" (Web) icon pe click karo -> app register karo (naam kuch bhi)
// 5. Wahan se milne wala "firebaseConfig" object copy karo aur neeche
//    paste kar do (jaisa ka jaisa - apiKey, projectId, sab).
//
// Jab tak ye fill nahi karoge, app localStorage me hi (sirf tumhare
// apne browser me) kaam karega - kisi aur ko dikhega nahi. Config
// bharne ke baad automatically sabke liye shared ho jayega.
// -----------------------------------------------------------------

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
}

let db = null

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } else {
    console.warn(
      '[Firebase] Config abhi bhara nahi hai — abhi ke liye sirf is browser me hi data save hoga. ' +
        'src/firebaseConfig.js me apni Firebase project ki details daalo taaki sabke liye shared ho jaye.'
    )
  }
} catch (err) {
  console.error('[Firebase] Setup me error, localStorage fallback use ho raha hai:', err)
  db = null
}

export { db }
