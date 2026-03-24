import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { Button, TextInput, SegmentedButtons, Checkbox, Text } from 'react-native-paper';
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
  const [imageUri, setImageUri] = useState<string | undefined>(initialUser?.imageUri);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Ensure file input is created for web platform
      if (!fileInputRef.current) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        input.onchange = handleImageSelected as any;
        if (fileInputRef as any) {
          (fileInputRef as any).current = input;
        }
      }
    }
  }, []);

  const toggleDay = (day: number) => {
    setVisitingDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleImagePick = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // For mobile platforms, you would integrate with expo-image-picker here
      alert('Image upload is available on web. For mobile, consider using expo-image-picker.');
    }
  };

  const handleImageSelected = (event: any) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setImageUri(base64String);
      };
      reader.readAsDataURL(file);
    }
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
      imageUri,
    });

    // Reset form
    setName('');
    setGender('male');
    setPhoneNumber('');
    setAddress('');
    setHasWhatsApp(false);
    setVisitingDays([]);
    setImageUri(undefined);
    onClose();
  };

  const handleCancel = () => {
    setName('');
    setGender('male');
    setPhoneNumber('');
    setAddress('');
    setHasWhatsApp(false);
    setVisitingDays([]);
    setImageUri(undefined);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Image Upload Section */}
          <View style={styles.imageSection}>
            <TouchableOpacity 
              style={styles.imageContainer}
              onPress={handleImagePick}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Button icon="camera-plus">Select Image</Button>
                </View>
              )}
            </TouchableOpacity>
            {imageUri && (
              <Button 
                mode="text" 
                onPress={() => setImageUri(undefined)}
                style={styles.removeImageButton}
              >
                Remove Image
              </Button>
            )}
          </View>

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
                    <Text style={styles.dayName}>{getDayName(day)}</Text>
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
              onPress={handleCancel}
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
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 60,
  },
  removeImageButton: {
    marginTop: 4,
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
