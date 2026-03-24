import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Searchbar, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserCard } from '../components/UserCard';
import { calculateUserStats } from '../utils/attendanceHelper';
import { usersAPI } from '../utils/api';
import { setUsers, setLoading, setError } from '../store/usersSlice';

export const UserListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const attendance = useSelector((state: RootState) => state.attendance.records);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any[]>([]);
  const filteredUsers = useMemo(() => {
    if (searchQuery.trim() === '') {
      return users;
    } else {
      const query = searchQuery.toLowerCase();
      return users.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.phoneNumber.includes(query)
      );
    }
  }, [searchQuery, users]);

  // Fetch users from backend on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setLoading(true));
        const fetchedUsers = await usersAPI.getAllUsers();
        console.log({fetchedUsers});
        console.log('Dispatching setUsers with length:', fetchedUsers.length);
        dispatch(setUsers(fetchedUsers));
        dispatch(setError(null));
      } catch (error) {
        console.error('Failed to fetch users:', error);
        dispatch(setError('Failed to load users'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    const calculatedStats = users.map(user =>
      calculateUserStats(user, attendance)
    );
    setStats(calculatedStats);
  }, [users, attendance]);

  const getStatsForUser = (userId: string) => {
    return stats.find(s => s.userId === userId) || { visitingPercentage: 0 };
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search users by name or phone"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            visitingPercentage={getStatsForUser(item.id).visitingPercentage}
            onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Button onPress={() => navigation.navigate('CreateUser')}>
              No users found. Add one?
            </Button>
          </View>
        }
      />

      <FAB
        icon="plus"
        label="Add User"
        onPress={() => navigation.navigate('CreateUser')}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 8,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
