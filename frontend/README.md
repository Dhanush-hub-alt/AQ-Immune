# AQ-Immune Frontend Application

Complete professional-grade frontend application for the AQ-Immune Air Quality Monitoring System with both web and mobile implementations.

## 📁 Project Structure

```
frontend/
├── web/                     # React web application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page/route components
│   │   ├── services/        # API & Firebase integration
│   │   ├── store/           # Redux state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript definitions
│   │   ├── config/          # Configuration
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   └── README.md
│
├── mobile/                  # React Native mobile application
│   ├── src/
│   │   ├── components/      # Reusable Native components
│   │   ├── screens/         # Screen/page components
│   │   ├── services/        # API & Firebase integration
│   │   ├── store/           # Redux state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript definitions
│   │   ├── config/          # Configuration
│   │   ├── App.tsx          # Main app component
│   │   └── index.ts         # Entry point
│   ├── assets/              # Images and icons
│   ├── app.json             # Expo config
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── shared/                  # Shared code between web and mobile
    ├── types.ts             # Shared TypeScript types
    ├── utils.ts             # Shared utility functions
    └── constants.ts         # Shared constants
```

## 🚀 Tech Stack

### Web Application
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **API Client**: Axios
- **Backend Integration**: Firebase (Auth & Firestore)
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **UI Components**: Custom built
- **Icons**: React Icons
- **Date Handling**: date-fns

### Mobile Application
- **Framework**: React Native + Expo + TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Redux Toolkit
- **API Client**: Axios
- **Backend Integration**: Firebase (Auth & Firestore)
- **Charts**: React Native Chart Kit
- **Icons**: Expo Vector Icons
- **Notifications**: Expo Notifications
- **Date Handling**: date-fns

### Shared
- **Language**: TypeScript
- **Package Manager**: npm

## ✨ Features

### Core Features
✅ Real-time sensor data visualization (PM2.5, PM10, CO2, Temperature, Humidity)
✅ Interactive charts and graphs with trend analysis
✅ AQI calculations and automated alerting
✅ Dark/Light theme toggle
✅ Fully responsive design (desktop, tablet, mobile)
✅ Secure authentication with role-based access control

### User Features
✅ Personal dashboard and sensor monitoring
✅ Historical data analysis with multiple time ranges
✅ Real-time notifications for alerts
✅ Data export and report generation
✅ Customizable notification settings and thresholds
✅ User preference management

### Admin Features
✅ Device management (add, edit, delete sensors)
✅ System dashboard with comprehensive statistics
✅ User and role management
✅ Alert configuration and monitoring
✅ System health checks
✅ Historical data and analytics access

## 🛠️ Installation

### Web Application

```bash
cd frontend/web
npm install
copy .env.example .env
# Configure environment variables in .env
npm run dev
```

### Mobile Application

```bash
cd frontend/mobile
npm install
# Install Expo CLI globally if not already installed
npm install -g expo-cli
copy .env.example .env
# Configure environment variables in .env
npm start
```

## 📝 Usage

### Development

**Web**:
```bash
cd frontend/web
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Build for production
```

**Mobile**:
```bash
cd frontend/mobile
npm start          # Start Expo server
# Press 'i' for iOS Simulator or 'a' for Android Emulator
```

### Build & Deployment

**Web**:
```bash
npm run build      # Creates optimized production build
npm run preview    # Preview production build locally
```

**Mobile**:
```bash
eas build --platform ios --auto-submit
eas build --platform android --auto-submit
```

## 🔌 API Integration

Both applications integrate with the Spring Boot backend and Firebase:

- **Base URL**: http://localhost:8080
- **API Endpoints**: See `config/index.ts`
- **Firebase Config**: Configure via environment variables

### Key Services:
- `sensorAPI` - Sensor data and device management
- `alertAPI` - Alert operations
- `userAPI` - User profile management
- `reportAPI` - Report generation
- `adminAPI` - Admin operations

## 🎨 Component Architecture

### Web Components

#### Common Components
- `Button` - Primary, secondary, danger, success, ghost variants
- `Card` - Container with optional title, description, footer
- `Badge` - Status indicators
- `Modal` - Dialog with focus trap
- `Alert` - Notification alert
- `LoadingSpinner` - Animated loader
- `Navbar` - Top navigation
- `Sidebar` - Side navigation

#### Form Components
- `Input` - Text input with validation
- `Textarea` - Multi-line input
- `Select` - Dropdown
- `Checkbox` - Boolean input

#### Chart Components
- `PollutantChart` - PM2.5 & PM10 visualization
- `EnvironmentalChart` - Temperature & humidity
- `CO2Chart` - Carbon dioxide levels
- `AQITrendChart` - AQI trends

### Mobile Components
- Custom native components built with React Native
- Material Design principles
- Optimized for touch interaction

## 📊 State Management

### Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  sensors: {
    devices: SensorDevice[],
    selectedDevice: SensorDevice | null,
    loading: boolean
  },
  sensorData: {
    data: SensorData[],
    loading: boolean,
    lastUpdate: Date | null
  },
  alerts: {
    alerts: Alert[],
    unreadCount: number,
    loading: boolean
  },
  ui: {
    theme: 'light' | 'dark',
    sidebarOpen: boolean,
    notificationsEnabled: boolean
  }
}
```

## 🔐 Authentication

- **Method**: Firebase Authentication
- **Supports**: Email/password signup and login
- **Features**: Persistent sessions, password recovery, role-based access
- **Roles**: Admin and User

## 🎯 Key Pages/Screens

### Web Routes
- `/login` - User authentication
- `/signup` - Account creation
- `/dashboard` - Main dashboard with AQI and trends
- `/sensors` - Sensor list and details
- `/profile` - User account settings
- `/admin/dashboard` - Admin panel

### Mobile Screens
- Login/Signup - Authentication
- Home - Dashboard with current AQI
- Sensors - List of connected sensors
- Profile - User settings

## 📱 Responsive Design

- **Web**: Mobile-first approach with Tailwind CSS
- **Mobile**: Native React Native components
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🚨 Error Handling

- Global error boundaries
- API error interceptors
- User-friendly error messages
- Loading states for async operations

## 📈 Performance Optimizations

- Code splitting and lazy loading
- Memoized selectors and components
- Debounced searches and inputs
- Optimized bundle size
- Image lazy loading
- Service worker for offline support

## 🌐 Browser & Device Support

### Web
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

### Mobile
- iOS 13+
- Android 7+

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Native Documentation](https://reactnative.dev)
- [Redux Documentation](https://redux.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Documentation](https://firebase.google.com/docs)

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all components
3. Write meaningful commit messages
4. Test components before submitting
5. Follow the component naming conventions

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check existing documentation
2. Review similar implementations
3. Create an issue with detailed information
4. Provide error logs and reproduction steps

---

**Last Updated**: February 2026
**Version**: 1.0.0
