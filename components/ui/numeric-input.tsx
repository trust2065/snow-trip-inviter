import React from 'react';
import { Input } from '@rneui/themed';

type NumericInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
};

export default function NumericInput({ label, placeholder, value, onChange }: NumericInputProps) {
  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={text => {
        // 過濾非數字，只保留 0~9
        const filtered = text.replace(/[^0-9]/g, '');
        onChange(filtered);
      }}
      keyboardType='numeric'
    />
  );
}