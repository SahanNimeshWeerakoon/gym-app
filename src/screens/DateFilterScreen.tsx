import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { UserCard } from '../components/UserCard';
import { getUsersForDate, formatDateForDisplay } from '../utils/attendanceHelper';
import { format } from 'date-fns';
import { markUserAsVisited } from '../store/attendanceSlice';
import { attendanceStorage } from '../utils/storage';

export const DateFilterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const users = useSelector((state: RootState) => state.users.users);
  const attendance = useSelector((state: RootState) => state.attendance.records);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  useEffect(() => {
    const usersForDate = getUsersForDate(users, selectedDate, attendance);
    setFilteredUsers(usersForDate);
  }, [selectedDate, users, attendance]);

  const handleMarkAttended = async (userId: string) => {
    dispatch(markUserAsVisited({ userId, date: selectedDate, markedBy: 'owner' }));
    
    const record = {
      id: `${userId}-${selectedDate}`,
      userId,
      date: selectedDate,
      marked: true,
      markedBy: 'owner' as const,
      markedAt: new Date().toISOString(),
    };
    await attendanceStorage.addRecord(record);
  };

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#2196F3',
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#2196F3',
            todayTextColor: '#2196F3',
          }}
        />
      </View>

      <View style={styles.dateInfo}>
        <Text variant="titleMedium">
          {formatDateForDisplay(selectedDate)}
        </Text>
        <Text variant="bodySmall" style={styles.count}>
          {filteredUsers.length} users scheduled
        </Text>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.user.id}
        renderItem={({ item }) => (
          <UserCard
            user={item.user}
            isAttended={item.attended}
            showMarkButton={true}
            onMarkVisited={() => handleMarkAttended(item.user.id)}
            onPress={() => navigation.navigate('UserDetail', { userId: item.user.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  calendarContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  dateInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  count: {
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 16,
  },
});
