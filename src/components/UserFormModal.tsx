import React, { useState } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Button, TextInput, SegmentedButtons, Checkbox } from 'react-native-paper';
import { User } from '../types';
import { getDayName } from '../utils/attendanceHelper';

interface UserFormProps {
  onSave: (user: Omit<User, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  initialUser?: User;
  visible: boolean;
  onClose: () => void;
}

export const UserFormModal: React.FC<UserFormProps> = ({
  onSave,
  initialUser,
  visible,
  onClose,
}) => {
  const [name, setName] = useState(initialUser?.name || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialUser?.gender || 'male');
  const [phoneNumber, setPhoneNumber] = useState(initialUser?.phoneNumber || '');
  const [address, setAddress] = useState(initialUser?.address || '');
  const [hasWhatsApp, setHasWhatsApp] = useState(initialUser?.hasWhatsApp || false);
  const [visitingDays, setVisitingDays] = useState<number[]>(initialUser?.visitingDays || []);

  const toggleDay = (day: number) => {
    setVisitingDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!name.trim() || !phoneNumber.trim() || visitingDays.length === 0) {
      alert('Please fill all required fields and select at least one visiting day');
      return;
    }

    onSave({
      name,
      gender,
      phoneNumber,
      address,
      hasWhatsApp,
      visitingDays,
    });

    // Reset form
    setName('');
    setGender('male');
    setPhoneNumber('');
    setAddress('');
    setHasWhatsApp(false);
    setVisitingDays([]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />

          <SegmentedButtons
            value={gender}
            onValueChange={value => setGender(value as 'male' | 'female' | 'other')}
            buttons={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
            style={styles.segment}
          />

          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />

          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            mode="outlined"
            multiline
          />

          <View style={styles.checkboxContainer}>
            <Checkbox.Item
              label="WhatsApp Available"
              status={hasWhatsApp ? 'checked' : 'unchecked'}
              onPress={() => setHasWhatsApp(!hasWhatsApp)}
            />
          </View>

          <View style={styles.daysContainer}>
            <View style={styles.daysLabel}>
              {[0, 1, 2, 3, 4, 5, 6].map(day => (
                <View key={day} style={styles.dayCheckbox}>
                  <Checkbox
                    status={visitingDays.includes(day) ? 'checked' : 'unchecked'}
                    onPress={() => toggleDay(day)}
                  />
                  <View style={{ marginLeft: 8 }}>
                    <View style={styles.dayName}>{getDayName(day)}</View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <Button mode="contained" onPress={handleSave} style={styles.button}>
              Save
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                setName('');
                setGender('male');
                setPhoneNumber('');
                setAddress('');
                setHasWhatsApp(false);
                setVisitingDays([]);
                onClose();
              }}
              style={styles.button}
            >
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: 50,
  },
  content: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  input: {
    marginBottom: 12,
  },
  segment: {
    marginBottom: 12,
  },
  checkboxContainer: {
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  daysContainer: {
    marginBottom: 16,
  },
  daysLabel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  dayName: {
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
