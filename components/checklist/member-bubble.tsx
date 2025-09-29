// MemberBubble.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

type MemberBubbleProps = {
  name: string;
  selected: boolean;
  readOnly?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
};

export const MemberBubble = ({ name, selected, readOnly, onPress, onLongPress }: MemberBubbleProps) => {
  const lastPress = React.useRef(0);
  // Web 雙擊偵測
  const handlePress = () => {
    if (!onPress || readOnly) {
      return;
    }

    if (Platform.OS === 'web') {
      const now = Date.now();
      if (now - lastPress.current < 300) {
        // 雙擊
        console.log('雙擊');
        onLongPress?.();
      } else {
        // 單擊
        console.log('單擊');
        onPress();
      }
      lastPress.current = now;
    } else {
      console.log('...');
      // Mobile 直接用原生行為
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      style={[
        styles.bubble,
        selected && styles.selectedBubble,
      ]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {name.slice(0, 3).toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBubble: {
    backgroundColor: '#007BFF',
  },
  text: {
    color: '#333',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#FFF',
  },
});