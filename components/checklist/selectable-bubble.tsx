// SelectableBubble.tsx
import React from 'react';
import { BaseBubble } from './base-bubble';

type SelectableBubbleProps = {
  name: string;
  selected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  showTick?: boolean;
};

export const SelectableBubble = ({
  name,
  selected,
  onPress,
  onLongPress,
  showTick,
}: SelectableBubbleProps) => {
  return (
    <BaseBubble
      name={name}
      selected={selected}
      onPress={onPress}
      onLongPress={onLongPress}
      showTick={showTick}
    />
  );
};