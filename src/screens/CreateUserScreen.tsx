import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/usersSlice';
import { UserFormModal } from '../components/UserFormModal';
import { usersStorage } from '../utils/storage';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const CreateUserScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(true);

  const handleSaveUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    dispatch(addUser(newUser));
    await usersStorage.addUser(newUser);

    setModalVisible(false);
    navigation.goBack();
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
