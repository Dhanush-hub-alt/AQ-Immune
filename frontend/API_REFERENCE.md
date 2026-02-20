# AQ-Immune Frontend - API Reference

Complete API endpoint documentation and usage examples for the AQ-Immune frontend application.

## 📌 Base Configuration

**Base URL**: `http://localhost:8080` (development)  
**Production URL**: `https://api.aq-immune.com`  
**Protocol**: HTTP/HTTPS  
**Authentication**: Bearer Token (JWT)  

## 🔐 Authentication

### Headers Required
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Obtaining Token
```typescript
// Firebase provides JWT token
const token = await user.getIdToken();

// Token automatically included in API calls via interceptor
// See: src/services/api.ts
```

---

## 📡 Sensor Endpoints

### Get All Sensors
```
GET /api/sensors
```

**Parameters**:
```typescript
{
  skip?: number;      // Pagination offset
  limit?: number;     // Results per page (default: 20)
  status?: string;    // 'online' | 'offline' | 'inactive'
  userId?: string;    // Filter by owner
}
```

**Response**:
```typescript
{
  success: true,
  data: [
    {
      id: "sensor_123",
      deviceName: "Office Sensor",
      location: "3rd Floor, Building A",
      latitude: 37.7749,
      longitude: -122.4194,
      status: "online",
      lastUpdate: "2024-02-15T10:30:00Z",
      owner: "user_456",
      timezone: "America/Los_Angeles",
      calibrationDate: "2024-01-01T00:00:00Z",
      installationDate: "2023-12-01T00:00:00Z",
      notes: "Main office sensor"
    }
  ]
}
```

### Get Single Sensor
```
GET /api/sensors/{sensorId}
```

**Response**:
```typescript
{
  success: true,
  data: { /* SensorDevice object */ }
}
```

### Create Sensor
```
POST /api/sensors
```

**Request Body**:
```typescript
{
  deviceName: "New Sensor",
  location: "Conference Room",
  latitude: 37.7749,
  longitude: -122.4194,
  timezone: "America/Los_Angeles",
  notes?: "Optional notes"
}
```

**Response**:
```typescript
{
  success: true,
  data: { /* Created SensorDevice */ }
}
```

### Update Sensor
```
PUT /api/sensors/{sensorId}
```

**Request Body**: Same as create (partial update supported)

### Delete Sensor
```
DELETE /api/sensors/{sensorId}
```

**Response**:
```typescript
{
  success: true,
  message: "Sensor deleted successfully"
}
```

---

## 📊 Sensor Data Endpoints

### Get Latest Readings
```
GET /api/sensors/data/latest
```

**Parameters**:
```typescript
{
  sensorId?: string;  // Specific sensor, or all if omitted
  limit?: number;     // Number of readings (default: 10)
}
```

**Response**:
```typescript
{
  success: true,
  data: [
    {
      id: "data_123",
      sensorId: "sensor_123",
      deviceName: "Office Sensor",
      location: "3rd Floor",
      pm25: 35.2,
      pm10: 62.4,
      co2: 420,
      temperature: 22.5,
      humidity: 45,
      timestamp: "2024-02-15T10:30:00Z",
      aqi: 98,
      aqiDescription: "Moderate",
      status: "moderate"
    }
  ]
}
```

### Get Historical Data
```
GET /api/sensors/data/history
```

**Parameters**:
```typescript
{
  sensorId: string;           // Required
  startDate: string;          // ISO 8601 format
  endDate: string;            // ISO 8601 format
  interval?: string;          // 'hourly' | 'daily' | 'weekly'
  metrics?: string[];         // ['pm25', 'pm10', 'co2', etc.]
  skip?: number;
  limit?: number;
}
```

**Response**:
```typescript
{
  success: true,
  data: [
    {
      timestamp: "2024-02-15T10:00:00Z",
      pm25: 35.2,
      pm10: 62.4,
      co2: 420,
      temperature: 22.5,
      humidity: 45,
      aqi: 98
    }
  ]
}
```

### Get Aggregated Data
```
GET /api/sensors/data/aggregate
```

**Parameters**:
```typescript
{
  sensorId: string;
  startDate: string;
  endDate: string;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
}
```

**Response**:
```typescript
{
  success: true,
  data: {
    pm25: {
      avg: 35.2,
      min: 20.1,
      max: 89.5,
      samples: 1440
    },
    pm10: {
      avg: 62.4,
      min: 40.2,
      max: 150.3,
      samples: 1440
    },
    co2: {
      avg: 420,
      min: 398,
      max: 850,
      samples: 1440
    },
    // ... temperature, humidity
  }
}
```

### Stream Real-time Data
```
WebSocket: ws://localhost:8080/api/sensors/stream
```

**Subscribe**:
```typescript
const ws = new WebSocket('ws://localhost:8080/api/sensors/stream');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    sensorIds: ['sensor_123', 'sensor_456'],
    token: 'JWT_TOKEN'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('New reading:', data);
  // Structure matches GET /latest response
};
```

---

## 🚨 Alert Endpoints

### Get Alerts
```
GET /api/alerts
```

**Parameters**:
```typescript
{
  userId?: string;
  status?: 'read' | 'unread';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  sensorId?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  limit?: number;
}
```

**Response**:
```typescript
{
  success: true,
  data: [
    {
      id: "alert_123",
      deviceId: "sensor_123",
      deviceName: "Office Sensor",
      type: "pm25" | "pm10" | "co2" | "temperature" | "humidity" | "device_offline",
      severity: "high",
      message: "PM2.5 levels exceeded threshold",
      value: 156,
      threshold: 150,
      timestamp: "2024-02-15T10:30:00Z",
      read: false,
      userId: "user_456"
    }
  ]
}
```

### Mark Alert as Read
```
PUT /api/alerts/{alertId}/read
```

**Response**:
```typescript
{
  success: true,
  data: { /* Updated Alert */ }
}
```

### Mark All as Read
```
PUT /api/alerts/read-all
```

**Parameters**:
```typescript
{
  userId: string;
}
```

### Delete Alert
```
DELETE /api/alerts/{alertId}
```

### Create Alert Rule
```
POST /api/alerts/rules
```

**Request Body**:
```typescript
{
  sensorId: string;
  type: "pm25" | "pm10" | "co2" | "temperature" | "humidity";
  threshold: number;
  severity: "low" | "medium" | "high" | "critical";
  enabled: true;
  notifyVia: ["email", "push"];
}
```

---

## 👤 User Endpoints

### Get User Profile
```
GET /api/users/profile
```

**Response**:
```typescript
{
  success: true,
  data: {
    id: "user_456",
    email: "user@example.com",
    displayName: "John Doe",
    photoURL: "https://...",
    role: "user" | "admin",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-02-15T10:30:00Z",
    preferences: {
      theme: "light" | "dark",
      language: "en",
      units: "metric" | "imperial",
      aqi_standard: "us" | "cn" | "eu",
      notifications_enabled: true
    },
    notificationSettings: {
      email: true,
      push: true,
      sms: false,
      alert_threshold: {
        pm25: 150,
        pm10: 300,
        co2: 1000,
        temperature: { min: 15, max: 30 },
        humidity: { min: 30, max: 70 }
      }
    },
    linkedDevices: ["sensor_123", "sensor_456"]
  }
}
```

### Update User Profile
```
PUT /api/users/profile
```

**Request Body** (partial update):
```typescript
{
  displayName?: "New Name",
  photoURL?: "https://...",
  preferences?: { /* updated preferences */ }
}
```

### Update Notification Settings
```
PUT /api/users/notifications
```

**Request Body**:
```typescript
{
  email: boolean;
  push: boolean;
  sms: boolean;
  alert_threshold: {
    pm25: 150,
    pm10: 300,
    co2: 1000,
    temperature: { min: 15, max: 30 },
    humidity: { min: 30, max: 70 }
  }
}
```

### Change Password
```
POST /api/users/change-password
```

**Request Body**:
```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

### Delete Account
```
DELETE /api/users/account
```

**Parameters**:
```typescript
{
  password: string;  // Confirm with password
}
```

---

## 📈 Report Endpoints

### Generate Report
```
POST /api/reports/generate
```

**Request Body**:
```typescript
{
  sensorId: string;
  startDate: string;      // ISO 8601
  endDate: string;        // ISO 8601
  format: "pdf" | "csv" | "json";
  metrics?: ["pm25", "pm10", "co2", "temperature", "humidity"];
  title?: "Custom Report Title";
}
```

**Response**:
```typescript
{
  success: true,
  data: {
    id: "report_123",
    downloadUrl: "https://...",
    generatedAt: "2024-02-15T10:30:00Z",
    expiresAt: "2024-02-22T10:30:00Z"
  }
}
```

### Get Report History
```
GET /api/reports
```

**Parameters**:
```typescript
{
  sensorId?: string;
  skip?: number;
  limit?: number;
}
```

### Download Report
```
GET /api/reports/{reportId}/download
```

---

## 👨‍💼 Admin Endpoints

### Get All Users
```
GET /api/admin/users
```

**Parameters**:
```typescript
{
  role?: "admin" | "user";
  skip?: number;
  limit?: number;
  searchTerm?: string;
}
```

**Response**:
```typescript
{
  success: true,
  data: [
    {
      id: "user_123",
      email: "user@example.com",
      displayName: "User Name",
      role: "user",
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: "2024-02-15T10:30:00Z",
      sensorCount: 3,
      status: "active" | "inactive"
    }
  ]
}
```

### Update User Role
```
PUT /api/admin/users/{userId}/role
```

**Request Body**:
```typescript
{
  role: "admin" | "user"
}
```

### Get System Statistics
```
GET /api/admin/stats
```

**Response**:
```typescript
{
  success: true,
  data: {
    totalUsers: 1250,
    totalSensors: 4320,
    totalReadings: 5243200,
    activeSensors: 4100,
    offlineSensors: 220,
    criticalAlerts: 45,
    averageAQI: 85,
    lastUpdate: "2024-02-15T10:30:00Z"
  }
}
```

### Get Sensor Health Report
```
GET /api/admin/sensors/health
```

**Response**:
```typescript
{
  success: true,
  data: [
    {
      sensorId: "sensor_123",
      name: "Office Sensor",
      status: "online" | "offline" | "error",
      lastUpdate: "2024-02-15T10:30:00Z",
      uptime: 99.8,
      reliability: 99.5,
      batteryLevel?: 85,
      errorCount: 2,
      lastError?: "Connection timeout"
    }
  ]
}
```

---

## ⚠️ Error Responses

All endpoints return standardized error responses:

```typescript
{
  success: false,
  message: "Error description",
  errorCode: "ERROR_CODE",
  details?: {
    field: ["specific error message"]
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | User lacks permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| DUPLICATE_ERROR | 409 | Resource already exists |
| RATE_LIMIT | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

---

## 🔄 Pagination

All list endpoints support pagination:

```typescript
GET /api/endpoint?skip=0&limit=20

Response:
{
  success: true,
  data: [ /* items */ ],
  pagination: {
    skip: 0,
    limit: 20,
    total: 156,
    hasMore: true
  }
}
```

---

## ⏱️ Rate Limiting

- **Rate Limit**: 1000 requests per hour per user
- **Headers**: 
  ```
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 999
  X-RateLimit-Reset: 1708007400
  ```

---

## 🧪 Testing with cURL

### Get Sensors
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/sensors
```

### Create Alert Rule
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "sensor_123",
    "type": "pm25",
    "threshold": 150,
    "severity": "high"
  }' \
  http://localhost:8080/api/alerts/rules
```

---

## 📚 Usage Examples

### Get and Display Sensor Data

```typescript
import { sensorAPI } from '@/services/api';

// Fetch latest readings
const response = await sensorAPI.getLatestReadings('sensor_123', 10);
if (response.success) {
  const readings = response.data;
  console.log(`Latest PM2.5: ${readings[0].pm25}`);
}
```

### Subscribe to Real-time Updates

```typescript
import { sensorService } from '@/services/firebase';

// Subscribe to sensor updates
sensorService.subscribeSensorData('sensor_123', (data) => {
  console.log('New reading:', data);
  // Update UI with new data
});
```

### Handle Errors

```typescript
try {
  const data = await sensorAPI.getSensors();
} catch (error) {
  if (error.response?.status === 401) {
    console.log('Please log in again');
    // Redirect to login
  } else if (error.response?.status === 404) {
    console.log('Sensor not found');
  } else {
    console.log('Error:', error.message);
  }
}
```

---

## 📞 Support

- **Issues**: Create GitHub issue with API error details
- **Documentation**: See full API docs in backend repo
- **Contact**: api-support@aq-immune.com

---

**Last Updated**: February 2026
**API Version**: 1.0.0
**Maintained By**: Backend Team
