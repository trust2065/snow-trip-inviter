import React from 'react';
import { CheckBox } from '@rneui/themed';

type MyCheckboxProps = {
  title: string;
  checked: boolean;
  onPress: () => void;
  checkedColor?: string;
  uncheckedColor?: string;
};

export default function MyCheckbox({
  title,
  checked,
  onPress,
  checkedColor = 'lightblue',
  uncheckedColor = '#808080',
}: MyCheckboxProps) {
  return (
    <CheckBox
      title={title}
      checked={checked}
      onPress={onPress}
      checkedColor={checkedColor}
      uncheckedColor={uncheckedColor}
      iconType='material-community'
      checkedIcon='checkbox-outline'
      uncheckedIcon='checkbox-blank-outline'
      containerStyle={{ backgroundColor: 'transparent' }}
    />
  );
}