import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type MemberBubbleProps = {
  name: string;
  selected: boolean;
  onPress: () => void;
};

export const MemberBubble = ({ name, selected, onPress }: MemberBubbleProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.bubble,
        selected && styles.selectedBubble,
      ]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {name[0].toUpperCase()} {/* 用第一個字母，也可以全名 */}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bubble: {
    width: 50,
    height: 50,
    borderRadius: 25, // 變成圓形
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