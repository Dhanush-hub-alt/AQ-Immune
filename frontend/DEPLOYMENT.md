# AQ-Immune Frontend Production Deployment Guide

Complete guide for building, testing, and deploying AQ-Immune frontend applications to production environments.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] No console errors or warnings
- [ ] Environment variables configured for production
- [ ] Backend API is accessible and tested
- [ ] Firebase project configured and verified
- [ ] Code reviewed by team members
- [ ] Accessibility audit passed
- [ ] Performance benchmarks acceptable
- [ ] Security audit completed
- [ ] Database backups configured (backend)

## 🌐 Web Application Deployment

### Production Build

```bash
cd frontend/web

# Build optimized bundle
npm run build

# Verify build
npm run preview

# Size check
npm run build -- --analyze
```

### Environment Configuration

Create `frontend/web/.env.production`:
```env
VITE_FIREBASE_API_KEY=prod_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aq-immune-prod
VITE_FIREBASE_STORAGE_BUCKET=aq-immune-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=prod_sender_id
VITE_FIREBASE_APP_ID=prod_app_id
VITE_API_BASE_URL=https://api.aq-immune.com
VITE_APP_ENV=production
```

### Deployment Options

#### Option 1: Vercel (Recommended for Vite + React)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend/web
vercel --prod

# Configure
# - Set environment variables in Vercel dashboard
# - Enable automatic deployments from Git
```

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_FIREBASE_API_KEY": "@firebase_api_key",
    "VITE_API_BASE_URL": "@api_base_url"
  }
}
```

#### Option 2: AWS S3 + CloudFront

```bash
# Build with base path if needed
cd frontend/web
npm run build

# Upload to S3
aws s3 sync dist/ s3://aq-immune-prod --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

**CloudFront Setup**:
1. Create S3 bucket (static website hosting disabled)
2. Create CloudFront distribution
3. Set origin to S3 bucket
4. Configure SSL/TLS certificate
5. Set Cache-Control headers for optimal caching

#### Option 3: Docker + Container Registry

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and push**:
```bash
docker build -t aq-immune-web:1.0.0 .
docker tag aq-immune-web:1.0.0 registry.example.com/aq-immune-web:1.0.0
docker push registry.example.com/aq-immune-web:1.0.0
```

### Performance Optimization

#### Build Output
```bash
# Analyze bundle
npm run build -- --analyze

# Expected sizes:
# - main bundle: ~150KB (gzipped)
# - vendor chunk: ~200KB (gzipped)
```

#### Caching Strategy

**index.html** (no-cache):
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
```

**Static assets** (long-term cache):
```nginx
# nginx.conf
location ~* \.(js|css|png|jpg|gif|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

#### Service Worker Setup

```typescript
// src/service-worker.ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log('Service Worker registered:', reg);
  });
}
```

### Monitoring & Analytics

**Sentry Integration**:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/123456",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

**Analytics**:
```typescript
import { analytics } from '@/services/firebase';

// Track page views
export const logPageView = (pageName: string) => {
  analytics.logEvent('page_view', {
    page_name: pageName,
  });
};
```

---

## 📱 Mobile Application Deployment

### Build Configuration

Update `frontend/mobile/app.json`:
```json
{
  "name": "AQ Immune",
  "slug": "aq-immune",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "ios": {
    "supportsTabletMode": true,
    "bundleIdentifier": "com.aqimmune.app"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "package": "com.aqimmune.app",
    "versionCode": 1
  }
}
```

### iOS Deployment

#### Prerequisites
- Apple Developer Account ($99/year)
- Xcode 13+
- Provisioning profile and certificate

#### Build & Submit

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build for iOS
eas build --platform ios --auto-submit

# For TestFlight
eas submit --platform ios
```

**Signing Configuration**:
```json
{
  "build": {
    "ios": {
      "distribution": "appstore",
      "enterpriseProvisioning": "adhoc"
    }
  }
}
```

**App Store Submission Checklist**:
- [ ] App name and description
- [ ] Privacy policy URL
- [ ] Support email
- [ ] Screenshots (all device sizes)
- [ ] Preview video
- [ ] Category and subcategory
- [ ] Keywords and support pages
- [ ] Content rating questionnaire
- [ ] App ID and bundle identifier
- [ ] Pricing and availability

### Android Deployment

#### Prerequisites
- Google Play Developer Account ($25 one-time)
- Android Keystore or Google Play App Signing

#### Build & Submit

```bash
# Build for Android
cd frontend/mobile
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

**Signing Configuration** (`eas.json`):
```json
{
  "build": {
    "android": {
      "distribution": "playstore",
      "android": {
        "useSecureKeystore": true
      }
    }
  }
}
```

**Google Play Submission Checklist**:
- [ ] App title and short description
- [ ] Full description (4000 char max)
- [ ] App icon (512x512, PNG)
- [ ] Feature graphic (1024x500, PNG)
- [ ] Screenshots (up to 8)
- [ ] Video preview URL
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] Target API level (minimum 21)
- [ ] Permissions to explain

### Post-Release Management

#### Versioning Strategy

```
major.minor.patch (+build)
1.0.0+1    (version 1.0.0, build 1)
1.1.0+2    (minor: new features)
1.0.1+3    (patch: bug fixes)
2.0.0+4    (major: breaking changes)
```

Update in `app.json`:
```json
{
  "version": "1.0.0",
  "android": {
    "versionCode": 1
  }
}
```

#### Over-the-Air Updates

Using Expo Updates:
```bash
# Publish update
eas update --branch=production

# Manage releases
eas update:list
eas update:view <ID>
```

#### Rollback Strategy

```bash
# View update history
eas update:list

# Rollback to previous version
eas update:republish --group <GROUP_ID>
```

---

## 🔐 Security Checklist

### Web Application
- [ ] Enable HTTPS only
- [ ] Set security headers (CSP, X-Frame-Options, etc.)
- [ ] Implement rate limiting
- [ ] Use secure cookies (httpOnly, secure, sameSite)
- [ ] Enable CORS properly
- [ ] Sanitize user inputs
- [ ] Validate API responses
- [ ] Use environment variables for secrets
- [ ] Regular dependency updates (`npm audit`)
- [ ] Code obfuscation for production

### Mobile Application
- [ ] Keep Android SDK updated
- [ ] Use secure storage for tokens
- [ ] Implement certificate pinning
- [ ] Encrypt sensitive data
- [ ] Disable debug logging in production
- [ ] Validate API certificates
- [ ] Use network security configuration
- [ ] Regular dependency updates
- [ ] Code obfuscation enabled

---

## 📊 Post-Deployment Monitoring

### Key Metrics

```typescript
// Track performance
export const reportWebVitals = () => {
  web_vitals.getCLS(console.log);
  web_vitals.getFID(console.log);
  web_vitals.getFCP(console.log);
  web_vitals.getLCP(console.log);
  web_vitals.getTTFB(console.log);
};
```

### Alerting Rules

**Web**:
- 5xx errors > 10 per minute
- API response time > 5 seconds
- Failed transactions > 1%

**Mobile**:
- Crash rate > 0.1%
- ANR (App Not Responding) > 0.01%
- Battery drain > expected baseline

### Log Aggregation

**Cloud Logging Setup**:
```bash
# View logs
gcloud logging read "resource.type=gae_app" --limit 50

# Create alert
gcloud alpha monitoring policies create \
  --notification-channels=<CHANNEL_ID> \
  --display-name="High Error Rate"
```

---

## 🚀 Rollout Strategy

### Phased Rollout

**Phase 1: Internal Testing**
- 5% of users (1 day)
- Monitor errors and crashes
- Check backend compatibility

**Phase 2: Staged Release**
- 25% of users (2 days)
- Verify analytics and feedback
- Performance check

**Phase 3: Full Release**
- 100% of users
- Continue monitoring
- Prepare rollback plan

### Rollback Procedure

**Web**:
```bash
# Revert to previous deployment
vercel rollback

# Or with Docker
docker run registry.example.com/aq-immune-web:0.9.9
```

**Mobile**:
```bash
# iOS: Manage app versions in App Store Connect
# Android: Create new release with previous APK

# Over-the-air rollback
eas update:republish --branch=production --message="Rollback to v1.0.0"
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review approved
- [ ] No security vulnerabilities
- [ ] Documentation updated
- [ ] Changelog entry added
- [ ] Version bumped
- [ ] Staging tested

### Deployment
- [ ] Build succeeds
- [ ] Artifacts generated
- [ ] Deployment configuration correct
- [ ] Secrets properly injected
- [ ] Health checks configured

### Post-Deployment
- [ ] Monitor for errors
- [ ] Check analytics
- [ ] User feedback monitored
- [ ] Performance metrics acceptable
- [ ] All features working
- [ ] Notifications working
- [ ] Database migrations completed (if applicable)

---

## 🆘 Emergency Procedures

### Web Application Down
1. Check deployment status
2. Review recent logs
3. Verify backend connectivity
4. Rollback if necessary
5. Post status update
6. Investigation post-mortem

### High Error Rate
```bash
# Check error logs
tail -f logs/error.log | grep ERROR

# Clear caches
redis-cli flushdb

# Restart services
docker-compose restart web
```

### API Connectivity Issues
1. Verify backend is up
2. Check API endpoint configuration
3. Review firewall rules
4. Test API connectivity
5. Check JWT tokens
6. Verify CORS settings

---

## 📞 Support & Escalation

**On-Call Support**: 
- P1 (Critical): Immediate response
- P2 (High): 1 hour response
- P3 (Medium): 4 hour response
- P4 (Low): Next business day

**Contact**: #aq-immune-incidents on Slack

---

**Last Updated**: February 2026
**Maintained By**: Engineering Team
