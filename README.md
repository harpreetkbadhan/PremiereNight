## 🎬 Premiere Night

A simple movie discovery app I built while learning **bare React Native** (no Expo).  
Browse popular movies, check details, and add films to your Watchlist.

The app uses the TMDb API along with React Navigation, Zustand, and AsyncStorage.

---

## 🚀 Getting Started

### Requirements
- Node 18+
- React Native CLI
- Xcode (iOS)
- Android Studio (Android)
- TMDb API key

---

## 🔧 Installation

```sh
npm install


-for iOS
cd ios && pod install && cd ..
npm run ios

-for Android
npm run android


if server is not running  (error no Bundle url present)
-npm start 


Project Structure


src/
── api/          # TMDb API calls
── components/   # Reusable UI (just MovieCard for now)
── navigation/   # React Navigation setup
── screens/      # Home, Detail, Watchlist
── state/        # Zustand store
── types/        # TypeScript definitions


-Tech 

- React Native 0.73
- TypeScript
- Zustand 
- React Navigation
- AsyncStorage 

There is Folder of Screenshot (added the screenshots of app running)
-ScreenShots
