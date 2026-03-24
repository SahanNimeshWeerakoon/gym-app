import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Text, Chip, Button } from 'react-native-paper';
import { User } from '../types';
import { getDayName } from '../utils/attendanceHelper';

interface UserCardProps {
  user: User;
  visitingPercentage?: number;
  onPress?: () => void;
  onMarkVisited?: () => void;
  showMarkButton?: boolean;
  isAttended?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  visitingPercentage = 0,
  onPress,
  onMarkVisited,
  showMarkButton = false,
  isAttended = false,
}) => {
  console.log({user});
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.container}>
            {/* User Image */}
            <View style={styles.imageContainer}>
              {user.imageUri ? (
                <Image source={{ uri: user.imageUri }} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* User Info */}
            <View style={styles.infoSection}>
              <Text variant="titleMedium" style={styles.name}>
                {user.name}
              </Text>

              <View style={styles.daysContainer}>
                <Text variant="bodySmall" style={styles.daysLabel}>
                  Days Coming:
                </Text>
                <View style={styles.daysChips}>
                  {(user.visitingDays ?? []).map(day => (
                    <Chip 
                      key={day} 
                      compact 
                      style={styles.dayChip} 
                    >
                      {getDayName(day)}
                    </Chip>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {showMarkButton && (
            <Button
              mode={isAttended ? 'contained' : 'outlined'}
              onPress={onMarkVisited}
              style={styles.markButton}
              textColor={isAttended ? '#fff' : undefined}
            >
              {isAttended ? '✓ Attended' : 'Mark Attended'}
            </Button>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  infoSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  daysContainer: {
    marginTop: 4,
  },
  daysLabel: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#666',
    fontSize: 12,
  },
  daysChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayChip: {
    marginBottom: 4,
  },
  markButton: {
    marginTop: 12,
  },
});
