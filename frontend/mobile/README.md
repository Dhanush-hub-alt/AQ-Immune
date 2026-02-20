# AQ-Immune Mobile Application

Professional-grade React Native mobile application for iOS and Android featuring real-time air quality monitoring.

## Features

### Core Features
- 📊 **Real-time Sensor Data** - Live PM2.5, PM10, CO2, Temperature, Humidity
- 📱 **Cross-Platform** - iOS and Android support via React Native and Expo
- 🔔 **Push Notifications** - Real-time alerts for poor air quality
- 🌍 **Offline Support** - View cached data when offline
- 🎨 **Material Design** - Native UI components with smooth animations

### User Features
- 👤 **User Profiles** - Personal account management
- 📈 **Charts & Analytics** - Visual data representation
- 🌙 **Dark/Light Theme** - System-wide theme support
- 🗺️ **Location Based** - Monitor sensors by location
- 🔐 **Secure Authentication** - Firebase-based auth

## Project Structure

```
mobile/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen/page components
│   │   ├── auth/        # Authentication screens
│   │   ├── home/        # Home/dashboard screen
│   │   ├── sensors/     # Sensors list/detail
│   │   └── profile/     # User profile screen
│   ├── services/        # API and Firebase services
│   ├── store/           # Redux state management
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── config/          # Configuration
│   ├── App.tsx          # Main app component
│   └── index.ts         # Entry point
├── assets/              # Images and icons
├── app.json             # Expo configuration
├── package.json
├── tsconfig.json
└── .env.example
```

## Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Backend Integration**: Axios
- **Firebase**: Authentication & Firestore
- **Charts**: React Native Chart Kit
- **Icons**: Expo Vector Icons & React Native Vector Icons

## Prerequisites

- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (for Mac) or Android Emulator
- Expo Go app (for physical device testing)

## Installation

```bash
cd frontend/mobile
npm install
```

## Development

```bash
npm start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

## Build

```bash
eas build --platform ios
eas build --platform android
```

## Notable Libraries

- `@react-native-firebase/auth` - Firebase authentication
- `@react-native-firebase/firestore` - Real-time database
- `@react-navigation/native` - Navigation framework
- `react-native-chart-kit` - Charts and graphs
- `redux` & `react-redux` - State management
- `axios` - HTTP client
- `expo-notifications` - Push notifications

## Screen Structure

### Auth Stack
- Login with email/password
- Signup with validation
- Password recovery

### App Stack
- **Home** - Dashboard with current AQI and trends
- **Sensors** - List and detail view of connected sensors
- **Profile** - User account and preferences

## Environmental Variables

Create `.env`:

```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project
...
REACT_APP_ENVIRONMENT=development
```

## Key Features to Implement

- [ ] Complete screen implementations
- [ ] API integration with backend
- [ ] Firebase authentication setup
- [ ] Real-time data streaming
- [ ] Offline caching strategy
- [ ] Push notifications setup
- [ ] App store releases
- [ ] Performance optimization

## Troubleshooting

**Expo connection issues**: Clear cache with `expo start --clear`
**Firebase initialization**: Ensure `google-services.json` and `GoogleService-Info.plist` are configured
**Navigation errors**: Clear node_modules and reinstall

## Building for Production

```bash
# Create app on Expo
eas build --platform ios --auto-submit
eas build --platform android --auto-submit
```

For detailed release notes and screens documentation, see individual screen files.
