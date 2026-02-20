# Frontend Installation & Setup

## ⚠️ Important: Missing Dependencies

The frontend web application requires the following npm packages to be installed:

### Installation Steps

```bash
cd frontend/web

# Install all dependencies
npm install

# Or install specific packages if npm install doesn't work:
npm install react@latest react-dom@latest
npm install @reduxjs/toolkit react-redux
npm install firebase
npm install axios
npm install react-router-dom
npm install react-hot-toast
npm install recharts date-fns
npm install tailwindcss postcss autoprefixer
npm install -D typescript @types/react @types/react-dom
npm install -D @vitejs/plugin-react vite eslint
npm install -D @types/node
```

### Complete package.json

The web app's `package.json` should contain:

```json
{
  "name": "aq-immune-web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "firebase": "^10.7.0",
    "axios": "^1.6.5",
    "react-hot-toast": "^2.4.1",
    "recharts": "^2.10.3",
    "date-fns": "^2.30.0",
    "tailwindcss": "^3.4.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/node": "^20.10.6",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

## Configuration Files Created

The following config files have been created/updated:

✅ `tsconfig.json` - TypeScript configuration with relaxed strict mode
✅ `vite.config.ts` - Vite build configuration
✅ `tailwind.config.js` - Tailwind CSS theme
✅ `postcss.config.js` - PostCSS configuration
✅ `.eslintrc.json` - ESLint rules
✅ `.env.example` - Environment variables template
✅ `vite-env.d.ts` - Vite environment types
✅ `.prettierrc.json` - Code formatter config
✅ `.stylelintignore` - Ignore Tailwind directives from linting

## Setup Checklist

After installing dependencies:

- [ ] Run `npm install` to install all packages
- [ ] Copy `.env.example` to `.env`
- [ ] Update `.env` with your Firebase credentials
- [ ] Run `npm run dev` to start development server
- [ ] Verify no TS errors: `npm run type-check`
- [ ] Check linting: `npm run lint`

## Firebase Configuration

Get your Firebase credentials from [Firebase Console](https://console.firebase.google.com/):

1. Create a new project or use existing
2. Add a web app to your project
3. Copy the config values to `.env`:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

## Troubleshooting

### "Cannot find module" errors
→ Run: `npm install`

### TypeScript errors about import.meta.env
→ The `vite-env.d.ts` file provides type definitions. Ensure it's in `src/` folder.

### Red squiggles in VS Code
→ Run: `npm run type-check`

## Next Steps

1. Install dependencies: `npm install`
2. Configure `.env` file
3. Start dev server: `npm run dev`
4. Open http://localhost:3000

---

**All code is ready. Just install dependencies!**
