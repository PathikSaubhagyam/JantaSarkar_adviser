import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FONTS_Family } from '../constants/Font';
import { COLORS } from '../constants/Colors';

const CommonModal = ({ visible, onClose, onAdd, isAddClick }) => {
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    if (amount && !isNaN(amount)) {
      onAdd(Number(amount)); // Pass the amount back to parent
      setAmount('');
      onClose();
    } else {
      alert('Please enter a valid amount');
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* <Text style={styles.title}>Add Coins</Text> */}
          <Text style={styles.title}>
            {' '}
            {isAddClick === 'Add' ? 'Add Money' : 'Withdraw Money'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={[styles.btnText, { color: '#fff' }]}>
                {isAddClick === 'Add' ? 'Add' : 'Withdraw'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: FONTS_Family.FontBold,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: FONTS_Family.FontMedium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    alignItems: 'center',
  },
  addBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FONTS_Family.FontBold,
    color: 'red',
  },
});
