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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={({ route }: any) => ({
          title: 'User Details',
        })}
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
        options={{ title: 'All Users' }}
      />
      <Stack.Screen
        name="CreateUser"
        component={CreateUserScreen}
        options={{ title: 'Add New User' }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{ title: 'User Details' }}
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
        options={{ title: 'Filter by Date' }}
      />
      <Stack.Screen
        name="PercentageFilterHome"
        component={PercentageFilterScreen}
        options={{ title: 'Filter by Attendance' }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{ title: 'User Details' }}
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
