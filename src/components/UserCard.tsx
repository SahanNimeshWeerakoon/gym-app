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
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.cardWrapper}>
        {/* Top right visited button */}
        <View style={styles.topRightButtonContainer} pointerEvents="box-none">
          <Button
            icon="check"
            mode="contained"
            onPress={onMarkVisited}
            style={styles.visitedButton}
            buttonColor="#4CAF50"
            contentStyle={{justifyContent: 'center', alignItems: 'center', width: 36, height: 36}}
            compact
            disabled={isAttended}
          >
            {''}
          </Button>
        </View>
        {/* User Image on top, overlapping card */}
        <View style={styles.imageOuterContainer}>
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
        </View>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.container}>
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 24,
  },
  topRightButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  visitedButton: {
    borderRadius: 20,
    minWidth: 36,
    minHeight: 36,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    paddingTop: 40,
    overflow: 'visible',
    elevation: 3,
  },
  imageOuterContainer: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
