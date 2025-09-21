import React from 'react';
import { Button } from '@rneui/themed';

interface AddTripButtonProps {
  onPress: () => void; // onPress 是一個沒有參數、沒有返回值的函式
  title: string; // 按鈕標題
  disabled?: boolean;  // 可選的 disabled 屬性
}

// 可重用按鈕元件
const MyButton: React.FC<AddTripButtonProps> = ({ onPress, disabled = false, title }) => {
  return (
    <Button
      buttonStyle={{ width: 120 }}
      onPress={onPress}
      title={title}
      titleProps={{}}
    />
  );
};

export default MyButton;