# Frontend - Web Application

Professional-grade reactive air quality monitoring web application built with React, TypeScript, and modern web technologies.

## Features

### Core Features
- ✨ **Real-time Sensor Data Visualization** - Live PM2.5, PM10, CO2, Temperature, Humidity
- 📊 **Interactive Charts & Graphs** - Recharts-based visualizations with trend analysis
- 🌡️ **AQI Calculations & Alerts** - US EPA standard AQI with automated alerting
- 🎨 **Dark/Light Theme Toggle** - System-wide theme support with persistence
- 📱 **Fully Responsive** - Desktop, tablet, and mobile optimization

### User Features
- 👤 **User Profiles** - Personal dashboard with sensor monitoring
- 📈 **Historical Data Analysis** - Time-series data with multiple time ranges
- 🔔 **Real-time Notifications** - Toast notifications for alerts
- 📥 **Data Reports** - Generate and export historical reports
- ⚙️ **Preference Management** - Customizable settings and thresholds

### Admin Features
- 🔐 **Device Management** - Add, edit, delete sensors
- 📊 **System Dashboard** - Comprehensive system statistics
- 👥 **User Management** - Role-based access control
- 🚨 **Alert Configuration** - Customizable alert thresholds
- 📋 **System Health** - Monitor system performance

## Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── forms/           # Form components
│   │   └── charts/          # Chart components
│   ├── pages/
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── admin/           # Admin pages
│   │   └── profile/         # Profile pages
│   ├── services/            # API and Firebase services
│   ├── store/               # Redux state management
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   ├── config/              # Configuration files
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Backend API**: Axios
- **Firebase**: Authentication & Firestore
- **UI Components**: Custom built
- **Notifications**: React Hot Toast
- **Routing**: React Router v6

## Installation

```bash
cd frontend/web
npm install
```

## Development

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_ENVIRONMENT=development
```

## Component Library

### Common Components
- `Button` - Primary, secondary, danger, success, ghost variants
- `Card` - Container with optional title, description, footer
- `Badge` - Status indicators with multiple variants
- `Modal` - Dialog with focus trap and keyboard support
- `Alert` - Notifications with 4 types
- `LoadingSpinner` - Animated loading indicator
- `Input` - Text input with validation
- `Textarea` - Multi-line text input
- `Select` - Dropdown selection
- `Checkbox` - Boolean input
- `Navbar` - Top navigation bar
- `Sidebar` - Side navigation with responsive behavior

### Chart Components
- `PollutantChart` - PM2.5 and PM10 visualization
- `EnvironmentalChart` - Temperature and humidity trends
- `CO2Chart` - Carbon dioxide levels
- `AQITrendChart` - Air quality index trends

## Redux Store

### State Slices
- `auth` - Authentication and user state
- `sensors` - Sensor device management
- `sensorData` - Real-time sensor data
- `alerts` - Alert management
- `ui` - UI state (theme, sidebar, etc.)

## Custom Hooks

- `useAppDispatch` - Typed dispatch hook
- `useAppSelector` - Typed selector hook
- `useAsync` - Async operation management
- `useDebounce` - Debounced value
- `useLocalStorage` - Local storage persistence
- `usePrevious` - Previous value tracking
- `useOutsideClick` - Outside click detection
- `useMediaQuery` - Media query matching
- `useWindowSize` - Window dimensions
- `useToggle` - Boolean state toggle

## API Integration

All API calls are handled through services:

- `sensorAPI` - Sensor data operations
- `alertAPI` - Alert management
- `userAPI` - User profile operations
- `reportAPI` - Report generation
- `adminAPI` - Admin operations
- `firebaseService` - Firebase real-time operations

## Performance Optimizations

- Lazy loading components
- Memoized selectors
- Optimized re-renders
- Debounced search
- Code splitting with React Router
- Image optimization

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

Follow the existing code style and component structure. All components should be fully typed with TypeScript.

## License

MIT
