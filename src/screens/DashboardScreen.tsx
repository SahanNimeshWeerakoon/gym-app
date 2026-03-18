import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, FAB, Card, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUsers } from '../store/usersSlice';
import { setAttendanceRecords } from '../store/attendanceSlice';
import { usersStorage, attendanceStorage } from '../utils/storage';
import { UserCard } from '../components/UserCard';
import { calculateUserStats } from '../utils/attendanceHelper';

export const DashboardScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const attendance = useSelector((state: RootState) => state.attendance.records);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [users, attendance]);

  const loadData = async () => {
    try {
      setLoading(true);
      const loadedUsers = await usersStorage.getAllUsers();
      const loadedAttendance = await attendanceStorage.getAllRecords();
      
      dispatch(setUsers(loadedUsers));
      dispatch(setAttendanceRecords(loadedAttendance));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const calculatedStats = users.map(user =>
      calculateUserStats(user, attendance)
    );
    setStats(calculatedStats);
  };

  const totalUsers = users.length;
  const avgAttendance =
    stats.length > 0
      ? (stats.reduce((sum, s) => sum + s.visitingPercentage, 0) / stats.length).toFixed(1)
      : 0;

  const topAttenders = stats
    .sort((a, b) => b.visitingPercentage - a.visitingPercentage)
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text variant="labelSmall" style={styles.statLabel}>
                Total Users
              </Text>
              <Text variant="displaySmall" style={styles.statValue}>
                {totalUsers}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text variant="labelSmall" style={styles.statLabel}>
                Avg Attendance
              </Text>
              <Text variant="displaySmall" style={styles.statValue}>
                {avgAttendance}%
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* All Users */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            All Users
          </Text>
          {users.length > 0 ? (
            users.map(user => {
              const stat = stats.find(s => s.userId === user.id);
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  visitingPercentage={stat?.visitingPercentage || 0}
                  onPress={() => navigation.navigate('UserDetail', { userId: user.id })}
                />
              );
            })
          ) : (
            <Text style={styles.noUsersText}>No users yet. Tap the + button to add your first user.</Text>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Actions
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('UserList')}
            style={styles.actionButton}
          >
            View All Users
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('DateFilter')}
            style={styles.actionButton}
          >
            Filter by Date
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('PercentageFilter')}
            style={styles.actionButton}
          >
            Filter by Attendance
          </Button>
        </View>
      </ScrollView>

      {/* FAB for adding user */}
      <FAB
        icon="plus"
        label="Add User"
        onPress={() => navigation.navigate('Users', { screen: 'CreateUser' })}
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
  scrollContent: {
    paddingVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  actionButton: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  noUsersText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingHorizontal: 16,
  },
});
