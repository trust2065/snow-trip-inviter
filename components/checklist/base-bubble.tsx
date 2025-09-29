// BaseBubble.tsx
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, GestureResponderEvent } from 'react-native';

type BaseBubbleProps = {
  name: string;
  selected?: boolean;
  showTick?: boolean;
  readOnly?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
};

export const BaseBubble = ({
  name,
  selected,
  showTick,
  readOnly,
  onPress,
  onLongPress,
}: BaseBubbleProps) => {
  const Wrapper = readOnly ? View : TouchableOpacity;

  return (
    <Wrapper
      {...(!readOnly && { onPress, onLongPress })}
      style={[
        styles.bubble,
        selected && styles.selectedBubble,
      ]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {name.slice(0, 3).toUpperCase()}
      </Text>

      {showTick && (
        <View style={styles.tickContainer}>
          <Text style={styles.tick}>✓</Text>
        </View>
      )}
    </Wrapper>
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
    position: 'relative',
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
  tickContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 2,
  },
  tick: {
    fontSize: 12,
    color: 'green',
    fontWeight: 'bold',
  },
});