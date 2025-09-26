import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  defaultName?: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
};

export default function MemberNameModal({ visible, defaultName = '', onClose, onConfirm }: Props) {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    setName(defaultName); // 打開時填入初始值
  }, [defaultName]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>請輸入名字</Text>
          <TextInput
            style={styles.input}
            placeholder="成員名字"
            value={name}
            onChangeText={setName}
            autoFocus
          />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (name.trim()) {
                  onConfirm(name.trim());
                }
              }}
              style={[styles.button, styles.confirm]}
            >
              <Text style={styles.buttonText}>確定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: '#E0E0E0',
  },
  confirm: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});