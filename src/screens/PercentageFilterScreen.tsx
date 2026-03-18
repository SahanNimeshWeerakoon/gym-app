import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, SegmentedButtons, RadioButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserCard } from '../components/UserCard';
import { calculateUserStats, filterByPercentage } from '../utils/attendanceHelper';

type PercentageRange = 'above90' | 'above80' | 'above50' | 'above25' | 'above10' | 'above1' | 'below1';

export const PercentageFilterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const users = useSelector((state: RootState) => state.users.users);
  const attendance = useSelector((state: RootState) => state.attendance.records);
  const [selectedRange, setSelectedRange] = useState<PercentageRange>('above80');
  const [filteredStats, setFilteredStats] = useState<any[]>([]);

  useEffect(() => {
    const stats = users.map(user => calculateUserStats(user, attendance));
    const filtered = filterByPercentage(stats, selectedRange);
    setFilteredStats(filtered);
  }, [selectedRange, users, attendance]);

  const getRangeLabel = (range: PercentageRange) => {
    const labels: Record<PercentageRange, string> = {
      above90: '90% - 100% Attendance',
      above80: '80% - 100% Attendance',
      above50: '50% - 100% Attendance',
      above25: '25% - 100% Attendance',
      above10: '10% - 100% Attendance',
      above1: '1% - 100% Attendance',
      below1: 'Below 1% Attendance',
    };
    return labels[range];
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.filterSection}>
          <Text variant="titleMedium" style={styles.filterTitle}>
            Filter by Attendance Rate
          </Text>
          
          <View style={styles.radioGroup}>
            {(['above90', 'above80', 'above50', 'above25', 'above10', 'above1', 'below1'] as PercentageRange[]).map(
              range => (
                <View key={range} style={styles.radioItem}>
                  <RadioButton
                    value={range}
                    status={selectedRange === range ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedRange(range)}
                  />
                  <Text style={styles.radioLabel}>{getRangeLabel(range)}</Text>
                </View>
              )
            )}
          </View>

          <Text variant="bodySmall" style={styles.resultCount}>
            {filteredStats.length} users found
          </Text>
        </View>
      </ScrollView>

      <FlatList
        data={filteredStats}
        keyExtractor={item => item.userId}
        renderItem={({ item }) => {
          const user = users.find(u => u.id === item.userId);
          return user ? (
            <UserCard
              user={user}
              visitingPercentage={item.visitingPercentage}
              onPress={() => navigation.navigate('UserDetail', { userId: user.id })}
            />
          ) : null;
        }}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
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
    paddingBottom: 16,
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  filterTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  radioGroup: {
    gap: 4,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  radioLabel: {
    marginLeft: 8,
    flex: 1,
  },
  resultCount: {
    marginTop: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  listContent: {
    paddingVertical: 8,
  },
});
