# AQ-Immune Frontend - Quick Start Guide

Get up and running with the AQ-Immune frontend in 5 minutes!

## 🚀 Super Quick Setup (5 min)

### 1. Clone & Install
```bash
cd frontend/web
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

### 3. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📱 Mobile (Expo)

### 1. Install
```bash
cd frontend/mobile
npm install -g expo-cli
npm install
```

### 2. Configure
```bash
cp .env.example .env
# Edit .env with Firebase credentials
```

### 3. Run
```bash
npm start
# Press 'i' (iOS) or 'a' (Android)
```

## 🔑 Essential Commands

### Web
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Test production build
npm run lint       # Check code style
npm run type-check # TypeScript validation
```

### Mobile
```bash
npm start          # Start Expo server
npm run build      # Build for app stores
npm run prebuild   # Prebuild for EAS
```

## 📁 Key Directory Structure

```
src/
├── components/     # UI components (Button, Card, Modal, etc.)
├── pages/          # Pages/routes (Dashboard, Login, etc.)
├── services/       # API & Firebase integration
├── store/          # Redux state management
├── hooks/          # Custom React hooks
├── utils/          # Helper functions
└── types/          # TypeScript definitions
```

## 🔗 Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app with routing |
| `src/store/index.ts` | Redux configuration |
| `src/services/firebase.ts` | Firebase setup |
| `src/services/api.ts` | REST API client |
| `.env` | Environment variables |

## 🎨 Main Components

### UI Components (`src/components/common/`)
- `Button` - For all buttons
- `Card` - Containers
- `Modal` - Dialogs
- `Alert` - Notifications
- `Badge` - Status labels

### Form Components (`src/components/forms/`)
- `Input` - Text fields
- `Select` - Dropdowns
- `Textarea` - Large text
- `Checkbox` - Toggles

### Charts (`src/components/charts/`)
- `PollutantChart` - PM2.5/PM10
- `EnvironmentalChart` - Temp/Humidity
- `CO2Chart` - CO2 levels
- `AQITrendChart` - AQI history

## 📊 Redux Store Example

```typescript
// Get data from store
const user = useAppSelector(state => state.auth.user);

// Update store
const dispatch = useAppDispatch();
dispatch(updateUser({ name: 'John' }));
```

## 🔐 Authentication Flow

```
1. User enters email/password
2. Firebase authenticates
3. Token stored in Redux + localStorage
4. API requests include token header
5. On logout, clear token & update Redux
```

## 🌍 API Integration

```typescript
// Example: Fetch sensor data
import { sensorAPI } from '@/services/api';

const data = await sensorAPI.getSensors();
// Returns: { success: true, data: SensorData[] }
```

## 🎯 Common Tasks

### Add a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Create link in `src/components/common/Sidebar.tsx`

```typescript
// src/pages/NewPage.tsx
export function NewPage() {
  return <div>Page content</div>;
}

// src/App.tsx - Add route
<Route path="/new" element={<NewPage />} />
```

### Add a New Component

1. Create in `src/components/common/`
2. Export from `src/components/index.ts`
3. Use in pages/components

```typescript
// src/components/common/MyComponent.tsx
export const MyComponent = ({ prop1 }: { prop1: string }) => {
  return <div>{prop1}</div>;
};
```

### Fetch Data in Component

```typescript
// Use custom hook
import { useAsync } from '@/hooks';
import { sensorAPI } from '@/services/api';

function MyComponent() {
  const { data, loading, error } = useAsync(
    () => sensorAPI.getSensors(),
    []
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error">{error}</Alert>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### Add Redux State

1. Create slice in `src/store/`
2. Add to `configureStore`
3. Use in components with hooks

```typescript
// src/store/mySlice.ts
const mySlice = createSlice({
  name: 'myFeature',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value++;
    },
  },
});

export const { increment } = mySlice.actions;
```

## 🧪 Testing Components

### Quick Test

```typescript
import { render, screen } from '@testing-library/react';
import { MyButton } from '@/components';

test('button renders', () => {
  render(<MyButton>Click me</MyButton>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## 🐛 Common Issues

**Port already in use?**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

**Module not found?**
```bash
# Clear node_modules & reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors?**
```bash
npm run type-check
# Check imports and type definitions
```

**Firebase connection failed?**
```typescript
// Verify config in src/config/index.ts
// Check .env variables
// Enable Firebase APIs in console
```

## 📚 Documentation Links

- [Full README](./README.md) - Complete documentation
- [Development Guide](./DEVELOPMENT.md) - Detailed setup & architecture
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Project Structure](./PROJECT_STRUCTURE.md) - File organization

## 💡 Tips & Tricks

### Hot Module Replacement
```bash
# Changes instantly reload in browser
npm run dev
# Edit a component and save - instant update!
```

### Redux DevTools
```typescript
// Inspect Redux state in browser devtools
// Time-travel debugging
// Action replay
```

### React Developer Tools
```
Install: React Developer Tools browser extension
Use: Inspect components, watch state changes
```

### Environment Variables
```typescript
// Access in code
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Only VITE_ prefix variables exposed
```

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
```

## 🎓 Learning Resources

**React**
- [React Docs](https://react.dev)
- [React Hooks](https://react.dev/reference/react)

**Redux**
- [Redux Docs](https://redux.js.org)
- [Redux Toolkit](https://redux-toolkit.js.org)

**TypeScript**
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

**Tailwind CSS**
- [Tailwind Docs](https://tailwindcss.com/docs)

**Firebase**
- [Firebase Docs](https://firebase.google.com/docs)

## 🆘 Need Help?

1. **Check the docs** - Read the relevant documentation file
2. **Search existing code** - Look for similar implementations
3. **Ask teammates** - Post in #development Slack channel
4. **Create an issue** - Detailed problem description & error logs

## 📋 Checklist for First-time Setup

- [ ] Node.js 16+ installed (`node --version`)
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured with Firebase credentials
- [ ] Backend running on `http://localhost:8080`
- [ ] Dev server can start (`npm run dev`)
- [ ] Can access `http://localhost:3000`
- [ ] Firebase credentials working
- [ ] (Optional) Redux DevTools installed

## 🚀 Next Steps

1. **Explore the codebase** - Read through existing components
2. **Run the dev server** - Get familiar with the UI
3. **Make a small change** - See HMR in action
4. **Read the guides** - Check DEVELOPMENT.md for deeper knowledge
5. **Start contributing** - Pick an issue or feature to implement

---

**Happy Coding!** 🎉

For issues: Create an issue with details, error logs, and reproduction steps.
For questions: Ask in #development on Slack.

**Last Updated**: February 2026
