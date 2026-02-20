# AQ-Immune Frontend Development Guide

Complete guide for developing, testing, and deploying the AQ-Immune frontend applications.

## 📋 Table of Contents
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Architecture](#architecture)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🔧 Environment Setup

### Prerequisites
- Node.js 16+ (v18 recommended)
- npm 8+ or yarn
- Git
- Firebase account with project created
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
```bash
git clone <repo-url>
cd AQ-Immune-Software
```

2. **Install dependencies**
```bash
# Web app
cd frontend/web
npm install

# Mobile app
cd frontend/mobile
npm install
```

3. **Configure environment variables**

**Web** (`frontend/web/.env`):
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_ENV=development
```

**Mobile** (`frontend/mobile/.env`):
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
EXPO_PUBLIC_APP_ENV=development
```

4. **Verify installation**
```bash
# Web
cd frontend/web
npm run build

# Mobile
cd frontend/mobile
npm install -g expo-cli
expo doctor
```

## 🚀 Development Workflow

### Web Application

**Start development server**:
```bash
cd frontend/web
npm run dev
```
Access at `http://localhost:3000`

**HMR Features**:
- Instant component updates
- State preservation
- Style updates without refresh

**Common Commands**:
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
```

### Mobile Application

**Start development server**:
```bash
cd frontend/mobile
npm start
```

**Run on simulator**:
```bash
# iOS (macOS only)
npm start
# Press 'i'

# Android
npm start
# Press 'a'
```

**Build for deployment**:
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Both
eas build --platform all
```

## 🏗️ Architecture

### Component Hierarchy

**Web**:
```
App.tsx
├── Layout
│   ├── Navbar
│   └── Sidebar
└── Routes
    ├── AuthLayout
    │   ├── LoginPage
    │   └── SignupPage
    ├── DashboardLayout
    │   ├── DashboardPage
    │   ├── AdminDashboardPage
    │   └── UserProfilePage
    └── 404 Page
```

**Mobile**:
```
App.tsx (Navigation)
├── AuthStack
│   ├── LoginScreen
│   └── SignupScreen
└── AppStack
    ├── HomeNavigator (Home, Sensors, Profile)
    │   ├── HomeScreen
    │   ├── SensorsScreen
    │   └── ProfileScreen
    └── DrawerNavigator (Settings, Help)
```

### Data Flow

```
Redux Store
├── Actions (dispatch)
├── Reducers (state updates)
├── Selectors (state consumption)
└── Components (subscribe via hooks)

Services
├── Firebase Auth → User Authentication
├── Firebase Firestore → Real-time Data
└── Axios API → REST Endpoints

Components
├── Smart Components (containers with hooks)
└── Presentational Components (pure UI)
```

### File Structure Conventions

```
components/
├── common/           # Reusable UI components
├── forms/           # Form inputs
├── charts/          # Data visualization
├── layouts/         # Layout wrappers
└── features/        # Feature-specific components

pages/              # Route components
├── auth/           # Authentication
├── dashboard/      # Main dashboard
├── admin/          # Admin features
└── profile/        # User profile

services/           # External integrations
├── api.ts          # REST API
└── firebase.ts     # Firebase

store/              # Redux
├── slices/         # Feature slices
├── selectors.ts    # Memoized selectors
└── hooks.ts        # Typed hooks

utils/              # Helper functions
├── calculations    # AQI, recommendations
├── formatting      # Date, number formatting
└── validation      # Input validation

types/              # TypeScript definitions
hooks/              # Custom React hooks
config/             # Configuration
```

## 📝 Code Standards

### TypeScript Best Practices

```typescript
// ✅ DO: Use interface for contracts
interface SensorData {
  id: string;
  pm25: number;
  timestamp: Date;
}

// ❌ DON'T: Use type for object contracts
type SensorData = {
  id: string;
  pm25: number;
  timestamp: Date;
};

// ✅ DO: Always type function parameters
function processSensorData(data: SensorData): string {
  return `AQI for ${data.id}: ${data.pm25}`;
}

// ❌ DON'T: Use any type
function processSensorData(data: any): string {
  return `AQI: ${data.pm25}`;
}
```

### React Best Practices

```typescript
// ✅ DO: Use functional components with hooks
function SensorCard({ sensor }: { sensor: SensorData }) {
  const [expanded, setExpanded] = useState(false);
  return <div>{/* Component JSX */}</div>;
}

// ✅ DO: Memoize expensive components
export const SensorChart = memo(function SensorChart(props) {
  return <div>{/* Chart JSX */}</div>;
});

// ✅ DO: Use custom hooks for logic reuse
function useSensorData(sensorId: string) {
  return useAppSelector(state => 
    state.sensorData.data.find(d => d.sensorId === sensorId)
  );
}

// ❌ DON'T: Use class components (legacy)
class SensorCard extends Component {
  // ...
}
```

### Component Structure

```typescript
// 1. Imports
import React, { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { Button } from '@/components/common';
import { SensorData } from '@/types';

// 2. Types & Interfaces
interface SensorCardProps {
  sensor: SensorData;
  onUpdate?: (sensor: SensorData) => void;
}

// 3. Component
export const SensorCard = memo(function SensorCard({
  sensor,
  onUpdate,
}: SensorCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();

  const handleUpdate = useCallback(() => {
    // Handle update
    setIsEditing(false);
    onUpdate?.(sensor);
  }, [sensor, onUpdate]);

  return (
    <div className="card">
      {/* JSX */}
    </div>
  );
});

// 4. Display name for debugging
SensorCard.displayName = 'SensorCard';
```

### CSS/Styling Guidelines

```tsx
// ✅ DO: Use Tailwind classes
<div className="flex gap-4 p-4 bg-white rounded-lg shadow-md">
  Content
</div>

// ✅ DO: Use CSS modules for scoped styles
import styles from './Component.module.css';
<div className={styles.container}>Content</div>

// ✅ DO: Use Tailwind for responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Items
</div>

// ❌ DON'T: Inline styles
<div style={{ display: 'flex', gap: '16px' }}>Content</div>

// ❌ DON'T: Global CSS conflicting names
<div className="container">Content</div>
```

### Naming Conventions

```typescript
// Components: PascalCase
export const SensorCard = () => {};
export const AdminDashboard = () => {};

// Functions/Variables: camelCase
const calculateAQI = (pm25: number) => {};
let sensorCount = 0;

// Constants: UPPER_SNAKE_CASE
const MAX_ALERT_THRESHOLD = 150;
const API_TIMEOUT = 5000;

// CSS Classes: kebab-case
<div className="sensor-card-container">

// Files:
// - Components: PascalCase (SensorCard.tsx)
// - Utils: camelCase (calculateAQI.ts)
// - Types: index.ts (centralized)
```

## 🧪 Testing

### Unit Testing Setup

```bash
# Web
npm install --save-dev @testing-library/react vitest

# Mobile
npm install --save-dev @testing-library/react-native jest
```

### Example Tests

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { SensorCard } from '@/components';

describe('SensorCard', () => {
  it('renders sensor name', () => {
    const sensor = {
      id: '1',
      deviceName: 'Office Sensor',
      pm25: 35,
    };
    
    render(<SensorCard sensor={sensor} />);
    expect(screen.getByText('Office Sensor')).toBeInTheDocument();
  });
});

// Utility test
import { calculateAQI } from '@/utils';

describe('calculateAQI', () => {
  it('calculates correct AQI for PM2.5', () => {
    const { aqi, level } = calculateAQI(35);
    expect(level).toBe('Moderate');
    expect(aqi).toBeGreaterThan(50);
  });
});
```

## 🔍 Debugging

### VS Code Setup

**.vscode/launch.json**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach to Chrome",
      "urlFilter": "http://localhost:3000/*",
      "pathMapping": {
        "/": "${workspaceRoot}/",
        "/src": "${workspaceRoot}/src"
      }
    }
  ]
}
```

### Redux DevTools

Large web app with Redux DevTools enabled:
- Inspect state changes
- Time-travel debugging
- Action replaying

### React DevTools

Browser extensions for React debugging:
- Component tree inspection
- Props and state tracking
- Performance profiling

## 🐛 Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Module not found**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Firebase connection issues**:
- Verify credentials in `.env`
- Check Firebase project settings
- Ensure backend CORS is configured

**TypeScript errors**:
```bash
npm run type-check
# Verify tsconfig.json path aliases
```

**Build failures**:
```bash
# Web
npm run build -- --debug

# Mobile
expo doctor
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite User Guide](https://vitejs.dev/guide/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation (Mobile)](https://reactnavigation.org/)
- [Firebase Docs](https://firebase.google.com/docs)

---

**Need Help?**
1. Check this guide first
2. Review similar implementations
3. Check GitHub issues
4. Ask team members on Slack
