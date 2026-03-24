import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import { addUser } from '../store/usersSlice';
import { UserFormModal } from '../components/UserFormModal';
import { User } from '../types';
import { usersAPI } from '../utils/api';

export const CreateUserScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  const handleSaveUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastUpdated'>) => {
    setIsLoading(true);
    try {
      // Map the form data to match the NestJS DTO
      const createUserPayload = {
        name: userData.name,
        gender: userData.gender,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        isWhatsappAvailable: userData.hasWhatsApp,
        visitDays: userData.visitingDays.map(day => day.toString()),
      };

      const createdUser = await usersAPI.createUser(createUserPayload as any);
      
      // Also update local Redux store
      const newUser: User = {
        ...createdUser,
        createdAt: createdUser.createdAt || new Date().toISOString(),
        lastUpdated: createdUser.lastUpdated || new Date().toISOString(),
      };
      
      dispatch(addUser(newUser));

      setSnackbarMessage('User created successfully!');
      setSnackbarType('success');
      setSnackbarVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error('Failed to create user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create user';
      setSnackbarMessage(errorMessage);
      setSnackbarType('error');
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <UserFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          navigation.goBack();
        }}
        onSave={handleSaveUser}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarType === 'success' ? '#4caf50' : '#f44336',
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
