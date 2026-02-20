# AQ-Immune Frontend Project Structure

Complete file and directory organization for the AQ-Immune Frontend Applications.

## 📁 Directory Tree

```
frontend/
│
├── README.md                          # Main frontend documentation
├── DEVELOPMENT.md                     # Development guide
├── DEPLOYMENT.md                      # Production deployment guide
│
├── shared/                            # Shared code between web and mobile
│   ├── types.ts                       # Shared TypeScript types
│   ├── utils.ts                       # Shared utility functions
│   └── constants.ts                   # Shared constants
│
├── web/                               # React web application
│   ├── package.json                   # Dependencies & scripts
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── vite.config.ts                 # Vite build configuration
│   ├── tailwind.config.js             # Tailwind CSS theming
│   ├── postcss.config.js              # PostCSS plugins
│   ├── .eslintrc.json                 # ESLint rules
│   ├── index.html                     # HTML entry point
│   ├── .env.example                   # Environment variables template
│   ├── README.md                      # Web app documentation
│   │
│   ├── src/
│   │   ├── main.tsx                   # React entry point with Redux provider
│   │   ├── App.tsx                    # Main app with routing & theme
│   │   ├── index.css                  # Global styles & animations
│   │   │
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript type definitions
│   │   │       ├── SensorData
│   │   │       ├── SensorDevice
│   │   │       ├── User & UserPreferences
│   │   │       ├── NotificationSettings
│   │   │       ├── Alert
│   │   │       ├── HistoricalReport
│   │   │       ├── Recommendation
│   │   │       ├── DashboardStats
│   │   │       ├── DeviceManagement
│   │   │       ├── ApiResponse
│   │   │       ├── ChartDataPoint
│   │   │       └── FilterOptions
│   │   │
│   │   ├── config/
│   │   │   └── index.ts               # Centralized configuration
│   │   │       ├── Firebase config loader
│   │   │       ├── API endpoints registry
│   │   │       ├── Feature flags
│   │   │       ├── Chart configuration
│   │   │       ├── AQI thresholds (US EPA)
│   │   │       ├── Notification settings
│   │   │       └── Storage keys
│   │   │
│   │   ├── services/
│   │   │   ├── firebase.ts            # Firebase integration
│   │   │   │   ├── authService (signup, login, logout, password reset)
│   │   │   │   ├── sensorService (read, write, real-time listeners)
│   │   │   │   ├── alertService (CRUD operations)
│   │   │   │   └── userService (profile management)
│   │   │   │
│   │   │   └── api.ts                 # REST API client (Axios)
│   │   │       ├── sensorAPI (GET/POST/PUT/DELETE)
│   │   │       ├── alertAPI (CRUD, filtering)
│   │   │       ├── userAPI (profile, preferences)
│   │   │       ├── reportAPI (generate, download)
│   │   │       ├── adminAPI (system operations)
│   │   │       └── Interceptors (auth, error handling)
│   │   │
│   │   ├── store/
│   │   │   └── index.ts               # Redux store configuration
│   │   │       ├── authSlice (login, logout, user state)
│   │   │       ├── sensorsSlice (device list, selected device)
│   │   │       ├── sensorDataSlice (real-time data)
│   │   │       ├── alertsSlice (alerts, unread count)
│   │   │       ├── uiSlice (theme, sidebar, notifications)
│   │   │       ├── rootReducer
│   │   │       ├── useAppDispatch (typed dispatch)
│   │   │       ├── useAppSelector (typed selector)
│   │   │       └── Selectors (memoized state accessors)
│   │   │
│   │   ├── hooks/
│   │   │   └── index.ts               # Custom React hooks
│   │   │       ├── useAsync (async state management)
│   │   │       ├── useDebounce (search debouncing)
│   │   │       ├── useLocalStorage (persistence)
│   │   │       ├── usePrevious (track previous value)
│   │   │       ├── useOutsideClick (modal handling)
│   │   │       ├── useMediaQuery (responsive)
│   │   │       ├── useWindowSize (layout responsiveness)
│   │   │       ├── usePreviousEffect (cleanup on dependency)
│   │   │       ├── useIsMounted (prevent memory leaks)
│   │   │       ├── useToggle (boolean state)
│   │   │       ├── useNotification (toast notifications)
│   │   │       └── useTheme (dark/light mode)
│   │   │
│   │   ├── utils/
│   │   │   └── index.ts               # Utility functions
│   │   │       ├── calculateAQI (US EPA formula)
│   │   │       ├── getAQIColor (severity color)
│   │   │       ├── getAQIDescription (health level)
│   │   │       ├── generateHealthRecommendations (advice)
│   │   │       ├── formatDate (YYYY-MM-DD)
│   │   │       ├── formatDateTime (timestamp)
│   │   │       ├── formatTime (HH:MM:SS)
│   │   │       ├── formatRelativeTime (e.g., "2 hours ago")
│   │   │       ├── isValidEmail (validation)
│   │   │       ├── isStrongPassword (strength check)
│   │   │       ├── deepClone (object clone)
│   │   │       ├── mergeObjects (shallow merge)
│   │   │       ├── sortByProperty (array sort)
│   │   │       ├── filterByConditions (array filter)
│   │   │       ├── debounce (function debouncing)
│   │   │       ├── throttle (function throttling)
│   │   │       ├── getInitials (avatar text)
│   │   │       └── truncateString (ellipsis text)
│   │   │
│   │   ├── components/
│   │   │   ├── common/                # Reusable UI components
│   │   │   │   ├── Button.tsx         # 5 variants, 3 sizes, icons
│   │   │   │   ├── Card.tsx           # Container with footer
│   │   │   │   ├── Badge.tsx          # Status indicators
│   │   │   │   ├── Modal.tsx          # Dialog with focus trap
│   │   │   │   ├── Alert.tsx          # Notifications
│   │   │   │   ├── LoadingSpinner.tsx # Animated loader
│   │   │   │   ├── Navbar.tsx         # Top navigation bar
│   │   │   │   └── Sidebar.tsx        # Side navigation
│   │   │   │
│   │   │   ├── forms/                 # Form components
│   │   │   │   ├── Input.tsx          # Text input with validation
│   │   │   │   ├── Textarea.tsx       # Multi-line input
│   │   │   │   ├── Select.tsx         # Dropdown selector
│   │   │   │   └── Checkbox.tsx       # Boolean input
│   │   │   │
│   │   │   └── charts/                # Data visualization
│   │   │       ├── PollutantChart.tsx     # PM2.5 & PM10 dual line
│   │   │       ├── EnvironmentalChart.tsx # Temp & Humidity
│   │   │       ├── CO2Chart.tsx           # CO2 with baseline
│   │   │       └── AQITrendChart.tsx      # AQI history with bands
│   │   │
│   │   └── pages/
│   │       ├── auth/
│   │       │   ├── LoginPage.tsx      # Email/password login
│   │       │   └── SignupPage.tsx     # User registration
│   │       │
│   │       ├── dashboard/
│   │       │   └── DashboardPage.tsx  # Main KPI dashboard
│   │       │
│   │       ├── admin/
│   │       │   └── AdminDashboardPage.tsx # Device management
│   │       │
│   │       └── profile/
│   │           └── UserProfilePage.tsx    # User settings
│   │
│   └── dist/                          # Build output (generated)
│
├── mobile/                            # React Native with Expo
│   ├── package.json                   # Dependencies & scripts
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── app.json                       # Expo configuration
│   ├── .env.example                   # Environment template
│   ├── README.md                      # Mobile documentation
│   │
│   ├── assets/
│   │   ├── icon.png                   # App icon
│   │   ├── splash.png                 # Splash screen
│   │   └── adaptive-icon.png          # Android adaptive icon
│   │
│   ├── src/
│   │   ├── index.ts                   # Entry point with StatusBar
│   │   ├── App.tsx                    # Navigation structure
│   │   │                              # (AuthStack + AppStack)
│   │   │
│   │   ├── types/
│   │   │   └── index.ts               # Type definitions (same as web)
│   │   │
│   │   ├── config/
│   │   │   └── index.ts               # Firebase & API configuration
│   │   │
│   │   ├── store/
│   │   │   └── index.ts               # Redux store (simplified)
│   │   │       ├── authSlice
│   │   │       ├── sensorsSlice
│   │   │       ├── sensorDataSlice
│   │   │       ├── alertsSlice
│   │   │       └── Typed hooks
│   │   │
│   │   ├── hooks/
│   │   │   └── index.ts               # Custom hooks
│   │   │       ├── useAsync
│   │   │       ├── useToggle
│   │   │       ├── useAppDispatch
│   │   │       └── useAppSelector
│   │   │
│   │   ├── utils/
│   │   │   └── index.ts               # Utility functions
│   │   │       ├── calculateAQI
│   │   │       ├── getAQIColor
│   │   │       ├── formatNumber
│   │   │       ├── formatDate
│   │   │       └── generateHealthRecommendations
│   │   │
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.tsx    # Authentication screen
│   │   │   │   └── SignupScreen.tsx   # Registration screen
│   │   │   │
│   │   │   ├── home/
│   │   │   │   └── HomeScreen.tsx     # Main dashboard
│   │   │   │
│   │   │   ├── sensors/
│   │   │   │   └── SensorsScreen.tsx  # Device list
│   │   │   │
│   │   │   └── profile/
│   │   │       └── ProfileScreen.tsx  # User settings
│   │   │
│   │   └── components/
│   │       ├── Button.tsx             # Native button
│   │       ├── Card.tsx               # Container
│   │       ├── LoadingSpinner.tsx     # Activity indicator
│   │       └── (more native components)
│   │
│   └── .expo/                         # Expo cache (gitignored)
│
└── docs/                              # Additional documentation
    ├── API.md                         # API endpoint reference
    ├── CONVENTIONS.md                 # Code style guide
    ├── TESTING.md                     # Testing strategies
    ├── PERFORMANCE.md                 # Performance optimization
    └── ARCHITECTURE.md                # System architecture
```

## 📊 File Count Summary

| Category | Web | Mobile | Shared | Total |
|----------|-----|--------|--------|-------|
| TypeScript/JSX | 37 | 15 | 3 | 55 |
| Config | 6 | 4 | - | 10 |
| JSON | 2 | 2 | - | 4 |
| Documentation | 1 | 1 | - | 2 |
| CSS/Assets | 1 | - | - | 1 |
| **Total** | **47** | **22** | **3** | **72** |

## 🔑 Key Features by Component

### Web Components

| Component | Features | Lines |
|-----------|----------|-------|
| Button | 5 variants, 3 sizes, icons, loading | ~80 |
| Card | Hoverable, clickable, footer slot | ~50 |
| Modal | Focus trap, Esc key, custom sizes | ~100 |
| Charts | 4 types, real-time, responsive | ~400 |
| Dashboard | KPI cards, multi-chart, responsive | ~200 |
| Admin Dashboard | Device table, add/edit/delete | ~250 |

### Mobile Screens

| Screen | Purpose | Status |
|--------|---------|--------|
| LoginScreen | User authentication | Placeholder |
| SignupScreen | Account creation | Placeholder |
| HomeScreen | Dashboard | Placeholder |
| SensorsScreen | Sensor list | Placeholder |
| ProfileScreen | User settings | Placeholder |

**Implementation Priority**:
1. LoginScreen (core authentication)
2. HomeScreen (main UX)
3. SensorsScreen (core functionality)
4. ProfileScreen (user preferences)
5. Error boundaries & loading states

## 💾 Storage & Data Flow

### State Management
```
Redux Store (5 slices, 40+ actions)
├── Read: useAppSelector (memoized)
├── Write: useAppDispatch (actions)
└── Services: firebase.ts, api.ts
```

### Local Storage
```
localStorage
├── aq_immune_auth_token
├── aq_immune_user_preferences
├── aq_immune_selected_devices
├── aq_immune_alert_history
└── aq_immune_theme
```

### Firebase
```
Firestore Collections
├── sensors/ (device data)
├── sensorData/ (measurements)
├── alerts/ (notifications)
├── users/ (profiles)
└── reports/ (historical)
```

## 🔄 Integration Points

### Backend API
- **Base URL**: `http://localhost:8080`
- **Endpoints**: `/api/sensors`, `/api/alerts`, `/api/users`, etc.
- **Auth**: Bearer token in headers

### Firebase
- **Auth**: Email/password signup and login
- **Firestore**: Real-time document listeners
- **Storage**: User profiles, avatar uploads
- **Notifications**: Push alerts for thresholds

## 📈 Metrics

### Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: React & hooks rules enforced
- **Coverage**: Unit & integration tests planned
- **Performance**: Sub-second HMR (web), lazy loading

### Bundle Size (Web)
```
main.js        ~100 KB (gzipped)
vendor.js      ~200 KB (gzipped)
Total          ~300 KB (uncompressed: ~1 MB)
```

### Performance Targets
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 4s

## 🚀 Next Steps

### Immediate (Week 1)
- [ ] Configure Firebase credentials
- [ ] Test API connectivity
- [ ] Implement mobile screens
- [ ] Setup CI/CD pipeline

### Short-term (Week 2-3)
- [ ] Complete authentication flows
- [ ] Implement real-time data sync
- [ ] Add offline support
- [ ] Performance optimization

### Medium-term (Month 2)
- [ ] Push notifications
- [ ] Data export/reports
- [ ] Advanced analytics
- [ ] Mobile app store submission

### Long-term (Month 3+)
- [ ] PWA support (web)
- [ ] Voice commands
- [ ] ML-based recommendations
- [ ] Multi-language support

---

**Total Lines of Code**: ~8,500
**Documentation**: ~4,000 lines
**Configuration**: ~500 lines
**Total Project**: ~13,000 lines

**Maintained By**: AQ-Immune Engineering Team
**Last Updated**: February 2026
