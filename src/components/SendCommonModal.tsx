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

const SendCommonModal = ({ visible, onClose, onAdd, isAddClick }) => {
  const [amount, setAmount] = useState('');
  const [oppositeAccountNo, setOppositeAccountNo] = useState('');
  const [errors, setErrors] = useState({});

  // const formatAccountNo = text => {
  //   let cleaned = text.replace(/\s+/g, ''); // remove spaces
  //   let formatted = cleaned.match(/.{1,5}/g)?.join(' ') || '';
  //   return formatted;
  // };
  const formatAccountNo = text => {
    let cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/g, ''); // only numbers
    let formatted = cleaned.match(/.{1,5}/g)?.join(' ') || '';
    return formatted;
  };

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!oppositeAccountNo.trim()) {
      newErrors.oppositeAccountNo = 'Please enter account number';
      valid = false;
    }

    if (!amount.trim()) {
      newErrors.amount = 'Please enter points';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // const handleAdd = () => {
  //   if (amount && !isNaN(amount) && oppositeAccountNo.trim() !== '') {
  //     onAdd({
  //       amount: Number(amount),
  //       oppositeAccountNo: oppositeAccountNo.trim(),
  //     }); // Pass both values back
  //     setAmount('');
  //     setOppositeAccountNo('');
  //     onClose();
  //   } else {
  //     alert('Please enter valid details');
  //   }
  // };

  const handleAdd = () => {
    if (validate()) {
      const pureAccountNo = oppositeAccountNo.replace(/\s+/g, '');
      onAdd({
        amount: Number(amount),
        // oppositeAccountNo: oppositeAccountNo.trim(),
        oppositeAccountNo: pureAccountNo,
      });
      setAmount('');
      setOppositeAccountNo('');
      setErrors({});
      onClose();
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
          <Text style={styles.title}>{' Send Points'}</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Account Number"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={oppositeAccountNo}
            maxLength={11} // 10 digits + 1 space
            onChangeText={text => setOppositeAccountNo(formatAccountNo(text))}
          />
          {errors.oppositeAccountNo && (
            <Text style={styles.errorText}>{errors.oppositeAccountNo}</Text>
          )}
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 10,
              padding: 10,
              // marginBottom: 10,
              marginTop: 12,
              fontSize: 16,
              fontFamily: FONTS_Family.FontMedium,
            }}
            placeholder="Enter points"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}
          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={[styles.btnText, { color: '#fff' }]}>
                {/* {isAddClick === 'Add' ? 'Add' : 'Withdraw'} */}
                {'Send'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SendCommonModal;

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
    // marginBottom: 10,
    // marginTop: 5,
    fontSize: 16,
    fontFamily: FONTS_Family.FontMedium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    // marginBottom: 10,
  },
});
