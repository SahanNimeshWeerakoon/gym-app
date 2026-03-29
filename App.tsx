import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


import {
  DashboardScreen,
  UserListScreen,
  UserDetailScreen,
  CreateUserScreen,
  DateFilterScreen,
  PercentageFilterScreen,
} from './src/screens';

// Helper to generate header options with custom title
function getHeaderOptions(title: string) {
  return {
    headerTitle: () => <HeaderWithDate title={title} />,
    headerTitleContainerStyle: {
      width: '100%' as `${number}%`
    }
  };
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import { View, Text } from 'react-native';

function HeaderWithDate({title}: {title: string}) {
  const dateObj = new Date();
  const month = dateObj.toLocaleString('en-US', { month: 'short' });
  const dayNum = dateObj.getDate();
  const date = `${month} ${dayNum}`;
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2196F3' }}>{title}</Text>
      <Text style={{ textAlign: 'right', fontSize: 14, color: '#666' }}>
        {date && (
          <>
            <Text>{date}</Text>
            <Text
              style={{
                marginLeft: 8,
                fontStyle: 'italic',
                backgroundColor: '#E3F2FD', // light blue
                color: '#1976D2', // strong blue
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 12,
                fontWeight: 'bold',
                shadowColor: '#1976D2',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              {' ' + day}
            </Text>
          </>
        )}
      </Text>
    </View>
  );
}

// Dashboard Stack Navigator
function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#2196F3',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={props => <DashboardScreen {...props} />}
        options={() => getHeaderOptions('Dashboard')}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={() => getHeaderOptions('User Details')}
      />
    </Stack.Navigator>
  );
}

// Users Stack Navigator
function UsersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#2196F3',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="UserListHome"
        component={UserListScreen}
        options={() => getHeaderOptions('All Users')}
      />
      <Stack.Screen
        name="CreateUser"
        component={CreateUserScreen}
        options={() => getHeaderOptions('Add New User')}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={() => getHeaderOptions('User Details')}
      />
    </Stack.Navigator>
  );
}

// Filter Stack Navigator
function FiltersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#2196F3',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="DateFilterHome"
        component={DateFilterScreen}
        options={() => getHeaderOptions('Filter by Date')}
      />
      <Stack.Screen
        name="PercentageFilterHome"
        component={PercentageFilterScreen}
        options={() => getHeaderOptions('Filter by Attendance')}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={() => getHeaderOptions('User Details')}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'account-multiple' : 'account-multiple-outline';
          } else if (route.name === 'Filters') {
            iconName = focused ? 'filter' : 'filter-outline';
          }

          return (
            <MaterialCommunityIcons name={iconName as any} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Users"
        component={UsersStack}
        options={{ title: 'Users' }}
      />
      <Tab.Screen
        name="Filters"
        component={FiltersStack}
        options={{ title: 'Filters' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
