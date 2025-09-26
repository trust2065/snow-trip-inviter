import React from 'react';
import { Button } from '@rneui/themed';

interface AddTripButtonProps {
  onPress: () => void; // onPress 是一個沒有參數、沒有返回值的函式
  title: string; // 按鈕標題
  width?: number;
  disabled?: boolean;  // 可選的 disabled 屬性
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default';
  type?: 'solid' | 'outline' | 'clear';
}

// 可重用按鈕元件
const MyButton: React.FC<AddTripButtonProps> = ({ onPress, disabled = false, title, color = 'primary', type = 'solid', width }) => {
  return (
    <Button
      buttonStyle={{ width: width ?? 120 }}
      onPress={onPress}
      title={title}
      titleProps={{}}
      color={color}
      type={type}
    />
  );
};

export default MyButton;