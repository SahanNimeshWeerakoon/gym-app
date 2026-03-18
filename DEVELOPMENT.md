# Development Guide

Best practices and guidelines for developing the Gym Management App.

## Code Structure

### Component Organization

```typescript
// Good: Self-contained component
const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        {/* Component JSX */}
      </Card>
    </TouchableOpacity>
  );
};

// File structure
src/components/
├── UserCard.tsx         # Single component per file
├── UserFormModal.tsx
└── index.ts            # Barrel export
```

### Screen Organization

```typescript
// Good: Screen with hooks and Redux integration
export const UserListScreen: React.FC<ScreenProps> = ({ navigation }) => {
  // 1. Redux hooks first
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch = useDispatch();

  // 2. React hooks
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Effects
  useEffect(() => {
    loadData();
  }, []);

  // 4. Handlers
  const handlePress = () => { /* ... */ };

  // 5. JSX
  return (
    <View style={styles.container}>
      {/* JSX */}
    </View>
  );
};

// File structure
src/screens/
├── DashboardScreen.tsx
├── UserListScreen.tsx
└── index.ts
```

## Redux Best Practices

### Creating a Slice

```typescript
// Good: Following Redux Toolkit patterns
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyType } from '../types';

interface MyState {
  items: MyType[];
  loading: boolean;
  error: string | null;
}

const initialState: MyState = {
  items: [],
  loading: false,
  error: null,
};

const mySlice = createSlice({
  name: 'my',
  initialState,
  reducers: {
    // Synchronous actions
    setItems: (state, action: PayloadAction<MyType[]>) => {
      state.items = action.payload;
    },
    // Async thunks for complex logic
  },
});

export const { setItems } = mySlice.actions;
export default mySlice.reducer;
```

### Using Redux in Components

```typescript
// Good: Optimized selector usage
const MyComponent: React.FC = () => {
  // Use specific selectors, not entire state
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch = useDispatch();

  return (
    <View>
      {users.map(user => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
};

// Bad: Don't subscribe to entire state
const users = useSelector((state: RootState) => state); // ❌
```

## TypeScript Guidelines

### Type Definitions

```typescript
// Good: Clear, specific types
interface User {
  id: string;
  name: string;
  visitingDays: number[]; // 0-6
  hasWhatsApp: boolean;
  createdAt: string; // ISO string
}

// Good: Enums for constants
enum MarkedBy {
  Owner = 'owner',
  User = 'user',
  WhatsApp = 'whatsapp',
}

// Good: Using 'as const' for string literals
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

type Role = typeof ROLES[keyof typeof ROLES];
```

### Component Props

```typescript
// Good: Explicit prop types
interface UserCardProps {
  user: User;
  onPress?: () => void;
  isAttended?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  isAttended = false,
}) => {
  // ...
};

// Bad: Using 'any' type
export const UserCard: React.FC<any> = (props) => { // ❌
  // ...
};
```

## Storage Patterns

### Saving Data

```typescript
// Good: Consistent storage pattern
import { usersStorage } from './utils/storage';

const handleAddUser = async (user: User) => {
  try {
    // 1. Save to Redux
    dispatch(addUser(user));
    
    // 2. Save to AsyncStorage
    await usersStorage.addUser(user);
    
    // 3. Show feedback
    showMessage('User added successfully');
  } catch (error) {
    console.error('Error:', error);
    showMessage('Failed to add user');
  }
};
```

### Loading Data

```typescript
// Good: Load from storage, sync from API if available
const loadData = async () => {
  try {
    setLoading(true);
    
    // 1. Load from local storage (fast)
    const localUsers = await usersStorage.getAllUsers();
    dispatch(setUsers(localUsers));
    
    // 2. Try to sync from API (background)
    try {
      const apiUsers = await usersAPI.getAllUsers();
      dispatch(setUsers(apiUsers));
      await usersStorage.saveUsers(apiUsers);
    } catch (apiError) {
      console.warn('API sync failed, using cached data', apiError);
    }
  } finally {
    setLoading(false);
  }
};
```

## API Integration

### Axios Patterns

```typescript
// Good: Structured API calls with error handling
export const usersAPI = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  createUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    try {
      const response = await apiClient.post('/users', user);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};
```

### Using in Components

```typescript
// Good: Handle API calls with loading states
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchUsers = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await usersAPI.getAllUsers();
    dispatch(setUsers(data));
  } catch (err: any) {
    setError(err.message || 'Failed to fetch users');
  } finally {
    setLoading(false);
  }
};
```

## Performance Tips

### Memoization

```typescript
// Good: Prevent unnecessary re-renders
import { memo } from 'react';

const UserCard = memo<UserCardProps>(({ user, onPress }) => {
  return <Card>{/* ... */}</Card>;
}, (prevProps, nextProps) => {
  // Return true if props are equal (don't re-render)
  return prevProps.user.id === nextProps.user.id;
});
```

### useMemo for Calculations

```typescript
// Good: Memoize expensive calculations
const filteredUsers = useMemo(() => {
  return users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
}, [users, search]);
```

### useCallback for Functions

```typescript
// Good: Stable function reference
const handlePress = useCallback((userId: string) => {
  navigation.navigate('UserDetail', { userId });
}, [navigation]);

// Use in child components
<UserCard key={user.id} user={user} onPress={handlePress} />
```

## Navigation Patterns

### Stack Navigation

```typescript
// Good: Named routes with types
<Stack.Navigator>
  <Stack.Screen
    name="UserList"
    component={UserListScreen}
    options={{ title: 'All Users' }}
  />
  <Stack.Screen
    name="UserDetail"
    component={UserDetailScreen}
    options={({ route }: any) => ({
      title: route.params?.userId,
    })}
  />
</Stack.Navigator>

// Navigate with params
navigation.navigate('UserDetail', { userId: '123' });

// Receive params
const { userId } = route.params;
```

### Tab Navigation

```typescript
// Good: Bottom tab configuration
<Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      const iconName = getIconName(route.name);
      return <Icon name={iconName} size={size} color={color} />;
    },
  })}
>
  <Tab.Screen name="Dashboard" component={DashboardStack} />
  <Tab.Screen name="Users" component={UsersStack} />
  <Tab.Screen name="Filters" component={FiltersStack} />
</Tab.Navigator>
```

## Styling Guidelines

```typescript
// Good: Organized StyleSheet
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  // Group related styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

// Use in component
<View style={styles.container}>
  <View style={styles.header}>
    <Text style={styles.title}>Title</Text>
  </View>
</View>
```

## Error Handling

```typescript
// Good: Comprehensive error handling
const fetchData = async () => {
  try {
    // Attempt operation
    const data = await api.get('/data');
    setData(data);
  } catch (error: any) {
    // Handle different error types
    if (error.response) {
      // Server error (4xx, 5xx)
      console.error('Server error:', error.response.status);
      setError(`Server error: ${error.response.status}`);
    } else if (error.request) {
      // Request made but no response
      console.error('Network error');
      setError('Network error - check your connection');
    } else {
      // Other errors
      console.error('Error:', error.message);
      setError(error.message);
    }
  } finally {
    setLoading(false);
  }
};
```

## Testing Guidelines

```typescript
// Good: Testable component structure
interface UserCardProps {
  user: User;
  onPress: () => void;
}

// Pure component - easy to test
const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} testID={`user-card-${user.id}`}>
      <Text testID="user-name">{user.name}</Text>
    </TouchableOpacity>
  );
};

// Test
describe('UserCard', () => {
  it('should render user name', () => {
    const { getByTestId } = render(
      <UserCard user={mockUser} onPress={jest.fn()} />
    );
    expect(getByTestId('user-name')).toHaveTextContent('John');
  });
});
```

## Debugging Tips

### Redux DevTools
```typescript
// In development, log state changes
if (__DEV__) {
  console.log('State:', store.getState());
}
```

### Console Logging
```typescript
// Good: Structured logging
console.log('User loaded:', { userId: user.id, name: user.name });
console.warn('Missing prop:', propertyName);
console.error('Failed to fetch:', error.message);

// Bad: Unclear logs
console.log('test'); // ❌
console.log(user); // Too verbose ❌
```

### React DevTools
1. Install React DevTools browser extension
2. Run app with `npm start`
3. Connect debugger
4. Inspect component tree

## Git Workflow

```bash
# Feature branch
git checkout -b feature/user-search

# Good commit messages
git commit -m "feat: add user search functionality"
git commit -m "fix: attendance filter showing wrong dates"
git commit -m "refactor: simplify attendance calculations"

# Push and create PR
git push origin feature/user-search
```

## Performance Monitoring

```typescript
// Monitor render performance
import { PerformanceObserver, performance } from 'perf_hooks';

const startMeasure = (label: string) => {
  performance.mark(`${label}-start`);
};

const endMeasure = (label: string) => {
  performance.mark(`${label}-end`);
  performance.measure(label, `${label}-start`, `${label}-end`);
  const measure = performance.getEntriesByName(label)[0];
  console.log(`${label}: ${measure.duration}ms`);
};
```

## Security Best Practices

```typescript
// Good: Never expose sensitive data
const apiCall = async (user: User) => {
  // Don't log sensitive data
  console.log('User ID:', user.id); // ✅ Safe
  console.log('User:', user); // ⚠️ May contain sensitive data
  
  // Validate inputs
  if (!user.phoneNumber.match(/^\d{10}$/)) {
    throw new Error('Invalid phone number');
  }
  
  // Use HTTPS only
  const API_BASE_URL = 'https://api.example.com'; // ✅
  // const API_BASE_URL = 'http://api.example.com'; // ❌
};
```

## Code Review Checklist

- [ ] TypeScript types are complete
- [ ] No `any` types used
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Redux state properly used
- [ ] No console.log in production code
- [ ] Styling responsive and consistent
- [ ] Navigation tested
- [ ] Performance optimized
- [ ] Comments for complex logic

---

For questions, refer to:
- [README.md](./README.md)
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- Official docs: [React Native](https://reactnative.dev), [Expo](https://docs.expo.dev/), [Redux](https://redux.js.org/)
