# Gym Management App - React Native Expo

A mobile application for gym owners to manage member attendance, check visiting percentages, and track gym usage patterns.

## Features

✅ **User Management**
- Create and manage gym members
- Store member details (name, gender, phone, address)
- Track scheduled visiting days
- WhatsApp integration support

✅ **Attendance Tracking**
- Mark members as visited by gym owner
- Calendar-based date filtering
- View attendance history per member
- Track attendance via date selection

✅ **Advanced Filtering**
- Filter users by visiting percentage (90%, 80%, 50%, 25%, 10%, 1%)
- Filter users by specific dates
- Real-time attendance calculations
- Search members by name or phone number

✅ **Dashboard**
- Overview statistics (total users, average attendance)
- Top attenders list
- Quick action buttons

✅ **Data Persistence**
- Local storage with AsyncStorage
- Automatic data syncing
- Offline-first architecture

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **date-fns** for date manipulation
- **AsyncStorage** for local persistence
- **Axios** for API calls

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Setup

1. **Clone/Navigate to project:**
```bash
cd gym-app
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Install Expo Vector Icons:**
```bash
expo install @expo/vector-icons expo-vector-icons MaterialCommunityIcons
```

4. **Start the development server:**
```bash
npm start
# or
yarn start
```

5. **Run on device:**

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web:**
```bash
npm run web
```

## Project Structure

```
gym-app/
├── App.tsx                          # Main app component & navigation
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
├── app.json                         # Expo configuration
│
├── src/
│   ├── screens/                     # Screen components
│   │   ├── DashboardScreen.tsx      # Home dashboard
│   │   ├── UserListScreen.tsx       # All users list
│   │   ├── UserDetailScreen.tsx     # User details & attendance
│   │   ├── CreateUserScreen.tsx     # Add new user
│   │   ├── DateFilterScreen.tsx     # Filter by date
│   │   ├── PercentageFilterScreen.tsx # Filter by attendance %
│   │   └── index.ts
│   │
│   ├── components/                  # Reusable components
│   │   ├── UserFormModal.tsx        # User creation/edit form
│   │   ├── UserCard.tsx             # User display card
│   │   └── index.ts
│   │
│   ├── store/                       # Redux store
│   │   ├── index.ts                 # Store configuration
│   │   ├── usersSlice.ts            # Users state management
│   │   └── attendanceSlice.ts       # Attendance state management
│   │
│   ├── utils/                       # Utility functions
│   │   ├── api.ts                   # API calls (configure URL)
│   │   ├── storage.ts               # AsyncStorage helpers
│   │   └── attendanceHelper.ts      # Attendance calculations
│   │
│   ├── types/                       # TypeScript types
│   │   └── index.ts                 # Type definitions
│   │
│   └── navigation/                  # Navigation configuration
│
└── assets/                          # Images, icons
```

## Configuration

### API Setup

Edit `src/utils/api.ts` and set your backend API URL:

```typescript
const API_BASE_URL = 'https://your-api.com/api'; // Replace with your API
```

### Firebase Setup (Optional)

If using Firebase for backend:

```bash
npm install firebase
```

Update `src/utils/api.ts` with Firebase configuration.

## Key Workflows

### 1. Creating a New User
1. Navigate to Users tab → Click "Add User"
2. Fill in user details and select visiting days
3. User is saved locally and synced to backend (if configured)

### 2. Marking Attendance by Date
1. Navigate to Filters tab → "Filter by Date"
2. Select a date from the calendar
3. View all users scheduled for that day
4. Click "Mark Attended" button for each user

### 3. Filtering by Attendance Percentage
1. Navigate to Filters tab → "Filter by Attendance"
2. Select desired percentage range (90%, 80%, etc.)
3. View filtered list of users

### 4. Viewing User Details
1. Tap on any user card
2. View detailed statistics:
   - Total scheduled days
   - Days attended
   - Attendance percentage
   - Last visit date
   - Upcoming scheduled visits
3. Quick mark attendance buttons

## Future Enhancements

- [ ] WhatsApp API integration for automated messages
- [ ] Export reports (PDF, CSV)
- [ ] Member notifications
- [ ] Subscription/membership management
- [ ] Revenue tracking
- [ ] GraphQL API support
- [ ] Dark mode
- [ ] Multi-language support

## Backend Integration

### Required API Endpoints

Your backend should provide the following endpoints:

**Users:**
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Attendance:**
- `GET /api/attendance` - Get all records
- `POST /api/attendance` - Create record
- `POST /api/attendance/mark` - Mark user as visited
- `GET /api/attendance/user/:userId` - Get user attendance
- `GET /api/attendance/date` - Get records for date

### Example Backend Response Format

**User:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "gender": "male",
  "phoneNumber": "1234567890",
  "address": "123 Main St",
  "hasWhatsApp": true,
  "visitingDays": [1, 3, 5],
  "createdAt": "2024-01-01T00:00:00Z",
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

**Attendance:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "date": "2024-01-15",
  "marked": true,
  "markedBy": "owner",
  "markedAt": "2024-01-15T10:30:00Z"
}
```

## Troubleshooting

### Blank Screen Issue
```bash
# Clear cache and restart
expo start --clear
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Firebase Connection Error
- Check API URL in `src/utils/api.ts`
- Verify backend is running
- Check network connectivity

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: your-email@example.com

---

**Note:** This is a frontend-only application. You'll need to build a backend API to handle data persistence, WhatsApp messaging, and other server-side logic.
