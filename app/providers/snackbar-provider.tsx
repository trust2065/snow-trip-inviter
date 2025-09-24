import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

type SnackbarOptions = {
  duration?: number;
  variant?: 'success' | 'error';
};

type SnackbarContextType = {
  showSnackbar: (message: string, options?: SnackbarOptions) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode; }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [bgColour, setBgColour] = useState<'green' | 'red'>('green');
  const [timer, setTimer] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const showSnackbar = (msg: string, options?: SnackbarOptions) => {
    const duration = options?.duration ?? 2000;
    const variant = options?.variant ?? 'success';

    if (timer) clearTimeout(timer);

    setMessage(msg);
    setBgColour(variant === 'success' ? 'green' : 'red');
    setVisible(true);
    fadeAnim.setValue(1);

    const newTimer = setTimeout(() => {
      // 自動消失時淡出
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, duration);

    setTimer(newTimer);
  };

  const closeSnackbar = () => {
    if (timer) clearTimeout(timer);
    setVisible(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {visible && (
        <Animated.View style={[styles.snackbar, { backgroundColor: bgColour, opacity: fadeAnim }]}>
          <Text style={styles.text}>{message}</Text>
          <TouchableOpacity onPress={closeSnackbar} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context.showSnackbar;
}

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 30,
    maxWidth: '60%',
    right: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  text: {
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    marginLeft: 12,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});