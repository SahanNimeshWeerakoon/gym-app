import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Divider, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { markUserAsVisited } from '../store/attendanceSlice';
import { calculateUserStats, getDayName, formatDateForDisplay } from '../utils/attendanceHelper';
import { format, isToday, isBefore, parse, startOfToday } from 'date-fns';
import { usersStorage, attendanceStorage } from '../utils/storage';

export const UserDetailScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { userId } = route.params;
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const attendance = useSelector((state: RootState) => state.attendance.records);
  const user = users.find(u => u.id === userId);
  const [stats, setStats] = useState<any>(null);
  const [upcomingDates, setUpcomingDates] = useState<string[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const userStats = calculateUserStats(user, attendance);
      setStats(userStats);

      // Calculate upcoming dates
      const today = startOfToday();
      const upcoming: string[] = [];
      const next30Days = new Date(today);
      next30Days.setDate(next30Days.getDate() + 30);

      let currentDate = new Date(today);
      while (currentDate <= next30Days) {
        const dayOfWeek = currentDate.getDay();
        if (user.visitingDays.includes(dayOfWeek)) {
          upcoming.push(format(currentDate, 'yyyy-MM-dd'));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setUpcomingDates(upcoming);

      // Get recent attendance
      const userRecords = attendance
        .filter(r => r.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
      setRecentAttendance(userRecords);
    }
  }, [user, attendance]);

  if (!user || !stats) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  const handleMarkVisited = async (date: string) => {
    dispatch(markUserAsVisited({ userId, date, markedBy: 'owner' }));
    
    // Save to storage
    const record = {
      id: `${userId}-${date}`,
      userId,
      date,
      marked: true,
      markedBy: 'owner' as const,
      markedAt: new Date().toISOString(),
    };
    await attendanceStorage.addRecord(record);
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 50) return '#FFC107';
    if (percentage >= 25) return '#FF9800';
    return '#F44336';
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text variant="headlineSmall">{user.name}</Text>
              <Text variant="bodySmall" style={styles.gender}>
                {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
              </Text>
            </View>
            <View
              style={[
                styles.percentageBadge,
                { backgroundColor: getPercentageColor(stats.visitingPercentage) },
              ]}
            >
              <Text style={styles.percentageText}>{stats.visitingPercentage.toFixed(0)}%</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.label}>
              Phone:
            </Text>
            <Text variant="bodySmall">{user.phoneNumber}</Text>
            {user.hasWhatsApp && <Chip label="WhatsApp" size="small" style={styles.chip} />}
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.label}>
              Address:
            </Text>
            <Text variant="bodySmall">{user.address || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.label}>
              Visiting Days:
            </Text>
            <View style={styles.daysContainer}>
              {user.visitingDays.map(day => (
                <Chip key={day} label={getDayName(day)} size="small" style={styles.chip} />
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Statistics */}
      <Card style={styles.section}>
        <Card.Title title="Statistics" />
        <Card.Content>
          <View style={styles.statRow}>
            <Text variant="bodySmall">Total Scheduled Days:</Text>
            <Text variant="bodySmall" style={styles.statValue}>
              {stats.totalScheduledDays}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text variant="bodySmall">Total Visited Days:</Text>
            <Text variant="bodySmall" style={styles.statValue}>
              {stats.totalVisitedDays}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text variant="bodySmall">Attendance Rate:</Text>
            <Text
              variant="bodySmall"
              style={[styles.statValue, { color: getPercentageColor(stats.visitingPercentage) }]}
            >
              {stats.visitingPercentage.toFixed(2)}%
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text variant="bodySmall">Last Visit:</Text>
            <Text variant="bodySmall" style={styles.statValue}>
              {stats.lastVisitedDate ? formatDateForDisplay(stats.lastVisitedDate) : 'Not visited yet'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Upcoming Dates */}
      <Card style={styles.section}>
        <Card.Title title="Upcoming Scheduled Visits" />
        <Card.Content>
          {upcomingDates.slice(0, 5).map(date => {
            const isAttended = attendance.some(
              r => r.userId === userId && r.date === date && r.marked
            );
            return (
              <View key={date} style={styles.dateRow}>
                <View>
                  <Text variant="bodySmall" style={styles.dateText}>
                    {formatDateForDisplay(date)}
                  </Text>
                </View>
                <Button
                  mode={isAttended ? 'contained' : 'outlined'}
                  onPress={() => handleMarkVisited(date)}
                  size="small"
                  disabled={isAttended}
                >
                  {isAttended ? '✓ Attended' : 'Mark'}
                </Button>
              </View>
            );
          })}
        </Card.Content>
      </Card>

      {/* Recent Attendance */}
      {recentAttendance.length > 0 && (
        <Card style={styles.section}>
          <Card.Title title="Recent Attendance" />
          <Card.Content>
            {recentAttendance.map(record => (
              <View key={record.id} style={styles.attendanceRow}>
                <Text variant="bodySmall">{formatDateForDisplay(record.date)}</Text>
                <Chip label={record.markedBy} size="small" style={styles.chip} />
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  section: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gender: {
    color: '#888',
    marginTop: 2,
  },
  percentageBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 8,
  },
  label: {
    fontWeight: '600',
    width: 100,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  statValue: {
    fontWeight: '600',
    color: '#2196F3',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateText: {
    fontSize: 14,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
