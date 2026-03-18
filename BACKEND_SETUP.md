# Backend Setup Guide

This document explains the backend API requirements for the Gym Management App.

## API Base URL Configuration

Edit `src/utils/api.ts` and replace the API_BASE_URL with your backend server:

```typescript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## Required Endpoints

### Authentication (Optional but Recommended)

```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
```

### Users Management

#### Get All Users
```
GET /api/users

Response:
[
  {
    "id": "uuid",
    "name": "John Doe",
    "gender": "male",
    "phoneNumber": "+1234567890",
    "address": "123 Main Street",
    "hasWhatsApp": true,
    "visitingDays": [1, 3, 5],
    "createdAt": "2024-01-01T10:00:00Z",
    "lastUpdated": "2024-01-01T10:00:00Z"
  }
]
```

#### Get User by ID
```
GET /api/users/:userId

Response:
{
  "id": "uuid",
  "name": "John Doe",
  "gender": "male",
  "phoneNumber": "+1234567890",
  "address": "123 Main Street",
  "hasWhatsApp": true,
  "visitingDays": [1, 3, 5],
  "createdAt": "2024-01-01T10:00:00Z",
  "lastUpdated": "2024-01-01T10:00:00Z"
}
```

#### Create User
```
POST /api/users

Body:
{
  "name": "John Doe",
  "gender": "male",
  "phoneNumber": "+1234567890",
  "address": "123 Main Street",
  "hasWhatsApp": true,
  "visitingDays": [1, 3, 5]
}

Response: (Same as Get User by ID, includes id and timestamps)
```

#### Update User
```
PUT /api/users/:userId

Body: (All fields optional)
{
  "name": "John Doe Updated",
  "gender": "male",
  "phoneNumber": "+1234567890",
  "address": "123 Main Street",
  "hasWhatsApp": true,
  "visitingDays": [1, 3, 5]
}

Response: Updated user object
```

#### Delete User
```
DELETE /api/users/:userId

Response: 
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Attendance Management

#### Get All Attendance Records
```
GET /api/attendance

Query Parameters (Optional):
- userId: string
- dateFrom: string (YYYY-MM-DD)
- dateTo: string (YYYY-MM-DD)

Response:
[
  {
    "id": "uuid",
    "userId": "uuid",
    "date": "2024-01-15",
    "marked": true,
    "markedBy": "owner",
    "markedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Attendance for Specific User
```
GET /api/attendance/user/:userId

Response:
[
  {
    "id": "uuid",
    "userId": "uuid",
    "date": "2024-01-15",
    "marked": true,
    "markedBy": "owner",
    "markedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Attendance for Specific Date
```
GET /api/attendance/date?date=2024-01-15

Response:
[
  {
    "id": "uuid",
    "userId": "uuid",
    "date": "2024-01-15",
    "marked": true,
    "markedBy": "owner",
    "markedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Mark User as Visited
```
POST /api/attendance/mark

Body:
{
  "userId": "uuid",
  "date": "2024-01-15",
  "markedBy": "owner"
}

Note: markedBy can be "owner", "user", or "whatsapp"

Response:
{
  "id": "uuid",
  "userId": "uuid",
  "date": "2024-01-15",
  "marked": true,
  "markedBy": "owner",
  "markedAt": "2024-01-15T10:30:00Z"
}
```

#### Create Attendance Record
```
POST /api/attendance

Body:
{
  "userId": "uuid",
  "date": "2024-01-15",
  "marked": true,
  "markedBy": "owner"
}

Response: Attendance record object
```

#### Delete Attendance Record
```
DELETE /api/attendance/:recordId

Response:
{
  "success": true,
  "message": "Record deleted successfully"
}
```

### Health Check
```
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Responses

All error responses should follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication failed
- `FORBIDDEN` - Authorization failed
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

## Backend Technology Recommendations

### Node.js/Express Stack
```bash
npm init -y
npm install express cors dotenv axios
npm install -D typescript ts-node @types/node
```

Example Express endpoint:
```javascript
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Database Recommendations
- **PostgreSQL** - For relational data (Users, Attendance)
- **MongoDB** - For flexibility and ease of deployment
- **Firebase Firestore** - For serverless option

### Database Schema

**Users Table/Collection:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(20),
  phoneNumber VARCHAR(20) UNIQUE,
  address TEXT,
  hasWhatsApp BOOLEAN DEFAULT false,
  visitingDays INTEGER ARRAY,
  createdAt TIMESTAMP DEFAULT NOW(),
  lastUpdated TIMESTAMP DEFAULT NOW(),
  gymOwnerId UUID REFERENCES gym_owners(id)
);
```

**Attendance Table/Collection:**
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  marked BOOLEAN DEFAULT false,
  markedBy VARCHAR(20),
  markedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(userId, date)
);
```

**Gym Owners Table/Collection:**
```sql
CREATE TABLE gym_owners (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phoneNumber VARCHAR(20),
  gymName VARCHAR(255),
  createdAt TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

Your backend should support these environment variables:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost/gym_app
CORS_ORIGIN=https://your-app-domain.com
JWT_SECRET=your-secret-key
WHATSAPP_API_KEY=your-whatsapp-api-key
```

## Testing the API

Use Postman or curl to test endpoints:

```bash
# Get all users
curl -X GET http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "gender": "male",
    "phoneNumber": "+1234567890",
    "address": "123 Main Street",
    "hasWhatsApp": true,
    "visitingDays": [1, 3, 5]
  }'

# Mark attendance
curl -X POST http://localhost:3000/api/attendance/mark \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "uuid",
    "date": "2024-01-15",
    "markedBy": "owner"
  }'
```

## Rate Limiting (Recommended)

Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## CORS Configuration

Enable CORS for your Expo app:

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://your-app-domain.com', 'exp://localhost:19000'],
  credentials: true
}));
```

## Data Synchronization Strategy

For offline-first approach:

1. **Initial Load**: Load data from local storage (AsyncStorage)
2. **Background Sync**: Periodically sync with backend every 5-10 minutes
3. **Conflict Resolution**: Last-write-wins strategy
4. **Queue Pending Changes**: Queue offline changes and sync when online

Example sync logic in hooks:

```typescript
export const useSyncAllData = () => {
  const { syncUsers } = useSyncUsers();
  const { syncAttendance } = useSyncAttendance();

  const syncAll = useCallback(async (fromAPI = false) => {
    await Promise.all([
      syncUsers(fromAPI),
      syncAttendance(fromAPI),
    ]);
  }, [syncUsers, syncAttendance]);

  return { syncAll };
};
```

## Deployment

### Heroku
```bash
heroku create your-gym-app-api
git push heroku main
heroku config:set NODE_ENV=production DATABASE_URL=...
```

### AWS Lambda + API Gateway
- Use AWS SDK and serverless framework
- Connect to RDS or DynamoDB
- Configure CORS on API Gateway

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Security Considerations

1. **Authentication**: Implement JWT tokens
2. **Authorization**: Role-based access control (RBAC)
3. **Input Validation**: Validate all inputs
4. **Rate Limiting**: Prevent brute force attacks
5. **HTTPS**: Always use HTTPS in production
6. **CORS**: Configure CORS properly
7. **SQL Injection**: Use parameterized queries
8. **Data Encryption**: Encrypt sensitive data

---

Next Steps:
1. Set up your backend server
2. Implement the API endpoints listed above
3. Update API_BASE_URL in the app
4. Test all endpoints with the mobile app
5. Implement WhatsApp messaging features (future enhancement)
