import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 50) return '#FFC107';
    if (percentage >= 25) return '#FF9800';
    return '#F44336';
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.nameSection}>
              <Text variant="titleMedium" style={styles.name}>
                {user.name}
              </Text>
              {visitingPercentage > 0 && (
                <View
                  style={[
                    styles.percentageChip,
                    { backgroundColor: getPercentageColor(visitingPercentage) },
                  ]}
                >
                  <Text style={styles.percentageText}>{visitingPercentage.toFixed(0)}%</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.label}>
              Phone:
            </Text>
            <Text variant="bodySmall">{user.phoneNumber}</Text>
            {user.hasWhatsApp && (
              <Chip
                size="small"
                style={styles.whatsappChip}
                label="WhatsApp"
                icon="whatsapp"
              />
            )}
          </View>

          {user.address && (
            <View style={styles.infoRow}>
              <Text variant="bodySmall" style={styles.label}>
                Address:
              </Text>
              <Text variant="bodySmall" numberOfLines={1}>
                {user.address}
              </Text>
            </View>
          )}

          <View style={styles.daysRow}>
            <Text variant="bodySmall" style={styles.label}>
              Days:
            </Text>
            <View style={styles.daysChips}>
              {user.visitingDays.map(day => (
                <Chip key={day} size="small" label={getDayName(day)} style={styles.dayChip} />
              ))}
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
  header: {
    marginBottom: 8,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  percentageChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  percentageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 8,
  },
  label: {
    fontWeight: '600',
    width: 50,
  },
  whatsappChip: {
    marginLeft: 'auto',
  },
  daysRow: {
    marginVertical: 8,
  },
  daysChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  dayChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  markButton: {
    marginTop: 8,
  },
});
